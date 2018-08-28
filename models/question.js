const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var questionSchema = new Schema({
  title: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  answers: [{
    type: Schema.Types.ObjectId,
    ref: 'Answer'
  }],
  upvote: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvote: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question
