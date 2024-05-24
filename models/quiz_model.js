const mongoose = require('mongoose')

const ansOptionSchema = mongoose.Schema({

    optionNumber: Number,
    ansBody: {
        type: String,
        minlength: 1,
        maxlength: 200,
        required: true,
    },
    isCorrect: {
        type: Boolean,
        default: false
    },
    _id: false
})

const quesSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000,
    },

    point: {
        type: Number,
        default: 1
    },

    options: {
        type: [ansOptionSchema],
        validate: {
            validator: function(value){
                return value && value.length <= 4;
            },
            message: "Answer options should be less than  or equal to 4",
        }
    },
},{timestamps: true})

const quizSchema = new mongoose.Schema({

    quizname: String,
    description: String,
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    }, 
    questionSet: [quesSchema],
})

const Quiz = new mongoose.model("quiz", quizSchema)

module.exports = Quiz