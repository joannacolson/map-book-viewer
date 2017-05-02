// Requires and global variables
var express = require('express');
var db = require('../models');
var passport = require('../config/passportConfig');
var router = express.Router();

// Routes
router.get('/signup', function(req, res) {
    res.render
('auth/signupForm');
});

router.post('/signup', function(req, res, next) {
    // find or create a user, providing the name fields and password as default values
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'password': req.body.password
        }
    }).spread(function(user, wasCreated) {
        if (wasCreated) {
            // Good! Log them in...
            // if created, success and redirect home
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: 'Account created and logged in!',
                failureRedirect: '/login',
                failureFlash: 'Unknown error occurred, please re-login.'
            })(req, res, next);
        } else {
            // BAD!
            // if not created, the email already exists
            req.flash('error', 'Email already exists, please login.');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        // if an error occurs, let's see what the error is
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    });
});

router.get('/login', function(req, res) {
    res.render('auth/loginForm');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'Good job, you logged in. Woot!',
    failureRedirect: '/auth/login',
    failureFlash: 'Try again, invalid email and/or password.'
}));

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You logged out, see you next time!');
    res.redirect('/');
});

// FACEBOOK AUTH SECTION
router.get('/facebook', passport.authenticate('facebook', {
    scope: ['public_profile', 'email']
}));

router.get('/callback/facebook', passport.authenticate('facebook', {
    successRedirect: '/profile',
    successFlash: 'You have logged in using Facebook.',
    failureRedirect: '/auth/login',
    failureFlash: 'You tried, but Facebook said no'
}));

// Export
module.exports = router;
