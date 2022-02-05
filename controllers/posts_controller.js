const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

// ap
// module.exports.post = function (req, res) {
//     return res.end('<h1>Your post</h1>');
// }


module.exports.create = async function(req, res) {
    
    try {
        let post = await Post.create({
            content: req.body.content,
            // user inserted by passport -- see main index.js setauthuser
            user: req.user._id 
        });

        // refer docs for existing records (not pwds' plz :) )
        // await post.populate('user','name').execPopulate();

        await post
        .populate({
            path: 'user',
            select: 'name avatar'
        }).execPopulate();


        if(req.xhr) {
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post published!"
                
            });
        }
    
        // earlier non ajax version
        req.flash('success', 'Post published!');
        return res.redirect('back');    

    }catch(err) {
        console.log("error occuring");
        req.flash('error', err);
        return res.redirect('back');
    }

}

module.exports.destroy = async function (req, res) {
    let post = await Post.findById(req.params.id);
    
    try {
        if(post.user == req.user.id) {
            
            await post.remove();

            // remove associated likes - on the post
            await Like.deleteMany({likeable: req.params.id, onModel: 'Post'});

            // remove associated likes - on the comments of this post
            await Like.deleteMany({_id: {$in: post.comments}});

            // remove associated comments
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "post deleted"
                });
            }
            
            req.flash('success', 'Post and associated comments deleted');
            return res.redirect('back');
            
        }else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err) {
        console.log('Error', err);
        return;
    }
   
}

/*
module.exports.create = function (req, res) {
    
    Post.create({
        content: req.body.content,
        // user inserted by passport -- see main index.js setauthuser
        user: req.user._id 
    }, function (err, post) {
        if(err) {
            console.log('error in creating post');
            return;
        }

        return res.redirect('back');
    });

}*/

/*
module.exports.destroy = function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        // .id means converting the object id to string
        if(post.user == req.user.id) {
            post.remove();

            // remove associated comments
            Comment.deleteMany({post: req.params.id}, function (err) {
                return res.redirect('back');
            });

        }else {
            return res.redirect('back');
        }
    });
}
*/