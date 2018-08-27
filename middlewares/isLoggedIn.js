const jwt = require('jsonwebtoken')
const User = require('../models/user')

class LoginCheck {
  static loginCheck (req, res, next){
    // console.log(req.headers);
    jwt.verify(req.headers.token, process.env.JWT_SECRET_KEY, function(err,decoded){
      // console.log(decoded);
      if (decoded === undefined) {
        res.status(400).json({message: 'not logged in', err})
      }
      User.findOne({ _id: decoded.id })
      .then(user=>{
        // console.log(decoded.id);
        if (user === null) {
          res.status(400).json({message: 'user not found', err})
        }
        next()
      })
      .catch(err=>{
        res.status(400).json({message: 'user not found', err})
      })
    })
  }
}

module.exports = LoginCheck
