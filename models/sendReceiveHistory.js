const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	receiver: String,
	sender: String,
	name: String,
	quantity: String,
	date: String,
});

module.exports = mongoose.model('SendReceiveHistory', schema);
