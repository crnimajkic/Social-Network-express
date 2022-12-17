// checking are you loged in and filing informations 


let thisSession = new Session()
sessionCookies = thisSession.getSession()

if (sessionCookies !== '') {


    async function populateUserData() {
        let user = new User()
        data = await user.get(sessionCookies)

        // fillig the user profile informations
        document.querySelector('#profile_username').innerText = data['username']
        document.querySelector('#profile_email').innerText = data['email']

        // filling the edit form 
        document.querySelector('#edit_username').value = data['username']
        document.querySelector('#edit_email').value = data['email']


    }

    populateUserData()

} else {
    window.location.href = '/'
}

// adding logout function

document.querySelector('#logout').addEventListener('click', e => {
    e.preventDefault()

    thisSession.destroySession()

    window.location.href = '/'

})

// edit acount modal opener/closer
document.querySelector('#editAccount').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'block'
})

document.querySelector('#closeModal').addEventListener('click', () => {
    document.querySelector('.custom-modal').style.display = 'none'
})

//editing the profiile, writing information to server
document.querySelector('#editForm').addEventListener('submit', e => {
    e.preventDefault()

    let user = new User()
    user.username = document.querySelector('#edit_username').value
    user.email = document.querySelector('#edit_email').value
    user.edit()

})


// deleting porfile,from server 
document.querySelector('#deleteProfile').addEventListener('click', (e) => {
    e.preventDefault()

    let text = 'You are deleting a profile?'
    //pop up confirmation and calling the delete
    if (confirm(text) === true) {
        let user = new User();
        user.delete()
    }
})



document.querySelector('#postForm').addEventListener('submit', e => {
    e.preventDefault()

    async function createPost() {

        let content = document.querySelector('#postContent').value
        if(content==""){
            return
        }else{
            document.querySelector('#postContent').value = ''

            let post = new Post
    
            post.post_content = content
            // create puts it in database and return whole post object, but variable post is no more class Post
            post = await post.create()
    
            let curentUser = new User
            curentUser = await curentUser.get(sessionCookies)
    
    
    
            let html = document.querySelector('#allPostsWrapper').innerHTML
    
    
            // checking if current user has posted post if it is, adding the remove button
            let delete_post_html = ``
    
            if (sessionCookies === post.user_id) {
                delete_post_html = `<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>`
            }
    
    
            //filling everything in postsWraper
    
            document.querySelector('#allPostsWrapper').innerHTML = `<div class = "single-post" data-post_id="${post.id}">
                                                                         <div class="single-post-content">${post.content}</div>
                                                                        
                                                                         <div class ="post-actions">
                                                                         <p><b>Author:</b>${curentUser.username}</p>
                                                                            <div>
                                                                            <button onclick="likePost(this)" class ="likePostJS like-btn"><span>${post.likes}</span>Likes</button>
                                                                            <button class = "comment-btn" onclick="commentPost(this)">Comments</button>
                                                                            ${delete_post_html}
                                                                            </div>
                                                                         </div>
                                                                         <div class="post-comments">
                                                                            <form>
                                                                                <input placeholder="Write comment" type="text">
                                                                                <button onclick="commentPostSubmit(event)">Comment</button>
                                                                            </form>
                                                                         </div>
                                                                    </div>`+ html
    
    
        }
        

    }

    createPost()
})


// GETTING ALL POSTS AND COMMENTS

async function getAllPosts() {
    let all_posts = new Post()
    all_posts = await all_posts.get_AllPosts()

    all_posts.forEach(post => {
        async function getPostUser() {

            let user = new User()
            let user_that_posted = await user.get(post.user_id)
            
            let comments = new Comment();

            post_comments = await comments.getComments(post.id)

            let comment_html = ''

            if (post_comments.length > 0) {
                post_comments.forEach(comment => {
                    comment_html += `<div class="single-comment"><span class="comment_username"><i class="fas fa-comment-dots"></i> ${comment.username}</span> : ${comment["content"]}</div>`
                })
            }

            let html = document.querySelector('#allPostsWrapper').innerHTML

            let delete_post_html = ``

            if (sessionCookies === post.user_id) {
                delete_post_html = `<button class="remove-btn" onclick="removeMyPost(this)">Remove</button>`
            }


            document.querySelector('#allPostsWrapper').innerHTML = `<div class = "single-post" data-post_id="${post.id}">
                                                                     <div class="single-post-content">${post.content}</div>
                                                                    
                                                                     <div class ="post-actions">
                                                                     <p><b>Author:</b>${user_that_posted.username}</p>
                                                                        <div>
                                                                        <button onclick="likePost(this)" class ="likePostJS like-btn"><span>${post.likes}</span> Likes</button>
                                                                        <button class = "comment-btn" onclick="commentPost(this)">Comments</button>
                                                                        ${delete_post_html}
                                                                        </div>
                                                                     </div>
                                                                     <div class="post-comments">
                                                                        <form>
                                                                            <input placeholder="Write comment" type="text">
                                                                            <button onclick="commentPostSubmit(event)">Comment</button>
                                                                        </form>
                                                                        <div class="all-coments">
                                                                        <span class = "comments-label">Comments:</span>
                                                                        ${comment_html}
                                                                        </div>
                                                                     </div>
                                                                </div>`+ html
        }
        getPostUser()

    });
}

getAllPosts()

//function for posting comment
const commentPostSubmit = event => {
    event.preventDefault()

    let btn = event.target;

    let main_post_el = btn.closest('.single-post')
    let post_id = main_post_el.getAttribute('data-post_id')
    let comment_value = main_post_el.querySelector('input').value
    if (comment_value == '') {
        return
    } else {
        // so you can comment only once per pagerefresh
        btn.setAttribute('disabled', 'true')

        let comment = new Comment()
        comment.content = comment_value
        comment.user_id = sessionCookies
        comment.post_id = post_id
        comment.username = document.querySelector('#profile_username').innerText

        
        main_post_el.querySelector('.post-comments').innerHTML += `<div class="single-comment"><span class="comment_username"><i class="fas fa-comment-dots"></i> ${comment.username}</span> : ${comment_value}</div>`

        comment.create()
    }


}
// function for removing posts
const removeMyPost = btn => {

    let post_id = btn.closest('.single-post').getAttribute('data-post_id');

    btn.closest('.single-post').remove()

    post = new Post()

    post.delete(post_id)


}
///////liking post   /////////////
async function likePost(btn) {

    let main_post_el = btn.closest('.single-post')
    let post_id = main_post_el.getAttribute('data-post_id')

    let post = new Post()
    let postData = await post.get(post_id)


    if (postData.user_id == sessionCookies) {

        btn.setAttribute('disabled', 'true')

    } else {
        let likePost = new Post()
        let numberOfLikesInDB = await likePost.like(post_id,sessionCookies)

        //changing the document view
        btn.querySelector('span').innerHTML = parseInt(numberOfLikesInDB)
        btn.classList.toggle('liked')

    }

}
//////////////////////////////////////////////////////////////////////

//opening post comments
const commentPost = btn => {
    let main_post_el = btn.closest('.single-post')
    let post_id = main_post_el.getAttribute('data-post_id')

    if (main_post_el.querySelector('.post-comments').style.display == 'none') {
        main_post_el.querySelector('.post-comments').style.display = 'block'
    } else {
        main_post_el.querySelector('.post-comments').style.display = 'none'
    };
}






/// TO DOO 

/// 1 . IF REGISTRATION EMAIL OR USERNAME IS SAME AS ANY OF THE USERS IN DATA BASE, PREVENT