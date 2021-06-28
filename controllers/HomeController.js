const emoji = require('node-emoji');
const MainCategory = require('../models/category.js');
const User = require('../models/user.js');
const Entry = require('../models/entry.js');

module.exports = {
  async index(req, res) {
    const systemCategoriesTotal = await MainCategory.countDocuments(
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
    const publicCategoriesTotal = await MainCategory.countDocuments(
      {
        $and: [
          {owner: {
            $in: req.user._id,
          }},
          {public: {
            $in: true,
          }},
        ]
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
    const categories = await MainCategory.find({isPrivate: false}).sort({'createdAt': -1}).limit(5);
    const entries = await Entry.find({isPrivate: false}).sort({'createdAt': -1}).limit(5);
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
      systemCategoriesTotal: systemCategoriesTotal,
      publicCategoriesTotal: publicCategoriesTotal,
      privateCategoriesTotal: privateCategoriesTotal,
      faqsTotal: faqsTotal,
      categoryArr: categoryArr,
      newestCategory: [categories[0], categories[1],categories[2]],
      newestFAQ: [entries[0],entries[1],entries[2]],
    });
  }
}
