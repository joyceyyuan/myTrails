const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

// configuring Passport!
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
					avatar: profile.photos[0].value //< - the hosted image string/link
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
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {

  // Find your User, using your model, and then call done(err, whateverYourUserIsCalled)
  // When you call this done function passport assigns the user document to req.user, which will 
  // be availible in every Single controller function, so you always know the logged in user
  User.findById(id, function (err, userDoc) { // search our databases for the user, with the id from the session
    done(err, userDoc); // when we call done here pass in the studentDoc,  This is where req.user = studentDoc
    });
});



