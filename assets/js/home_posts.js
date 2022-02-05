{
    // sends data to controller
    // method to submit the form data for new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();
            
            $.ajax({
                type: 'POST',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data) {
                    newPostForm[0][0].value = "";
            
                    let newPost= newPostDom(data.data.post);
                    $('#posts-list-container > ul').prepend(newPost);

                    let newCommentForm = newPost.find('.new-comment-form');
                    // add event listener for new comment handler
                    newCommentForm.submit(globe.createCommentEventHandler);

                    //  for newly added post apply class for likes event
                    // get togglelikebutton class inside newPost 
                    new ToggleLike($(' .toggle-like-button', newPost));
                    
                    notyGen(data.message, 'success').show();

                    //add event listener for deleting post (X)  -for post created via ajax
                    // console.log('Adding delete button to this element',$(' .delete-post-button', newPost));
                    deletePost($(' .delete-post-button', newPost)); 

                },
                error: function (error) {
                    notyGen(error.statusText, 'error').show();
                    console.log(error.statusText);
                }                 
            });
        });
    }

    // method to create a post in DOM
    let newPostDom = function (post) {
        // to convert html to jquery object

        console.log(post.user);
        let profPic = "";
        if(!post.user.avatar) {
            profPic = '<i style="font-size: 1.5rem;" class="fas fa-user"></i>';
        }else {
            profPic = `<img src="${post.user.avatar}" alt="${post.user.name}" width="40px" height="40px" style="border-radius: 50%;" ></img>`;
        }

        return $(`<li class="help-border" id="post-${post._id}">
                   <p class="post-header">
 
                    <small class="delete-btn">
                        <a class="delete-post-button" href="/posts/destroy/${post._id}">
                            <i class="fas fa-trash"></i>
                        </a>
                    </small>

                    ${profPic}
            
                    <span class="post-username-span">
                        ${post.user.name}
                    </span>
                    
                    <span class="dateva"> ${post.createdAt}</span>
                    
                    <p style="font-size: 1.5rem;">
                        ${post.content}
                    </p>
            
                </p>
                
                <div class="action-div disp-flex align-center">
            
                    <small style="margin-top: 1px;">
                            <a class="toggle-like-button a-fix" data-likes= "${post.likes.length}" 
                                href="/likes/toggle/?id=${post._id}&type=Post">
                                ${post.likes.length} <i class="far fa-thumbs-up"></i>
                            </a>
                    </small>
            
                    <div class="post-comments">
            
                            <form action="/comments/create" class="new-comment-form disp-flex align-center" method="POST">
                                
                                <input type="text" name="content" class="help-border-2" 
                                    placeholder="Add a comment..." required>
                                
                                <input type="hidden" name="post" value="${post._id}">
                                
                                <button class="custom-send-button" type="submit">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                            </form>
                    
                    </div>
            
                </div>
            
                <div class="post-comments-list">
                    <ul id="post-comments-${post._id}">

                    </ul>            
                </div>
            
            </li>
        `);
    };

    // method to delete a post from dom
    let deletePost = function (deleteLink) {

        // $(deleteLink required?)
        deleteLink.click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    // removes the post
                    $(`#post-${data.data.post_id}`).remove();

                    notyGen(data.message, 'success').show();
                },
                error: function (error) {
                    notyGen(error.statusText, 'error').show();
                    console.log(error.responseText);
                }
            });
        });
    };


    // to put event listeners for ajax delete
    let allPostsLinkTags =  $('#posts-list-container a.delete-post-button');
    allPostsLinkTags.each( (index, value) => {
        deletePost($(allPostsLinkTags.get(index)));
    });

    createPost();
}



// Date formatter
function dateOutput(target) {

    // for each element get date
    let temp = new Date(target.innerText);
    let sp = temp.toUTCString().split(" ");
    return `${sp[0]} ${sp[1]} ${sp[2]} ${sp[3]} ${temp.toLocaleTimeString()}`;
}

function putDate(elements) {

    if(NodeList.prototype.isPrototypeOf(elements)) {
        // for arrays
        elements.forEach(element => {
        element.innerText = dateOutput(element)
        });
    }
    
}

// for already present entities
putDate(document.querySelectorAll(".dateva"));