const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


// tell passport to use a new strategy google login
passport.use(new googleStrategy({
        clientID: "1067387636207-vckd11l7fg5dep0kj1mfrvhd41mpovt5.apps.googleusercontent.com",
        clientSecret: "qJjrXq-jcXW-tPvJyHobYsRx",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
    },

    function (accessToken, refreshToken, profile, done) {

        // find a user 
        User.findOne({email: profile.emails[0].value}).exec(function (err, user) {

            if(err) {console.log('error in google-strategy-passport', err); return }
            // console.log(profile);
            console.log("this is the accessToken ", accessToken);

            if(user){
                // set this as req.user
                return done(null, user);
            }else {
                // if not found, create the user and set it as req.user (signed in!)
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    // for every user signing up random password would be generated
                    password: crypto.randomBytes(20).toString('hex')
                }, function (err, user) {
                    if(err) { console.log('Error in creating user'); return}
                    
                    return done(null, user);
                });
            }
        });
        
    }
));

module.exports = passport;