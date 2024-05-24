const express = require('express')
const assignmentController = require("../controllers/assignment.controller")
const assSolController = require("../controllers/assignSol.controller")
const authMid = require('../middlewares/authenticateMiddleware')
const middle = require('../middlewares/uploadMiddleware')

const router = express.Router()

router.post("/", middle.assignment.single('File') , assignmentController.createAssignment )

router.post("/submit", middle.studentAssignment.single('File') , assSolController.submit )

// router.post("/submit", middle.studentAssignment.single('File') ,   )  this is for solution submit

router.get("/:id", assignmentController.getAssignment )

router.get("/file/:id/:token", assignmentController.getFile )



router.delete("/:id", assignmentController.deleteAssignment )

module.exports = router