const Post = require('../models/post');
const User = require('../models/user');


module.exports.home = async function (req, res) {

    try {
    // console.log("homey",res.locals.flash);

    let posts = await Post.find({})
    // sort the result acc to created at time

    // populate the each post user,likes,populate each comment
    // (if not populate id is still there)
    .sort('-createdAt')
    .populate('user')
    .populate('likes')
    .populate({
        path: 'comments',
        options: {
            sort: {
                'createdAt': -1
            }
        },
        populate: { path: 'user' },
        // populate: {
        //     path: 'likes'
        // }
    });

    // console.log(posts[0].comments);

    let users = await User.find({});

    return res.render('home', {
        title: "Socially | Home",
        posts: posts,
        all_users: users
    });

    }catch(err) {
        console.log('Error in  home controller ', err);
    }
    
}

/*module.exports.home = function (req, res) {
    console.log(req.cookies);
    // res.cookie('roll',99);

    // populatev(replace id by actual data) the user for each post
    Post.find({})
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .exec(function (err, posts) {

        User.find({}, function (err, users) {

            return res.render('home', {
                title: "Codeial | Home",
                posts: posts,
                all_users: users
            });
        });
        // locals from res.locals is being passed to render
        
    });
    
}
// functions are called actions
*/