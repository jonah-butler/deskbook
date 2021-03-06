const mongoose = require("mongoose");

const DeskBookSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
	},
	section: String,
	cost: {
		type: Number,
		required: false,
	},
	title: {
		type: String,
		required: true,
	},
	cabinet: {
		type: Number,
		required: false,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	category: [
		{
			type: String,
			required: false,
		},
	],
	public: {
		type: Boolean,
	},
	isPrivate: {
		type: Boolean,
		default: false,
	},
	user: [
		{
			type: String,
			required: false,
		},
	],
}, {
	timestamps: true,
})

module.exports = mongoose.model("Entry", DeskBookSchema);
