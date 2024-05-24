const Discussion = require('../models/discussion_model')

async function addMessage(courseId){
    const discussion = new Discussion({course_id: courseId})
    discussion.save().then(()=>{
        res.status(201).send(user)
    }).catch((e)=>{
        res.send(e);
    })
}

module.exports = {
    addMessage
}