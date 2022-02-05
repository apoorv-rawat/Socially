// root of all routes

// uses already loaded instance in app
const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');


console.log('   --index.js main router loaded');

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/likes', require('./likes'));

// for any futher routes, access from here 
// router.use('routername', require('routerfile'));


// router.use('/api', require('./api'));

module.exports = router;