const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: String,
	bought_price: Number,
	quantity: Number,
	type: String,
	date: String,
});

module.exports = mongoose.model('Coin', schema);
