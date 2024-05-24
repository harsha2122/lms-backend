const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require("../models/user_model")

async function authenticateToken(req, res, next){

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[0]
    if(token == null) return res.status(401).send("Not Authorized")
    jwt.verify(token, process.env.SECRET_KEY,(err, user)=>{
        console.log('Our user', user)
        if(err) return res.status(401).send("Cannot verify")
        req.user = user
        User.findById(user._id, (err, docs)=>{
            if(docs){

                req.user.enrolled_courses = docs.enrolled_courses
            }
        } ).select({enrolled_courses: 1})
        next()
    } ) 
}

async function authenticateTokenByParams(req, res, next){

    const token = req.params.token
    if(token == null) return res.status(401).send("Not Authorized")
    jwt.verify(token, process.env.SECRET_KEY,(err, user)=>{
        console.log('Our user',user)
        if(err) return res.status(401).send("Cannot verify")
        req.user = user
        User.findById(user._id, (err, docs)=>{
            console.log(docs)
            if(docs){
                req.user.enrolled_courses = docs.enrolled_courses
            }
        } )
        next()
    } ) 
}

function authenticateConnection(token){

    if(token == null) return null
    jwt.verify(token, process.env.SECRET_KEY,(err, user)=>{
        if(err) return null
        return user
    }) 
}

module.exports ={ 
    authenticateToken,
    authenticateTokenByParams,
    authenticateConnection
}