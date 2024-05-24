const mongoose = require("mongoose")
const Assignment = require("../models/assignment_model")

async function getAssignment(req, res){

    try{
        const courseId = req.params.id
        const assignments = await Assignment.find({ courseId :courseId }).select({filepath: 0, __v: 0, courseId: 0})
        res.send(assignments)

    }catch(e){
        return res.status(400).send(e)
    }
}

async function getFile(req, res){
    try{
        const assId = req.params.id
        console.log(assId)
        const assignment = await Assignment.findOne( { _id: assId})
        console.log("Get file fro assignemtn", assignment)
        if(assignment.filepath){
            console.log(assignment.filepath)
            return res.sendFile(`C:\\Users\\Vaibhav\\work\\backend\\${assignment.filepath}`)
        }else{
            res.status(400).send("No such file")
        }

    }catch(e){
        res.status(400).send(e)
    }
}

async function deleteAssignment(req, res){
    try{
        const assignmentId = req.params.id
        const assignment = await Assignment.findByIdAndDelete(assignmentId)
        if(assignment){
            res.send("Assignment Deleted")
        }else{
            res.send("Cannot Deleted or no such Assignment")
        }
    }catch(e){
        res.send(e)
    }
}

async function createAssignment(req, res){

    console.log(req.file)
    const assignment = new Assignment(req.body)
    if(req.file){
        assignment.hasFile = true
        assignment.filepath = req.file.path
    }
    assignment.save().then(()=>{
        return res.status(201).send(assignment)

    }).catch((e)=>{
        res.status(400).send("Cannot create assignment"+e);
    })

}

module.exports = {
    createAssignment,
    getAssignment,
    deleteAssignment,
    getFile,
}
