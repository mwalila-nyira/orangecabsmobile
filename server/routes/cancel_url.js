var express = require("express");
var router = express.Router();

var connection = require("./connectDB");

//it will send the bookings request
router.get("/cancel_url/:trip_id/:user_id", function(req,res,next){
    let paymentStatus = false;
    const tripId = req.params.trip_id;
    const userId = req.params.user_id
    connection.query('select * from trips WHERE trip_id=? AND user_id=?',[tripId, userId],function(err,users){
        if(err){
            res.send(err)
        }
        if(users.length > 0){
            paymentStatus = true
        }
        res.send(`<div style="justify-content:center; width:auto; height:auto; display:flex; align-items:center; overflow:hidden; font-size:20px"><h2>Your payment was cancelled!</h2></div>`)
    });
});


module.exports = router;