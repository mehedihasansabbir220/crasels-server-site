const express = require('express')
const app = express()
const cors = require('cors');
const ObjectIb = require('mongodb').ObjectId
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncqfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("CarSelas");
        const carBrand = database.collection("brand");
        const usersCollection = database.collection("user")
        const productCollection = database.collection("product")
        const orderCollection = database.collection("order")
        const faviroteCarCollection = database.collection("faviroteCar")
        const reviewCarCollection = database.collection("review")
        app.post('/brand', async (req, res) => {
            const brand = req.body;
            const result = await carBrand.insertOne(brand)
            res.send(result)
            console.log(result);
        })
        app.get('/car', async (req, res) => {
            const result = await carBrand.find({}).toArray()
            res.send(result)
        })
        //Create A New User 
        app.post('/users', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });
        //Findn User
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await usersCollection.findOne(query)
            res.send(result)
            // console.log(result);
        })
        //Add A new product
        app.post('/addproduct', async (req, res) => {
            const doc = req.body;
            const result = await productCollection.insertOne(doc)
            res.send(result)
            console.log(result);

        })
        //Find All Car
        app.get('/allcars', async (req, res) => {
            // console.log(req);
            const result = await productCollection.find({}).toArray()
            console.log(result);
            res.send(result)
        })
        //Order Collection
        app.post('/order', async (req, res) => {
            const userOrder = req.body
            const result = await orderCollection.insertOne(userOrder)
            res.send(result)
            console.log('hitting server', result)
        })
        //Find Ordder
        app.get('/myorder/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await orderCollection.find(query).toArray()
            res.send(result)
            // console.log(result);
        })
        //Find All Order
        app.get('/allOrders', async (req, res) => {
            const result = await orderCollection.find({}).toArray()
            res.send(result)
            // console.log(result);
        })
        //Most Favirote Car
        app.post('/mostFavirote', async (req, res) => {
            const query = req.body
            const result = await faviroteCarCollection.insertOne(query)
            res.send(result)
            console.log('hitting the server ', result);
        })
        //New Car
        app.get('/newCar', async (req, res) => {
            const result = await faviroteCarCollection.find({}).toArray()
            res.send(result)
            // console.log(result);
        })
        //review Collection
        app.post('/reviews', async (req, res) => {
            const query = req.body
            const result = await reviewCarCollection.insertOne(query)
            res.send(result)
            // console.log(result);
        })
        //Get All Reviews
        app.get('/allreviews', async (req, res) => {
            const result = await reviewCarCollection.find({}).toArray()
            res.send(result)
            // console.log('thanks for your reviews ', result);
        })
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        //Dlete Order
        app.delete('/myorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id }
            const result = await orderCollection.deleteOne(query)
            res.send(result)
            console.log(result);
        })
        //make a Admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body.email;
            const options = { upsert: true };
            const filter = { email: user }
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            console.log(result);
        })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello Car seles hear !')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})