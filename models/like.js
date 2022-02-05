const mongoose = require('mongoose');


const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    // this defines the object id of the liked object - Parent
    likeable: {
        type: mongoose.Schema.ObjectId,
        required: true,
        // dynamic referencing
        refPath: 'onModel'
    },
    // this defines the type of liked object
    onModel: {
        type: String,
        required: true,
        enum: ['Post','Comment']
    }
}, {
    timestamps: true
});


const Like = mongoose.model('Like', likeSchema);
module.exports = Like; 