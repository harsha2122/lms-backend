const mongoose = require('mongoose')

const asssolSchema = new mongoose.Schema({

    assId:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assignment",
        required: true
    },
    marks: Number,
    filepath: String
})

const AssSol = new mongoose.model("assSol", asssolSchema)

module.exports = AssSol