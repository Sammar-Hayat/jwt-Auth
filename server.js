const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("okokokokokok");
// });

connectDb();
const port = process.env.PORT || 5008;
app.listen(port, () => {
  console.log(`server running on ${port}`);
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
