// All the requires and global variables
require('dotenv').config();
var express = require('express');
var path = require('path');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('./config/passportConfig');
// require the authorization middleware to prevent access when not logged in
// var isLoggedIn = require('./middleware/isLoggedIn');
// require the route reporting tool
var rowdy = require('rowdy-logger');

var app = express();

rowdy.begin(app);

// Set and Use Statements
app.set('view engine', 'ejs');
// this sets a static directory for files used by the views
app.use(express.static(path.join(__dirname, 'static')));
// using the body parser module
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);
// this adds some logging to each request
app.use(require('morgan')('dev'));
// override with POST having action containing ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'));

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

// Controllers
app.use('/auth', require('./controllers/auth'));
app.use('/topics', require('./controllers/topics'));
app.use('/places', require('./controllers/places'));

// Listen on the port set in the env or 3000
var server = app.listen(process.env.PORT || 3000, function() {
    rowdy.print();
});

module.exports = server;
