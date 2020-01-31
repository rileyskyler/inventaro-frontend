const { Schema, model } = require('mongoose');

const locationSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  salesTax: {
    type: Number,
    required: false
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  inventory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Stock'
    }
  ]
});

module.exports = model("Location", locationSchema);