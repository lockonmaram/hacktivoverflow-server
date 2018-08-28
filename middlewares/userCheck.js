const jwt = require('jsonwebtoken')
const User = require('../models/user')

class IsUser {
  static isUser (req, res, next){
    jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY, function(err,decoded){
      if (decoded === undefined) {
        res.status(402).json({message: 'invalid token'})
      }else {
        User.findOne({ _id: req.params.id })
        .then(user=>{
          if (user._id == decoded.id) {
            next()
          }else if (decoded.role === 'admin'){
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

module.exports = IsUser
