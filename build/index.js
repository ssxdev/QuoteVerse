require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
db.once("open", function () {
  console.log("MongoDB Connected successfully");
});

app.post("/api/login", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (!userExist)
      return res
        .status(400)
        .json({ status: "fail", message: "User doesn't exist!" });

    const validPass = await bcrypt.compare(
      req.body.password,
      userExist.password
    );
    if (!validPass)
      return res
        .status(400)
        .json({ status: "fail", message: "Invalid Password" });

    const token = jwt.sign({ _id: userExist._id }, process.env.TOKEN_SECRET);
    res.status(200).json({ status: "success", data: userExist, token: token });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return res
        .status(400)
        .json({ status: "fail", message: "User already exist!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: newUser._id }, process.env.TOKEN_SECRET);
    res.status(200).json({ status: "success", data: newUser, token: token });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

app.get("/api/quote", async (req, res) => {
  try {
    const token = req.header("x-access-token");
    if (!token)
      return res
        .status(401)
        .json({ status: "fail", message: "Access Denied!" });
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const userData = await User.findOne({ _id: verified._id });
    res.json({ status: "success", user: userData });
  } catch (err) {
    res.json({ status: "fail", message: err.message });
  }
});

app.post("/api/quote", async (req, res) => {
  try {
    const token = req.header("x-access-token");
    if (!token)
      return res
        .status(401)
        .json({ status: "fail", message: "Access Denied!" });
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const userData = await User.updateOne(
      { _id: verified._id },
      { $set: { quote: req.body.quote } }
    );
    res.json({ status: "success", user: userData });
  } catch (err) {
    res.json({ status: "fail", message: err.message });
  }
});

app.get("/api/allquote", async (req, res) => {
  try {
    const allUsers = await User.find({ quote: { $exists: true } });
    res.json({ status: "success", data: allUsers });
  } catch (err) {
    res.json({ status: "fail", message: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
