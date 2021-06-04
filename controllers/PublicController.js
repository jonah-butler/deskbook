const emoji = require('node-emoji');
const MainCategory = require('../models/category.js');
const Entry = require('../models/entry.js');

module.exports = {
  async publicLanding(req, res) {
    const publicCategories = await MainCategory.find({
      $and: [
        {section: {
          $in: 'parent',
        }},
        {public: {
          $in: true,
        }},
      ]
    }).populate('owner').populate('faqs').populate('subCategories').sort({'createdAt': -1});
    let timeObj = {
      emoji: undefined,
      greeting: undefined,
    };
    let time = (new Date()).getHours();
    if(time < 12){
      timeObj.emoji = emoji.get("sun_with_face");
      timeObj.greeting = 'Good Morning'
    } else if(time >= 12 && time <= 16) {
      timeObj.emoji = emoji.get("sun_with_face");
      timeObj.greeting = 'Good Afternoon';
    } else {
      timeObj.emoji = emoji.get("full_moon_with_face");
      timeObj.greeting = 'Good Evening';
    }
    res.render('public/landing', {
      user: req.user,
      greeting: timeObj,
      publicCategories: publicCategories,
    })
  },
  async publicNewCategoryIndex(req, res) {
    res.render('public/new-category', {
      user: req.user,
    });
  },
  async publicCategoryIndex(req, res) {
    try{
      const category = await MainCategory.findById(
        req.params.categoryId
      ).populate('owner')
      .populate('subCategories')
      .populate('faqs');

      if(category.public){

        let bookmarked = null;

        if(req.user){
          if(req.user.categoryBookmarks.indexOf(category._id) == -1){
            bookmarked = false;
          } else {
            bookmarked = true;
          }
        }

        if(category.section != 'parent'){
          let sectionArray = [];
          let section = category.section
          while(section != 'parent'){
            section = await MainCategory.findOne({_id: section});
            sectionArray.push({title: section.title, _id: section._id});
            section = section.section;
          }
            res.render("header-list", {
              category: category,
              sectionArray: sectionArray,
              bookmarked: bookmarked,
              user: req.user || null,
            });
        } else {
          res.render("header-list", {
            category: category,
            sectionArray: undefined,
            bookmarked: bookmarked,
            user: req.user || null,
          });
        }
      } else {
        res.redirect('/404');
      }
    } catch(err) {
      res.redirect('404');
    }
  },
  async publicFaqIndex(req, res) {
    const entry = await Entry.findOne({_id: req.params.faqId});
    const parentCategory = await MainCategory.findOne({_id: req.params.categoryId}).populate('faqs');
    Promise.all([
      Entry.find({_id: req.params.faqId}).populate('owner'),
      // Entry.findOne({_id: { $gt: req.params.id } }, { section: entry.section } ),
      // Entry.findOne({_id: { $lt: req.params.id } }, { section: entry.section } )
      Entry.find({
        _id: { "$lt": entry._id},
        "section": {"$in": entry.section}
      }).sort({_id: -1}).limit(1),
      Entry.find({
        _id: { "$gt": entry._id},
        "section": {"$in": entry.section}
      }).sort({_id: 1}).limit(1)
    ]).then((data) => {
      const newObj = data.map((obj) => {
        if(obj != undefined){
            return obj[0];
        };
      })
      res.render("show", {
        parentCategory: parentCategory,
        values: newObj,
        user: req.user,
      } );
    })
  },
  async publicSearch(req, res) {
    MainCategory.find(
      { $and: [
        {$or: [
          {public: {$in: true}},
        ]},
        {$or: [{ title: { $regex: req.query.query, $options: 'i' } },
                { description: { $regex: req.query.query, $options: 'i' } },
              { category: {  $regex: req.query.query, $options: 'i'} }
            ]}
      ]},
        function(err, categoryResults) {
          if(err) {
            console.log(err);
          } else {
            Entry.find(
              { $and: [
                {$or: [
                  {public: {$in: true}},
                ]},
                {$or: [{ title: { $regex: req.query.query, $options: 'i' } },
                        { description: { $regex: req.query.query, $options: 'i' } },
                      { category: {  $regex: req.query.query, $options: 'i'} }
                    ]}
              ]},
                function(err, entryResults) {
                  if(err) {
                    console.log(err);
                  } else {
                    res.render('public/search', {
                      user: req.user,
                      query: req.query.query,
                      categoryResults: categoryResults,
                      entryResults: entryResults,
                    })
                  }
                }
            )
          }
        }
    )
  },
}
