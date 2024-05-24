const express = require('express')
const Course = require("../models/course_model")
const quizController = require("../controllers/quiz.controller")
const authMid = require('../middlewares/authenticateMiddleware')
const quizAnsController = require("../controllers/quizAns.controller")


const router = express.Router()

// router.post("/",authMid.authenticateToken ,quizController.createQuiz )

// route to add question in a particular quiz
// router.patch("/:quizId",authMid.authenticateToken ,quizController.addQuestion   )

router.post("/",authMid.authenticateToken ,quizController.createQuiz )
router.get('/all/:courseId',quizController.getallquiz)
router.delete("/:id" ,quizController.deleteQuiz )
router.get("/:quizId",  authMid.authenticateToken ,quizController.getQuiz )
router.post('/addques/:id',quizController.addquestion)
router.delete('/deletequestion/:quizid/:questionid',quizController.deleteQuestion)


router.post('/addanswer',  authMid.authenticateToken,quizAnsController.addAnswer)
router.post('/appendanswer/:id',quizAnsController.appendAnswer)
router.get('/useranswer/:id',quizAnsController.userAnswer)
router.get('/quizallanswer/:id',quizAnsController.quizAllAnswer)


module.exports = router

