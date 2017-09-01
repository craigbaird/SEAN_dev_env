var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

router.get('/', function(req, res) {
  console.log('get /user route');
  if(req.isAuthenticated()) {
    console.log('logged in');
    var userInfo = {
      username : req.user.username,
    };
    res.send(userInfo);
  } else {
    console.log('not logged in');
    res.send(false);
  }
});

router.get('/logout', function(req, res) {
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

module.exports = router;
