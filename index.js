const express = require("express");
const cors = require("cors");
const { MongoClient, Collection, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.az9qi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const run = async () => {
  try {
    const db = client.db("taskDb");

    const productCollection = db.collection("user");
    const cartCollection = db.collection("cart");

    app.get("/product/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!id) {
          res.send("console.error");
        }
        const query = { _id: ObjectId(id) };
        const service = await productCollection.findOne(query);
        res.send(service);
      } catch (e) {
        res.send(e);
      }
    });

    app.post("/products", async (req, res) => {
      const user = req.body;

      const result = await productCollection.insertOne(user);

      res.send(result);
    });

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    app.get("/cart", async (req, res) => {
      const cursor = cartCollection.find({});
      const product = await cursor.toArray();

      res.send(product);
    });

    app.post("/carts", async (req, res) => {
      const product = req.body;

      const result = await cartCollection.insertOne(product);

      res.send(result);
    });
  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
