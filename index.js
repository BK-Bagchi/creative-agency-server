require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g0cgl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const ObjectId = require('mongodb').ObjectId

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


client.connect(err => {
    const services = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_ONE}`);
    const feedback = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_TWO}`);
    const admin = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_THREE}`);
    const orderService = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_FOUR}`)
    const userReview = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_TABLE_FIVE}`)
    console.log("Database is connected");

    app.get('/', (req, res) => res.send("<h1>Creative Agency</h1>"))

    app.get('/services', (req, res) => {
        services.find({}).toArray((err, result) => res.send(result))
    })

    app.get('/feedback', (req, res) => {
        feedback.find({}).toArray((err, result) => res.send(result))
    })

    app.get('/admin', (req, res) => {
        admin.find({}).toArray((err, result) => res.send(result))
    })

    app.post('/makeAdmin', (req, res) => {
        admin.insertOne(req.body)
            .then(result => res.send(result))
    })

    app.post('/addServices', (req, res) => {
        services.insertOne(req.body)
            .then(result => res.send(result))
    })

    app.post('/orderService', (req, res) => {
        orderService.insertOne(req.body)
            .then(result => res.send(result))
    })

    app.get('/showOrderedService', (req, res) => {
        orderService.find({}).toArray((err, result) => res.send(result))
    })

    app.post('/showOrderedService', (req, res) => {
        orderService.find(req.body).toArray((err, result) => res.send(result))
    })

    app.post('/userReview', (req, res) => {
        userReview.insertOne(req.body)
            .then(result => res.send(result))
    })

    app.patch('/changeStatus', (req, res) => {
        const { _id, status } = req.body

        orderService.updateOne(
            { _id: ObjectId(_id) },
            { $set: { status: status } }
        )
            .then(result => res.send(result))
    })
});



app.listen(process.env.PORT || 4000, () => {
    console.log("Server is running")
})