const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
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