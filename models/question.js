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
}, {
    timestamps: true,
})

module.exports = mongoose.model("ReferenceQuestion", ReferenceQuestionSchema);
