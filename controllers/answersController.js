const Answer = require('../models/answer')
const Question = require('../models/question')
const jwt = require('jsonwebtoken')

class AnswerController {
  static addAnswer(req, res){
    // console.log('asdasdasdasd', req.headers);
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
    // console.log('asdfasdfasdfcweqf', decoded);
    Answer.create({
      content: req.body.content,
      writer: decoded.id,
      question: req.params.questionId
    })
    .then(answer=>{
      Question.findOneAndUpdate({ _id: answer.question }, {$push: {answers: answer._id}})
      .then(result=>{
        // console.log(result);
        res.status(200).json({message: 'answer successfully added!', data: answer})
      })
      .catch(err=>{
        res.status(400).json({message:'something went wrong!', err})
      })
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getAnswers(req, res){
    Answer.find({})
    .populate('writer')
    .then(answers=>{
      res.status(200).json({message: 'answers successfully retrieved', data: answers})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getOneAnswer(req, res){
    Answer.findOne({ _id: req.params.id })
    .populate('writer')
    .then(answer=>{
      res.status(200).json({message: 'answer successfully retrieved', data: answer})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static updateAnswer(req, res){
    Answer.updateOne({ _id: req.params.id },{
      content: req.body.content
    })
    .then(result=>{
      if (result.n === 0) {
        res.status(404).json({message: 'answer not found'})
      }
      res.status(200).json({message: 'answer successfully updated', result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static upvote(req, res){
    var decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY)
    Answer.findOne({ _id: req.params.id })
    .then(answer=>{
      // console.log(answer);
      let index = answer.upvote.indexOf(decoded.id)
      if (index === -1) {
        Answer.updateOne({ _id: answer._id },{
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
    Answer.findOne({ _id: req.params.id })
    .then(answer=>{
      // console.log(answer);
      let index = answer.downvote.indexOf(decoded.id)
      // console.log(index);
      if (index === -1) {
        Answer.updateOne({ _id: answer._id },{
          $push: { downvote: decoded.id },
          $pull: { upvote: decoded.id }
        })
        .then(result=>{
          // console.log(result);
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

module.exports = AnswerController
