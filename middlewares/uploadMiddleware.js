const path = require("path")
const multer = require("multer")

var storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads/profilePic/')
  },
  filename: (req, file, cb)=>{
    fname = req.user._id
    let ext = path.extname(file.originalname)
    cb(null, fname + ext)
  }
})

const storageForCourse = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads/courseImages/')
  },
  filename: (req, file, cb)=>{
    fname = req.params.id
    let ext = path.extname(file.originalname)
    cb(null, fname + ext)
  }
})

const storageForAssignment = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads/assignments/')
  },
  filename: (req, file, cb)=>{
    let ext = path.extname(file.originalname)
    cb(null, file.originalname + '_' + Date.now() + ext)
  }
})

const storageForStudentAssignment = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads/assSol/')
  },
  filename: (req, file, cb)=>{
    let ext = path.extname(file.originalname)
    cb(null, file.originalname + '_' + Date.now() + ext)
  }
})

var storage2 = multer.diskStorage({
  destination: (req, file, cb)=>{
    cb(null, 'uploads/lectures/')
  },
  filename: (req, file, cb)=>{
    let ext = path.extname(file.originalname)
    cb(null, Date.now() + ext)
  }
})

const profilePic = multer({
  storage: storage,
  // fileFilter: (req, file, cb)=>{
  //   if(file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" ){
  //     cb(null, true)
  //   }else{
  //     console.log("File type not allowed")
  //     cb(null, false)
  //   }
  // }
})
const courseImage = multer({
  storage: storageForCourse ,
  fileFilter: (req, file, cb)=>{
    if(file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png" ){
      cb(null, true)
    }else{
      console.log("File type not allowed")
      cb(null, false)
    }
  }
})

const assignment = multer({
  storage: storageForAssignment,
  fileFilter: (req, file, cb)=>{
    if(file.mimetype == "application/pdf" ){
      cb(null, true)
    }else{
      console.log("File type not allowed")
      cb(null, false)
    }
  }
})


const studentAssignment = multer({
  storage: storageForStudentAssignment,
  fileFilter: (req, file, cb)=>{
    if(file.mimetype == "application/pdf" ){
      cb(null, true)
    }else{
      console.log("File type not allowed")
      cb(null, false)
    }
  }
})

const lecture = multer({
  storage: storage2,
})

module.exports = {profilePic, lecture, assignment, studentAssignment, courseImage }