const MainCategory = require('../models/category.js');
const Entry = require('../models/entry.js');
const User = require('../models/user.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = {
  async index(req, res) {
    let publicCategories = await MainCategory.find(
      {
        $and: [
          {section: {
            $in: 'parent',
          }},
          {isPrivate: {
            $in: false,
          }},
          {public: {
            $exists: false,
          }},
        ],
      }
    ).populate('owner').sort({'createdAt': -1}).limit(6);
    // const privateCategories = await User.findOne({_id: req.user._id}).populate('privateEntries').sort({'createdAt': -1}).populate('owner');
    const privateCategories = await MainCategory.find(
      {
        $and: [
          {owner: req.user._id},
          {section: 'parent'},
          {isPrivate: true},
        ],
      }
    ).populate('owner').sort({'createdAt': -1}).limit(6);
    const childCategoriesCollaborating = await MainCategory.find(
      {
        $and: [
          {"user.1": {$exists: true}},
          {"user": {$in: req.user._id}},
        ],
      }
    ).populate('owner').sort({'createdAt': -1})
    const publicParentTotal = await MainCategory.countDocuments(
      {
        $and: [
          {section: {
            $in: 'parent',
          }},
          {isPrivate: {
            $in: false,
          }},
          {public: {
            $exists: false,
          }},
        ],
      }
    )
    res.render('index', {
      publicParentTotal: publicParentTotal,
      categories: publicCategories,
      // privateCategories: privateCategories.privateEntries.slice(0, 6),
      privateCategories: privateCategories,
      childCategoriesCollaborating: childCategoriesCollaborating,
      user: req.user,
      adminStatus: req.user.isAdmin
    })
  },
  async post(req, res) {
    if(req.body.entry.isPrivate == 'true'){
      req.body.entry.user = req.user._id;
    }
    req.body.entry.owner = req.user._id;
    Entry.create(req.body.entry, (err, newEntry) => {
      if(err){
        console.log(err);
      } else{
        MainCategory.findOne({_id: req.body.entry.section}, (err, category) => {
          if(err){
            console.log(err);
          } else {
            category.faqs.push(newEntry);
            category.save((err, updatedCategory) => {
              if(err){
                console.log(err);
              } else {
                console.log(updatedCategory);
                res.redirect(`/entries/${category._id}`);
              }
            })
          }
        })
      }
    })
  },
  async new(req, res) {
    MainCategory.findOne({_id: req.params.id}, (err, category) => {
      console.log(category);
      res.render("new-faq", {
        category: category,
        user: req.user,
      });
    })
  },
  async categoryIndex(req, res) {
    try{

      const category = req.category;
      const collaborators = [];
      let bookmarked = null;

      if(category.user.length) {
        for(const userId of category.user) {
          let user = await User.findOne({_id: userId});
          if(user.email != category.owner.email){
            collaborators.push(user);
          }
        }
      }

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
          sectionArray.push({title: section.title, _id: section._id, user: section.user});
          section = section.section;
        }
          res.render("header-list", {
            category: category,
            sectionArray: sectionArray,
            bookmarked: bookmarked,
            user: req.user || null,
            collaborators: collaborators || null,
          });
      } else {
        res.render("header-list", {
          category: category,
          sectionArray: undefined,
          bookmarked: bookmarked,
          user: req.user || null,
          collaborators: collaborators || null,
        });
      }
    } catch(err) {
      console.log(err);
    }
  },
  async faqIndex(req, res) {

	const entry = await Entry.findOne({_id: req.params.id});
	const parentCategory = await MainCategory.findOne({_id: req.params.categoryId}).populate('faqs').populate('subCategories');
	Promise.all([
		Entry.find({_id: req.params.id}).populate('owner'),
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
      user: req.user || null,
		} );
	})
  },
  async editIndex(req, res) {
    const category = req.params.headerCategory;
    const users = await User.find();
    Entry.findById(req.params.id, (err, entry) => {
      if(err){
        redirect("/entries");
      } else {
        res.render("edit", {
          entry: entry,
          category: category,
          users: users,
          user: req.user,
          // categories: mainCategories
        });
      }
    })
  },
  async editDelete(req, res) {
    // await MainCategory.updateOne({title: req.params.category}, { $pull: { faqs: req.params.id }});
    let category = await MainCategory.findOne({_id: req.params.category});
    category.faqs.pull(req.params.id);
    await category.save();
    await Entry.deleteOne({_id: req.params.id});
    res.redirect(`/entries/${req.params.category}`);
  },
  async editUpdate(req, res) {
    if(!req.body.entry.category){
      req.body.entry['category'] = [];
    }
    Entry.findByIdAndUpdate(req.params.id, req.body.entry, (err, updatedEntry) => {
      if(err){
        console.log(err);
        res.redirect("/entries/" + req.params.headerCategory);
      } else {
        res.redirect("/entries/" + req.params.headerCategory + "/" + req.params.id);
      }
    })
  },
}
