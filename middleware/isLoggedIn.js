module.exports = function(req, res, next) {
    if (!req.user) {
        req.flash('error', 'You must be logged in to view that page');
        res.redirect('/auth/login'); // Whoa, not so fast.
    } else {
        next(); // Good to go!
    }
};
