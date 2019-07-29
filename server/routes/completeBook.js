var express = require("express");
var router = express.Router();
// var nodemailer = require("nodemailer");

var connection = require("./connectDB");

//it will send the bookings request
router.get("/completeBook", function(req,res,next){
    connection.query('select * from trips WHERE user_id=?',[],function(err,users){
        if(err){
            res.send(errr)
        }
        res.json(users)
    });

});

router.post("/completeBook", function(req,res,next){
    
    var booking = req.body;
    var mobile = booking.mobile;
    var token = booking.token;
    var pickuplocation = booking.pickup;
    var amountofrider = booking.amountofrider;
    var nameofrider = booking.nameofrider;
    var datePicker = booking.datePicker;
    var price = booking.price;
    var dropoff = booking.dropoff;
    var pickuplatitude = booking.pickuplatitude;
    var pickuplongitude = booking.pickuplongitude;
    var dropofflatitude = booking.dropofflatitude;
    var dropofflongitude = booking.dropofflongitude;
    var status = booking.status;
    var distance = booking.distance +" Km";
    var duration = booking.duration;
    var id_user ="";
    
    connection.query('SELECT user_id FROM users WHERE mobile=? AND access_token=?',[mobile,token],function(err,results,fields)
    {
        if (err) {
            res.status(400);
            res.json({
                error: "Bad data!"
            });
        }
        if(results.length > 0){
            id_user = results[0].user_id;
                 //Insert into the data base
            connection.query('INSERT INTO trips SET user_id=?, departure=?, departureLatitude=?, departureLongitude=?, destination=?, destinationLatitude=?, destinationLongitude=?,distance=?, duration=?, amountofriders=?, nameofonerider=?, price=?, mobile=?, status_pay=?, date=?,access_token=?',
            [
                id_user,
                pickuplocation,
                pickuplatitude,
                pickuplongitude,
                dropoff,
                dropofflatitude,
                dropofflongitude,
                distance,
                duration,
                amountofrider,
                nameofrider,
                price,
                mobile,
                status,
                datePicker,
                token
            ],function(error,results,fields){
            if(error){
                console.log(error);
                res.send({'success':false,'message':'could not connect to the database'});
            }
            if(results.affectedRows > 0){
                res.send({'success':true,'results':results});
                
            //     let transporter = nodemailer.createTransport({
            //         host: "smtp.gmail.com",
            //         port: 465,
            //         secure: true, // true for 465, false for other ports
            //         auth: {
            //         user: mwalilanyira@gmail.com, // generated ethereal user
            //         pass: demwantambo89 // generated ethereal password
            //         }
            //     });

            //     // send mail with defined transport object
            //     let info = await transporter.sendMail({
            //         from: '"Fred Foo 👻" <foo@example.com>', // sender address
            //         // to: "bar@example.com, baz@example.com", // list of receivers
            //         to: "mwalilanyira@gmail.com"
            //         subject: "Orangecabs request riders from mobile  App", // Subject line
            //         text: "Has added a new trip to his list", // plain text body
            //         html: "<b>Hello world?</b>" // html body
            //     });

            // console.log("Message sent: %s", info.messageId);
            // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            }
            }); 
        }

    });

});


module.exports = router;