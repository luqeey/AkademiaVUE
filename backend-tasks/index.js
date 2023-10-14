const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connection_string = "mongodb+srv://eliaslukas557:vwarteon522GT@cluster0.pxyppwi.mongodb.net/shoppinglist";
const database_name = "shoppinglist";
let database;

app.listen(5038, () => {
    MongoClient.connect(connection_string, { useUnifiedTopology: true })
        .then((client) => {
            database = client.db(database_name);
            console.log("MongoDB connection successful");
            startApp();
        })
        .catch((error) => {
            console.error("MongoDB connection error:", error);
        });
});

function startApp() {

    app.get('/api/shoppinglist/GetNote', (request, response) => {
        if (database) {
            database.collection('shoppinglistcollection').find({}).toArray()
                .then((result) => {
                    response.send(result);
                })
                .catch((error) => {
                    console.error("MongoDB query error:", error);
                    response.status(500).send("Error retrieving data");
                });
        } else {
            response.status(500).send("Database not initialized");
        }
    });

}

app.post('/api/shoppingapp/add', multer().none(),(request, response) => {
    database.collection('shoppinglistcollection').count({}, function(error,numOfDocs) {
        database.collection('shoppinglistcollection').insertOne({
            id:(numOfDocs+1).toString(),
            description: request.body.newNotes
        })
        response.json('added succesfully')
    })
})

app.delete('/api/shoppingapp/delete', (request, response) => {
    database.collection('shoppinglistcollection').deleteOne({
        id: request.query.id,
    })
    response.json('deleted succesfully')
})




