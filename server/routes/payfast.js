var express = require("express");
var router = express.Router();

var connection = require("./connectDB");

//it will send the bookings request

router.get("/success/:trip_id/:user_id", (req,res,next)=>{
    const tripId = req.params.trip_id;
    const userId = req.params.user_id;
    let userData;
    
    connection.query('select * from trips WHERE trip_id=? AND user_id=?',[tripId, userId],(err,user)=>{
        if(err){
            res.send(err)
        }
        if(user.length > 0){
            userData = user[0]
        }
        let status = false;
        if(userData.status_pay === 'unpaid'){
            connection.query(`UPDATE trips SET status_pay='paid' WHERE trip_id=? AND user_id=?`, [tripId, userId], (err, res)=>{
               if(err) throw err;
               if(res.length > 0){
                  status = true 
               }
            })
            res.json(status)
        }
        
    });
});
router.post('/update-pay-status', (req, res)=>{
    console.log(req.user_id)
})
module.exports = router;
