const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
const app = express();

// Use cors middleware to enable CORS
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request body
// for environment variable
require("dotenv").config();

const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.bpciahf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    console.log("mongo Connected Successfully");
    const DB= client.db("quiz-app");
    const englishQuestionCollection = DB.collection("engilsh-question");
    // const taskCollection = client.db("system_2").collection("task");


    // status
    app.get("/status/:email", async (req, res) => {
      const email = req.params.email;
      let query = { email };
      const result = await statusCollection.findOne(query);
      res.send(result);
    });
    // tasks
    app.get("/task/:email", async (req, res) => {
      const email = req.params.email;
      let query = { email };
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });

    // update status

    app.post("/status", async (req, res) => {
      const email = req.body.email;
      const status = req.body;
      const query = { email: email };
      const { _id, ...rest } = status;
      // console.log(id, filter, data)
      const updateDoc = { $set: rest };
      const options = { upsert: true };
      const result = await statusCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
      //   }
    });
    //todo this is temporary sakil bro please change it update task
    app.post("/task", async (req, res) => {
      const email = req.body.email;
      const task = req.body;
      const query = { email: email };
      const { _id, ...rest } = task;
      // console.log(id, filter, data)
      const updateDoc = { $set: rest };
      const options = { upsert: true };
      const result = await statusCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(result);
      //   }
    });
    // app.post("/status", async (req, res) => {
    //   const status = req.body;
    //   // console.log(user)
    //   //   const query = { email: user.email };
    //   //   const currentUser = await usersCollection.findOne(query);
    //   //   //    console.log(currentUser)
    //   //   if (currentUser) {
    //   //     res.send({});
    //   //   } else {
    //   const result = await statusCollection.insertOne(status);
    //   res.send(result);
    //   //   }
    // });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hi I am Mynul Islam Sakil. Creator Of System App");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
