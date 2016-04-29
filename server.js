var express = require('express'),
	session = require('express-session'),
	passport = require('passport'),
	FacebookStrategy = require('passport-facebook').Strategy,
	keys = require('./keys'),
	app = express();

app.use(session({secret: 'Super secret, secret'}));
app.use(passport.initialize());
app.use(passport.session());

//Facebook strategy
passport.use(new FacebookStrategy({
		clientID: keys.appId,
		clientSecret: keys.secret,
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	function (accessToken, refreshToken, profile, cb) {
			return cb(null, profile);
	}
));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect: '/login'
	}),
	function (req, res) {
		res.redirect('/me')
	})

passport.serializeUser(function (user, done) {
	//go to mongo get_id for user, put that on session in real app
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	//get data off of sesion.
	done(null, obj);
	//put it on req.user in EVERY ENDPOINT
});

app.get('/me', function (req, res) {
	res.send(req.user);
})


//SET UP PORT//
var port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log('Listening on port ' + port);
})
