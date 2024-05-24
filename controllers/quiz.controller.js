const Quiz = require("../models/quiz_model");
const Roles = require("../constants/userroles");
const Answer = require("../models/quizAns_model")
const { compare } = require("bcryptjs");


async function createQuiz(req, res) {
  console.log("quiz request coming......", req.user , req.body)
  if(req.user == Roles.Student  ){
      return res.status(401).send("Not Authorized")
  }
  const quiz = new Quiz(req.body);
  quiz.save().then((data) => {
      console.log(quiz);
      res.status(201).send(quiz);
    }).catch((e) => {
      res.send(e);
    });
}

async function deleteQuiz(req, res) {
  try {
    const quiz = await Quiz.findByIdAndDelete({ _id: req.params.id });
    console.log("This is deleted QUiz", quiz);
    if (quiz) {
      res.send("Quiz deleted Successfully");
    } else {
      res.status(404).send("Quiz Not Found");
    }
  } catch (e) {
    res.send(e);
  }
}

async function getallquiz(req, res) {
  Quiz.find({courseId: req.params.courseId}, (err, qz) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(qz);
    }
  });
}

async function addquestion(req, res) {
  console.log("Add question call comming ..........", req.body)
  try {
    const quiz = await Quiz.findById({
      _id: req.params.id,
    });
    quiz.questionSet.push(req.body);
    quiz.save();
    res.status(200).send("Question added Successfully");
  } catch (e) {
    res.status(404).send(e);
  }
}

async function deleteQuestion(req, res) {
  const questionid = req.params.questionid;
  try {
    const quiz = await Quiz.findById({ _id: req.params.quizid });
    quiz.questionSet.pull({ _id: questionid });
    quiz.save();
    res.status(200).send("Question deletd Successfully");
  } catch (e) {
    res.status(404).send(e);
  }
}

async function getQuiz(req, res) {
  console.log(" Get a quiz ......")
  try {
    const doc = await Answer.exists({ quizId: req.params.quizId , studentId: req.user._id })
    if(doc){
      return res.status(208).send("Quiz Already submited")
    }
    const quiz = await Quiz.findById({ _id: req.params.quizId });
    console.log(quiz)
    res.send(quiz);
  } catch (e) {
    res.status(404).send(e);
  }
}

module.exports = {
  createQuiz,
  getQuiz,
  deleteQuiz,
  getallquiz,
  addquestion,
  deleteQuestion,
};
