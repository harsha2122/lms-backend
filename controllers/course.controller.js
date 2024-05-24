const Course = require("../models/course_model");
const Roles = require("../constants/userroles");
const mongoose = require("mongoose");
const User = require("../models/user_model");
const fs = require('fs')
const path = require('path')

async function enrolled_students(req, res){
    try{
        console.log("Enrolled students call coming")
        console.log(req.user)
        if(req.user.role == Roles.Admin || req.user.role == Roles.Educator ){
            const courseId = req.params.id
            const users = await User.find({ enrolled_courses: courseId }).select({ _id: 1, name: 1, email: 1, phone: 1, role: 1 })
            res.send(users)

        }else{
            res.status(404).send("You dont have access to this information")
        }
    }catch(e){
        res.send(e)
    }
}


async function getCourses(req, res){
    console.log("Get Courses Request Comming")
    var courseData;
    try{
        const role = req.user.role
        const userId = req.user._id
        // courseData = await Course.find({}).select() 
        if(role == Roles.Admin ){
            courseData = await Course.find({}).select({modules: 0}) 
        }else if(role == Roles.Educator ){
            courseData = await Course.find({author: userId }).select({modules: 0}) ;
        }else if(role == Roles.Student) {
            const user = await User.findById(req.user._id).select({enrolled_courses: 1})
            courseData = await Course.find( {'$and': [{published: true, _id: { '$nin': user.enrolled_courses }}]}).select({modules: 0}) ;
        }
        res.send(courseData);
    }catch(e){
        res.send(e);
    }
}

async function getContent(req, res){
    
    try{
        const courseId = req.body.courseId
        const moduleId = req.body.moduleId
        const lecId = req.body.lecId
        console.log("get content req coming")
        const course = await Course.findById(courseId)
        for(mod of course.modules){
            if(mod._id == moduleId){
                for(lec of mod.lectures){
                    if( lec._id == lecId ){
                        res.status(200).send(lec.content)
                    }
                }
            }
        }

    }catch(e){
        res.send(e)
    }

}

async function getCourse(req, res){
    console.log("Get course call comming")
    try{
        var courseData = await Course.findOne({ "_id": req.params.id}).select({ "modules.lectures.content": 0,  "modules.lectures.path": 0 }).lean() ;
        
        courseData.enrolled = false

    if(req.user.enrolled_courses && req.user.enrolled_courses.includes(courseData._id.toString() ) ){
        courseData.enrolled = true
    }
    // console.log(courseData)
    res.send(courseData);
    }catch(e){
        res.send(e);
    }
}

async function courseImage(req, res){
    try{
        console.log("Course Image request comming.....")
        if (req.user.role == Roles.Educator ||req.user.role == Roles.Admin){
            const courseId = req.params.id
            const course = await Course.findById(courseId)
            if ( !req.file ) return res.status(415).send("No file")
            course.imgFile = req.file.path
            course.save().then(()=>{
                res.send("Picture uploaded successfully")
            }).catch((e)=>{
                res.status(400).then(e)
            })
        }else{
            res.status(401).send("Not Authoirised")
        }
    }catch(e){
        res.status(400).send(e)
    }
}

async function addCourse(req, res){
    console.log("Add Course request coming")
    console.log(req.file)
    console.log(req.body)
    const course = new Course(req.body)
    const user = await User.exists({email: req.body.author, role: Roles.Educator})
    console.log("This is author..", user)
    if ( ! user) return res.status(406).send("No such Educator")
    course.author = user._id
    course.save().then(()=>{
        res.status(201).send(course)

    }).catch((e)=>{
        res.send(e);
    })
}

async function deleteModule(req, res){
    if (req.user.role == Roles.Educator ||req.user.role == Roles.Admin){
        try{
            console.log("Delete module req comming")
            const courseId = req.body.courseId
            const moduleId = req.body.moduleId
            const course = await Course.findById(courseId)
            for (mod of course.modules){
                if( mod._id == moduleId ){ 
                    for ( lec of mod.lectures ){
                        if(lec.path){
                            const lecPath = path.normalize(`${__dirname}\\..\\${lec.path}`)
                            console.log(lecPath)
                            fs.unlink(lecPath, (err)=>{
                                if(err) return err
                                console.log(err)
                            })
                        }
                    }
                }
            }
            course.modules.pull({_id: moduleId})
            course.save().then(()=>{
                res.send("Module deleted successfully")
            }).catch((e)=>{
                res.status(400).send("Module cannot be deleted")
            })
            
        }catch(e){
            res.status(400).send(e)
        }

    }else{
        res.status(401).send("Not Authoirised")
    }
}

async function addModule(req, res){
    console.log("Add Module Call coming")
    
    if (req.user.role == Roles.Educator ||req.user.role == Roles.Admin){
        try{
            const course = await Course.findById({"_id": req.params.id})
            course.modules.push(req.body)
            course.save()
            res.status(200).send("Module added Successfully")
        }catch(e){
            res.status(404).send(e)
        }
    }else{
        res.status(401).send("Not Authoirised")
    }

}

async function deleteCourse(req, res){
    console.log("Delete Course request coming");


    if ( req.user.role == Roles.Admin){
        
        try{
            const course = await Course.findByIdAndDelete({"_id": req.params.id});
            console.log("This is deleted Course" ,course)
            if(course){
                for (mod of course.modules){
                    for ( lec of mod.lectures ){
                        if(lec.path){
                            const lecPath = path.normalize(`${__dirname}\\..\\${lec.path}`)
                            console.log(lecPath)
                            fs.unlink(lecPath, (err)=>{
                                if(err) return err
                                console.log("Lecrure deleted successfully ",lecPath )
                            })
                        }
                    }
                }
                res.send("Course deleted successfully");
            }else{
                res.status(400).send("Cannot delete")
            }
        }catch(e){
            res.status(404).send(e);
        }
    }else{
        res.status(401).send("Not Authoirised")
        }
}
    
    
    async function deleteLecture (req, res){
    try{
        const courseId = req.body.courseId
        const moduleId = req.body.moduleId
        const lecId = req.body.lecId
        console.log("Delete Lecture Call Coming")
        console.log(courseId, moduleId)
        const course = await Course.findById(courseId)
        var filepath
        for ( mod of course.modules ){
            // console.log(mod._id, mod)
            if (mod._id == moduleId ){
                for(lec of mod.lectures){
                    if(lec._id == lecId){
                        filepath = lec.path
                    }
                }
                mod.lectures.pull({"_id": lecId}, )
            }
        }
        if(filepath){
            const lecPath = path.normalize(`${__dirname}\\..\\${filepath}`)
            console.log(lecPath)
            fs.unlink(lecPath, (err)=>{
                if(err) return err
                console.log(err)
            })
        }

        course.save()
        // console.log(course)
        res.status(200).send("course deleted successfully")
    }catch(e){
        res.send(e)
    }
}


async function addLecture (req, res){

    try{

        console.log("Add Lecture api call")
        // console.log(req.body)
        console.log(req.file)
        if( req.file ){
            const file = req.file;
            const courseId = req.params.id;
            const moduleId = req.params.idd;
            const course = await Course.findById(courseId)
            const filename = file.originalname;
            const filetype = file.mimetype;
            
            for ( mod of course.modules ){
                // console.log(mod)
                if (mod._id == moduleId ){
                    mod.lectures.push({ "name": req.body.Title, "content": req.body.content , "path": file.path, "type": filetype})
                }
            }
            
            // course.modules.findById(moduleId).lectures.push(file.path)
            course.save()
            // console.log(course);
            res.status(200).send("lecture added")
            
        }else if(req.body) {
            const courseId = req.params.id;
            const moduleId = req.params.idd;
            const course = await Course.findById(courseId)
            
            for ( mod of course.modules ){
                // console.log(mod)
                if (mod._id == moduleId ){
                    mod.lectures.push({ "name": req.body.Title, "content": req.body.content , "path": null, "type": 'application/reading'})
                }
            }
            
            course.save()
            // console.log(course);
            res.status(200).send("Content added")
        }else{
            res.send("No files or Content")
    
        }
    }catch(e){
        res.send(e)
    }

}

async function publish(req, res){

    console.log("Publish Request coming  ")
    try{
        if(req.user.role == Roles.Admin || req.user.role == Roles.Educator ){
            const courseId = req.body.courseId
            const course = await Course.findById(courseId, {"published": 1})
            course.published = ! course.published
            course.save()
            if(course.published){
                res.status(200).send("Course Published")
            }else{
                res.status(200).send("Course Unpublished")
            }
    
        }else{
            res.status(401).send("Not Admin")
        }

    }catch(e){
        res.status(400).send(e)
    }
} 

async function picture(req, res){
    try{
        console.log("Picture comming soon", req.params.id)
        const course = await Course.findById({ _id: req.params.id}).select({ imgFile: 1})
        if( course && !course.imgFile){
            return res.send(null)
        }
        const filepath = path.normalize(`${__dirname}\\..\\${course.imgFile}`)
        console.log(filepath)
        if(filepath){
            res.sendFile(filepath)
        }else{
            res.send("No course Image")
        }
    }catch(e){
        res.send(e)
    }
}


module.exports = {
    getCourses,
    getCourse,
    addCourse,
    addLecture,
    deleteModule,
    deleteCourse,
    courseImage,
    enrolled_students,
    addModule,
    deleteLecture,
    publish,
    getContent,
    picture,
}
