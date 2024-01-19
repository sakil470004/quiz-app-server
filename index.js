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
    const DB = await client.db("quiz-app");
    const questionCollection = await DB.collection("questions");
    const userCollection =  await DB.collection("users-data");
    // const taskCollection = client.db("system_2").collection("task");

    // status
    app.get("/question/:language", async (req, res) => {
      const language = req.params.language;
      let query = {};
      if (language) {
        query = { language: language };
      }
      const result = await questionCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/score/", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
  
    app.post("/addScore/", async (req, res) => {
      const status = req.body;
      const query = { email: status.email };
      // console.log(status);
      const currentUser = await userCollection.findOne(query);
      // console.log(currentUser);
    //change user info based on country 
      if (currentUser) {
        const { _id, ...rest } = currentUser;
        const newStatus = { ...rest };
        const language = status.language;
        console.log(language);
        if (currentUser.hasOwnProperty(language)) {
          const oldScore = currentUser[language];
          const totalScore = oldScore + status[language];
          newStatus[language] = totalScore;
        } else {
          newStatus[language] = status[language];
        }
         const updateDoc = { $set: newStatus };
        const options = { upsert: true };
        const result = await userCollection.updateOne(
          query,
          updateDoc,
          options
        );
        res.send(result);
      } else {
        const result = await userCollection.insertOne(status);
        res.send(result);
      }
      // const { _id, ...rest } = status;
      // console.log(id, filter, data)
      // const updateDoc = { $set: rest };
      // const options = { upsert: true };
      // const result = await statusCollection.updateOne(
      //   query,
      //   updateDoc,
      //   options
      // );
      // res.send(result);
      //   }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hi I am Mynul Islam Sakil. Creator Of Quiz App");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
