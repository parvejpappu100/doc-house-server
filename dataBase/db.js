require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdnsrak.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  await client.connect();
}

// * COLLECTIONS:-
function getClientSaysCollection() {
  return client.db("doc-house").collection("client-says");
}

function usersCollection() {
  return client.db("doc-house").collection("usersCollection");
}

module.exports = {
  connect,
  getClientSaysCollection,
  usersCollection
};
