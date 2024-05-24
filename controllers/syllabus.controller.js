const Course = require("../models/course_model");
const Roles = require("../constants/userroles");
const mongoose = require("mongoose");

async function createSyllabus(req, res){


if (req.user.role == Roles.Educator ||req.user.role == Roles.Admin){    
    try{
        const courseId = req.params.id
        console.log(req.body)
        Course.findByIdAndUpdate(courseId,req.body, ( err, doc )=>{
            if(err) return res.status(400).send("Syllabus cannot be added")
            res.send("Syllabus added")
        })
        
    }catch(e){
        res.status(404).send(e)
    }
}else{
    res.status(401).send("Not Authoirised")
    }
}

async function getSyllabus(req, res){
    
    try {
        const courseId = req.params.id
        const course = await Course.findById(courseId).select({syllabus: 1})
        res.send(course.syllabus)
        
    } catch (e) {
        res.status(400).send(e)
    }

}


module.exports = {
    createSyllabus,
    getSyllabus
}