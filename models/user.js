const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    require: true
  },
  imageUrl: {
    type: String,
    default: 'https://storage.googleapis.com/overflow.lockonmaram.com/default.png'
  },
  role: {
    type: String,
    default: 'user'
  },
  password: String,
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User
