{

    // sending data to controller via AJAX - for posting comments
    function formSubmitHandler(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/comments/create',
            data: $(this).serialize(),
            success: function (data) {

                // flushing comment input box
                e.target[0].value = "";
                
                let newComment = newCommentDom(data.data.comment);
                let postId = data.data.comment.post;
                $(`#post-comments-${postId}`).prepend(newComment);

                //  for newly added post apply class for likes event
                // get togglelikebutton class inside newPost 
                new ToggleLike($(' .toggle-like-button', newComment));

                notyGen(data.message, 'success').show();

                // add event listener - to this newly created comment X
                deleteComment($(' a', newComment));
                
            },
            error: function (error) {
                notyGen(error.statusText, 'error').show();
                console.log(error.statusText);
            }
        });
    }

    // Attaching event listeners for new comment form submit
    let createComment = function () {
        // get all forms which create new comment
        let newCommentsForms = $('.post-comments .new-comment-form');
        
        // bulk apply of listeners on all elements
        // https://api.jquery.com/on/#:~:text=The%20.on()%20method%20attaches%20event%20handlers%20to%20the%20currently%20selected%20set%20of%20elements%20in%20the%20jQuery%20object.
        newCommentsForms.submit(formSubmitHandler);
    };
    
    // applying event listeners to all new comments forms
    createComment();

    // method to create a comment in DOM 
    let newCommentDom = function (comment) {

        let formattedTime = new Date(comment.createdAt).toLocaleDateString('en-GB');

        return $(`
        <li class="comment-li" id="comment-${comment._id}">

                <small class="comment-dt">
                    ${formattedTime}
                </small>
            
                <div class="comment-header disp-flex align-center">

                    <span class="comment-username">
                        ${comment.user.name}
                    </span>
        
                    <small class="del-comment-container">
                        <a class="delete-comment-button a-fix" href="/comments/destroy/${comment.id}">
                            <i class="fas fa-trash"></i>
                        </a>
                    </small>    
                    
                </div>
            
                <span class="comment-content-span">
                    ${comment.content}
                </span>

                <!-- data attribute -->
                <!-- display the likes of this comment -->
                <small>
                        <a class="toggle-like-button a-fix" data-likes="${comment.likes.length}" 
                            href="/likes/toggle/?id=${comment._id}&type=Comment">
                            ${comment.likes.length} <i class="far fa-thumbs-up"></i>
                        </a>
                </small>

        </li>`);

        return $(
            `<li id="comment-${comment._id}">
                <p>
            
                        <small>
                            <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                        </small>
                        
                    <b>${comment.content}</b>
                    <br>
                    <small>
                        by - ${comment.user.name}
                    </small>

                    <small>
                        <a class="toggle-like-button" data-likes="0" 
                        href="/likes/toggle/?id=${comment._id}&type=Comment">
                            0 Likes
                        </a>
                    </small>

                </p>
            </li>`);
    };

    // method to delete a post from dom
    let deleteComment = function (deleteLink) {

        // $(deleteLink required?)
        deleteLink.click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    // removes the comment
                    $(`#comment-${data.data.comment_id}`).remove();

                    notyGen(data.message, 'success').show();
                },
                error: function (error) {
                    notyGen(error.statusText, 'error').show();
                    console.log(error.responseText);
                }
            });
        });
    };

    // to put event listeners for ajax delete comment
    let allCommentsLinkTags =  $('#posts-list-container .post-comments-list a.delete-comment-button');
    
    allCommentsLinkTags.each( (index, value) => {
        deleteComment($(allCommentsLinkTags.get(index)));
    });


    // scope create Comments scope to global
    // since when we add new comment we need to attach event listener
    // for comment as well
    var globe = {};
    globe.createCommentEventHandler = formSubmitHandler;
}

// noty generator - config
let notyGen = function (text, type) {
    return new Noty({
        theme: 'relax',
        text: text,
        type: type,
        layout: 'topRight',
        timeout: 1500
    });
}