const express = require('express')
const authMid = require('../middlewares/authenticateMiddleware')
const labController = require('../controllers/lab.controller')

const router = express.Router()

router.get("/", authMid.authenticateToken, labController.getLab );

router.post("/destroy", authMid.authenticateToken, labController.delLab );



module.exports = router