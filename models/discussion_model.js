const mongoose = require('mongoose')

const discussionSchema = mongoose.Schema({
    course_id: {
        type: String,
        required: true
    },

    messages: [{
        user: String,
        message: String 
    },] 

})

const Discussion = new mongoose.model("discussion",discussionSchema);

module.exports = Discussion