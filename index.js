const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const usersRoute = require("./route/users");
const authRoute = require("./route/auth");
const postsRoute = require("./route/posts");
const uploadRoute = require("./route/upload");
const conversationsRoute = require("./route/conversations");
const messagesRoute = require("./route/messages");

dotenv.config();

mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connect to mongoDB");
  }
);

const app = express();

app.use("/public", express.static(__dirname + "\\public"));

app.use(express.json());
app.use(helmet());
// app.use(compression());
app.use(morgan("common"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/conversations", conversationsRoute);
app.use("/api/messages", messagesRoute);

app.listen(process.env.PORT || 8800, () => {
  console.log("Backend is running!");
});
