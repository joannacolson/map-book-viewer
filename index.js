// All the requires and global variables
require('dotenv').config();
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/passportConfig');
// require the authorization middleware
var isLoggedIn = require('./middleware/isLoggedIn');

var app = express();

// Set and Use Statements
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
/*
 * setup the session with the following:
 *
 * secret: A string used to "sign" the session ID cookie, which makes it unique
 * from application to application. We'll hide this in the environment
 *
 * resave: Save the session even if it wasn't modified. We'll set this to false
 *
 * saveUninitialized: If a session is new, but hasn't been changed, save it.
 * We'll set this to true.
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
/*
 * Include the flash module by calling it within app.use().
 * IMPORTANT: This MUST go after the session module
 */
app.use(flash());
// initialize the passport configuration and session as middleware
app.use(passport.initialize());
app.use(passport.session());
// Custom middleware for flash messages
app.use(function(req, res, next) {
    // before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.get('/', function(req, res) {
    res.render('home');
});

// isLoggedIn middleware is put on any route that requires login to access it
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile');
});

// Controllers
app.use('/auth', require('./controllers/auth'));

// Listen
app.listen(3000);
