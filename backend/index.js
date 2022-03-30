import mongodb from "mongodb";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";

dotenv.config();

const MongoClient = mongodb.MongoClient;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/restaurants", restaurants);
app.use("*", (req, res) => res.status(404).json({ error: "notfound" }));

const port = process.env.PORT || 8000;
MongoClient.connect(process.env.RESTREVIEW_DB_URI, {
  maxPoolSize: 20,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
})
  .then(
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    })
  )
  .catch((err) => {
    console.error(err.stack);
  });
