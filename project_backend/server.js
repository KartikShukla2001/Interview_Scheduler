const express = require("express");
require("dotenv").config();
const path = require("path");
const mongoose = require("mongoose");
const colors = require("colors");
const cors = require("cors");
const { ClientEncryption } = require('mongodb-client-encryption');

// Route Files
const main = require("./routes/main");

// DB Connection
const db = require("./config/keys").MongoURI;
// Connect MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected".green.bold))
  .catch((err) => console.log(err));

const app = express();

app.use(cors());
app.use(express.json());

// Routing for API Service
app.use("/api/v1/main", main);
const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server running on port ${PORT}`.yellow.bold));

