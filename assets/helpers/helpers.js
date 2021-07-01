const Entry             = require("../../models/entry");
const MainCategory      = require("../../models/category");
const passport          = require('passport');

function splitAtWordEnd(str, limit) {
  let count = 0;
  let newText = '';
  str.split(' ').forEach(word => {
    if(count < limit){
      newText += `${word} `
    } else {
      return;
    }
    count += word.length;
  })
  newText += '...';
  return newText;
}

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

function formatDatesForDatePickers(date) {
  if(date instanceof Date){
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  } else {
    return new Error('invalid date param, use Date class');
  }
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
        } else {
        // res.redirect('/login');
        res.redirect('/entries');
        // req.category = category;
        // return next();
      }
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

async function s3RetrieveAllKeys(s3, params) {
  //while loop boolean
  let truncated = true;
  //return arr for organizing data:
  //0 = data that is not a directory or current directory
  //1 = current directory listing
  //2 = child directories of current directory
  const keys = [[],[]];
  //truncated begins as true. aws s3 return will hold truncated var
  //if truncated return true, there are still more items to fetch
  //beyond may keys. if !truncated, loop will break.
  while(truncated) {
    const data = await s3.listObjectsV2(params).promise();
    if(data.KeyCount !== 0) {
      data.Contents.forEach(item => {
        if(item.Size === 0) {
          keys[1].push({key: item.Key, size: item.Size});
        } else {
          keys[0].push({key: item.Key, size: item.Size});
        }
      })
      keys[2] = data.CommonPrefixes;
      truncated = data.IsTruncated;
      if(data.NextContinuationToken){
        params.ContinuationToken
      }
    } else {
      return false;
    }
  }
  return keys;
}

function buildQueryArr(awsKey) {
  //remove deskbook-uploads/ portion of key
  let modifiedKey = awsKey.replace('deskbook-uploads/', '').split('/');
  modifiedKey.pop();
  return modifiedKey;
}

function findPreviousDirectory(currentPrefix) {
  let previousDirectory = currentPrefix.split('/').filter(x => x);
  previousDirectory.pop();
  previousDirectory = `${previousDirectory.join('/')}/`;
  if(previousDirectory !== 'deskbook-uploads/'){
    return previousDirectory;
  } else {
    return null;
  }
}

function isDocument(link) {
  const nonImgFormats = ['pdf', 'doc', 'docx'];
  let splitLink = link.split('.');
  splitLink = splitLink[splitLink.length - 1];
  if(nonImgFormats.includes(splitLink)){
    return true;
  } else {
    return false;
  }
}

function concatStrWithHyphens(str) {
  if(str.indexOf(' ') != -1) {
    let concatStr = str.split(' ');
    return concatStr.join('-');
  } else {
    return str;
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
module.exports.formatDatesForDatePickers = formatDatesForDatePickers;
module.exports.splitAtWordEnd = splitAtWordEnd;
module.exports.s3RetrieveAllKeys = s3RetrieveAllKeys;
module.exports.buildQueryArr = buildQueryArr;
module.exports.findPreviousDirectory = findPreviousDirectory;
module.exports.isDocument = isDocument;
module.exports.concatStrWithHyphens = concatStrWithHyphens;
