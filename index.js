const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5gvym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("alluring_perfumes");
      const perfumesCollection = database.collection("perfumes");
      const usersCollection = database.collection("users");
      const ordersCollection = database.collection("orders");
      const reviewsCollection = database.collection("reviews");
      const tab1Collection = database.collection("tab1");
      const tab2Collection = database.collection("tab2");

      // POST API
      app.post("/perfumes", async (req, res) => {
        const perfume = req.body;
        const result = await perfumesCollection.insertOne(perfume);
        res.json(result);
      });

      // GET API
      app.get("/perfumes", async (req, res) => {
        const cursor = perfumesCollection.find({});
        const perfumes = await cursor.toArray();
        res.send(perfumes);
      });

      // GET API by id
      app.get("/perfumes/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const perfume = await perfumesCollection.findOne(query);
        res.json(perfume);
      });

      // POST API
      app.post("/users", async (req, res) => {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.json(result);
      });

      // POST API
      app.post("/orders", async (req, res) => {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.json(result);
      });

      // UPDATE API
      app.put("/users", async (req, res) => {
        const user = req.body;
        const filter = { email: user.email };
        const updateDoc = { $set: { role: "admin" } };
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.json(result);
      });

      // Tab-1 UPDATE API
      app.put("/tab1/:id", async (req, res) => {
        const id = req.params.id;
        const tab1 = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = { $set: tab1 };
        const result = await tab1Collection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.json(result);
      });

      // GET Tab-1 API
      app.get("/tab1", async (req, res) => {
        const cursor = tab1Collection.find({});
        const tab1 = await cursor.toArray();
        res.send(tab1);
      });

      // Tab-2 UPDATE API
      app.put("/tab2/:id", async (req, res) => {
        const id = req.params.id;
        const tab2 = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = { $set: tab2 };
        const result = await tab2Collection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.json(result);
      });

      // GET Tab-2 API
      app.get("/tab2", async (req, res) => {
        const cursor = tab2Collection.find({});
        const tab2 = await cursor.toArray();
        res.send(tab2);
      });

      // GET API(admin role matched)
      app.get("/users/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await usersCollection.findOne(query);
        let isAdmin = false;
        if (user?.role === "admin") {
          isAdmin = true;
        }
        res.json({ admin: isAdmin });
      });

      // GET API by user's email id
      app.get("/orders/:email", async (req, res) => {
        const cursor = ordersCollection.find({ email: req.params.email });
        const orders = await cursor.toArray();
        res.send(orders);
      });

      // GET API
      app.get("/orders", async (req, res) => {
        const cursor = ordersCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
      });

      // UPDATE API(put)
      app.put("/orders/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            status: "Shipped",
          },
        };
        const result = await ordersCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.json(result);
      });

      // POST API
      app.post("/reviews", async (req, res) => {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.json(result);
      });

      // GET API
      app.get("/reviews", async (req, res) => {
        const cursor = reviewsCollection.find({});
        const reviews = await cursor.toArray();
        res.send(reviews);
      });

      // GET API for payment
      app.get("/orders/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const order = await ordersCollection.findOne(query);
        res.json(order);
      });

      // DELETE API
      app.delete("/orders/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await ordersCollection.deleteOne(query);
        res.json(result);
      });

      // DELETE API
      app.delete("/perfumes/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await perfumesCollection.deleteOne(query);
        res.json(result);
      });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Alluring Perfumes Server Is Running!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})