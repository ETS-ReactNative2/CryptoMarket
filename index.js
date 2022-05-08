const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Coin = require('./models/coin');
const User = require('./models/users');
const PortfolioCoin = require('./models/portfolioCoin'); // INFO of the portfolio
const PortfolioValueDate = require('./models/portfolioValueDate'); //Dates of each of the portfolio vvalue
const SendReceiveHistory = require('./models/sendReceiveHistory');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
const express = require('express');

const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

const JWT_SECRET = 'DANIELZHANG';

// password TKS1032801 Username Guan_Ha

const MONGODB_URI =
	'mongodb+srv://Guan_Ha:TKS1032801@cluster0.itcgi.mongodb.net/accountDatabase?retryWrites=true&w=majority';

console.log('connecting to', MONGODB_URI);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connection to MongoDB:', error.message);
	});
const typeDefs = gql`
	scalar Upload
	type changeProfileDetails {
		lastName: String
		aboutMe: String
		name: String
	}
	type PortfolioValueDate {
		assetValueTotal: Float!
		date: String!
		id: ID!
	}
	type File {
		url: String!
	}
	type PortfolioCoin {
		name: String!
		quantity: Float!
		owner: String!
		id: ID!
	}
	type Coin {
		name: String!
		bought_price: Float!
		quantity: Float!
		date: String!
		type: String!
		id: ID!
	}

	type SendReceiveHistory {
		receiver: String!
		sender: String!
		name: String!
		quantity: Float!
		date: String!
		id: ID!
	}
	type User {
		name: String!
		lastName: String!
		username: String!
		imageProfile: String!
		aboutMe: String
		transactionHistory: [Coin!]
		watchListCoins: [String!]
		portfolioCoins: [PortfolioCoin!]
		limitCoins: [Coin!]
		portfolioValueDates: [PortfolioValueDate!]
		sendReceiverHistories: [SendReceiveHistory!]
		fiatBalance: Float
		id: ID!
	}

	type Token {
		value: String!
	}
	type Query {
		userCount: Int!
		allUsers: [User!]!
		getWatchListCoins: [String!]!
		findUser(username: String!): User
		me: User
	}

	type Mutation {
		addWatchList(coin: String!): String!
		removeWatchList(coin: String!): String!
		createUser(username: String!, password: String!, name: String!, lastName: String!): User
		login(username: String!, password: String!): Token
		buyMarketCoin(name: String!, bought_price: Float!, quantity: Float!): Coin!
		addPortfolioDateValue(assetValueTotal: Float!): PortfolioValueDate!
		sellMarketCoin(name: String!, sell_price: Float!, quantity: Float!): Coin!
		sendUser(username: String!, quantity: Float!, name: String!): String
		changeProfilePicture(file: Upload!): File!
		changeName(name: String!): String!
		changeLastName(lastName: String!): String!
		changeAboutMe(sentence: String!): String!
		changeProfile(name: String!, lastName: String!, aboutMe: String!): String
	}
`;

const resolvers = {
	Query: {
		userCount: async () => User.collection.countDocuments(),
		allUsers: async (root, args) => {
			return User.find()
				.populate('transactionHistory')
				.populate('portfolioCoins')
				.populate('portfolioValueDates')
				.populate('sendReceiverHistories');
		},
		findUser: async (root, args) => User.findOne({ username: args.username }),
		me: (root, args, context) => {
			return context.currentUser;
		},
		getWatchListCoins: async (root, args, context) => {
			return context.currentUser.watchListCoins;
		},
	},
	Upload: GraphQLUpload,
	Mutation: {
		createUser: async (root, args) => {
			const passwordHash = await bcrypt.hash(args.password, 12);
			const user = new User({
				username: args.username,
				passwordHash,
				name: args.name,
				lastName: args.lastName,
				aboutMe: '',
				imageProfile: 'http:localhost:4000/images/default_profile.png',
				fiatBalance: 10000,
			});

			return user.save().catch((error) => {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			});
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });

			const isValid = await bcrypt.compare(args.password, user.passwordHash);
			if (!user || !isValid) {
				throw new UserInputError('wrong credentials');
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, JWT_SECRET) };
		},
		buyMarketCoin: async (root, args, context) => {
			const currentUser = context.currentUser;
			const date = new Date();
			const coin = new Coin({
				name: args.name,
				quantity: args.quantity,
				bought_price: args.bought_price,
				type: 'Buy',
				date: date.toISOString().split('T')[0],
			});
			let portfolioCoin;
			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}
			portfolioCoin = await PortfolioCoin.findOne({ name: args.name, owner: currentUser.username });

			try {
				await coin.save();
				if (!portfolioCoin) {
					portfolioCoin = new PortfolioCoin({
						name: args.name,
						quantity: args.quantity,
						owner: currentUser.username,
					});
					currentUser.portfolioCoins = currentUser.portfolioCoins.concat(portfolioCoin);
				} else {
					portfolioCoin.quantity = portfolioCoin.quantity + args.quantity;
					const idx = currentUser.portfolioCoins.findIndex((el) => el.name === portfolioCoin.name);
					currentUser.portfolioCoins[idx] = portfolioCoin;
				}
				await portfolioCoin.save();
				currentUser.fiatBalance -= args.bought_price * args.quantity;
				currentUser.transactionHistory = currentUser.transactionHistory.concat(coin);
				await currentUser.save();
			} catch (error) {
				console.log('error here');
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
			return coin;
		},
		addWatchList: async (root, args, context) => {
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}
			try {
				currentUser.watchListCoins = currentUser.watchListCoins.concat(args.coin);
				await currentUser.save();
			} catch (error) {
				console.log('error here');
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			return args.coin;
		},

		sellMarketCoin: async (root, args, context) => {
			const currentUser = context.currentUser;
			const date = new Date();
			const coin = new Coin({
				name: args.name,
				quantity: args.quantity,
				bought_price: args.sell_price,
				type: 'Sell',
				date: date.toISOString().split('T')[0],
			});
			//TODO schema that defines whether it is a sell or buy
			const portfolioCoin = await PortfolioCoin.findOne({
				name: args.name,
				owner: currentUser.username,
			});
			try {
				await coin.save();
				portfolioCoin.quantity = portfolioCoin.quantity - args.quantity;
				const idx = currentUser.portfolioCoins.findIndex((el) => el.name === portfolioCoin.name);
				currentUser.portfolioCoins[idx] = portfolioCoin;

				await portfolioCoin.save();
				currentUser.transactionHistory = currentUser.transactionHistory.concat(coin);
				currentUser.fiatBalance += args.sell_price * args.quantity;
				await currentUser.save();
			} catch (error) {
				console.log('error here');
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
			return coin;
		},
		addWatchList: async (root, args, context) => {
			const currentUser = context.currentUser;
			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}
			try {
				currentUser.watchListCoins = currentUser.watchListCoins.concat(args.coin);
				await currentUser.save();
			} catch (error) {
				console.log('error here');
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			return args.coin;
		},
		removeWatchList: async (root, args, context) => {
			const currentUser = context.currentUser;
			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}
			try {
				currentUser.watchListCoins = currentUser.watchListCoins.filter((el) => el !== args.coin);
				currentUser.fiatBalance -= args.bought_price * args.quantity;
				await currentUser.save();
			} catch (error) {
				console.log('error here');
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			return args.coin;
		},
		addPortfolioDateValue: async (root, args, context) => {
			// The front end is responsible for processing the current total assets

			const currentUser = context.currentUser;

			let portfolioValueDate;

			const date = new Date();
			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}

			portfolioValueDate = await PortfolioValueDate.findOne({
				date: date.toISOString().split('T')[0],
			});
			try {
				if (!portfolioValueDate) {
					portfolioValueDate = new PortfolioValueDate({
						date: date.toISOString().split('T')[0],
						assetValueTotal: args.assetValueTotal,
					});
					currentUser.portfolioValueDates =
						currentUser.portfolioValueDates.concat(portfolioValueDate);
				} else {
					portfolioValueDate.assetValueTotal = args.assetValueTotal;
					const idx = currentUser.portfolioCoins.findIndex(
						(el) => el.date === date.toISOString().split('T')[0]
					);
					currentUser.portfolioCoins[idx] = portfolioValueDate;
				}
				portfolioValueDate.save();
				currentUser.save();
			} catch (error) {
				console.log('error here');
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			return portfolioValueDate;
		},
		sendUser: async (roots, args, context) => {
			const currentUser = context.currentUser;
			let portfolioCoin;

			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}
			const receiverUser = await User.findOne({ username: args.username })
				.populate('transactionHistory')
				.populate('portfolioCoins')
				.populate('portfolioValueDates')
				.populate('sendReceiverHistories');
			if (!receiverUser)
				throw new UserInputError({
					invalidArgs: args,
					error: 'User does not exist',
				});
			try {
				portfolioCoin = await PortfolioCoin.findOne({
					name: args.name,
					owner: receiverUser.username,
				});
				const idxReceiver = receiverUser.portfolioCoins.findIndex((el) => el.name === args.name);
				if (idxReceiver === -1) {
					portfolioCoin = new PortfolioCoin({
						name: args.name,
						quantity: args.quantity,
						owner: receiverUser.username,
					});

					receiverUser.portfolioCoins = receiverUser.portfolioCoins.concat(portfolioCoin);
				} else {
					portfolioCoin.quantity += args.quantity;
					receiverUser.portfolioCoins[idxReceiver] = portfolioCoin;
				}
				portfolioCoin.save();

				const idxCurrUser = currentUser.portfolioCoins.findIndex((el) => el.name === args.name);
				/* 				console.log({ name: args.name, owner: currentUser.username });
				 */ const senderUserPortfolioCoin = await PortfolioCoin.findOne({
					name: args.name,
					owner: currentUser.username,
				});
				senderUserPortfolioCoin.quantity -= args.quantity;
				const date = new Date();

				currentUser.portfolioCoins[idxCurrUser] = senderUserPortfolioCoin;
				const sendReceiveHistory = new SendReceiveHistory({
					sender: currentUser.name + ' ' + currentUser.lastName,
					receiver: receiverUser.name + ' ' + receiverUser.lastName,
					quantity: args.quantity,
					date: date.toISOString().split('T')[0],
					name: args.name,
				});
				sendReceiveHistory.save();
				senderUserPortfolioCoin.save();
				receiverUser.sendReceiverHistories =
					receiverUser.sendReceiverHistories.concat(sendReceiveHistory);
				receiverUser.save();
				currentUser.sendReceiverHistories =
					currentUser.sendReceiverHistories.concat(sendReceiveHistory);

				currentUser.save();
			} catch (error) {
				console.log('error here');
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
			return args.name;
		},
		changeProfilePicture: async (roots, args, context) => {
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}
			const { createReadStream, filename, mimetype, encoding } = await args.file;

			const stream = createReadStream();
			const pathName = path.join(__dirname, `/public/images/${filename}`);

			await stream.pipe(fs.createWriteStream(pathName));
			currentUser.imageProfile = `http://localhost:4000/images/${filename}`;
			currentUser.save();
			return {
				url: `http://localhost:4000/images/${filename}`,
			};
		},
		changeName: async (roots, args, context) => {
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}

			currentUser.name = args.name;
			currentUser.save();

			return args.name;
		},
		changeLastName: async (roots, args, context) => {
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}

			currentUser.lastName = args.lastName;
			currentUser.save();

			return args.lastName;
		},
		changeAboutMe: async (roots, args, context) => {
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}

			currentUser.aboutMe = args.aboutMe;
			currentUser.save();

			return args.lastName;
		},
		changeProfile: async (roots, args, context) => {
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new AuthenticationError('not authenticated');
			}
			currentUser.lastName = args.lastName;

			currentUser.name = args.name;
			currentUser.aboutMe = args.aboutMe;
			currentUser.save();

			return args.profile;
		},
	},
};
async function startServer() {
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }) => {
			const auth = req ? req.headers.authorization : null;
			if (auth && auth.toLowerCase().startsWith('bearer ')) {
				const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);

				const currentUser = await User.findById(decodedToken.id)
					.populate('transactionHistory')
					.populate('portfolioCoins')
					.populate('portfolioValueDates')
					.populate('sendReceiverHistories');

				return { currentUser };
			}
		},
	});
	await server.start();

	const app = express();

	const cors = require('cors');

	app.use(cors());

	app.use(graphqlUploadExpress());

	app.use(express.static('public'));

	server.applyMiddleware({ app });

	await new Promise((r) => app.listen({ port: 4000 }, r));

	console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
startServer();
