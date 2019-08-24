var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var index = require("./routes/index");
var bookings = require("./routes/bookings");
var viewtrip = require("./routes/viewtrip");
var loginrider = require("./routes/loginrider");
var logout = require("./routes/logout");
var signup = require("./routes/signup");
var logindriver = require("./routes/logindriver");
var driverLocation = require("./routes/driverLocation");
var drivers = require("./routes/drivers");
var activate = require("./routes/activate");
var forgotpassword = require("./routes/forgotpassword");
var resetpassword = require("./routes/resetpassword");
var completeBook = require("./routes/completeBook");
var alltrip = require("./routes/alltrips");
var historytrip = require("./routes/historytrip");
var trippaid = require("./routes/trippaid");
var paymentHistory = require("./routes/paymentHistory");
var success = require("./routes/payfast");
var user = require("./routes/user");
var deletetrip = require("./routes/deletetrip");
var cancel_url = require("./routes/cancel_url");

var port = 3000;

var app = express();

var socket_io = require("socket.io");

var io = socket_io();

//views

app.set("views",  path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);


//Body parser MW

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


//Routes

app.use("/", index);
app.use("/api", bookings);
app.use("/api", loginrider);
app.use("/api", logout);
app.use("/api", viewtrip);
app.use("/api", signup);
app.use("/api", logindriver);
app.use("/api", driverLocation);
app.use("/api", drivers);
app.use("/api", activate);
app.use("/api", forgotpassword);
app.use("/api", resetpassword);
app.use("/api",completeBook);
app.use('/api',alltrip);
app.use("/api",historytrip)
app.use('/api',trippaid);
app.use("/api",paymentHistory);
app.use("/api",success);
// app.use('/api', require('./routes/success'));
app.use("/api",user);
app.use("/api",deletetrip);
app.use("/api",cancel_url);

//
let taxiSocket = null;
let riderSocket = null;
//send by id
// let socket.broadcast.to(clientid).emit('antwort', "message x y z");
//Sockect io
//chat with socket io and user connected
//socket io server connection
io.on("connection", socket => {
	console.log("a user connected :" +socket.id);
    //chat message 
    // socket.on("chat message",msg=>{
    //     console.log(msg)
        
    //     io.sockets.emit("chat message",msg)
    // })
    
    //request a taxi rider side
    socket.on("taxiRequest", routeResponse => {
        // console.log(routeResponse);
        // riderSocket = socket;
        // console.log("Someone wants a taxi!");
        io.sockets.emit("taxiRequest", routeResponse)
        // if(taxiSocket != null){
        //     taxiSocket.emit("taxiRequest", routeResponse);
        // }
        
    });
    
    //looking for passengers driver side
    socket.on("driverLocation", dataResponse => {
        console.log(" Data send by Driver for his location"+ JSON.stringify(dataResponse));
        // emit driver location
        io.sockets.emit('driverLocation',dataResponse);
        
    });
    
    //Direction driver
    // socket.on("directionsDriver",data => {
    //     console.log("Driver send his coordinate"+data)
    //     // emit driver location
    // //    if (riderSocket !== null) {
    //       riderSocket.emit('directionsDriver',data); 
    // //    }
        
    // })
    
    
    // socket.on("lookingForPassenger",()=> {
    //     console.log("Driver looking for rider")
    //     taxiSocket = socket
        
        
    // })
    // socket.on("disconnect",() => {
    //     delete 
    // })
});

io.listen(app.listen(app.listen(port, function(){
	console.log("Server running on port", port);
	
})));


