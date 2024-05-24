const Grade = require("../models/grades_model")

async function getGrades(req, res){
    console.log("Grades call comming .....", req.params.id)
    try{
        const grade = await Grade.findOne({ studentId: req.user._id, courseId: req.params.id })
        if(!grade){
            res.send("No data found")
        }else{
            res.send(grade)
        }
    }catch(e){
        res.status(404).send(e)
    }
}

module.exports = {
    getGrades
}