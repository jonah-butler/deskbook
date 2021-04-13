const MainCategory = require('../models/category.js');
const Entry = require('../models/entry.js');
const User = require('../models/user.js');
const helpers = require('../assets/helpers/helpers.js');

module.exports = {
  async newGet(req, res) {
    const category = await MainCategory.findOne({_id: req.params.id});
    res.render("new-category", {
      category: category,
    });
  },
  async getMove(req, res) {
    const category = await MainCategory.findOne({_id: req.params.id});

    if (category.isPrivate) {
      res.redirect(`/entries/${category._id}`);
    } else {
      const publicCategories = await MainCategory.find(
        { $and: [
          {isPrivate: {
            $in: false,
          }},
        ],
       }
     ).sort({title: 1});
      res.render("move", {
        publicCategories: publicCategories,
        categorytoMove: category,
        id: category._id,
      });
    }
  },
  async move(req, res) {

    try {
      let categoryToMove = await MainCategory.findOne({_id: req.params.id});

      if (categoryToMove.isPrivate) {
        res.redirect(`/entries/${categoryToMove._id}`);
      }
      // if moving the subcategory to become a parent and removing its child status
      if (req.body.categoryId === 'parent') {
        let parentCategory = await MainCategory.findOne({_id: categoryToMove.section});
        parentCategory.subCategories.splice(parentCategory.subCategories.indexOf(categoryToMove._id), 1);
        categoryToMove.section = 'parent';
        await parentCategory.save()
        await categoryToMove.save();
      } else {
        if (categoryToMove.section !== 'parent') {

          let newParentCategory = await MainCategory.findOne({_id: req.body.categoryId});
          let oldParentCategory = await MainCategory.findOne({_id: categoryToMove.section});

          oldParentCategory.subCategories.splice(oldParentCategory.subCategories.indexOf(categoryToMove._id), 1);
          categoryToMove.section = req.body.categoryId;
          newParentCategory.subCategories.push(categoryToMove._id);

          await oldParentCategory.save();
          await categoryToMove.save();
          await newParentCategory.save();
        } else {

          let newParentCategory = await MainCategory.findOne({_id: req.body.categoryId});

          categoryToMove.section = req.body.categoryId;
          newParentCategory.subCategories.push(categoryToMove._id);

          await categoryToMove.save();
          await newParentCategory.save();
        }
      }
      res.redirect(`/entries/${categoryToMove._id}`);
    } catch (error) {
      console.log(error);
    }

  },
  async publicIndex(req, res) {
    const count = await MainCategory.countDocuments(
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
    )
    if(req.query.page == 1){
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
      ).populate('owner').sort({'createdAt': -1}).limit(9);
      const remainder = count - 9;
      res.render('index-all', {
        categories: publicCategories,
        user: req.user,
        adminStatus: req.user.isAdmin,
        remainder: remainder,
        page: parseInt(req.query.page),
        isPrivate: false,
      })
    } else {
      const offset = req.query.page * 9;
      if(offset){
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
        ).sort({'createdAt': -1}).populate('owner').limit(9).skip(offset - 9);
        res.render('index-all', {
          categories: publicCategories,
          user: req.user,
          adminStatus: req.user.isAdmin,
          remainder: (count - offset),
          page: parseInt(req.query.page),
          isPrivate: false,
        })
    }
    }
  },
  async privateIndex(req, res) {
    const count = await MainCategory.countDocuments(
      {
        $and: [
          {isPrivate: {
            $in: true,
          }},
          {section: {
            $in: 'parent',
          }},
          {user: {
            $in: req.user._id,
          }},
        ]
      }
    );
    if(req.query.page == 1){
      const privateCategories = await MainCategory.find(
        {
          $and: [
            {isPrivate: {
              $in: true,
            }},
            {section: {
              $in: 'parent',
            }},
            {user: {
              $in: req.user._id,
            }},
          ]
        }
      ).populate('owner').sort({'createdAt': -1}).limit(9);
      const remainder = count - 9;
      res.render('index-all', {
        categories: privateCategories,
        user: req.user,
        adminStatus: req.user.isAdmin,
        remainder: remainder,
        page: parseInt(req.query.page),
        isPrivate: true,
      })
    } else {
      const offset = req.query.page * 9;
      if(offset) {
        const privateCategories = await MainCategory.find(
          {
            $and: [
              {isPrivate: {
                $in: true,
              }},
              {section: {
                $in: 'parent',
              }},
              {user: {
                $in: req.user._id,
              }},
            ]
          }
        ).populate('owner').sort({'createdAt': -1}).limit(9).skip(offset - 9);
        res.render('index-all', {
          categories: privateCategories,
          user: req.user,
          adminStatus: req.user.isAdmin,
          remainder: (count - offset),
          page: parseInt(req.query.page),
          isPrivate: true,
        })
      }
    }
  },
  async newPost(req, res) {
    try{
      let user = await User.findOne({_id: req.user._id});
      req.body.entry.owner = user;
      if(req.body.entry.isPrivate == 'true'){
        if(req.body.entry.section){
          req.body.entry.user = user._id;
          const newCategory = await MainCategory.create(req.body.entry);
          let parentCategory = await MainCategory.findOne({_id: req.body.entry.section});
          parentCategory.subCategories.push(newCategory);
          parentCategory = await parentCategory.save();
          res.redirect(`/entries/${newCategory._id}`);
        } else {
          req.body.entry.section = 'parent';
          req.body.entry.user = user._id;
          let newCategory = await MainCategory.create(req.body.entry);
          user.privateEntries.push(newCategory);
          await user.save();
          res.redirect(`/entries/${newCategory._id}`);
        }
      } else {
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
      }
    } catch(err) {
      console.log(err);
    }
  },
  async editGet(req, res) {
    try{
      const category = await MainCategory.findOne({_id: req.params.categoryId});
      const users = await User.find({});
      if(category.isPrivate){
        res.render('category-edit', {
          category: category,
          users: users,
          loggedUser: req.user,
          private: true,
        });
      } else {
        res.render('category-edit', {
          category: category,
          private: false,
          users: users,
          loggedUser: req.user,
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
      if(prop === "owner"){
        let owner = await User.findOne({_id: req.body.entry.owner});
        console.log(owner);
        category.owner = owner;
      } else {
        category[prop] = req.body.entry[prop];
      }
    }
    await category.save();
    if(category.section == "parent" && category.isPrivate){
      if(Array.isArray(req.body.entry.user)){
        for(const userId of req.body.entry.user){
          let user = await User.findOne({_id: userId});
          if(user.privateEntries.indexOf(category._id) == -1){
            user.privateEntries.push(category._id);
            await user.save();
          }
        }
      } else {
        // define delete controller for users not present - push above the property swap loop
      }
    }
    res.redirect(`/entries/${req.params.categoryId}`);
  },
  async delete(req, res) {
    const category = await MainCategory.findOne({_id: req.params.categoryId}).populate("faqs").populate("subCategories");
    let stagingArray = [];
    let arr = await helpers.recursiveCollectEntries(category.subCategories, stagingArray);
    await MainCategory.deleteOne({_id: req.params.categoryId});
    if(category.section === 'parent' && category.isPrivate === true){
      category.user.forEach( async (userId) => {
        await User.updateOne(
          {_id: userId},
          {$pull: {'privateEntries': category._id}}
        )
      })
    }
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
  },
  async newPrivateParent(req, res) {
    res.render('new-category-parent-private');
  }
}
