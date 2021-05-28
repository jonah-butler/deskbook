const MainCategory = require('../models/category.js');
const Entry = require('../models/entry.js');
const User = require('../models/user.js');
const Reference = require('../models/question.js');
const helpers = require('../assets/helpers/helpers.js');
const fs = require('fs');
const path = require('path');

module.exports = {
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
