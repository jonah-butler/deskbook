const  mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  jobseekers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker"
    }
  ]
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
