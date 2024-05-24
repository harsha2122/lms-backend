const express = require("express")
const mongoose = require("mongoose")

// const uri = "mongodb://127.0.0.1:27017/tg";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s9pzwsh.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`

mongoose.connect(uri).then(()=>{console.log("Database connection successfull")} )
.catch((err) => console.log("No Connections "+err) );
