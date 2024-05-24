const mongoose = require('mongoose')
const Quiz = require("./quiz_model")
const Grade = require("./grades_model")

const answerSchema = new mongoose.Schema({
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "quiz",
        required: true
    },

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },

    total: Number,
    scored: Number,
    
    answers: [{
        quesNo: Number,   // for question number
        ans: [Number]     // for multiple selection answers
    }]
})


function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

answerSchema.pre("save", async function(next){

    try{
        var maxScore = 0;
        const quiz = await Quiz.findOne({_id: this.quizId })
        for( ques of quiz.questionSet ){
            maxScore = maxScore + ques.point
        }
        this.total = maxScore
        
        var hisScore = 0;

        for( answer of this.answers ){
            const obj = quiz.questionSet[answer.quesNo].options
            var arr = []
            for ( a in obj ){
                console.log(a, obj[a])
                if ( obj[a].isCorrect ){
                    arr.push(Number(a))
                }
            }
            if ( arrayEquals(arr, answer.ans )){
                hisScore = hisScore + quiz.questionSet[answer.quesNo].point
            }
        }
        this.scored = hisScore

        const grade = await Grade.findOne({ studentId: this.studentId, courseId: quiz.courseId })
        console.log("Grade is there, but ")
        console.log(grade,this.studentId, this.quizId, quiz.courseId )
        grade.quizzes.push({ quizId: this.quizId, quizName: quiz.quizname, obtMarks: hisScore, totalMarks: maxScore })
        grade.save().then(()=>{
            console.log(" Marks added at grades ")
        }).catch((e)=>{
            console.log(e)
        })

    }catch(e){
        return e
    }
    next();
} )


const Answer = new mongoose.model("answer", answerSchema)

module.exports = Answer