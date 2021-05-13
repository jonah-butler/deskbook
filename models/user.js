const  mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const fs = require('fs');
const path = require('path');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  // library: {
  //   type: String,
  //   required: true,
  // },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  privateEntries: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainCategory",
    }
  ],
  categoryBookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainCategory",
    }
  ],
  entryBookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entry",
    }
  ],
  jobseekers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobSeeker"
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date,
})

UserSchema.pre("save", async function(next) {
  const user = this;
  if(!user.avatar){
    const defaultAvatarDir = path.join(__dirname, '..', 'assets', 'imgs', 'avatars', 'default');
    const defaultAvatar = fs.readdirSync(defaultAvatarDir);
    user.avatar = defaultAvatar[0];
    next();
  }
  return next();
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
