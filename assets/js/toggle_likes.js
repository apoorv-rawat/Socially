// create a class to toggle likes when a link is clicked, using AJAX
class ToggleLike{
    constructor(toggleElement) {
        this.toggler = toggleElement;

        // call here itself
        this.ToggleLike();
    }

    ToggleLike() {
        // console.log('this.toggler is',this.toggler, 'adding event to it');
        
        $(this.toggler).click(function (e) {
            e.preventDefault();
            let self = this;
            // console.log('what is this ', this);

            // this is a new way of writing ajax 
            $.ajax({
                type: 'POST',
                url: $(self).attr('href')
            })
            .done(function (data) {
                let likesCount = parseInt($(self).attr('data-likes'));

                if(data.data.deleted == true) {
                    likesCount -= 1;
                    $(self).html(`${likesCount} <i class="far fa-thumbs-up">`);

                }else {
                    likesCount += 1;
                    $(self).html(`${likesCount} <i class="fas fa-thumbs-up">`);

                }

                $(self).attr('data-likes', likesCount);
                // $(self).html(`${likesCount} <i class="far fa-thumbs-up">`);
            })
            .fail(function (errData) {
                console.log('error in completing the request');
            });
        });
    }
    
}

// ajax method to get likes for the user

function getLikes () {
    $.ajax({
        type: 'GET',
        url: '/likes/getlikes'
    })
    .done(function (data) {
        let postsArr = data.data.posts;

        postsArr.forEach(element => {
            
            // console.log("Element is ",element);
            let ele = $(`#post-${element.likeable} .action-div .toggle-like-button`);

            let prevHTML = ele.html();
            // console.log("prevHTML" + prevHTML);
            let arr = prevHTML.split(" ");
            // console.log(arr);
            ele.html(arr[20] + ' <i class="fas fa-thumbs-up">');

        });

        // liked comments by the user
        let commentsArr = data.data.comments;

        commentsArr.forEach(element => {
            
            try {
            let ele = $(`#comment-${element.likeable} .toggle-like-button`);

            let prevHTML = ele.html();
            let arr = prevHTML.split(" ");
            ele.html(arr[20] + ' <i class="fas fa-thumbs-up">');

            } catch (err) {
                console.log("error in togg .js");
            }
        
        });
        
    })
    .fail(function (err) {
        console.log('error in completing ajax request getlikes');
    });
}

getLikes();

