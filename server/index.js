require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.js");
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const verifyToken = require("./middleware/verifyToken.js");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
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
    res
      .cookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ status: "success", data: userExist, token: token });
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
    res
      .cookie("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ status: "success", data: newUser, token: token });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

app.get("/api/logout", verifyToken, async (req, res) => {
  try {
    res
      .clearCookie("auth-token")
      .send({ status: "success", data: "Logged Out" });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
