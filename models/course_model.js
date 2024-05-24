const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },      

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },

    syllabus: String,

    description: String,
    price: Number,

    imgFile: {
        type: String,
    },

    published: {
        type: Boolean,
        default: false,
    },

    licience: String,

    modules:[{
        name: {
            type: String,
            required: true, 
        },
        desc: String,
        lectures: [ {
            name: {
                type: String,
                // required: true, 
            },
            content: {
                type: String,

            },
            path: {
                type: String,
                // required: true, 
            },
            type: {
                type: String,
                // required: true, 
            },

        } ]
    }]

}, { timestamps: true })

const Course = new mongoose.model("course",courseSchema);

module.exports = Course