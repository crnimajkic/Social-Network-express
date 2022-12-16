class Comment{
    post_id = ''
    user_id = ''
    content = ''
    api_url = 'https://62d5dfad15ad24cbf2ce5ec2.mockapi.io'

    create(){
        let data = {
            post_id: this.post_id,
            user_id: this.user_id,
            content: this.content
        }

        data = JSON.stringify(data)

        fetch(this.api_url + '/comments',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        })
        .then(response => response.json())
        .then(data => {

        })
    }

    async getComments(id){
        let api_url = this.api_url + '/comments';

        const response = await fetch(api_url)
        data = await response.json()

        let post_comments = []

        let i = 0
        data.forEach(comment => {
            if(comment.post_id == id){
                post_comments[i] = comment
                i++
            }
        });
        console.log(post_comments, `commets after getCommets metode`)
        return post_comments
        
    }
}