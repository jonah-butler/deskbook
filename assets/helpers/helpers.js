const Entry             = require("../../models/entry");
const MainCategory      = require("../../models/category");
const passport          = require('passport');

async function recursiveCollectEntries(subCategoryArr, staging) {
  if(!subCategoryArr.length){
    return;
  } else {
    for(let category of subCategoryArr) {
      try {
        let categories = await MainCategory.findOne({_id: category._id}).populate("subCategories");
        staging.push(category._id);
        await recursiveCollectEntries(categories.subCategories, staging);
      } catch(err) {
        console.log(err);
      }
    }
  }
  return staging;
}

function findNextDay(date) {
  tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
    // return null;
    res.redirect("/login");
  }
}

function cachePreviousRoute(req, res, next) {
  req.previousRoute = req.headers.referer;
}

function canSubmit(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    res.send({error: 'user not logged in'});
  }
}

function isAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.isAdmin == true){
		return next();
	}
	res.redirect("/");
}

async function isPublicEntry(req, res, next){
  try{
    let entry = await Entry.findOne({_id: req.params.id});
      if(entry && entry.isPrivate && !req.isAuthenticated()){
        res.redirect('/login');
      } else {
        req.entry = entry;
        return next();
      }
  } catch(err) {
    res.redirect('/404');
  }
}

async function shouldUserUpdateLibraryLocation(req, res, next) {
  try{
    if(!req.user.library){
      res.redirect(`user/${req.user_id}/account-details`);
    } else {
      return next();
    }
  } catch(err) {
    console.log('error in update library location middleware');
  }
}

async function isPublicCategory(req, res, next){
  try{
    const category = await MainCategory.findOne({_id: req.params.id}).populate("faqs").populate("subCategories").populate('owner');
    // MainCategory.findOne({_id: req.params.id}, (err, category) => {
      if(!category.isPrivate){
        req.category = category;
        return next();
        if(category.user.indexOf(req.user._id) !== -1){
          req.category = category;
          return next();
        }
        // res.redirect('/login');
      } else {
        if(category.user.indexOf(req.user._id) !== -1){
          req.category = category;
          return next();
        } else
        // res.redirect('/login');
        res.redirect(req.headers.referer);
        // req.category = category;
        // return next();
      }
  } catch(err) {
    res.redirect('/404');
  }

  // });
}

async function passportAuthentication() {
  try{
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login"
    }), (req, res) => {

    };
  } catch(err){
    console.log(err);
  }
}

module.exports.recursiveCollectEntries = recursiveCollectEntries;
module.exports.findNextDay = findNextDay;
module.exports.isLoggedIn = isLoggedIn;
module.exports.isAdmin = isAdmin;
module.exports.isPublicEntry = isPublicEntry;
module.exports.isPublicCategory = isPublicCategory;
module.exports.canSubmit = canSubmit;
module.exports.passportAuthentication = passportAuthentication;
module.exports.shouldUserUpdateLibraryLocation = shouldUserUpdateLibraryLocation;
