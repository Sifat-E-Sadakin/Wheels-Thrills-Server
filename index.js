const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
require('dotenv').config()

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rohhp7w.mongodb.net/?retryWrites=true&w=majority`;

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

    let ToyDB = client.db('ToyDB').collection('toys');

    app.post('/addToy', async(req, res)=>{
        let toy = req.body;
        let result = await ToyDB.insertOne(toy);
        res.send(result)
    })
    
    app.get('/toys', async(req, res)=>{
        
      let query = req.query.tName;
      let find =  ToyDB.find({ tName : query})
      let result = await ToyDB.find().limit(20).toArray()
       
        res.send(result)
    })

    app.get('/toys/find', async(req, res)=>{
      let item= req.query.tName;
      let query = {tName : item}
      let result = await ToyDB.find(query).toArray();
      res.send(result)
    })

    app.get('/toys/:id', async (req, res)=>{
      let id = req.params.id;
      let query = { _id : new ObjectId(id)};
      let result = await ToyDB.findOne(query);
      res.send(result);
    })

    app.get('/email', async(req, res)=>{
      let mail = req.query.email
      let query = {sEmail : mail }
      let result = await ToyDB.find(query).toArray();
      res.send(result)
    })

    app.put('/update/:id', async (req, res)=>{
      let id = req.params.id
      let info = req.body;
      let filter = { _id : new ObjectId(id)}
      const options = { upsert: true };
      let updateInfo = {
        $set: {
          price: info.price,
          quantity: info.quantity,
          description: info.description,
        }
      }
      let result = await ToyDB.updateOne(filter,updateInfo, options);
      res.send(result)
     
      
    })

    app.delete('/remove/:id', async (req, res)=>{
      let id = req.params.id
      let query = { _id : new ObjectId(id)}
      let result = await ToyDB.deleteOne(query);
      res.send(result)
      
    })

    app.get('/asort', async (req, res)=>{
      let mail = req.query.email;
      // console.log(mail);
      let query = {sEmail : mail};
      let sort = {price : 1};
      let result = await ToyDB.find(query).sort(sort).toArray();
      res.send(result)
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
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
  res.send('Hi toy')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})