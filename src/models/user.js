const { Schema } = require('mongoose');
const { model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  locations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Location'
    }
  ]
});

module.exports = model("User", userSchema);