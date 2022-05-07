const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: String,
	quantity: Number,
	owner: String,
});

module.exports = mongoose.model('PortfolioCoin', schema);
