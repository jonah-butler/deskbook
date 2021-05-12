const User = require('../models/user.js');
const Category = require('../models/category.js');
const Entry = require('../models/entry.js');

module.exports = {
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
