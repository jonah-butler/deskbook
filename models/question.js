const mongoose = require("mongoose");

const ReferenceQuestionSchema = new mongoose.Schema({
  overFiveMinutes: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  library: {
    type: String,
    required: true,
  },
  subLocation: {
    type: String,
    required: false,
  },
  refType: {
    type: String,
    required: true,
  },
  answeredHow: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
    timestamps: true,
})

module.exports = mongoose.model("ReferenceQuestion", ReferenceQuestionSchema);
