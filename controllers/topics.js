// Requires and global variables
var express = require('express');
// require the authorization middleware
var isLoggedIn = require('../middleware/isLoggedIn');

var db = require('../models');
var router = express.Router();

// Routes

// display an INDEX of all topics
// isLoggedIn middleware is put on any route that requires login to access it
router.get('/', isLoggedIn, function(req, res) {
    db.topic.findAll()
        .then(function(topics) {
            res.render('topics/index', { topics: topics });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});

// return an HTML form to create a NEW topic
// this must be above the show route to process correctly
router.get('/new', isLoggedIn, function(req, res) {
    res.render('topics/new');
});

// using form data from /new, CREATE a new topic
router.post('/', isLoggedIn, function(req, res) {
    var newTopic = req.body;
    db.topic.create(newTopic).then(function(topic) {
        res.status(303).redirect('/topics');
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

// SHOW a specific topic
router.get('/:id', isLoggedIn, function(req, res) {
    var topicId = req.params.id;
    db.topic.findById(topicId)
        .then(function(topic) {
            res.render('topics/show', { topic: topic });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});

// return an HTML form to EDIT a topic
router.get('/:id/edit', isLoggedIn, function(req, res) {
    var topicId = req.params.id;
    db.topic.findById(topicId)
        .then(function(topic) {
            res.render('topics/edit', { topic: topic });
        }).catch(function(error) {
            res.status(404).send(error);
        });
});

// using form data from /:id/edit, UPDATE a specific topic
router.put('/:id', isLoggedIn, function(req, res) {
    var topicId = req.params.id;
    var editedTopic = req.body;
    db.topic.update({
        name: editedTopic.name,
        description: editedTopic.description
    }, {
        where: {
            id: topicId
        }
    }).then(function() {
        res.status(303).redirect('/topics');
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

// DELETE a specific topic
router.delete('/:id', isLoggedIn, function(req, res) {
    var topicId = req.params.id;
    db.topic.destroy({
        where: {
            id: topicId
        }
    }).then(function() {
        res.status(303).redirect('/topics');
    }).catch(function(error) {
        res.status(404).send(error);
    });
});

// Export
module.exports = router;
