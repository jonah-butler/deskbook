const mongoose = require("mongoose");

const PrintTrackerSchema = new mongoose.Schema({
	computerNum: Number,
	numOfPrints: Number
})

module.exports = mongoose.model("JobSeeker", PrintTrackerSchema);
