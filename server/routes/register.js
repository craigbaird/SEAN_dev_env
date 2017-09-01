var express = require('express');
var router = express.Router();
var passport = require('passport');
var Users = require('../modules/user');
var path = require('path');

// Handles request for HTML file
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../public/views/templates/register.html'));
});

// Handles POST request with new user data
router.post('/', function(req, res, next) {

    var userToSave = {
      username : req.body.username,
      password : req.body.password,
    };

    Users.create(userToSave, function(err, post) {
         if(err) {
           next(err);
         } else {
          res.redirect('/');
         }
    });
});

module.exports = router;
