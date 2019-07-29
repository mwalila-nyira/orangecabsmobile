var express = require("express");
var router = express.Router();

const connection = require("./connectDB");
//it will send the bookings request
router.get("/user/:mobile/:token", function(req,res,next){
    let userData = {};
    const mobile = req.params.mobile;
    const token = req.params.token;
    connection.query('select * from users WHERE mobile=? AND access_token=?',[mobile,token],function(err,users){
        if(err){
            res.send(errr)
        }
        if (users.length > 0) {
            userData = users
        }
        res.send({'success':true,'userData':userData});
    });

});

module.exports = router;