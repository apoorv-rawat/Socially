const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codeial_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to DB"));

db.once('open', function () {
    // callback fn
    console.log('Connected to DB :: MongoDB');
});

module.exports = db;