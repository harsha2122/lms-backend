const User = require("../models/user_model");
const bcrypt = require("bcryptjs");
const Course = require("../models/course_model");
const Roles = require("../constants/userroles");
const Grade = require("../models/grades_model")
const path = require("path");
const fs = require('fs');
const { REFUSED } = require("dns");
const request = require('request').defaults({ rejectUnauthorized: false });
const laburl = 'https://labs.megaproject.live/api/public/create_user';



async function deleteUser(req, res){
    if (req.user.role == Roles.Admin){

        console.log(req.body)
        try{
            const user = await User.findByIdAndDelete(req.body.userId)
            // console.log(user)
            if(user){
                res.send("User deleted Successfully")
            }else{
                res.status(404).send("User Not Found")
            }
        }catch(e){
            res.send(e)
        }
    }else{
        res.status(401).send("Not Authorized")
    }
}



async function getUser(req, res){
    try{
        if( req.user && req.user.role == Roles.Admin ){
            const userData = await User.find({}).select({name: 1, role: 1, _id: 1, email: 1, enrolled_courses: 1})
            res.send(userData);

        }else{
            res.status(401).send("Not Authoirised")
        }
    }catch(e){
        res.send(e);
    }
}


async function profile(req, res){
    console.log(req.body)
    console.log(req.user, req.file)
    try{
        const userData = await User.findById(req.user._id).select({tokens: 0, updatedAt:0, createdAt:0, password:0,confirm_password:0, "__v":0, avatar: 0 })
        console.log(userData)
    res.send(userData);
    }catch(e){
        res.send(e);
    }
}

// async function labRegister(user){
//     console.log("This is user", user);
//     var user_id = 'hj';
//     request.post(laburl, 
//         {
//             json: {
//                 "api_key":"JaBVHCaK66vS",
//                 "api_key_secret":"EZBdLV0zVBUXkDfUhn4DqyEy8HwQhdiQ",
//                 "target_user": {
//                     "username" : user.email,
//                     "first_name" : user.name.split(" ")[0] ,
//                     "last_name" : user.name.split(" ")[1],
//                     "locked": false,
//                     "disabled": false,
//                     "organization": "Allenhouse",
//                     "phone": user.phone.toString() ,
//                     "password": user.password
//                 }
//             }
//         },
        
//         //Thrid parameter Callack function  
//         function (error, response, body) {
//             if (!error && response.statusCode == 201) {
//                 console.log(body, response);
//             }
//             console.log("This is Body",body.user.user_id)
//             user_id = body.user.user_id;
//             console.log("This is inside: -- ", user_id);
//             return user_id
//         } );
        
//         // console.log("This is outside: -- ", user_id);
//         // return user_id
// }


async function register (req, res){
    var user = new User(req.body);
    user.role = Roles.Student

    //  Lab registration 

    request.post(laburl, 
        {
            json: {
                "api_key":"JaBVHCaK66vS",
                "api_key_secret":"EZBdLV0zVBUXkDfUhn4DqyEy8HwQhdiQ",
                "target_user": {
                    "username" : user.email,
                    "first_name" : user.name.split(" ")[0] ,
                    "last_name" : user.name.split(" ")[1],
                    "locked": false,
                    "disabled": false,
                    "organization": "Allenhouse",
                    "phone": user.phone.toString() ,
                    "password": user.password
                }
            }
        },
        
        //Thrid parameter Callack function  
        function (error, response, body) {
            if (!error && ( response.statusCode == 201 || response.statusCode == 200 )) {
                console.log("This is id",body.user.user_id)
                user.lab_id = body.user.user_id;
                user.save().then(()=>{
                    console.log("This is user: -- ", user);
                    res.status(201).send(user)
                }).catch((e)=>{
                    res.send(e);
                })
            }
        } );
        
}

async function login(req, res){
    console.log(req.body)
    try{
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email});
        // console.log(user)
        // res.cookie("jwt",token, {
            //     expires: new Date(Date.now() + 300000 ),
            //     httpOnly: true,
            //     // secure: true
            // })
            
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(` Password matched ${isMatch}`);
        if( isMatch ){
        const token = await user.generateAuthToken();
        res.status(200).json({"token": token, "status": "Authorised", "role": user.role, "userId": user._id, 'username': user.name});
        }else{
            res.status(401).send("Invalid Credentials");
        }
    }catch(error){
        res.status(401).send("Invalid Credentials")
    }
}

async function profilePic(req, res){
    console.log("This in profile pic request")
    console.log(" requested file ", req.file)
    console.log("req body", req.body)
    // console.log("req only", req)
    res.status(400).send("profile")

}

async function avatar(req, res){
    try{
        console.log("Avatar comming soon")
        const user = await User.findById(req.user._id).select({avatar:1})
        if( user && !user.avatar){
            return res.send("No profile pic")
        }
        console.log(user, __dirname)
        const filepath = path.normalize(`${__dirname}\\..\\${user.avatar}`)
        if(filepath){
            res.sendFile(filepath)
        }else{
            res.send("No profile pic")
        }
    }catch(e){
        res.send(e)
    }
}



async function update(req, res){
    console.log(" Update request coming ... ")
    try{
        console.log("This is User",req.user)
        console.log("This is file",req.file)
        console.log("This is body",req.body)
        const userId = req.user._id
        const updatedUser = await User.findByIdAndUpdate(userId, req.body,{new: true,  runValidators: true})
        if(req.file){
            console.log(updatedUser.avatar,req.file.path)
            updatedUser.avatar = req.file.path
            updatedUser.save({validateBeforeSave: false})
        }

        // console.log(updatedUser)
        return res.status(200).send("Updated successfully")
        
    }catch(err){
        console.log(err)
        return res.status(400).send(err)
    }
}

async function updateByAdmin(req, res){
    try{
        const user = await User.findByIdAndUpdate(req.body._id, req.body, {new: true})
        console.log("updated...")
        res.status(200).send("Updated Successfully")
    }catch(e){
        res.status(404).send(e)
    }
}

async function unenrollStudent(req, res){

    try{
        console.log("Unenroll Stduent call coming")
        const courseId = req.params.courseId
        const userId = req.params.userId
        console.log(courseId, userId)

        const user = await User.findById(userId)
        if ( !user) return res.status(404).send("User not found")
        if(user.enrolled_courses.includes(courseId) ){
            user.enrolled_courses.pull({ _id: req.params.courseId})
            user.save({ validateBeforeSave: false }).then(()=>{
                return res.status(200).send("Successfully unenrolled")
            }).catch((e)=>{
                res.status(400).send(e+"Cannot unenroll")
            })
        }else{
            return res.status(404).send("Course already unenrolled")
        }
    }catch(e){
        console.log(e)
        res.send(e)
    }
}


async function purchase(req, res){

    try{
        const courseId = req.body.courseId
        const user = await User.findOne({"_id": req.user._id} ).select({ enrolled_courses: 1 })
        if(user.enrolled_courses.includes(courseId) ){
            return res.status(409).send("Already Enrolled")
        }
        user.enrolled_courses.push(req.body.courseId)

        const grade = new Grade({ studentId: req.user._id , courseId: courseId })
        grade.save().then( ()=>{
            console.log("Grades created....")
        } ).catch((e)=>{
            console.log(e)
        })

        user.save({ validateBeforeSave: false }).then(()=>{
            return res.status(200).send("Successfully enrolled")
        }).catch((e)=>{
            res.status(400).send(e+"Cannot enroll")
        })
    }catch(e){
        console.log(e)
        res.send(e)
    }
}

async function myCourses(req, res){
    try{
        console.log("My courses req coming")
        const user = await User.findById(req.user._id).select({enrolled_courses: 1})
        const enrolled_courses = user.enrolled_courses
        console.log("These are enrolled courses of user", user, enrolled_courses)
        const courses = await Course.find({ '_id': { '$in': enrolled_courses } }).select({ published: 0, modules: 0,createdAt:0, updatedAt:0, __v: 0})
        res.send(courses)

    }catch(e){
        res.send(e)
    }
}

module.exports = {
    getUser,
    register,
    avatar,
    login,
    myCourses,
    update,
    updateByAdmin,
    profilePic,
    purchase,
    unenrollStudent,
    profile,
    deleteUser,
}