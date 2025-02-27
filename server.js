const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()


let db,
    dbConnecitonString = process.env.DB_STRING,
    dbName = 'Template-Demo',
    collection 
//this connects us to our database
MongoClient.connect(dbConnecitonString)
    .then(client => {
        console.log('Connected to Database')
        db = client.db(dbName)
        collection = db.collection('template-collection')
    })

//middleware will go before any of the HTTP methods

app.set('view engine', 'ejs')
//this lets express know to look into the public folder to serve up client side CSS/JS
app.use(express.static('public'))
//helps us parse/handle urls that are going to be passed around
app.use(express.urlencoded({extended:true}))
//this allows express to parse json and read it.
app.use(express.json())
//It allows for us to bipass cors errors
app.use(cors())


app.get('/', async (request, response)=>{
    //It will try something and if it cant do it it will respond with an error
    try {
        response.render('index.ejs')
    } catch (error) {
        response.status(500).send({message: error.message})
    }
})

//grabs the name and quote submitted
app.post('/quotes',(req, res)=>{
    console.log('Hello worldhopper take this form entry. It will go into your mongoDB')
    console.log(req.body)
//This will grab what is entered into our name and quote forms and send it to our mongoDB
    quotesCollection
        .insertOne(req.body)
        .then(result => {
            // console.log(result)
//This line redericts the user ot the form/landing page after the submit button is hit
            res.redirect('/')
        })
        .catch(error => console.error(error))
})

//this set up a port to listen for the server
//PORT = 8000
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})