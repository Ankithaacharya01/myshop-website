const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: Array,
  payment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
