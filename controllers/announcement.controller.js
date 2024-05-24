const Announcement = require('../models/anouncement_model')

const mongoose = require("mongoose");

async function createAnnouncement(req, res){
    try{
        console.log("This is request",req)
        console.log("This is Body",req.body)
        const announcement = await new Announcement(req.body)
        announcement.save().then(()=>{
            res.status(201).send("Announcement created..")
        }).catch((e)=>{
            res.status(400).send(e)
        })
    }catch(e){
        res.send(e)
    }
}

async function getAnnouncement(req, res){
    try{
        courseId = req.params.id
        const announcements = await Announcement.find({courseId: courseId }).select({ __v:0})
        res.send(announcements)
    }catch(e){
        res.send(e)
    }
}

async function deleteAnnouncement(req, res){
    try{
        const announcementId = req.params.id
        const announcement = await Announcement.findByIdAndDelete(announcementId)
        // console.log(announcement, announcementId)
        if(announcement){
            res.send("Announcement Deleted")
        }else{
            res.send("Cannot Deleted or no such announcement")
        }
        
    }catch(e){
        res.send(e)
    }
}

module.exports = {
    createAnnouncement,
    getAnnouncement,
    deleteAnnouncement
}
