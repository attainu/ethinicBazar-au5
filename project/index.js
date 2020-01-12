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

var app = express()
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine','hbs')

cloudinary.config({
  cloud_name: "rajvijay",
  api_key: "228268787423585",
  api_secret: "8Jjxk0EPNl7jkqqhEe_N_Mmo8AE"
});


app.use(session({
  secret: "ethnicHub-secret"
}));

var signuploginRoutes = require("./routes/signuplogin.route");
var sellerRoutes = require("./routes/sellers.route");


mongoose.connect("mongodb://localhost:27017/mongoose", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


mongoose.Promise = global.Promise;


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