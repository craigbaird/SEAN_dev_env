var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../modules/user');

// Store this user's unique id in the session for later reference
// Stores info on req.session.passport.user
passport.serializeUser(function(user, done) {
  console.log('serialized: ', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if(err) {
      done(err);
    }

    console.log('-----------------------------------------------\ndeserialized: ', user.id);
    done(null, user);
  });
});

passport.use('local', new localStrategy({
  passReqToCallback: true,
  usernameField: 'username'
  }, function(req, username, password, done) {
    // Mongoose stuff
    User.findOne({username: username}, function(err, user) {
      if(err) {
        throw err;
      }

      if(!user) {
        console.log('userStrategy.js :: no user found');
        return done(null, false, {message: 'Incorrect credentials.'});
      } else {
            user.comparePassword(password, function(err, isMatch) {
              if(err) {
                throw err;
              }

          if(isMatch) {
            console.log('userStrategy.js :: all good');
            return(done(null, user));
          } else {
            console.log('userStrategy.js :: password incorrect');
            done(null, false, {message: 'Incorrect credentials.'});
          }
        });
      } // end else
    }); // end findOne
  } // end callback
));

module.exports = passport;
