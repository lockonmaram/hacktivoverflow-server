var express = require('express');
var router = express.Router();
var usersController = require('../controllers/usersController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Overflow Server ¯\_(ツ)_/¯' });
});
router.post('/signup', usersController.registerUser)
router.post('/login', usersController.login)
router.post('/fbLogin', usersController.fbLogin)


module.exports = router;
