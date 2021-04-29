const passport          = require('passport');
const sgMail            = require('@sendgrid/mail');
const crypto            = require('crypto');
const User              = require('../models/user.js');


require('dotenv').config()

module.exports = {
  async loginIndex(req, res) {
    res.render("login", {
      userAuthenticated: req.isAuthenticated(),
      message: req.flash('message'),
    });
  },
  async loginPost(req, res) {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    }), (req, res) => {
    }
  },
  async forgotIndex(req, res) {
    if(req.user){
      res.redirect(`/user/${req.user._id}/change-password`);
    } else {
      res.render("forgot", {message: req.flash('message'), error: req.flash('error')});
    }
  },
  async forgot(req, res) {
    try{
      let token = crypto.randomBytes(20);
      token = token.toString('hex');
      const user = await User.findOne({email: req.body.email});
      if(user){

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;

        await user.save();

        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg =  {
          to: user.email,
          from: 'rvalearns@gmail.com',
          subject: 'RVALibrary Deskbook Password Reset',
          text: `You are receiving this email because you recently requested to reset your password.
          Please click the following link to update your password:

          https://${req.headers.host}/reset/${token}

          If you did not request this email, please ignore. This link is only valid for 1 hour`
        };

        sgMail
          .send(msg)
          .then(() => {
            req.flash('message', 'please check your inbox at the provided email for directions on resetting your password. check your promotions or spam inboxes if the reset link is unavailable.');
            res.redirect('/forgot');
          })
          .catch((error) => {
            req.flash('message', 'an unexpected error occurred. contact the administrator');
            res.redirect('/forgot');
          })

      } else {
        req.flash('error', 'that email does not exist in our records. please enter a valid email address');
        res.redirect(`/forgot`);
      }
    } catch(err) {
      req.flash('error', 'an unexpected error occurred');
      res.redirect('/forgot')
    }
  },
  async tokenIndex(req, res) {
    res.render('token',
    {
      token: req.params.token,
      message: req.flash('message'),
    });
  },
  async tokenPost(req, res) {
    try{
      const user = await User.findOne({resetPasswordToken: req.params.token});
      if(user){
        if(req.body.password1 === req.body.password2){
          const dateNow = new Date();
          const tokenExpiration = new Date(user.resetPasswordExpires);
          if( dateNow < tokenExpiration ){
            const updatedUser = await user.setPassword(req.body.password1);
            updatedUser.resetPasswordToken = null;
            updatedUser.resetPasswordExpires = null
            await updatedUser.save();
            req.flash('message', 'your password has been updated!');
            res.redirect('/login');
          } else {
            req.flash('error', 'your reset token has expired. :(');
            res.redirect('/forgot');
          }
        } else {
          req.flash('message', 'passwords do not match');
          res.redirect(`/reset/${req.params.token}`);
        }
      } else {
        req.flash('message', 'not a valid user');
        res.redirect(`/reset/${req.params.token}`);
      }
    } catch(err) {
      console.log(err);
    }
  },
}
