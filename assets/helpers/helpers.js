Entry             = require("../../models/entry");
MainCategory      = require("../../models/category");

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
	res.redirect("/entries");
}

function isPublic(req, res, next){
  Entry.findOne({_id: req.params.id}, (err, entry) => {
    if(entry.isPrivate && !req.isAuthenticated()){
      res.redirect('/login');
    } else {
      req.entry = entry;
      return next();
    }
  });
}

module.exports.recursiveCollectEntries = recursiveCollectEntries;
module.exports.findNextDay = findNextDay;
module.exports.isLoggedIn = isLoggedIn;
module.exports.isAdmin = isAdmin;
module.exports.isPublic = isPublic;
module.exports.canSubmit = canSubmit;
