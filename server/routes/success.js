const express = require("express")
const { success } = require("..controllers/PaymentController")
const router = express.Router()

router.get('success/:trip_id/:user_id', success)

module.exports = router