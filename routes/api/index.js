const express = require('express');

const router = express.Router();


// routes for all version of api
router.use('/v1', require('./v1'));


module.exports = router;