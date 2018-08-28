var express = require('express');
var router = express.Router();
var AnswersController = require('../controllers/answersController')
const WriterCheck = require('../middlewares/writerCheck')
const IsLoggedIn = require('../middlewares/isLoggedIn')
const images = require('../helpers/images')


/* GET answers listing. */
router.get('/', IsLoggedIn.loginCheck, AnswersController.getAnswers)
router.get('/:id', IsLoggedIn.loginCheck, AnswersController.getOneAnswer)
router.post('/:questionId', IsLoggedIn.loginCheck, AnswersController.addAnswer)
router.put('/:id', IsLoggedIn.loginCheck, WriterCheck.answerCheck, AnswersController.updateAnswer)
router.put('/:id/upvote', IsLoggedIn.loginCheck, WriterCheck.answerVoteCheck, AnswersController.upvote)
router.put('/:id/downvote', IsLoggedIn.loginCheck, WriterCheck.answerVoteCheck, AnswersController.downvote)

module.exports = router;
