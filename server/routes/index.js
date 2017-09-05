var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool');

// Handles login form POST from index.html
router.post('/',
    passport.authenticate('local', {
        // request stays within node/express and is routed as a new request
        successRedirect: '/user',   // goes to routes/user.js
        failureRedirect: '/error'        // goes to get '/' route below
    })
);

// Handle index file separately
// Also catches any other request not explicitly matched elsewhere
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

module.exports = router;
