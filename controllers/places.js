// Requires and global variables
var express = require('express');
// require the authorization middleware
var isLoggedIn = require('../middleware/isLoggedIn');

var db = require('../models');
var router = express.Router();

// Routes

// display an INDEX of all places
// isLoggedIn middleware is put on any route that requires login to access it
router.get('/', isLoggedIn, function(req, res) {
    var topicId = req.query.topicId;
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
        res.status(303).redirect('/places?topicId=' + newPlace.topicId);
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

// SHOW a specific place
router.get('/:id', isLoggedIn, function(req, res) {
    var placeId = req.params.id;
    db.place.findById(placeId)
        .then(function(place) {
            place.getTopic()
                .then(function(topic) {
                    res.render('places/show', {
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

// return an HTML form to EDIT a place
router.get('/:id/edit', isLoggedIn, function(req, res) {
    var placeId = req.params.id;
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

// using form data from /:id/edit, UPDATE a specific place
// findById and Save are used to trigger beforeUpdate hook as an individual update.
// update, even of one row, is a bulk update, so find and save works correctly.
router.put('/:id', isLoggedIn, function(req, res) {
    var placeId = req.params.id;
    var editedPlace = req.body;
    db.place.findById(placeId)
        .then(function(place) {
            place.name = editedPlace.name;
            place.address = editedPlace.address;
            place.save()
                .then(function() {
                    res.status(303).redirect('/places?topicId=' + editedPlace.topicId);
                }).catch(function(error) {
                    res.status(404).send(error);
                });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});

// DELETE a specific place
router.delete('/:id', isLoggedIn, function(req, res) {
    var placeId = req.params.id;
    db.place.findById(placeId)
        .then(function(place) {
            var topicId = place.topicId;
            place.destroy({
                where: {
                    id: placeId
                }
            }).then(function() {
                res.status(303).redirect('/places?topicId=' + topicId);
            }).catch(function(error) {
                res.status(404).send(error);
            });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});

// Export
module.exports = router;
