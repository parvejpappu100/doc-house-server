const express = require("express");
const db = require("./dataBase/db");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const { ObjectId } = require("mongodb");
const prot = process.env.PORT || 5000;

// * Middleware:
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

// * Connect With mongoDb:
db.connect();

// * secure related:
app.post("/jwt", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.send({ token });
});

// * Verify admin:
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const usersCollection = db.usersCollection();
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  if (user?.role !== "admin") {
    return res.status(403).send({ error: true, message: "forbidden message" });
  }
  next();
};

// * To save users on db:
app.post("/users", async (req, res) => {
  const user = req.body;

  const query = { email: user.email };
  const usersCollection = db.usersCollection();
  const existingUser = await usersCollection.findOne(query);
  if (existingUser) {
    return res.send({ message: "User already exist" });
  }

  const result = await usersCollection.insertOne(user);
  res.send(result);
});

// * To get all users:
app.get("/allUsers", async (req, res) => {
  const usersCollection = db.usersCollection();
  const result = await usersCollection.find().toArray();
  res.send(result);
});

// * To make user to ADMIN:
app.put("/users/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updatedRole = req.body;
  const setNewRole = {
    $set: {
      role: updatedRole.role,
    },
  };
  const usersCollection = db.usersCollection();
  const result = await usersCollection.updateOne(filter, setNewRole, options);
  res.send(result);
});

// * CHECK ADMIN OR  NOT:
app.get("/users/admin/:email",verifyJWT, verifyAdmin, async (req, res) => {
  const email = req.params.email;
  const usersCollection = db.usersCollection();
  console.log(email);

  if (req.decoded.email !== email) {
    return res.send({ admin: false });
  }
  const query = { email: email };
  const user = await usersCollection.findOne(query);
  const result = { admin: user?.role === "admin" };
  res.send(result);
});

// * To delete User:
app.delete("/users/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const usersCollection = db.usersCollection();
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});

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
