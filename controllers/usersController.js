const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const nodeMailer = require('nodemailer')

class UserController {
  static registerUser(req, res){
    // console.log(req.body);
    if (req.body.password === undefined || req.body.password.length === 0) {
      res.status(400).json({message: 'password is required'})
    }else if (req.body.password.length < 6) {
      res.status(400).json({message: 'password length must be 6 characters or higher'})
    }
    const saltUser = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(req.body.password, saltUser)
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    .then(user=>{
      let transporter = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        auth:{
          user:'treasurecredit@gmail.com',
          pass:'pairproject'
        }
      })
      // console.log(transporter);
      // console.log(user.email);
      let mailOptions = {
        from:'"Overflow"<treasurecredit@gmail.com>',
        to: user.email,
        subject: 'Register successful!',
        html: `<b> Thank you ${user.name},<br>
                   for joining Overflow!<br><br>
                   Now you can post questions and answer!
              </b>`
      };
      // console.log(mailOptions);
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
          res.status(400).json(error)
        }
        // res.alert('account registration confirmation has been sent via email!')
        // console.log('Message %s sent: %s',info.messageId,info.response);
        res.status(200).json({message: 'user successfully registered!', data: user})
      })
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getUsers(req, res){
    User.find({})
    .then(users=>{
      // console.log(users);
      if (users.length === 0) {
        res.status(404).json({message: 'no users found!',data: users})
      }else {
        res.status(200).json({message: 'users found!',data: users})
      }
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static getOneUser(req, res){
    User.findOne({ _id: req.params.id })
    .then(user=>{
      // console.log(user);
      res.status(200).json({message: 'User successfully retrived',data: user})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static deleteUser(req, res){
    User.deleteOne({ _id: req.params.id })
    .then(result=>{
      if (result.n === 0) {
        res.status(404).json({message: 'user not found!'})
      }
      res.status(200).json({message: 'user successfully deleted', data: result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static updateUser(req, res){
    User.updateOne({ _id: req.params.id }, {
      name: req.body.name,
      email: req.body.email
    })
    .then(result=>{
      if (result.n === 0) {
        res.status(404).json({message: 'user not found'})
      }
      res.status(200).json({message: 'user successfully updated!', result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static updatePassword(req, res){
    if (req.body.password === undefined || req.body.password.length === 0) {
      res.status(400).json({message: 'password is required to update'})
    }
    const saltUser = bcrypt.genSaltSync(8)
    const hashedPassword = bcrypt.hashSync(req.body.password, saltUser)
    User.updateOne({ _id: req.params.id }, {
      password: hashedPassword
    })
    .then(result=>{
      if (result.n === 0) {
        res.status(404).json({message: 'user not found'})
      }
      res.status(200).json({message: 'user successfully updated!', result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static updateImage(req, res){
    User.updateOne({ _id: req.params.id }, {
      imageUrl: req.file.cloudStoragePublicUrl
    })
    .then(result=>{
      if (result.n === 0) {
        res.status(404).json({message: 'user not found'})
      }
      res.status(200).json({message: 'user successfully updated!', result})
    })
    .catch(err=>{
      res.status(400).json({message: 'something went wrong!', err})
    })
  }
  static login(req, res){
    // console.log(req.body);
    User.findOne({ email: req.body.email})
    .then(user => {
      const passwordCheck = bcrypt.compareSync(req.body.password, user.password)
      // console.log(user.password);
      // console.log(passwordCheck);
      if (passwordCheck) {
        const tokenUser = jwt.sign({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }, process.env.JWT_SECRET_KEY)
        // console.log(tokenUser);
        let dataObj = { token: tokenUser, id: user._id, name: user.name, email: user.email }
        res.status(200).json({message: 'login successful!', data: dataObj})
        // req.headers.token = tokenUser
      }else {
        res.status(400).json({message: 'wrong password'})
      }
    })
    .catch(err=>{
      res.status(400).json({message: 'email is not found'})
    })
  }
  static fbLogin(req, res){
    let accessToken = req.headers.token
    axios.get(`https://graph.facebook.com/me?fields=name,email&access_token=${accessToken}`)
    .then(resFb=>{
      User.findOne({ email: resFb.data.email })
      .then(regist=>{
        console.log(regist);
        if (regist === null) {
          const saltUser = bcrypt.genSaltSync(8)
          const hashedPassword = bcrypt.hashSync(`${resFb.data.email}123`, saltUser)
          // console.log(resFb.data);
          User.create({
            name: resFb.data.name,
            email: resFb.data.email,
            password: hashedPassword
          })
          .then(user=>{
            const tokenUser = jwt.sign({
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            }, process.env.JWT_SECRET_KEY)
            // console.log(tokenUser);
            let dataObj = { token: tokenUser, id: user._id, name: user.name, email: user.email }
            res.status(200).json({message: 'login successful!', data: dataObj})
          })
          .catch(err=>{
            res.status(400).json({message: 'something went wrong!', err})
          })
        }else if (regist.email === resFb.data.email) {
          const tokenUser = jwt.sign({
            id: regist._id,
            name: regist.name,
            email: regist.email,
            role: regist.role
          }, process.env.JWT_SECRET_KEY)
          // console.log(tokenUser);
          let dataObj = { token: tokenUser, id: regist._id, name: regist.name, email: regist.email }
          res.status(200).json({message: 'login successful!', data: dataObj})
          // req.headers.token = tokenUser
        }
      })
    })
  }
}

module.exports = UserController
