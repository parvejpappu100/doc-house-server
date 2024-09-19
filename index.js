const express = require("express");
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

app.get("/", (req, res) => {
  res.send("doc-house server is running.");
});

app.listen(prot, () => {
  console.log(`doc-house server is running on port: ${prot}`);
});
