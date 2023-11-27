const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("okokokokokok");
// });

connectDb();
app.listen(5099, () => {
  console.log("Server running on port 5099");
});

app.use("/api/auth", require("./routes/authRoutes"));
