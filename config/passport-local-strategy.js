const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user'); 

console.log('Loading Passport_Local_strategy');

// telling passport to use local strategy
// authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
    }, 
    function (req, email, password, done) {
        // identify a user and establish identity
        User.findOne({email: email}, function (err, user) {
            if(err) {
                // console.log('Error in finding user --> Passport');
                req.flash('error', err);
                return done(err);
            }

            if(!user || user.password != password) {
                // console.log('invalid username && password');
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            // user found
            return done(null, user);
        });
    }

));


// serialise the user to decide which key is to be
// kept in cookie and send to browser
passport.serializeUser(function (user, done) {
    done(null, user.id);
})


// deserialising the user from the key in the cookies
// when req comes in from the browser to server 
// get the id out of encrypted cookie to get the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if(err) {
            console.log('error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});

// check if user is authenticated
passport.checkAuthentication = function (req, res, next) {

    // if the user is signed in, then pass on req to next function that is controllers action 
    if(req.isAuthenticated()) {
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function (req, res, next) {
    if(req.isAuthenticated()) {
        // req.user contains the current signed user from the session cookie
        // and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}

// if signed in already 
// passport.setBlockIfSignedIn = function (req, res, next) {
//     if(req.isAuthenticated()) {
//         return res.redirect('/users/profile');
//     }
    
//     next();
// }

module.exports = passport;