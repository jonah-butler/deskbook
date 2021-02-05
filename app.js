const express 				  = require('express'),
		  app 						  = express(),
			ejs 						  = require('ejs'),
 			bodyParser 			  = require('body-parser')
 			mongo 			      = require('mongodb').MongoClient,
 			mongoose 				  = require('mongoose'),
 			emoji 					  = require('node-emoji'),
		 	expressSanitizer  = require("express-sanitizer"),
 	 		methodOverride 	  = require("method-override"),
			passport 				  = require('passport'),
			helpers           = require('./assets/helpers/helpers'),
			LocalStrategy     = require('passport-local'),
			JobSeeker         = require("./models/jobseeker"),
			User              = require("./models/user"),
			Entry             = require("./models/entry"),
			MainCategory      = require("./models/category"),
			ReferenceQuestion = require("./models/question"),
			passportLocalMongoose = require("passport-local-mongoose")

const router = express.Router();

//Localhost setup for Mongo db
mongoose.connect('mongodb://localhost:27017/deskbook',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	});


	//express integration with bodyparser
	app.use(bodyParser.urlencoded({extended: true}));
	//express setup with ejs
	app.set("view engine", "ejs");
	//linking assets directory
	app.use(express.static("assets"));
	app.use(express.static("assets/imgs"));
	app.use(express.json({limit: '1mb'}));
	app.use(expressSanitizer());
	app.use(methodOverride("_method"));

	//**********
	// Passport Config
	//**********

	app.use(require("express-session")({
		secret: "Library's famous secret password",
		resave: false,
		saveUninitialized: false
	}));

	app.use(passport.initialize());
	app.use(passport.session());
	passport.use( new LocalStrategy(User.authenticate() ));
	passport.serializeUser( User.serializeUser() );
	passport.deserializeUser( User.deserializeUser() );

//************
//
//      Routes
//
//************

require('./routes/reference')(app);
require('./routes/search')(app);

//**********************
//      Category Routes
//**********************

app.get('/category/:id/new', async (req, res) => {
	const category = await MainCategory.findOne({_id: req.params.id});
	res.render("new-category", {
		category: category,
	});
})

// app.post('/category/new', (req, res) => {
// 	console.log(req.body);
// 	MainCategory.create(req.body.entry, (err, category) => {
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log(category);
// 			res.redirect('/entries');
// 		}
// 	})
// })

app.post('/category/new', async (req, res) => {
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
})

app.get('/category/:categoryId/edit', async (req, res) => {
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
})

app.put('/category/:categoryId/edit', async (req, res) => {
	const category = await MainCategory.findOne({_id: req.params.categoryId});
	if(req.body.entry.category == undefined){
		req.body.entry.category = [];
	}
	for(const prop in req.body.entry){
		category[prop] = req.body.entry[prop];
	}
	await category.save();
	// const updatedCategory = await MainCategory.findOneAndUpdate({title: req.body.category.title}, req.body.category, {
	// 	new: true,
	// });
	// console.log(category);
	res.redirect(`/entries/${req.params.categoryId}`);
})

app.delete('/category/:categoryId/edit', async (req, res) => {
	// const category = await MainCategory.findOne({title: req.params.categoryId});
	const category = await MainCategory.findOne({_id: req.params.categoryId}).populate("faqs").populate("subCategories");
	// helpers.test(category.subCategories);
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

	// await MainCategory.findOne({_id: req.params.categoryId}).populate("faqs").populate("subCategories").exec((err, category) => {
	// 	if(err){
	// 		console.log(err);
	// 	} else {
	// 		console.log('Parent Category+++++++++++++++', category.title);
	// 		category.subCategories.forEach((category) => {
	// 			console.log(a);
	// 		})
	// 		Entry.deleteMany({section: category._id}, (err, removed) => {
	// 			if(err){
	// 				console.log(err);
	// 			} else {
	// 				console.log(removed);
	// 			}
	// 		})
	// 	}
	// })
	// await MainCategory.deleteOne({_id: category._id});
	// MainCategory.
	// 	findOne({title: req.params.categoryTitle}).
	// 	populate("faqs").
	// 	exec((err, category) => {
	// 		if(err){
	// 			console.log(err);
	// 		} else {
	// 			category.faqs.forEach((faq) => {
	// 				try{
	// 				Entry.remove({_id: faq._id});
	// 				} catch(err) {
	// 					console.log(err);
	// 				}
	// 			})
	// 		  category.remove({_id: category._id});
	// 		}
	// 	})
		res.redirect('/entries');
})

app.get('/category/new-parent', (req, res) => {
	res.render('new-category-parent');
})

//**********************
//**********************


//Test Route for AJAX API
app.get("/test-api", (req, res) => {
	JobSeeker.find({}, (err, users) => {
		if(err){
			console.log(err);
		} else {
			res.send(users)
		}
	})
})

app.post("/user/print-tracker-update", isLoggedIn, (req, res) => {
	let numOfPrints = req.body.numOfPrints;
	let cardId = req.body.id;
	JobSeeker.findOne({_id: cardId}, (err, jobseeker) => {
		jobseeker.numOfPrints = numOfPrints;
		jobseeker.save((err, updatedJobseeker) => {
			if(err){
				console.log(err);
			} else {
				console.log(updatedJobseeker);
			}
		})
	})
})

//Home Route - Landing - Have More Options Eventually
app.get("/", isLoggedIn, (req, res) =>{
	res.render("landing", {
		bookEmoji: emoji.get("book"),
		user: req.user,
	});
})

app.get("/user", isLoggedIn, (req, res) =>{
	res.render("user", {
		user: req.user
	})
} )

app.get("/calendarClient", isLoggedIn, (req, res) => {
	const clientSecret = "baf5b3e12d05125f5d7e277d04ffc6ca";
	res.send({clientSecret: clientSecret});
})

app.get("/calendar", isLoggedIn, (req, res) => {
	res.render("calendar");
})

//*****************************
//      Entries Routes
//*****************************

//All Entries
app.get("/entries", isLoggedIn, (req, res) => {
	MainCategory.find({section: 'parent'}, (err, categories) => {
		if(err){
			console.log(err);
		} else {
			res.render("index", {
				categories: categories,
				user: req.user,
				adminStatus: req.user.isAdmin
			});
		}
	})
})
//Post new entry to db
app.post("/entries", isLoggedIn, (req, res) => {
	// console.log(req.body.entry);
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
});

//New FAQ Route
app.get("/entries/:id/new", isLoggedIn, (req, res) => {
	MainCategory.findOne({_id: req.params.id}, (err, category) => {
		console.log(category);
		res.render("new-faq", {category: category});
	})
});

//Category landing
app.get("/entries/:id", isLoggedIn, (req, res) => {
	MainCategory.findOne({_id: req.params.id}).populate("faqs").populate("subCategories").exec((err, category) => {
		if(err){
			console.log(err);
		} else {
			if(category.section != 'parent'){
				MainCategory.findOne({_id: category.section}, (err, parentCategory) => {
					res.render("header-list", {
						category: category,
						parentCategory: parentCategory,
						adminStatus: req.user.isAdmin,
					});
				});
			} else {
				res.render("header-list", {
					category: category,
					adminStatus: req.user.isAdmin,
				});
			}
		}
	})
})

//Single Entry Route for displaying all details - show route
app.get("/entries/:categoryId/:id", isLoggedIn, async (req, res) => {
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
		// console.log(newObj);
		res.render("show", {
			parentCategory: parentCategory,
			values: newObj,
			adminStatus: req.user.isAdmin
		} );
	})
});

app.get("/entries/:headerCategory/:id/edit", isAdmin, (req, res) => {
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
})

app.delete("/entries/:category/:id/edit", async (req, res) => {
	await MainCategory.update({title: req.params.category}, { $pull: { faqs: req.params.id }});
	await Entry.deleteOne({_id: req.params.id});
	res.redirect(`/entries/${req.params.category}`);
})


app.put("/entries/:headerCategory/:id", isLoggedIn, (req, res) => {
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
})


//Single Category Route - display all entries single category
app.get("/entries/:id", isLoggedIn, (req, res) => {
	MainCategory.findOne({_id: req.params.id}).populate("faqs").populate("subCategories").exec((err, category) => {
		if(err){
			console.log(err);
		} else {
			console.log(category);
			res.render("header-list", {
				category: category,
				// category: category,
				adminStatus: req.user.isAdmin,
			});
			// MainCategory.findOne({title: title}, (err, category) => {
			// 	if(err){
			// 		console.log(err);
			// 	} else {
			// 		res.render("header-list", {
			// 			allEntries: faqArr,
			// 			category: category,
			// 			adminStatus: req.user.isAdmin,
			// 		});
			// 	}
			// })
		}
	})
	// MainCategory.find({title: headerName}, (err, allEntries) => {
	// 	if(err){
	// 		console.log(err);
	// 	} else {
	// 		res.render("header-list", {
	// 			allEntries: allEntries,
	// 			headerName: headerName
	// 		});
	// 	}
	// })
})

// app.post("/print-tracker", function(req, res){
//
//  var formData = req.body.content;
//  console.log(formData);
//
//  Todo.create(formData, function(err, newVal){
//     if(err){
//       console.log(err);
//     } else {
// 		if(req.xhr){
// 			res.json(newVal)
// 		} else {
// 			console.log(err);
// 		}
//     }
//   });
// });

// app.get("/print-tracker", isLoggedIn, (req, res) =>{
// 	JobSeeker.find({}, (err, users) =>{
// 		if(err){
// 			console.log('Error');
// 			console.log(err);
// 		} else {
// 			res.render("print-tracker",
// 			{
// 				users: users
// 			});
// 		}
// 	})
// })

app.get("/user/print-tracker/:userId", isLoggedIn, (req, res) =>{
	let userId = req.params.userId;
	User.findOne({_id: userId}).populate("jobseekers").exec((err, user) => {
		if(err){
			console.log(err);
		} else {
			console.log(user.jobseekers);
			res.render('print-tracker',
			{
				jobseekers: user.jobseekers,
				userId: userId
			})
		}
	})

})

app.post("/user/print-tracker/:userId", isLoggedIn, (req, res) => {
	let userId = req.params.userId;
	let compNum = req.body.computerNum;
	let userObj = {computerNum: compNum, numOfPrints: 0};
	JobSeeker.create(userObj, (err, newObj) => {
		if(err){
			console.log(err);
		} else {
			// res.redirect('/user/print-tracker/' + userId);
			User.findOne({_id: userId}, (err, user) => {
				if(err){
					console.log(err);
				} else {
					user.jobseekers.push(newObj);
					user.save((err, updatedUser) => {
						if(err){
							console.log(err);
						} else {
							console.log(updatedUser);
							res.redirect("/user/print-tracker/" + userId);
						}
					})
				}
			})
		}
	})
})

app.get("/user/print-tracker/new/:userId", isLoggedIn, (req, res) => {
	let userId = req.params.userId
	res.render("new-user",
	{
		users: req.user.jobseekers,
		userId: userId
	})
})

// app.get("/print-tracker/new", isLoggedIn, (req, res) => {
// 	JobSeeker.find({}, (err, users) => {
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.render("new-user",
// 			{
// 					users: users
// 			});
// 		}
// 	})
//
//
//
//
// })

app.post('/print-tracker', isLoggedIn, (req, res) => {
	let compNum = req.body.computerNum;
	let userObj = {computerNum: compNum, numOfPrints: 0};
	JobSeeker.create(userObj, (err, newObj) => {
		if(err){
			console.log(err);
		} else {
			res.redirect('/print-tracker');
		}
	})
})

app.delete('/user/print-tracker/', (req, res) => {
	let cardId = req.body.valueId;
	User.findOne({_id: req.user._id}, (err, foundUser) => {
		if(err){
			console.log(err);
		} else {
			console.log(foundUser);
			// foundUser.jobseekers.splice(foundUser.jobseekers.indexOf(cardId), 1);
			// JobSeeker.findOneAndDelete((cardId), (err, deletedJobseeker) => {
			// 	if(err){
			// 		console.log(err);
			// 	} else {
			// 		console.log(deletedJobseeker);
			// 		res.redirect('/user/print-tracker/' + req.user._id);
			// 	}
			// })
		}
	})
})



//show register form
app.get("/register", isLoggedIn, isAdmin, (req, res) => {
	User.find({}, (err, obj) => {
		if(err){
			console.log(err);
		} else {
			res.render("register", {users: obj} );
		}
	});
});

//handle signup logic
app.post("/register", (req, res) => {
	let newUser = new User({username: req.body.username, isAdmin: req.body.adminradio});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/");
		})
	})
})

app.post("/register-show-user", (req, res) => {
	let user = req.body.username;
	User.find({username: user}, (err, user) => {
		if(err){
			console.log(err);
		} else {
			res.send(user);
		}
	})
})

//show login form
app.get("/login", (req, res) => {
	// res.locals.isAuthenticated = false
	console.log(req.isAuthenticated())
	res.render("login", {
		userAuthenticated: false,
	});
});

app.get('/isAdmin', (req, res) => {
	if(!req.user.isAdmin){
		res.send(false);
	} else {
		res.send(true);
	}
})

//handle login logic
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/entries",
		failureRedirect: "/login"

	}), (req, res) => {

})

//logout route
app.get("/logout", isLoggedIn, (req, res) => {
	req.logout();
	res.redirect('/login');
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function isAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.isAdmin == true){
		return next();
	}
	res.redirect("/entries");
}


app.get("*", (req, res) => {
	res.render("404");
})


//localhost setup
app.listen(3000, (req, res) =>{
	console.log("successfully listening on port 3000");
})
