var express = require("express");
var router = express.Router();

var connection = require("./connectDB");

//it will send the bookings request
router.get("/deletetrip", function(req,res,next){
    connection.query('select * from trips WHERE user_id=?',[],function(err,users){
        if(err){
            res.send(errr)
        }
        res.json(users)
    });

});

router.post("/deletetrip", function(req,res,next){
    var booking = req.body;
    var mobile = booking.mobile;
    var token = booking.token;
    var trip_id = booking.trip_id;

    connection.query('UPDATE trips SET is_delete=? WHERE trip_id=? AND mobile=? AND access_token=?',
        [1,trip_id,mobile,token],function(err,results){
        if (err) {
            res.status(400);
            res.json({
                error: "Bad data!"
            });
        }
            
        res.send({'success':true});

    });

});


module.exports = router;