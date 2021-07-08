const MainCategory = require('../models/category.js');
const Entry = require('../models/entry.js');
const User = require('../models/user.js');
const Reference = require('../models/question.js');
const helpers = require('../assets/helpers/helpers.js');
const fs = require('fs');
const path = require('path');
const sgMail = require('@sendgrid/mail');
const passport = require('passport');

require('dotenv').config();

module.exports = {
  async registerUser(req, res) {
    let newUser;
    if(req.body.library === 'main'){
      newUser = {
        username: req.body.username,
        email: req.body.email,
        isAdmin: req.body.adminradio,
        avatar: 'otter-pixel-trans.png',
        library: req.body.library,
        mainSubLocation: req.body.subLocation
      };
    } else {
      newUser = {
        username: req.body.username,
        email: req.body.email,
        isAdmin: req.body.adminradio,
        avatar: 'otter-pixel-trans.png',
        library: req.body.library,
      };
    }
    const registeredUser = new User(newUser);
    User.register(registeredUser, req.body.password, (err, user) => {
      if(err){
        console.log(err);
        req.flash('message', 'Error creating account.');
        return res.redirect("/");
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: req.body.email,
        from: 'rvalearns@gmail.com',
        subject: 'RVALibrary New Account Registration',
        html:  `<h2>Your RVALibrary Deskbook account was created successfully!</h2>
        <div>
        <h3>Account Details</h3>
        <hr>
        <ul>
        <li>${req.body.username}(used to login)</li>
        <li>${req.body.password}</li>
        <li>${req.body.email}</li>
        </ul>
        </div>
        <div>For logging in or resetting your password: https://rvalibrary-deskbook.herokuapp.com/login</div>
        <hr>
        <div>To get started with using Deskbook, visit the Deskbook meta FAQ. For information on submitting reference questions and querying reference, data, click on the <strong>Reference sub-folder:</strong> https://rvalibrary-deskbook.herokuapp.com/entries/608876de7c391a0f28b95188</div>.
        You must be logged in to access.
        <hr>
        <div>For updating your password after logging in, visit the user portal located in the navbar and select Change Password.
        <br>
        <p style="font-size: 13px">contact jonah.butler@richmondgov.com for any questions</p>`
      };
      sgMail
        .send(msg)
        .then(() => {
          passport.authenticate("/")(req, res, () => {
            req.flash('message', 'Account created. An email has been sent to the account with credentials');
            res.redirect("/");
          })
        })
        .catch((error) => {
          req.flash('message', 'Account created. But our servers could not send an email, notifying new user of their account. please contact the holder of the new account manually if you have not done so.');
          res.redirect("/");
        })
    })
  },
  async index(req, res){
    res.redirect(`/user/${req.user._id}`);
  },
  async indexLookup(req, res){
    try{
      if(req.params.userId == req.user._id){
        const user = await User.findById(req.params.userId)
        res.render('user/landing', {
          user: user,
        });
      }
    } catch(err) {
      res.redirect('/404');
    }
  },
  async changePwdIndex(req, res){
    const users = await User.find({});
    res.render('user/change-password', {
      users: users,
      user: req.user,
      message: req.flash('message'),
    });
  },
  async changePwdPost(req, res){
    if(req.body.password1 === req.body.password2){
      try{
        const user = await User.findById(req.body.user);
        const updatedUser = await user.setPassword( req.body.password1 );
        console.log(updatedUser);
        await updatedUser.save();
        console.log(updatedUser);
        res.redirect('/entries');
      } catch(err) {
        req.flash('message', 'there was an error, try updating again');
        res.redirect(`/user/${req.user_id}/change-password`);
      }
    } else {
      req.flash('message', 'Your new passwords did not match');
      res.redirect(`/user/${req.user_id}/change-password`);
    }
  },
  async referenceIndex(req, res){
    res.render('user/reference', {
      user: req.user,
    });
  },
  async referenceDelete(req, res){
    try{
      const reference = await Reference.deleteOne({_id: req.body.id});
      if(reference.deletedCount == 1){
        res.send({success: 'deleted'});
      }
    } catch(err) {
      res.send({error: 'oops looks like an error'});
    }
  },
  async changeAvatarGet(req, res){
    const avatarDirectory = path.join(__dirname, '..', 'assets', 'imgs', 'avatars', 'choices');
    fs.readdir(avatarDirectory, (err, files) => {
      if(err){
        console.log(err);
      } else {
        res.render('user/change-avatar', {
          avatars: files,
          userId: req.user.id,
          user: req.user,
        });
      }
    })
  },
  async changeAvatar(req, res){
    try{
      let user = await User.findOneAndUpdate({_id: req.params.userId}, {avatar: req.body.avatar});
      console.log(user);
      res.redirect(`/user/${req.params.userId}`);
    } catch(err) {
      console.log(err);
    }
  },
  async accountDetailsGet(req, res){
    if(!req.user.library){
      res.render('user/account-details', {
        user: req.user,
        message: req.flash('message'),
        isLocationUndefined: true,
      })
    } else {
      res.render('user/account-details', {
        user: req.user,
        message: req.flash('message'),
        isLocationUndefined: false,
      })
    }
  },
  async updateUser(req, res){
    try{
      let user = await User.findById({_id: req.params.userId});
      for(const key in req.body){
        if(user[key] != req.body[key]){
          user[key] = req.body[key];
          if(key === 'library' && req.body[key] !== 'main' && user.mainSubLocation){
            user.mainSubLocation = null;
          }
          await user.save();
        }
      }
      res.render('user/account-details', {
        user: user,
        message: 'account update successful',
      })
    } catch(err) {
      res.render('user/account-details', {
        user: user,
        message: err,
      });
    }
  },
}
