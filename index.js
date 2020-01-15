var express = require("express");
var bodyParser = require('body-parser')
var hbs = require("hbs");
var multiparty = require("multiparty");
var cloudinary = require('cloudinary').v2;
var session = require('express-session');
var path = require('path')
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var mongoose=require('mongoose');
var Request = require("request");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var passport = require("passport");

var app = express()
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine','hbs')

var signuploginRoutes = require("./routes/signuplogin.route");
var sellerRoutes = require("./routes/sellers.route");



app.use(session({
  secret: "ethnicHub-secret"
}));




mongoose.connect('mongodb+srv://Ethnic:abccba@cluster0-2exsp.mongodb.net/EthinicBazar?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  
});


mongoose.Promise = global.Promise;


app.use(passport.initialize());
app.use(passport.session());


app.use("/", signuploginRoutes)

app.use(function(req, res, next){
    
  if(req.session.seller){
      next(); 
  }
  else{
      res.redirect("/login");
  }
});

app.use("/", sellerRoutes);


app.listen(4500, () => {
  console.log("Listening on port 4500");
});


