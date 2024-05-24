const mongoose = require('mongoose')
const Course = require("./course_model")

const announcementSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true
    },
    title : String,
    content: {
        type: String,
        required: true,
    }
})

const announcement = new mongoose.model("announcement", announcementSchema)

module.exports = announcement