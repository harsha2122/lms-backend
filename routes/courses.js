const express = require('express')
const Course = require("../models/course_model")
const courseController = require("../controllers/course.controller")
const syllabusController = require("../controllers/syllabus.controller")
const authMid = require('../middlewares/authenticateMiddleware')
const middle = require('../middlewares/uploadMiddleware')

const router = express.Router()

router.post("/addModule/:id", authMid.authenticateToken, courseController.addModule )

router.post("/syllabus/:id",authMid.authenticateToken,syllabusController.createSyllabus )

router.get("/syllabus/:id",syllabusController.getSyllabus )

router.get("/image/:id", courseController.picture )

router.delete("/deleteModule", authMid.authenticateToken,courseController.deleteModule )

router.get("/all", authMid.authenticateToken, courseController.getCourses )

router.get("/students/:id",authMid.authenticateToken,   courseController.enrolled_students )


router.get('/lecture/:courseId/:moduleId/:lecId/:token', async (req, res)=>{
    try{
        console.log("lecture api call comming", req.params)
        // const moduleId = "636b75a49c00cca48e72fde6"
        const courseId = req.params.courseId
        const moduleId = req.params.moduleId
        const lecId = req.params.lecId
        const course = await Course.findById(courseId)
        // console.log(course.modules)
        for(mod of course.modules){
            // console.log(mod)
            if( mod._id == moduleId ){
                for(lec of mod.lectures){
                    if(lec._id == lecId){
                        // console.log(lec)
                        lecPath = lec.path
                        lecName = lec.name
                    }
                }
            }
        }
        
            // console.log(lecName, lecPath)
            console.log(`C:\\Users\\Vaibhav\\work\\backend\\${lecPath}`)
            res.sendFile(`C:\\Users\\Vaibhav\\work\\backend\\${lecPath}`)

    }catch(e){
        res.send("error aa gayi bhaiya "+e)
    }
} )
    
router.post("/content", authMid.authenticateToken,courseController.getContent )

router.get("/:id", authMid.authenticateToken,courseController.getCourse )
    
router.delete("/:id", authMid.authenticateToken,courseController.deleteCourse )

router.patch('/publish', authMid.authenticateToken, courseController.publish)

router.post("/image/:id", authMid.authenticateToken, middle.courseImage.single('image') , courseController.courseImage )


router.post("/", authMid.authenticateToken, courseController.addCourse )



module.exports = router