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
//reach out to DB and grab collecion of wells
   const wellNames = await collection.find().toArray()
    //It will try something and if it cant do it it will respond with an error
    response.render('index.ejs', {info: wellNames})
    
})

//grabs the name and quote submitted
app.post('/addWell',(request, response)=>{
//This will grab what is entered into our well name and well construction date forms and send it to our mongoDB
    collection.insertOne({wellName: request.body.wName,
        constructionDate: request.body.constructionDate,
        wellDiameter: request.body.wDiameter,
        wellDepth: request.body.wDepth,
        staticWL: request.body.wSWL,
        wellCorrection: request.body.wCorrection,
        correctedSWL: 0
    })
        .then(result => {
            console.log('One well entry added')
            console.log(request.body)
            // console.log(result)
//This line redericts the user ot the form/landing page after the submit button is hit
            response.redirect('/')
        })
        .catch(error => console.error(error))
})
//Here we are using the http method delete to reach out to our db collection and filtering by well name
app.delete('/deleteWell', (request, response)=>{
    collection.deleteOne({wellName: request.body.wellNameFromJS})
    .then(result =>{
        console.log('Well Deleted')
        response.json('Well Deleted')
    })
    .catch(error => console.error(error))

})
//Here we do our update request
app.put('/calculateWaterLevel', (request, response) => {
    console.log(request.body.wellNameFromJS)
    console.log(request.body.staticSWLFromJS)
    console.log(request.body.correctionFromJS)
    console.log(request.body.correctedSWLFromJS)
    collection.updateOne({wellName: request.body.wellNameFromJS,
        // staticWL: request.body.staticSWLFromJS,
        // wellCorrection: request.body.correctionFromJS, 
        correctedSWL: request.body.correctedSWLFromJS        
    },{
        $set: {
            correctedSWL:request.body.correctedSWLFromJS + 3.1416
          }
    })
    .then(result => {
        console.log('Calcualted cSWL')
        response.json('Calcualted cSWL')
    })
    .catch(error => console.error(error))

})


//this set up a port to listen for the server
//PORT = 8000
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})