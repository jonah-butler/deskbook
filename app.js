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
			passportLocalMongoose = require("passport-local-mongoose"),
			cors                  = require('cors');

const router = express.Router();
require('dotenv').config()


mongoose.connect(process.env.DB_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	});

	//express integration with bodyparser
	app.use(bodyParser.urlencoded({extended: true}));
	//express setup with ejs
	app.set("view engine", "ejs");
	app.use(cors());
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
		touchAfter: 24 * 60 * 60,
		autoRemove: 'interval',
		autoRemoveInterval: 10
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

require('./routes/authentication')(app);
require('./routes/entry')(app);
require('./routes/reference')(app);
require('./routes/search')(app);
require('./routes/category')(app);
require('./routes/home')(app);
require('./routes/user')(app);
require('./routes/sdks3')(app);
require('./routes/bookmark')(app);


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

const libcalSecret = process.env.LIBCAL_SECRET;

app.get("/calendarClient", isLoggedIn, (req, res) => {
	const clientSecret = process.env.LIBCAL_SECRET;
	res.send({clientSecret: clientSecret});
})

app.get("/calendar", isLoggedIn, (req, res) => {
	res.render("calendar", {
		user: req.user,
	});
})


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
		}
	})
})

app.get("/register", isAdmin, (req, res) => {
	res.render('register');
});

//handle signup logic
app.post("/register", isAdmin, (req, res) => {

	let newUser;
	if(req.body.library === 'main'){
		newUser = {
			username: req.body.username,
			email: req.body.email,
			isAdmin: req.body.adminradio,
			avatar: 'otter-pixel-trans.png',
			library: req.body.library,
			mainSubLocation: req.body.subLocation
		};
	} else {
		newUser = {
			username: req.body.username,
			email: req.body.email,
			isAdmin: req.body.adminradio,
			avatar: 'otter-pixel-trans.png',
			library: req.body.library,
		};
	}
	const registeredUser = new User(newUser);
	User.register(registeredUser, req.body.password, (err, user) => {
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("/")(req, res, () => {
			res.redirect("/entries");
		})
	})
})

// app.post("/login", passport.authenticate("local",
// 	{
// 		successRedirect: "/entries",
// 		failureRedirect: "/login"
// 	}), (req, res) => {
// })

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
	res.redirect("/");
}


app.get("*", (req, res) => {
	res.render("404");
})

const port = process.env.PORT || 3000;
app.listen(port, (req, res) =>{
	console.log("successfully listening on port 3000");
})
