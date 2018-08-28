var express = require('express');
var router = express.Router();
var QuestionController = require('../controllers/questionsController')
const WriterCheck = require('../middlewares/writerCheck')
const IsLoggedIn = require('../middlewares/isLoggedIn')
const images = require('../helpers/images')


/* GET questions listing. */
router.get('/', QuestionController.getQuestions)
router.get('/:id', QuestionController.getOneQuestion)
router.post('/', IsLoggedIn.loginCheck, QuestionController.addQuestion)
router.put('/:id', IsLoggedIn.loginCheck, WriterCheck.questionCheck, QuestionController.updateQuestion)
router.put('/:id/upvote', IsLoggedIn.loginCheck, WriterCheck.questionVoteCheck, QuestionController.upvote)
router.put('/:id/downvote', IsLoggedIn.loginCheck, WriterCheck.questionVoteCheck, QuestionController.downvote)
router.delete('/:id', IsLoggedIn.loginCheck, WriterCheck.questionCheck, QuestionController.deleteQuestion)

module.exports = router;
