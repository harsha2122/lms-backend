const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({

    courseId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    hasFile: { type: Boolean, required: true, default: false },
    content: String,
    filepath: String
})

const Assignment = new mongoose.model("assignment", assignmentSchema)

module.exports = Assignment