const express = require('express')
const announcementController = require("../controllers/announcement.controller")
const authMid = require('../middlewares/authenticateMiddleware')

const router = express.Router()

router.post('/', announcementController.createAnnouncement )

router.get('/:id', announcementController.getAnnouncement )

router.delete('/:id', announcementController.deleteAnnouncement )



module.exports =  router