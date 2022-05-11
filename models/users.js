const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	username:String,
	name: String,
	lastName: String,
	fiatBalance: Number,
	passwordHash: String,
	aboutMe: String,
	imageProfile: String,
	watchListCoins: [String],

	transactionHistory: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Coin',
		},
	],

	portfolioCoins: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'PortfolioCoin',
		},
	],
	limitCoins: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Coin',
		},
	],
	portfolioValueDates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioValueDate' }],
	sendReceiverHistories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SendReceiveHistory' }],
});



module.exports = mongoose.model('User', schema);
