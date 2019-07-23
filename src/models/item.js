const { Schema } = require('mongoose');
const { model } = require('mongoose');

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number
  }
});

module.exports = model("Item", itemSchema);