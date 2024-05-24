const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Course = require("./course_model")
const Roles = require("../constants/userroles")
const uniqueValidator = require('mongoose-unique-validator');
const Grade = require("./grades_model")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User must have a name" ],
        minlength:4
    },

    avatar: String,

    lab_id: String,
    
    email: {
        type: String,
        required: [true, "Email must be present"],
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },

    phone: {
        type: Number,
        minlength: 10,
        maxlength: 10,
        unique: true,
        required: [true, "Phone number must be present" ],
    },

    address: {
        type: String
    },

    password: {
        type: String,
        required: [true, "Please give password" ],
        validate:{
                validator: (value)=>{
                re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
                return re.test(value)
            },
        }
    },

    confirm_password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: Roles.Student,
    },

    enrolled_courses: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Course",
        
    }],

    tokens: [{
        token: {
            type: String,
            // required: true
        }
    }]

}, {timestamps: true})

userSchema.plugin(uniqueValidator)

userSchema.methods.generateAuthToken = async function(next){

    try{
        const token = jwt.sign({_id: this._id.toString(), role: this.role, enrolled_courses: this.enrolled_courses}, process.env.SECRET_KEY, {expiresIn: '1d'} );
        // this.tokens = this.tokens.concat({token: token});
        // await this.save();
        return token;
    }catch(err){

        console.log("The Error part "+err);
        response.send("The Error part "+err);
    }
    next();
}

userSchema.pre("save", async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confirm_password = this.password;
    }

    next();
})


const User = new mongoose.model("user",userSchema);

module.exports = User