const { Schema } = require('mongoose');
const { model } = require('mongoose');

const locationSchema = new Schema({
  name: {
    type: String,
    required: true
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