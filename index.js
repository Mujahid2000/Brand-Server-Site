const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5050;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mujahid.frqpuda.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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
        // read data
        app.get('/carmodel', async(req, res) =>{
            const cursor = CarsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        // send data to database

    app.post('/carmodel', async(req, res) =>{
        const brandData = req.body;
        console.log(brandData);
        const result = await CarsCollection.insertOne(brandData);
        res.send(result);
    } )



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
} finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
}
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('This is brand server')
})

app.listen(port, () =>{
    console.log(`Brand server running on port: ${port} `);
})