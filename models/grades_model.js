const mongoose = require('mongoose')


const assGradeSchema = mongoose.Schema({

    assId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assignment",
    }, 
    assName: String,
    obtMarks: Number,
    totalMarks: Number,

})


const quizGradeSchema = mongoose.Schema({

    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz",
    }, 
    quizName: String,
    obtMarks: Number,
    totalMarks: Number,

})

const gradeSchema = mongoose.Schema({
    studentId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }, 
    courseId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
    }, 
    assignments : [ assGradeSchema ],
    quizzes: [ quizGradeSchema ] 
})


const Grades = new mongoose.model("grade", gradeSchema)

module.exports = Grades