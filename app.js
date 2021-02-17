const express 				  = require('express'),
		  app 						  = express(),
			flash             = require('connect-flash'),
			ejs 						  = require('ejs'),
 			bodyParser 			  = require('body-parser'),
			session           = require('express-session'),
 			mongo 			      = require('mongodb').MongoClient,
 			mongoose 				  = require('mongoose'),
		 	expressSanitizer  = require('express-sanitizer'),
 	 		methodOverride 	  = require('method-override'),
			passport 				  = require('passport'),
			helpers           = require('./assets/helpers/helpers'),
			LocalStrategy     = require('passport-local'),
			JobSeeker         = require("./models/jobseeker"),
			User              = require("./models/user"),
			Entry             = require("./models/entry"),
			MainCategory      = require("./models/category"),
			ReferenceQuestion = require("./models/question"),
			MongoStore        = require('connect-mongo')(session),
			passportLocalMongoose = require("passport-local-mongoose")

const router = express.Router();
require('dotenv').config()


// mongoose.connect(process.env.DB_URL,
// 	{
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useFindAndModify: false
// 	});

//connect to Mongo Atlas
// const MongoClient = require('mongodb').MongoClient;
// const client = new mongo(process.env.DB_URL, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
mongoose.connect(process.env.DB_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	});

//Localhost setup for Mongo db
// mongoose.connect('mongodb://localhost:27017/deskbook',
// 	{
// 		useNewUrlParser: true,
// 		useUnifiedTopology: true,
// 		useFindAndModify: false
// 	});


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
	app.use(flash());

	//**********
	// Passport Config
	//**********

	const secret = process.env.SECRET || 'secretfordevelopment';

	const store = new MongoStore({
		url: process.env.DB_URL,
		secret,
		touchAfter: 24 * 60 * 60
	})

	store.on("error", function(e) {
		console.log('SESSION STORE', e);
	})

	const sessionConfig = {
		store,
		name: 'session',
		secret,
		resave: false,
		saveUninitialized: true,
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
			expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		}
	}

		app.use(session(sessionConfig));

	// app.use(session({
	// 	secret: "Library's famous secret password",
	// 	resave: false,
	// 	saveUninitialized: false
	// }));

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

require('./routes/entry')(app);
require('./routes/reference')(app);
require('./routes/search')(app);
require('./routes/category')(app);
require('./routes/home')(app);
require('./routes/user')(app);


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
// app.get("/", isLoggedIn, (req, res) =>{
// 	res.render("landing", {
// 		bookEmoji: emoji.get("book"),
// 		user: req.user,
// 	});
// })

// app.get("/user", isLoggedIn, (req, res) =>{
// 	res.render("user", {
// 		user: req.user
// 	})
// } )

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
// app.get("/entries", isLoggedIn, (req, res) => {
// 	MainCategory.find({section: 'parent'}, (err, categories) => {
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.render("index", {
// 				categories: categories,
// 				user: req.user,
// 				adminStatus: req.user.isAdmin
// 			});
// 		}
// 	})
// })
// //Post new entry to db
// app.post("/entries", isLoggedIn, (req, res) => {
// 	// console.log(req.body.entry);
// 	Entry.create(req.body.entry, (err, newEntry) => {
// 		if(err){
// 			console.log(err);
// 		} else{
// 			MainCategory.findOne({_id: req.body.entry.section}, (err, category) => {
// 				if(err){
// 					console.log(err);
// 				} else {
// 					category.faqs.push(newEntry);
// 					category.save((err, updatedCategory) => {
// 						if(err){
// 							console.log(err);
// 						} else {
// 							console.log(updatedCategory);
// 							res.redirect(`/entries/${category._id}`);
// 						}
// 					})
// 				}
// 			})
// 		}
// 	})
// });

// //New FAQ Route
// app.get("/entries/:id/new", isLoggedIn, (req, res) => {
// 	MainCategory.findOne({_id: req.params.id}, (err, category) => {
// 		console.log(category);
// 		res.render("new-faq", {category: category});
// 	})
// });

// //Category landing
// app.get("/entries/:id", isLoggedIn, (req, res) => {
// 	MainCategory.findOne({_id: req.params.id}).populate("faqs").populate("subCategories").exec((err, category) => {
// 		if(err){
// 			console.log(err);
// 		} else {
// 			if(category.section != 'parent'){
// 				MainCategory.findOne({_id: category.section}, (err, parentCategory) => {
// 					res.render("header-list", {
// 						category: category,
// 						parentCategory: parentCategory,
// 						adminStatus: req.user.isAdmin,
// 					});
// 				});
// 			} else {
// 				res.render("header-list", {
// 					category: category,
// 					adminStatus: req.user.isAdmin,
// 				});
// 			}
// 		}
// 	})
// })

// //Single Entry Route for displaying all details - show route
// app.get("/entries/:categoryId/:id", isLoggedIn, async (req, res) => {
// 	// const categoryName = req.params.id;
// 	const entry = await Entry.find({_id: req.params.id});
// 	const parentCategory = await MainCategory.findOne({_id: req.params.categoryId});
// 	// console.log(entry);
// 	// MainCategory.findOne({title: req.params.headerCategory}).populate("faqs").exec((err, categories) => {
// 	// 	if(err){
// 	// 		console.log(err);
// 	// 	} else {
// 	//
// 	// 	}
// 	// })
// 	Promise.all([
// 		Entry.find({_id: req.params.id}),
// 	  // Entry.findOne({_id: { $gt: req.params.id } }, { section: entry.section } ),
// 		// Entry.findOne({_id: { $lt: req.params.id } }, { section: entry.section } )
// 		Entry.find({
// 			"_id": { "$gt": req.params.id},
// 			"section": {"$in": entry[0].section}
// 		}),
// 		Entry.find({
// 			"_id": { "$lt": req.params.id},
// 			"section": {"$in": entry[0].section}
// 		})
// 	]).then((data) => {
// 		console.log('received data', data);
// 		const newObj = data.map((obj) => {
// 			if(obj != undefined){
// 					return obj[0];
// 			};
// 		})
// 		// console.log(newObj);
// 		res.render("show", {
// 			parentCategory: parentCategory,
// 			values: newObj,
// 			adminStatus: req.user.isAdmin
// 		} );
// 	})
// });

// app.get("/entries/:headerCategory/:id/edit", isAdmin, (req, res) => {
// 	let category = req.params.headerCategory;
// 	Entry.findById(req.params.id, (err, entry) => {
// 		if(err){
// 			redirect("/entries");
// 		} else {
// 			res.render("edit", {
// 				entry: entry,
// 				category: category,
// 				// categories: mainCategories
// 			});
// 		}
// 	})
// })

// app.delete("/entries/:category/:id/edit", isAdmin, async (req, res) => {
// 	await MainCategory.update({title: req.params.category}, { $pull: { faqs: req.params.id }});
// 	await Entry.deleteOne({_id: req.params.id});
// 	res.redirect(`/entries/${req.params.category}`);
// })


// app.put("/entries/:headerCategory/:id", isLoggedIn, (req, res) => {
// 	if(!req.body.entry.category){
// 		req.body.entry['category'] = [];
// 	}
// 	Entry.findByIdAndUpdate(req.params.id, req.body.entry, (err, updatedEntry) => {
// 		if(err){
// 			console.log(err);
// 			res.redirect("/entries/" + req.params.headerCategory);
// 		} else {
// 			res.redirect("/entries/" + req.params.headerCategory + "/" + req.params.id);
// 		}
// 	})
// })


//Single Category Route - display all entries single category
// app.get("/entries/:id", isLoggedIn, (req, res) => {
// 	MainCategory.findOne({_id: req.params.id}).populate("faqs").populate("subCategories").exec((err, category) => {
// 		if(err){
// 			console.log(err);
// 		} else {
// 			console.log(category);
// 			res.render("header-list", {
// 				category: category,
// 				// category: category,
// 				adminStatus: req.user.isAdmin,
// 			});
// 			// MainCategory.findOne({title: title}, (err, category) => {
// 			// 	if(err){
// 			// 		console.log(err);
// 			// 	} else {
// 			// 		res.render("header-list", {
// 			// 			allEntries: faqArr,
// 			// 			category: category,
// 			// 			adminStatus: req.user.isAdmin,
// 			// 		});
// 			// 	}
// 			// })
// 		}
// 	})
// 	// MainCategory.find({title: headerName}, (err, allEntries) => {
// 	// 	if(err){
// 	// 		console.log(err);
// 	// 	} else {
// 	// 		res.render("header-list", {
// 	// 			allEntries: allEntries,
// 	// 			headerName: headerName
// 	// 		});
// 	// 	}
// 	// })
// })

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

app.delete('/user/print-tracker/', isLoggedIn, (req, res) => {
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
// app.get("/register", isLoggedIn, isAdmin, (req, res) => {
// 	User.find({}, (err, obj) => {
// 		if(err){
// 			console.log(err);
// 		} else {
// 			res.render("register", {users: obj} );
// 		}
// 	});
// });
app.get("/register", isAdmin, (req, res) => {
	// User.find({}, (err, obj) => {
	// 	if(err){
	// 		console.log(err);
	// 	} else {
	// 		res.render("register", {users: obj} );
	// 	}
	// });
	res.render('register');
});

//handle signup logic
app.post("/register", isAdmin, (req, res) => {
	let newUser = new User({username: req.body.username, email: req.body.email, isAdmin: req.body.adminradio});
	User.register(newUser, req.body.password, (err, user) => {
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, () => {
			res.redirect("/entries");
		})
	})
})

app.post("/register-show-user", isLoggedIn, (req, res) => {
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
	// console.log(req.isAuthenticated())
	res.render("login", {
		userAuthenticated: req.isAuthenticated(),
	});
});

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

const port = process.env.PORT || 3000;
//localhost setup
app.listen(port, (req, res) =>{
	console.log("successfully listening on port 3000");
})
