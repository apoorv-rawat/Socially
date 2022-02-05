const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const express = require('express');

module.exports.profile = function (req, res) {

    User.findById(req.params.id, function (err, user) {

        return res.render('user_profile', {
            title: 'Socially | User Profile',
            profile_user: user
        });
    });

};

module.exports.update = async function (req, res) {
    if(req.user.id == req.params.id) {

        try {
            let user = await User.findById(req.params.id);

            // since multipart
            User.uploadedAvatar(req,res, function(err){
                if(err) {console.log('******Multer error', err);}

                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file) {

                    if(user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    // console.log(req.file);
                    user.avatar = User.avatarPath + '/' + req.file.filename
                    // console.log(user.avatar);
                }

                user.save();
                return res.redirect('back');


            });


        }catch(err) {
            req.flash('error',err);
            return res.redirect('back');
        }

    }else {
        req.flash('error', 'Unauthorised!');
        return res.status(401).send('Unauthorized');        
    }
}

/*
module.exports.update = function (req, res) {
    // check
    if(req.user.id == req.params.id) {
        User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
            return res.redirect('back');
        });

    }else {
        res.status(401).send('Unauthorized');
    }
}*/

module.exports.signUp = function (req, res) {

    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }    

    return res.render('user_sign_up', {
        title: 'Socially | Sign Up'
    });
};

// render signin page
module.exports.signIn = function (req, res) {

    if(req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }    

    return res.render('user_sign_in', {
        title: 'Socially | Sign In'
    });
};


// get the sign up data
module.exports.create = function (req, res) {
    if(req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function (err, user) {
        if(err) {
            console.log('error in finding user in signing up');
            return;
        }

        if(!user) {
            User.create(req.body, function (err, user) {

                if(err){
                    console.log('error in creating user (sign up)');
                    return;
                }

                return res.redirect('/users/sign-in');

            })
        } else {
            return res.redirect('back');
        }

    });
    
}

// sign in and create session for user
module.exports.createSession = function (req, res) {

    // set flash message
    req.flash('success', 'Logged in successfully!');
    return res.redirect('/'); 
}

module.exports.destroySession = function (req, res) {
    
    // courtesy passport.js
    req.logout();

    // set flash message
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
}

// export an action