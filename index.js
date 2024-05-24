const express = require("express");
const courseController = require("./controllers/course.controller")
const userController = require("./controllers/user.controller")
const courserouter = require("./routes/courses")
const gradesrouter = require("./routes/grade")
const labrouter = require("./routes/lab")
const assignmentrouter = require("./routes/assignment")
const quizrouter = require("./routes/quiz")
const announcementrouter = require("./routes/announcement")
const middle = require('./middlewares/uploadMiddleware')
const authMid = require('./middlewares/authenticateMiddleware')

const app = express()
const { Server } = require('socket.io')
const http = require('http')
const discussionController = require('./controllers/discussion.controller')


const bodyparser = require('body-parser')
require("./mydb")
const cookieParser = require("cookie-parser");
const fs = require('fs')
const Course = require("./models/course_model");
const { Socket } = require("dgram");
const Discussion = require("./models/discussion_model");
app.use(cookieParser())
app.use(express.json())
const cors = require('cors')
app.use(cors());
app.use(bodyparser.json())

app.use('/course', courserouter)

app.use('/machine', labrouter)

app.use('/announcement', announcementrouter)

app.use('/quiz', quizrouter)

app.use('/assignment', assignmentrouter)

app.use('/grades', gradesrouter)

app.get('/playvideo/:courseId/:moduleId/:lecId/:token', async (req, res)=>{

    const courseId = req.params.courseId
    const moduleId = req.params.moduleId
    const lecId = req.params.lecId
    var lecPath
    console.log("play video comming",req.params)
    const course = await Course.findById(courseId)
    for(mod of course.modules){
        if( mod._id == moduleId ){
            for(lec of mod.lectures){
                if(lec._id == lecId){
                    lecPath = lec.path
                }
            }
        }
    }
    if(!lecPath){
        console.log("No video file--", lecPath)
        res.status(401).send("No video File")
    }
    // console.log("Play video request coming.. ", lecPath)
    // console.log(req.body)
    const range = req.headers.range
    // const lecPath = "12.mp4"
    const videoSize = fs.statSync(lecPath).size
    const chunkSize = 1 * 1e7;
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + chunkSize, videoSize-1)
    const contentLength = end - start + 1 

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type" : "video/mp4"
    }

    res.writeHead(206, headers)
    const stream = fs.createReadStream(lecPath,{ start, end } )
    stream.pipe(res)

})

// app.get("/courses", authMid.authenticateToken, courseController.getCourses )
app.get("/courses",authMid.authenticateToken, courseController.getCourses )


app.get("/user", authMid.authenticateToken, userController.getUser),

app.delete("/user",authMid.authenticateToken, userController.deleteUser),

app.get("/user/courses",authMid.authenticateToken, userController.myCourses),

app.get("/profile", authMid.authenticateToken, userController.profile)

app.put("/profile",authMid.authenticateToken, middle.profilePic.single('pic'), userController.update)

app.patch("/profile",authMid.authenticateToken, userController.updateByAdmin)

app.get('/avatar/:token',authMid.authenticateTokenByParams ,  userController.avatar )

app.post("/register", userController.register);

app.post("/login", userController.login);

// app.patch("/user",authMid.authenticateToken, userController.update)


app.patch("/user/purchase",authMid.authenticateToken, userController.purchase)

app.patch("/user/unenroll/:courseId/:userId",userController.unenrollStudent)

app.post('/upload/:id/:idd',middle.lecture.single('File') , courseController.addLecture)

app.delete('/lecture', courseController.deleteLecture)


app.get('/vids', async (req, res)=>{

    try{
        res.sendFile(__dirname+"/index.html")

    }catch(e){
        res.send(e)
    }
} )

const server = http.createServer(app)

const io = new Server( server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'PUT'] 
    }
})

io.on("connection", (socket)=>{
    console.log(`User connected ${socket.id}`)
    console.log("This is socket...",  socket.handshake.auth )
    // var discussion
    socket.on("join", async (data)=>{
        console.log(` This data on join ${data}`)
        socket.join(data)
        var discussion = await Discussion.findOne({ course_id: data }).select({messages: 1})
        console.log(discussion)
        socket.to(socket.id).emit("allmessage", discussion)
        return

    })
    
    socket.on("sendMessages", async (data)=>{
        console.log(`this is message: ${data.message} and this is room ${data.room} `)
        var discussion = await Discussion.findOne( { course_id: data.room})
        if(!discussion){
            discussion = new Discussion({course_id: data.room})
        }
        console.log(discussion)
        discussion.messages.push({ user: data.user, message: data.message })
        discussion.save()
        console.log(`Sending messages... ${data.message},${data.room} , ${data.user}   `)
        socket.to(data.room).emit("receivedMessage", data ,(res)=>{
            console.log(`message sent... ${data.message} `)

        } )
        return
    }  )
    
    socket.on("disconnect",  ()=>{
        console.log(`User disconnected ${socket.id} `)
    
    })
} )

server.listen(3000, (req, res)=>{
    console.log("connection has started")
})