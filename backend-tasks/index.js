const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const index = express()
const port = 3000 

index.use(bodyParser.json())

const tasks = [
    { id: 1, task: 'Task 1', description: 'Description 1' },
    { id: 2, task: 'Task 2', description: 'Description 2' },
]

index.use(cors())
index.get('/tasks', (req, res) => {
    res.json(tasks)
})

index.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})