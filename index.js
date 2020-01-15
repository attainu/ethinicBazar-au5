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
'use strict';

// const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const config = require('./config');
const async = require('async')
const homeroutes = require('./routes/home.route');
const productRoute = require('./routes/product.route')
const apiRoutes = require('./api/api');
const multiparty = require("multiparty");
const cloudinary = require('cloudinary').v2;
const hbs = require('hbs')



//..........................//external helper function //.................................................................//
hbs.registerHelper('eachUnique', function(array, options) {
    
    var  dupCheck = {};
    var buffer = '';

    for( var i=0; i< array.length; i++){

      var entry = array[i];
      var uniqueKey = entry.subcategory 
      
   
      if(!dupCheck[uniqueKey]){
   
      
        dupCheck[uniqueKey] = true;
       
        buffer += options.fn(entry);
      }
    }

    
    return buffer;
  });

hbs.registerHelper('eachUnique1', function(array, options) {
    
    var  dupCheck = {};
    var buffer = '';

    for( var i=0; i< array.length; i++){

      var entry = array[i];
      var uniqueKey = entry.subcategory 
      var uniqueKey1 = entry.url
      var uniqueKey2 = entry.price

      
      console.log(dupCheck[uniqueKey1])
       
   
      if(!dupCheck[uniqueKey] && !dupCheck[uniqueKey1 ] && !dupCheck[uniqueKey2]){
       
        
      
        dupCheck[uniqueKey] = true;
        dupCheck[uniqueKey1] = true;
        dupCheck[uniqueKey2] = true;
       
        buffer += options.fn(entry);
        
      }
    }
    

    
    return buffer;
  });
//............................end helper function.............//

//cloudnary setup for product
cloudinary.config({
    cloud_name: "dlqxpkg7h",
    api_key: "661815952242859",
    api_secret: "zfP44FsPnUFcaXBvRF1TW0xfdlw"
});



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
//used for product
app.use(homeroutes)
app.use(productRoute)
app.use('/api', apiRoutes); 

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


