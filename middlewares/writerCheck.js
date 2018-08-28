const jwt = require('jsonwebtoken')
const Question = require('../models/question')
const Answer = require('../models/answer')

class Writter {
  static questionCheck (req, res, next){
    jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY, function(err,decoded){
      if (decoded === undefined) {
        res.status(402).json({message: 'invalid token'})
      }else {
        Question.findOne({ _id: req.params.id })
        .then(question=>{
          // console.log('asdfasd1f', question.writer);
          // console.log('asdfasd2f', decoded.id);
          if (question.writer == decoded.id) {
            next()
          }else if (decoded.role === 'admin') {
            next()
          }else {
            res.status(401).json({message: 'user not authorized'})
          }
        })
        .catch(err=>{
          res.status(403).json({message: 'something went wrong!', err})
        })
      }
    })
  }
  static questionVoteCheck (req, res, next){
    jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY, function(err,decoded){
      if (decoded === undefined) {
        res.status(402).json({message: 'invalid token'})
      }else {
        Question.findOne({ _id: req.params.id })
        .then(question=>{
          // console.log('asdfasd1f', question.writer);
          // console.log('asdfasd2f', decoded.id);
          if (question.writer != decoded.id) {
            next()
          }else {
            res.status(401).json({message: 'user not authorized'})
          }
        })
        .catch(err=>{
          res.status(403).json({message: 'something went wrong!', err})
        })
      }
    })
  }
  static answerCheck (req, res, next){
    jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY, function(err,decoded){
      if (decoded === undefined) {
        res.status(402).json({message: 'invalid token'})
      }else {
        Answer.findOne({ _id: req.params.id })
        .then(answer=>{
          // console.log('asdfasd1f', answer.writer);
          // console.log('asdfasd2f', decoded.id);
          if (answer.writer == decoded.id) {
            next()
          }else if (decoded.role === 'admin') {
            next()
          }else {
            res.status(401).json({message: 'user not authorized'})
          }
        })
        .catch(err=>{
          res.status(403).json({message: 'something went wrong!', err})
        })
      }
    })
  }
  static answerVoteCheck (req, res, next){
    jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY, function(err,decoded){
      if (decoded === undefined) {
        res.status(402).json({message: 'invalid token'})
      }else {
        Answer.findOne({ _id: req.params.id })
        .then(answer=>{
          // console.log('asdfasd1f', answer.writer);
          // console.log('asdfasd2f', decoded.id);
          if (answer.writer != decoded.id) {
            next()
          }else {
            res.status(401).json({message: 'user not authorized'})
          }
        })
        .catch(err=>{
          res.status(403).json({message: 'something went wrong!', err})
        })
      }
    })
  }
}

module.exports = Writter
