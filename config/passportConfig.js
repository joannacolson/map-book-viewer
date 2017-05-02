var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var db = require('../models');

/*
 * Passport "serializes" objects to make them easy to store, converting the
 * user to an identifier (id)
 */
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

/*
 * Passport "deserializes" objects by taking the user's serialization (id)
 * and looking it up in the database
 */
passport.deserializeUser(function(id, cb) {
    db.user.findById(id).then(function(user) {
        cb(null, user);
    }).catch(cb);
});

/*
 * This is Passport's strategy to provide local authentication. We provide the
 * following information to the LocalStrategy:
 *
 * Configuration: An object of data to identify our authentication fields, the
 * username and password
 *
 * Callback function: A function that's called to log the user in. We can pass
 * the email and password to a database query, and return the appropriate
 * information in the callback. Think of "cb" as a function that'll later look
 * like this:
 *
 * login(error, user) {
 *   // do stuff
 * }
 *
 * We need to provide the error as the first argument, and the user as the
 * second argument. We can provide "null" if there's no error, or "false" if
 * there's no user.
 */
passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, cb) {
    db.user.findOne({
        where: { email: email }
    }).then(function(user) {
        if (!user || !user.isValidPassword(password)) {
            cb(null, false); // No user or bad password
        } else {
            cb(null, user); // User is allowed, yay!
        }
    }).catch(cb);
}));

passport.use(new facebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/callback/facebook',
    // getting info about the user from facebook
    profileFields: ['id', 'email', 'displayName'],
    enableProof: true

}, function(accessToken, refreshToken, profile, cb) {
    // See if we can get the email from the facebook profile
    var email = profile.emails ? profile.emails[0].value : null;

    // See if the user already exists in the database
    db.user.findOne({
        where: { email: email }
    }).then(function(existingUser) {
        // This person has logged in before!
        if (existingUser && email) {
            existingUser.updateAttributes({
                facebookId: profile.id,
                facebookToken: accessToken
            }).then(function(updatedUser) {
                cb(null, updatedUser);
            }).catch(cb);
        } else {
            // The person is new, we need to make a new entry for them in the users table
            db.user.findOrCreate({
                where: { facebookId: profile.id },
                defaults: {
                    facebookToken: accessToken,
                    email: email,
                    firstName: profile.displayName.split(' ')[0],
                    lastName: profile.displayName.split(' ')[1]
                }
            }).spread(function(user, wasCreated) {
                if (wasCreated) {
                    // They were new, so we created a new user
                    cb(null, user);
                } else {
                    // They were not new after all - just update their token
                    user.facebookToken = accessToken;
                    user.save().then(function() {
                        cb(null, user);
                    }).catch(cb);
                }
            }).catch(cb);
        }
    });
}));

// export the Passport configuration from this module
module.exports = passport;
