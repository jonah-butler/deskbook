const emoji = require('node-emoji');
const MainCategory = require('../models/category.js');
const User = require('../models/user.js');
const Entry = require('../models/entry.js');

module.exports = {
  async index(req, res) {
    const publicCategoriesTotal = await MainCategory.countDocuments(
      {
        $and: [
          {owner: {
            $in: req.user._id,
          }},
          {isPrivate: {
            $in: false,
          }},
        ],
      }
    )
    const privateCategoriesTotal = await MainCategory.countDocuments(
      {
        $and: [
          {owner: {
            $in: req.user._id,
          }},
          {isPrivate: {
            $in: true,
          }},
        ],
      }
    )
    const faqsTotal = await Entry.countDocuments(
      {
        owner: {
          $in: req.user._id,
        },
      }
    )
    const categoryArr = [];
    const categories = await MainCategory.find().sort({'createdAt': -1}).limit(5);
    const entries = await Entry.find().sort({'createdAt': -1}).limit(5);
    categories.forEach(category => {
      category.category.forEach(tag => {
        if(categoryArr.indexOf(tag) == -1) categoryArr.push(tag);
      })
    })
    entries.forEach(entry => {
      entry.category.forEach(tag => {
        if(categoryArr.indexOf(tag) == -1) categoryArr.push(tag);
      })
    })
    res.render("landing", {
      bookEmoji: emoji.get("book"),
      user: req.user,
      publicCategoriesTotal: publicCategoriesTotal,
      privateCategoriesTotal: privateCategoriesTotal,
      faqsTotal: faqsTotal,
      categoryArr: categoryArr,
    });
  }
}
