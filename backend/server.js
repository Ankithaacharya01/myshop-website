const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const User = require("./User");
const Product = require("./product");

const app = express();   // ✅ CREATE app FIRST

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- SERVE FRONTEND ---------- */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ---------- DATABASE ---------- */
mongoose.connect("mongodb://127.0.0.1:27017/myshop")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

/* ---------- REGISTER ---------- */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = new User({ name, email, password });
  await user.save();

  res.json({ message: "Registered successfully" });
});

/* ---------- LOGIN ---------- */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  res.json({
    name: user.name,
    email: user.email
  });
});

/* ---------- PRODUCTS ---------- */
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/* ---------- START SERVER ---------- */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
