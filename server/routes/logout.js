var express = require("express");
var router = express.Router();

var connection = require("./connectDB");

router.get("/logout", function(req,res,next){
    connection.query('select * from users',function(err,users){
        if(err){
            res.send(errr)
        }
        res.json(users)
    });

});

router.post("/logout", function(req,res,next){
    var mobile = req.body.mobile;
    var token = req.body.token;

        connection.query('UPDATE users SET `is_connect`=?,`access_token`=? WHERE mobile=? AND access_token=?',
            [0,null,mobile,token], function(err,results,fields){
                if(err){
                    console.log(err);
                        // res.send({'success':false,'message':'logout failed'});
                }
                if(results.length > 0){
                    res.send({'success':true,'message':'Logout success'});
                }
                else{
                    res.send({'success':false,'message':'logout failed'});
                }
            });
   
});


module.exports = router;