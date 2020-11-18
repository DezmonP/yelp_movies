//===============================
// Imports
//===============================


//NPM Imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session'); 

//Config Imports
const config = require('./config');

//Route Imports
const moviesRoutes = require('./routes/movies');
const commentRoutes = require('./routes/comments');
const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');

//Model Imports
const Movie = require('./models/movies');
const Comment = require('./models/comment');
const User = require('./models/user');

//===============================
// Development
//===============================
//Morgan
app.use(morgan('tiny'))
//Seed the DB
// const seed = require('./utils/seed');
// seed();


//===============================
// Config
//===============================

//Body Parser Config
app.use(bodyParser.urlencoded({extended:true}));
//Connect to DB (Mongoose Config)
mongoose.connect( config.db.connection, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true});
//Express Session Config 
app.use(expressSession({
	secret: "sjdkfl;akdjfa;dlkfjasd;lkfj",
	resave: false,
	saveUninitialized: false
}));

//Express Config
app.set("view engine", "ejs");
app.use(express.static('public'));

// Method Override Config 
app.use(methodOverride('_method'));

//Passport Config
app.use(passport.initialize());
app.use(passport.session()); // Allows persistant sessions
passport.serializeUser(User.serializeUser()); // What data should be stored in session
passport.deserializeUser(User.deserializeUser()); // Get the user from the stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy 

//Current User Status Middleware Config
app.use((req,res,next) => {
	res.locals.user = req.user; 
	next();
})

//Route Config
app.use("/",mainRoutes);
app.use("/",authRoutes);
app.use("/movies",moviesRoutes);
app.use("/movies/:id/comments",commentRoutes);

//===============================
// Listen 
//===============================
app.listen(3000, () => {
	console.log("yelp_movies is running...");
})

