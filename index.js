const express = require("express");
const db = require("./dataBase/db");
const app = express();
const cors = require("cors");
const prot = process.env.PORT || 5000;

// * Middleware:
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// * Connect With mongoDb:
db.connect();

//* To get clients says collections:
app.get("/client-says", async (req, res) => {
  const clientSaysCollections = db.getClientSaysCollection();
  const result = await clientSaysCollections.find().toArray();
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("doc-house server is running.");
});

app.listen(prot, () => {
  console.log(`doc-house server is running on port: ${prot}`);
});
