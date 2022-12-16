class Post {
    post_id = ''
    post_content = ''
    user_id = ''
    likes = ''
    like_bucket = []
    api_url = 'https://62d5dfad15ad24cbf2ce5ec2.mockapi.io'

    async create() {
        let session = new Session()
        let session_id = session.getSession()

        let data = {
            user_id: session_id,
            content: this.post_content,
            like_bucket: [session_id],
            likes: 0,
        }

        data = JSON.stringify(data)

        let response = fetch(this.api_url + '/posts', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: data
        });

        data = await response;
        return data.json();
    }

    async get(post_id) {
        let api_url = this.api_url + '/posts/' + post_id
        let response = await fetch(api_url)
        return response.json()
    }

    async get_AllPosts() {
        let response = await fetch(this.api_url + '/posts')
        let data = await response.json()
        return data
    }

    // Working like  /////////////////////////////////////////////////////
    async like(post_id, user_id) {
        let api_url = this.api_url + '/posts/' + post_id;

        // geting the likebucket and comparing it to user id
        let response = await fetch(api_url)
        let data = await response.json()

        let like_bucket = await data.like_bucket
        console.log('like bucket after first fetch = ')          ///////////////////////////

        console.log(like_bucket)

        //if it is included , disliking
        if (like_bucket.includes(user_id.toString())) {
            like_bucket = like_bucket.filter(user => {
                return user !== (user_id.toString())
            })

            console.log('after filter')          ///////////////////////////

            console.log(like_bucket)                   ///////////////////////////

            //and liking if it's not
        } else {
            like_bucket[like_bucket.length] = (user_id.toString())
            console.log('after push')          ///////////////////////////

            console.log(like_bucket)                   ///////////////////////////

        }




        //defining data to send to DB
        data = {
            likes: like_bucket.length - 1,
            like_bucket: like_bucket
        }

        data = JSON.stringify(data)

        /// changing the database nubmer of likes
        let putResp = fetch(api_url, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            },
            body: data
        }).then(putResp => putResp.json())
            .then(data => {
                alert('You just liked/disliked a post!')
            })


        return parseInt(like_bucket.length - 1)

    }
    ////////////////////////////////////////////////////////////////

    delete(id) {

        let api_url = this.api_url + '/posts/' + id;

        let response = fetch(api_url, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                alert('You just deleted your post!')
            })

    }
}