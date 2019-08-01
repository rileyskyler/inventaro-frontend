const { Schema, model } = require('mongoose');

const stockSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }
});

module.exports = model('Stock', stockSchema);