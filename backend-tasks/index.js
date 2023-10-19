const express = require('express');
const { MongoClient, ObjectID } = require('mongodb'); // Import ObjectID from mongodb
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
    MongoClient.connect(connection_string)
        .then((client) => {
            database = client.db(database_name);
            console.log("MongoDB connection successful");
        })
        .catch((error) => {
            console.error("MongoDB connection error:", error);
        });

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

    app.post('/api/shoppingapp/add', (request, response) => {
        if (database) {
            const newItem = request.body; // Assuming you're sending the new item in the request body
            database.collection('shoppinglistcollection').insertOne(newItem)
                .then(() => {
                    response.json('Item added successfully');
                })
                .catch((error) => {
                    console.error("MongoDB query error:", error);
                    response.status(500).send("Error adding item");
                });
        } else {
            response.status(500).send("Database not initialized");
        }
    });

    app.delete('/api/shoppingapp/delete', (request, response) => {
        if (database) {
            const itemId = request.query.id;
            database.collection('shoppinglistcollection').deleteOne({ _id: ObjectID(itemId) })
                .then(() => {
                    response.json('Item deleted successfully');
                })
                .catch((error) => {
                    console.error("MongoDB query error:", error);
                    response.status(500).send("Error deleting item");
                });
        } else {
            response.status(500).send("Database not initialized");
        }
    });
});
