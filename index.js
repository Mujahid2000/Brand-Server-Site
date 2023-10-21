const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5050;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mujahid.frqpuda.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // card Data Collection
        const CarsCollection = client.db('CarDB').collection('NCarCollection')
        const CartCollection = client.db('CarDB').collection('NCartCollection')
        // read data
        app.get('/carmodel/:brand', async (req, res) => {
            const cursor = CarsCollection.find({
                brand: req.params.brand
            });
            const result = await cursor.toArray();
            res.send(result);
        })

        // update

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await CarsCollection.findOne(query);
            res.send(result);
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const query = { _id: new ObjectId(id) }
            const result = await CarsCollection.updateOne(query, {
                $set: data
            });
            res.send(result);
        })
        // send data to database

        app.get('/product/:brand', async (req, res) => {
            const brand = req.params.brand;
            const query = { brand: (brand) }
            const cursor = await CarsCollection.find(query)
            res.send(cursor)
        })

        app.get('/product/get/:id', async (req, res) => {

            const id = req.params.id;
            const cursor = await CarsCollection.findOne({ _id: new ObjectId(id) })
            res.send(cursor)
        })

        app.post('/add-to-cart', async (req, res) => {
            const data = req.body
            const cursor = await CartCollection.insertOne(data)
            res.send(cursor)
        })
        app.get('/my-cart/:userId', async (req, res) => {
            // const data = req.body
            const cursor = await CartCollection.find({
                userId: req.params.userId
            }).toArray();
            const productId= cursor?.map((item)=>{
                return new ObjectId(item.productId)
            })
            const result =await CarsCollection.find({
                _id: {$in: productId}
            }).toArray()
            res.send(result);
        })
        app.delete('/my-cart/:productId/:userId', async (req, res) => {
            const productId = req.params.productId;
            const userId = req.params.userId
            const result = await CartCollection.deleteOne({
                productId: productId,
                userId: userId
            });
            res.send(result);
        })


        app.post('/carmodel', async (req, res) => {
            const brandData = req.body;
          
            const result = await CarsCollection.insertOne(brandData);
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('This is brand server')
})

app.listen(port, () => {
    console.log(`Brand server running on port: ${port} `);
})