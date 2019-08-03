const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  upc: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

module.exports = model("Item", itemSchema);