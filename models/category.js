const mongoose = require("mongoose");

let EntryCategory = new mongoose.Schema({
	description: String,
	section: {
		type: String,
		required: false,
	},
	category: [
		{
			type: String,
			required: false,
		},
	],
	title: {
		type: String,
		required: true,
	},
	faqs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Entry",
		},
	],
	subCategories: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "MainCategory",
		},
	],
	isPrivate: {
		type: Boolean,
		default: false,
	},
	// user: {
	// 	type: String,
	// 	required: false,
	// },
	user: [
		{
			type: String,
			required: false,
		},
	],
}, {
	timestamps: true,
})

module.exports = mongoose.model("MainCategory", EntryCategory);
