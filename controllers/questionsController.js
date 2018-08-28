const Question = require('../models/question')
const Answer = require('../models/answer')
const jwt = require('jsonwebtoken')

class QuestionController {
  static addQuestion(req, res){
    // console.log('asdasdasdasd', req.headers);
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
    // console.log('asdfasdfasdfcweqf', decoded);
    Question.create({
      title: req.body.title,
      content: req.body.content,
      writer: decoded.id
    })
    .then(result=>{
      res.status(200).json({message: 'question successfully added!', data: result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getQuestions(req, res){
    Question.find({})
    .populate('comment')
    .populate('writer')
    .then(questions=>{
      if (questions.length === 0) {
        res.status(404).json({message: 'no questions found!'})
      }
      res.status(200).json({message: 'questions successfully retrieved', data: questions})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getOneQuestion(req, res){
    Question.findOne({ _id: req.params.id })
    .populate({
      path: 'comment',
      populate: { path: 'userId' }
    })
    .populate('writer')
    .then(question=>{
      res.status(200).json({message: 'question successfully retrieved', data: question})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static deleteQuestion(req, res){
    Question.deleteOne({ _id: req.params.id })
    .then(result=>{
      // console.log(result.n);
      if (result.n === 0) {
        res.status(404).json({message: 'question not found'})
      }
      Answer.remove({ question: req.params.id })
      .then(res=>{
        // console.log(res);
        res.status(200).json({message: 'question successfully deleted', result})
      })
      .catch(err=>{
        res.status(200).json({message: 'question successfully deleted', result})
      })
    })
    .catch(err=>{
      // console.log(err);
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static updateQuestion(req, res){
    Question.updateOne({ _id: req.params.id },{
      title: req.body.title,
      content: req.body.content
    })
    .then(result=>{
      if (result.n === 0) {
        res.status(404).json({message: 'question not found'})
      }
      res.status(200).json({message: 'question successfully updated', result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static upvote(req, res){
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
    Question.findOne({ _id: req.params.id })
    .then(question=>{
      let index = question.upvote.indexOf(decoded.id)
      if (index === -1) {
        Question.updateOne({ _id: question._id },{
          $push: { upvote: decoded.id },
          $pull: { downvote: decoded.id }
        })
        .then(result=>{
          res.status(200).json({message:'upvote registered', result})
        })
        .catch(err=>{
          res.status(400).json({message: 'something went wrong!', err})
        })
      }else {
        res.status(400).json({message: 'you already voted up'})
      }
    })
  }
  static downvote(req, res){
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
    Question.findOne({ _id: req.params.id })
    .then(question=>{
      let index = question.downvote.indexOf(decoded.id)
      if (index === -1) {
        Question.updateOne({ _id: question._id },{
          $push: { downvote: decoded.id },
          $pull: { upvote: decoded.id }
        })
        .then(result=>{
          res.status(200).json({message:'downvote registered', result})
        })
        .catch(err=>{
          res.status(400).json({message: 'something went wrong!', err})
        })
      }else {
        res.status(400).json({message: 'you already voted down'})
      }
    })
  }
}

module.exports = QuestionController
