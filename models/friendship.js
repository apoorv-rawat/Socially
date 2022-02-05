const mongoose = require('mongoose');


const friendshipSchema = new mongoose.Schema({
    // user who sent this request
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // the user who accepted the request (just for clarity sake)
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});


const Friendship = mongoose.model('Friendship', friendshipSchema);
module.exports = Friendship;