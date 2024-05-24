const express = require("express")
const gradeController = require("../controllers/grade.controller")
const authMid = require('../middlewares/authenticateMiddleware')
 
const router = express.Router()

router.get("/:id", authMid.authenticateToken, gradeController.getGrades )


module.exports = router 