const User = require('../models/user.js');
const Category = require('../models/category.js');
const Entry = require('../models/entry.js');

module.exports = {
  async indexRedirect(req, res) {
    res.redirect(`/user/${req.user._id}/bookmarks`);
  },
  async bookmarkIndex(req, res) {
    const categoryBookmarks = (await User.findOne({_id: req.user._id}).populate('categoryBookmarks')).categoryBookmarks;
    res.render('user/bookmarks', {
      user: req.user,
      categoryBookmarks: categoryBookmarks,
    });
  },
  async postBookMark(req, res) {
    try{
      if(req.body.type === 'category'){
        const category = await Category.findOne({'_id': req.body.id});
        if(req.user.categoryBookmarks.indexOf(category._id) == -1){
          await User.updateOne(
            {_id: req.user._id},
            {$push: {categoryBookmarks: category}}
          )
          res.send({result: `added ${category.title} to bookmarks`});
        } else {
          await User.updateOne(
            {_id: req.user._id},
            {$pull: {categoryBookmarks: req.body.id}}
          )
          res.send({result: `removed ${category.title} from bookmarks`});
        }
      }
    } catch(error) {
      res.send({result: error});
    }
  }
}
