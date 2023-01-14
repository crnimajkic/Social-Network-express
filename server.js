const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const cors = require('cors')

app.use(express.static(__dirname +'/public'))
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin:["https://hexa-social-network.onrender.com","https://kit.fontawesome.com/a076d05399.js"]
}))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/hexa.html', (req, res) => {
    res.sendFile(__dirname + '/hexa.html')
    console.log(req,res)
})

app.listen(PORT, console.log(`Listening at port ${PORT} and ${__dirname}`))