const MainCategory = require('../models/category.js');
const Entry = require('../models/entry.js');
const User = require('../models/user.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = {
  async index(req, res){
    res.redirect(`/user/${req.user._id}`);
  },
  async indexLookup(req, res){
    res.render('user', {
      user: req.user,
    });
  },
  async changePwdIndex(req, res){
    res.render('change-password', {
      user: req.user,
    });
  },
  async changePwdPost(req, res){
    if(req.body.password1 == req.body.password2){
      try{
        const user = await User.findById(req.params.userId);
        const updatedUser = await user.changePassword(req.body.oldpassword, req.body.password1);
        await updatedUser.save();
        res.redirect('/entries');
      } catch(err) {
        console.log(err);
      }
    } else {
      res.redirect(`/user/${req.user_id}/change-password`);
    }
  },
}
