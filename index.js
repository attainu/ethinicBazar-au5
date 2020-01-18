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


const homeroutes = require('./routes/home.route');
const productRoute = require('./routes/product.route')
const apiRoutes = require('./api/api');
var userRoutes = require("./routes/user");

var User = require("./models/userModel");
var Product = require("./models/products.model");
'use strict';


const config = require('./config');
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;





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
      var uniqueKey = entry.subCategory 
      var uniqueKey1 = entry.productImage
      var uniqueKey2 = entry.productPrice

      
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




app.use(session({
  secret: "ethnicHub-secret"
}));




mongoose.connect('mongodb+srv://Ethnic:abccba@cluster0-2exsp.mongodb.net/EthinicBazar?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  
});


mongoose.Promise = global.Promise;


app.use(passport.initialize());
app.use(passport.session());

app.use("/",homeroutes)
app.use("/",productRoute)
app.use('/api', apiRoutes); 

app.use("/", signuploginRoutes)
//used for product



var authMiddleware = function(req, res, next) {
  if (!req.session.user) {
    res.redirect("/userLogin?shouldLogin=true");
  } else {
    next();
  }
};

app.use("/user", userRoutes);
app.get("/userSignup", function(req, res) {
  res.render("userSignup.hbs");
});
app.get("/userLogin", function(req, res) {
  var mismatch = req.query.mismatch;
  var shouldLogin = req.query.shouldLogin;
  res.render("userLogin.hbs", {
    mismatch: mismatch,
    shouldLogin: shouldLogin
  });
});
app.post("/userLogin", function(req, res, next) {
  console.log(req.body);
  User.findOne({ userEmail: req.body.userEmail })
    .populate("userAddresses")
    .populate("cart")
    .populate("orderHistory")
    .exec()
    .then(result => {
      if (req.body.userPassword !== result.userPassword){
        res.redirect("/userLogin?mismatch=true");
      } else {
        req.session.user = result;
        console.log("session data after login: ", req.session.user);
        res.status(200).redirect("/user");
      }
    })
    .catch(err => {
      console.log(err);
      res.redirect("/userLogin?mismatch=true");
    });
});

app.get("/userLogout", (req, res) => {
  req.session.destroy();
  res.redirect("/userLogin");
});

app.use(function(req, res, next){
    
  if(req.session.seller){
      next(); 
  }
  else{
      res.redirect("/login");
  }
});


app.use("/", sellerRoutes);


app.post("/user", (req, res, next) => {
  console.log(req.body);
  var user = new User({
    _id: mongoose.Types.ObjectId(),
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
    userMobile: req.body.userMobile
  });
  user
    .save()
    .then(result => {
      console.log(result);
      req.session.user = result;
      res.redirect("/user");
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
// app.use("/buyer", authMiddleware, buyerRoutes);
// app.use("/seller", authMiddleware, sellerRoutes);


app.post("/delete", (req, res) => {
  console.log(req.body);
  User.findByIdAndDelete({ _id: req.body.id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).redirect("/userSignup");
    })
    .catch(err => {
      console.log("err");
      res.status(500).json(err);
    });
});

app.get("/product", (req, res) => {
  res.render("product");
});
app.post("/product", (req, res) => {
  Product.create(req.body)
    .then(product => {
      res.send(product);
    })
    .catch(err => {
      res.send(err);
    });
});
app.get("/productList", async (req, res) => {
  var products = await Product.find();
  res.render("productList", {
    products: products
  });
});
app.get("/home", (req, res) => {
  res.render("index");
});
app.get("*", function(req, res) {
  res.render("notFound");
});
app.post("/user/image", async (req, res) => {
  var form = new multiparty.Form();
  await form.parse(req, function(err, fields, files) {
    console.log("pic path: ", files.file[0].path);
    cloudinary.uploader.upload(
      files.file[0].path,
      { resource_type: "image" },
      async function(err, result) {
        if (err) {
          console.log("error message: ", err);
        } else {
          var updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            {
              $set: { userImage: result.secure_url }
            },
            { new: true }
          )
            .populate("orderHistory")
            .populate("addresses")
            .populate("cart");
          req.session.user = updatedUser;
          res.redirect("/user");
        }
      }
    );
  });
});



const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});


const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

// app.use(
//   session({
//     secret: "kdjfwjef wefhkwjef wkej fhwkejf",
//     cookie: {
//       maxAge: 1000 * 500,
//       path: "/",
//       httpOnly: true
//     }
//   })
// );
// var buyerRoutes = require("./routes/buyer");
// var sellerRoutes = require("./routes/seller");




