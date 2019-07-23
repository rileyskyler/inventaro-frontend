const { Schema } = require('mongoose');
const { model } = require('mongoose');

const stockSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  item: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }
});

module.exports = model("Stock", stockSchema);