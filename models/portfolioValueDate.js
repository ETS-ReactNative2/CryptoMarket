const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	assetValueTotal: Number,
	date: String,
});

module.exports = mongoose.model('PortfolioValueDate', schema);
