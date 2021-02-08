const MainCategory = require('../models/category.js');
const Entry = require('../models/entry.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = {
  async newGet(req, res) {
    const category = await MainCategory.findOne({_id: req.params.id});
    res.render("new-category", {
      category: category,
    });
  },
  async newPost(req, res) {
    try{
      if(req.body.entry.section){
        const newCategory = await MainCategory.create(req.body.entry);
        let parentCategory = await MainCategory.findOne({_id: req.body.entry.section});
        parentCategory.subCategories.push(newCategory);
        parentCategory = await parentCategory.save();
        res.redirect(`/entries/${newCategory._id}`);
      } else {
        req.body.entry.section = 'parent';
        const newCategory = await MainCategory.create(req.body.entry);
        res.redirect(`/entries/${newCategory._id}`);
      }
    } catch(err) {
      console.log(err);
    }
  },
  async editGet(req, res) {
    try{
      const category = await MainCategory.findOne({_id: req.params.categoryId});
      if(category){
        res.render('category-edit', {
          category: category,
        });
      }
    } catch(err) {
      console.log(err);
    }
  },
  async editUpdate(req, res) {
    const category = await MainCategory.findOne({_id: req.params.categoryId});
    if(req.body.entry.category == undefined){
      req.body.entry.category = [];
    }
    for(const prop in req.body.entry){
      category[prop] = req.body.entry[prop];
    }
    await category.save();

    res.redirect(`/entries/${req.params.categoryId}`);
  },
  async delete(req, res) {
    const category = await MainCategory.findOne({_id: req.params.categoryId}).populate("faqs").populate("subCategories");
    let stagingArray = [];
    let arr = await helpers.recursiveCollectEntries(category.subCategories, stagingArray);
    console.log(arr);
    await MainCategory.deleteOne({_id: req.params.categoryId});
    await Entry.deleteMany({section: req.params.categoryId});
    if(arr != undefined){
      try{
        for(let id of arr){
          await Entry.deleteMany({section: id});
          await MainCategory.deleteOne({_id: id});
        }
      }  catch(err) {
        console.log(err);
      }
    }
      res.redirect('/entries');
  },
  async newParent(req, res) {
    res.render('new-category-parent');
  }
}