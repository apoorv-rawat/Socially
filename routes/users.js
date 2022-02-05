const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
// console.log(usersController);

console.log('   --users.js router loaded');

router.get('/profile/:id',passport.checkAuthentication , usersController.profile);
router.post('/update/:id',passport.checkAuthentication , usersController.update);

router.get('/sign-in', usersController.signIn);
router.get('/sign-up', usersController.signUp);

// if already signed in my method
// router.get('/sign-in', passport.setBlockIfSignedIn, usersController.signIn);
router.post('/create', usersController.create);

// use passport as a mware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'} 
) , usersController.createSession);

router.get('/sign-out', usersController.destroySession);


// oauth
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), usersController.createSession);


module.exports = router;