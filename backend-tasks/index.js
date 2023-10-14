const express = require('express')
const { MongoClient } = require('mongodb')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')

const connection_string = "mongodb://localhost:27017/shoppinglist"

const index = express()
// const port = 3000 

index.use(bodyParser.json())

const database_name = "shoppinglist"
var database;

index.listen(5038, () => {
    MongoClient.connect(connection_string, (error, client) => {
        database = client.db(database_name)
        console.log("mongo db connection succesful ")
    })
})

index.get('/api/shoppinglist/GetNote', (request, response) => {
    database.collection('shoppinglistcollection').find({}).toArray((error, result) => {
        response.send(result)
    })
})


// const tasks = [
//     { id: 1, task: 'Task 1', description: 'Description 1' },
//     { id: 2, task: 'Task 2', description: 'Description 2' },
// ]

// index.use(cors())
// index.get('/tasks', (req, res) => {
//     res.json(tasks)
// })

// index.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// })