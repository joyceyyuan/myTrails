//configuration file for passport, 
// this isn't middleware, its just config
// so we won't export anything, we just need to require in the server, 
// just like the database file!
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const User = require('../models/user');
// plug in to Oauth Strategy, and provide VERIFY callback function, 
// this function will be called whenever a user logs in using Oauth
passport.use(
	new GoogleStrategy(
		{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_SECRET,
		callbackURL: process.env.GOOGLE_CALLBACK
		},
		async function(accessToken, refreshToken, profile, cb){ // verify callback that gets invoked every single time someone logs in
			// the use has logged in
			// profile, <- this is the stuff we want, aka the infromation about the user
			// you should probably console.log it 
			console.log(profile, " <- this is the profile from google")
			
			// Step 1, Check if the user exist in the database!
			// if the do, provide that user document to the passport!
			const user = await User.findOne({googleId: profile.id});
			// if User.findOne finds nothing, user will be undefined

			// cb(error, dataThatYouWantToPassToPassport)
			if(user) return cb(null, user);
			// end of step 1 ==========================================

			// So the User doens't exist in the database, 
			// which means we have a new user, so we have to add them to the database!
			try {
				const newUser = await User.create({
					name: profile.displayName,
					googleId: profile.id,
					email: profile.emails[0].value, // <- this give us the email
				})
				// pass the newUser document to passport!
				return cb(null, newUser)

			} catch(err){
				// cb(error, dataThatYouWantToPassToPassport)
				return cb(err)
			}
		}
	)
)


// serializeUser, return the data theat passport is going to add to the session (cookie!) to track the user
// this function is called after the verify callback function ^ the thing above

// user argument is coming from above, cb(null, newUser), cb(null, user)
passport.serializeUser(function(user, cb){
	cb(null, user._id); // <- storing in our session cookie the logged in users id
})

// desererialzieUser method is called every time a request comes in from a logged in user!
// THIS IS WHERE THE PASSPORT ASSIGNS THE USER DOCUMENT TO req.user, so in every single function we have access 
// to req.user which is the logged in users mongoose document!
passport.deserializeUser(function(userId, cb){
	User.findById(userId, function(err, userDocument){
		if(err) return cb(err)
		cb(null, userDocument);  // <- this assigns the userDocument to req.user = userDocument
	})
})