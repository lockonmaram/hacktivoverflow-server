const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var answerSchema = new Schema({
  content: {
    type: String,
    require: true
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  question: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    require: true
  },
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

var Question = mongoose.model('Answer', answerSchema);

module.exports = Question
