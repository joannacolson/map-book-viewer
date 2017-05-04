// Requires and global variables
var express = require('express');
// require the authorization middleware
var isLoggedIn = require('../middleware/isLoggedIn');

var db = require('../models');
var router = express.Router();

// Routes

// display an INDEX of all places
// isLoggedIn middleware is put on any route that requires login to access it
// router.get('/:topicId', isLoggedIn, function(req, res) {
router.get('/', isLoggedIn, function(req, res) {
    // console.log('==========');
    // console.log(req);
    // console.log(req.query);
    // console.log('The value is: ' + req.query.topicId);
    // console.log(req.params);
    // console.log(req.params.topicId);
    var topicId = req.query.topicId;
    // console.log(topicId);
    // console.log('==========');
    db.topic.findById(topicId)
        .then(function(topic) {
            topic.getPlaces()
                .then(function(places) {
                    res.render('places/index', {
                        topic: topic,
                        places: places
                    });
                }).catch(function(error) {
                    res.status(404).send(error);
                });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});

// return an HTML form to create a NEW place
// this must be above the show route to process correctly
router.get('/new', isLoggedIn, function(req, res) {
    var topicId = req.query.topicId;
    db.topic.findById(topicId)
        .then(function(topic) {
            res.render('places/new', { topic: topic });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});

// using form data from /new, CREATE a new place
router.post('/', isLoggedIn, function(req, res) {
    var newPlace = req.body;
    db.place.create(newPlace).then(function() {
        res.status(303).redirect('/places');
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

// SHOW a specific place
router.get('/:placeId', isLoggedIn, function(req, res) {
    var placeId = req.params.placeId;
    db.place.findById(placeId)
        .then(function(place) {
            res.render('places/show', { place: place });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});

// return an HTML form to EDIT a place
router.get('/:placeId/edit', isLoggedIn, function(req, res) {
    var placeId = req.params.placeId;
    db.place.findById(placeId)
        .then(function(place) {
            place.getTopic()
                .then(function(topic) {
                    res.render('places/edit', {
                        topic: topic,
                        place: place
                    });
                }).catch(function(error) {
                    res.status(404).send(error);
                });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});


// res.render('places/edit', { place: place });

// using form data from /:placeId/edit, UPDATE a specific place
// findById and Save are used to trigger beforeUpdate hook as an individual update.
// update, even of one row, is a bulk update, so find and save works correctly.
router.put('/:placeId', isLoggedIn, function(req, res) {
    var placeId = req.params.placeId;
    var editedPlace = req.body;
    db.place.findById(placeId)
        .then(function(place) {
            place.name = editedPlace.name;
            place.address = editedPlace.address;
            place.save()
                .then(function() {
                    res.status(303).redirect('/places');
                }).catch(function(error) {
                    res.status(404).send(error);
                });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});

// DELETE a specific place
router.delete('/:placeId', isLoggedIn, function(req, res) {
    var placeId = req.params.placeId;
    db.place.destroy({
        where: {
            id: placeId
        }
    }).then(function() {
        res.status(303).redirect('/places');
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

// Export
module.exports = router;
