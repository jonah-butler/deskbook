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
        ],
      }
    ).sort({'createdAt': -1}).limit(6);
    // console.log(publicCategories);
    let privateCategories = await User.findOne({_id: req.user._id}).populate('privateEntries').sort({'createdAt': -1});
    // console.log(privateCategories);
    res.render('index', {
      categories: publicCategories,
      privateCategories: privateCategories.privateEntries.slice(0, 6),
      user: req.user,
      adminStatus: req.user.isAdmin
    })
    // MainCategory.find({section: 'parent'}, (err, categories) => {
    //   if(err){
    //     console.log(err);
    //   } else {
    //     res.render("index", {
    //       categories: publicCategories,
    //       privateCategories: privateCategories,
    //       user: req.user,
    //       adminStatus: req.user.isAdmin
    //     });
    //   }
    // })
  },
  async post(req, res) {
    if(req.body.entry.isPrivate == 'true'){
      req.body.entry.user = req.user._id;
    }
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
      res.render("new-faq", {category: category});
    })
  },
  async categoryIndex(req, res) {
    try{
      const category = await MainCategory.findOne({_id: req.params.id}).populate("faqs").populate("subCategories");

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
            adminStatus: req.user.isAdmin,
            user: req.user,
          });
      } else {
        res.render("header-list", {
          category: category,
          sectionArray: undefined,
          adminStatus: req.user.isAdmin,
          user: req.user || null,
        });
      }
    } catch(err) {
      console.log(err);
    }
  },
  async faqIndex(req, res) {
    	// const categoryName = req.params.id;
	const entry = await Entry.find({_id: req.params.id});
	const parentCategory = await MainCategory.findOne({_id: req.params.categoryId});
	// console.log(entry);
	// MainCategory.findOne({title: req.params.headerCategory}).populate("faqs").exec((err, categories) => {
	// 	if(err){
	// 		console.log(err);
	// 	} else {
	//
	// 	}
	// })
	Promise.all([
		Entry.find({_id: req.params.id}),
	  // Entry.findOne({_id: { $gt: req.params.id } }, { section: entry.section } ),
		// Entry.findOne({_id: { $lt: req.params.id } }, { section: entry.section } )
		Entry.find({
			"_id": { "$gt": req.params.id},
			"section": {"$in": entry[0].section}
		}),
		Entry.find({
			"_id": { "$lt": req.params.id},
			"section": {"$in": entry[0].section}
		})
	]).then((data) => {
		console.log('received data', data);
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
    let category = req.params.headerCategory;
    Entry.findById(req.params.id, (err, entry) => {
      if(err){
        redirect("/entries");
      } else {
        res.render("edit", {
          entry: entry,
          category: category,
          // categories: mainCategories
        });
      }
    })
  },
  async editDelete(req, res) {
    await MainCategory.update({title: req.params.category}, { $pull: { faqs: req.params.id }});
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
  }
}
