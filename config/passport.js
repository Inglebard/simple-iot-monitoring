var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const global_data = require('./data.js');

module.exports.init = function(app)
{

	passport.use(new Strategy({passReqToCallback: true},
  function(req, username, password, cb) {   
    if (global_data.USER_NAME != username) {
			return cb(null, false, { message: 'Incorrect username or password.' });
		}
		bcrypt.compare(password, global_data.USER_PASSWORD, function(err, res) {
			if(res) {
	       return cb(null, global_data.USER_NAME);
			} else {
			 return cb(null, false, { message: 'Incorrect username or password.' });
			}
		});
  }));


	// Configure Passport authenticated session persistence.
	//
	// In order to restore authentication state across HTTP requests, Passport needs
	// to serialize users into and deserialize users out of the session.  The
	// typical implementation of this is as simple as supplying the user ID when
	// serializing, and querying the user record by ID from the database when
	// deserializing.
	passport.serializeUser(function(user, cb) {
	  cb(null, user);
	});

	passport.deserializeUser(function(user, cb) {
	  cb(null, user);
	});



	app.use(passport.initialize());
	app.use(passport.session());
	app.use(function(req, res, next) {
    res.locals.user = req.user || null;
		next();
	});
}
