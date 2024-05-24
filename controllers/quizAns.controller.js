const Answer = require("../models/quizAns_model");
const Quiz = require("../models/quiz_model");

async function addAnswer(req, res) {
  console.log("quiz Answer coming....", req.body);
  const doc = await Answer.exists({ quizId: req.body.quizId, studentId: req.user._id})
  if(doc){
    return res.status(208).send("Answer already exists..")
  }else{
    const answer = new Answer( { quizId: req.body.quizId, studentId: req.user._id, answers: req.body.answers,  } );
    console.log("this is answer", req.user._id ,answer);
    answer.save().then(() => {
      res.status(201).send(answer);
    })
    .catch((e) => {
      console.log(e)
      res.status(400).send(e);
    })
  }

}

async function appendAnswer(req,res){
  try {
    const answer = await Answer.findById({
      _id: req.params.id,
    });
    answer.answers.push(req.body);
    answer.save();
    res.status(200).send("Answer added Successfully");
  } catch (e) {
    res.status(404).send(e);
  }
}

async function userAnswer(req,res){
  Answer.find({}, (err, ans) => {
    if (err) {
      console.log(err);
      res.json({ msg: "some error!" });
    } else {
      res.json({ answer: ans });
    }
  });
}

async function quizAllAnswer(req,res){
  Quiz.find({}, (err, ans) => {
    if (err) {
      console.log(err);
      res.json({ msg: "some error!" });
    } else {
      res.json({ answer: ans });
    }
  });

}


module.exports = {
  addAnswer,
  appendAnswer,
  userAnswer,
  quizAllAnswer
};
