var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser')
var cloudinary = require('cloudinary').v2;
var multiparty = require("multiparty");
var ObjectId = require('mongodb').ObjectID;
var Request = require("request");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var passport = require("passport");

var Seller = require("../models/sellers.model");
var Product = require("../models/products.model");

cloudinary.config({
  cloud_name: "rajvijay",
  api_key: "228268787423585",
  api_secret: "8Jjxk0EPNl7jkqqhEe_N_Mmo8AE"
});



exports.getsellerHome = function(req, res, next){

    if(req.session.seller)
        res.redirect("/dashboard");
    else
        res.redirect("/login");

};


exports.getSignup = function(req, res, next){

    res.render("signup", {
        emailAlreadyExists: req.query.emailAlreadyExists
    });
    
};


exports.postSignup = function(req, res, next){
            
    var form = new multiparty.Form({
    
    });

    form.parse(req, function(err, fields, files) {

        cloudinary.uploader.upload(files.profileImageUrl[0].path, {resource_type: "image"}, function(error, res1) {
            console.log("error", error);
            imageResult = res1;
        

            var seller = new Seller({
        
                firstname: fields.firstname[0],
                lastname: fields.lastname[0],
                company: fields.company[0],
                email: fields.email[0],
                mobile:fields.mobile[0],
                password: fields.password[0],
                address: fields.address[0],
                profileImageUrl:imageResult.secure_url
            
            });

            
            Seller.findOne({email:seller.email}, function(err, result){
                if(err) console.log(err);
                if (result){
                    res.redirect("/signup?emailAlreadyExists=true");
                } else {

                    seller
                    .save(seller)
                    .then(function(result) {
                    res.redirect("/login");
                    })
                    .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                    });
                }
            })
        
        
        })
    });    
};


exports.getLogin = function(req, res,next){

    if(req.session.seller)
        res.redirect("/dashboard");
    else {
        res.render("login", {
            invalid: req.query.invalid,
            captchaNotTicked: req.query.captchaNotTicked
            
        });
    }
};

exports.getForgot = function(req, res,next){
    res.render("forgot", {});
}

exports.postForgot = function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            Seller.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    return res.render('forgot', {
                        flag: false,
                    });;
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                user.save(function (err) {
                    console.log(user)
                    done(err, token, user);
                
                });
            });
        },
        function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'raj.vijay.ece@gmail.com',
                    pass: 'sknagar2018'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'raj.vijay.ece@gmail.com',
                subject: 'Ecommerce Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                console.log('mail sent');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        return res.render('forgot', {
            flag: true
        });
    });
};

exports.verify = function (req, res) {
    console.log(req.params.token)
    Seller.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            return res.redirect('/forgot');
        }
        res.render('reset', { token: req.params.token });
    });
};

exports.token = function (req, res) {
    console.log("reached")
    async.waterfall([
        function (done) {
            Seller.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    return res.redirect('back');
                }
                if (req.body.password === req.body.confirm) {
                    user.password = req.body.password
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(function (err) {
                        req.logIn(user, function (err) {
                            done(err, user);
                        });
                    });
                } else {
                    return res.redirect('back');
                }
            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'raj.vijay.ece@gmail.com',
                    pass: 'sknagar2018'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'learntocodeinfo@mail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/login');
    });
};


exports.postLogin = function(req, res,next){
    
    var login = {
        email: req.body.email,
        password: req.body.password
    };

    const RECAPTCHA_SECRET = "6Lfi1NEUAAAAAKIuILSqZxpAdsfP2LwWVmiS374q";
    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;

    Request(recaptcha_url, function(error, resp, body) {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
            return res.redirect("/login?captchaNotTicked=true");
        } else
        
        Seller.findOne(login,function(err,result){
            if(err || !result ) {
                 res.redirect("/login?invalid=true");
                        
            }
            else{
                req.session.seller = result;
                res.redirect("/dashboard");
            }
    
        })
    
    });

}



exports.getDashboard = function(req, res,next){
    
    var email = req.session.seller.email
    
    Seller.findOne({email},function(err, results){
        // console.log("results: ", results);
        res.render("dashboard", {
            results: results
        });
    })
}


var rand, mailOptions, host, link;
exports.sendEmail = function(req, res) {

  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "raj.vijay.ece@gmail.com",
      pass: "sknagar2018"
    }
  });

  rand = Math.floor(Math.random() * 100 + 54);
  host = req.get("host");
  link = "http://" + req.get("host") + "/verifyEmail?id=" + rand;

  mailOptions = {
    to: req.session.seller.email,
    subject: "Please confirm your Email account",
    html:
      "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
      link +
      ">Click here to verify</a>"
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      Seller.findOneAndUpdate(
        { email: req.session.seller.email },
        { $set: { emailvalidate: undefined } },
        { new: true },
        (err, doc) => {
          if (err) {
            console.log("Something wrong when updating data!");
          }
          console.log(doc);
        }
      );
      console.log("Message sent: " + response.message);
      res.render("emailsend");
    }
  });
};


exports.verifyEmail = function(req, res) {
  console.log(req.protocol + ":/" + req.get("host"));
  if (req.protocol + "://" + req.get("host") == "http://" + host) {
    console.log("Domain is matched. Information is from Authentic email");
    if (req.query.id == rand) {
      console.log("email is verified");
      res.redirect("/login");
    } else {
      console.log("email is not verified");
      res.end("<h1>Bad Request</h1>");
    }
  } else {
    res.end("<h1>Request is from unknown source");
  }
};


exports.getListings = function(req,res,next) {  
    var email = req.session.seller.email
    Seller.find({email})
        .populate("product")
        .then(results=> {
            res.render("listings",{
                results:results
            })
        })
        .catch(err => {
        res.send(err);
        });       
}
  
exports.getOrders = function(req,res) {

    res.render("orders")
  
} 
  
exports.getAddItem = function(req,res,next) {

    res.render("additem" , {
        productAdded: req.query.productAdded
    })
  
}


exports.getEditItem = function(req,res,next) {

    Product.findOne( {_id: req.params.id}, function(err, result){
        
        console.log("result: ", result);
        res.render("edititem", {
            data: result
        });
    })
    
};
  
exports.getEditProfile = function(req,res,next) {

    Seller.findOne({_id: req.params.id}, function(err, result){
        console.log("id: ", req.params.id);
        // console.log("result: ", result);
        res.render("editprofile", {
            data: result
        });
    })
    
};

exports.getEditAddress = function(req,res,next) {
    
    Seller.findOne({_id: req.params.id}, function(err, result){
        res.render("editaddress", {
            data: result
        });
    })
    
};

var flag;

exports.postAddItem =  function(req,res,next) {

    var form = new multiparty.Form({
            
    });

    form.parse(req, function(err, fields, files) {

        cloudinary.uploader.upload(files.productImage[0].path, {resource_type: "image"}, function(error, res1) {
            console.log("error", error);
            imageResult = res1;
        

            var product = new Product({
    
                productName: fields.productName[0], 
                productPrice: fields.productPrice[0],
                category: fields.category[0],
                subCategory: fields.subCategory[0],
                productDescription1: fields.productDescription1[0],
                productDescription2: fields.productDescription2[0],
                productDescription3: fields.productDescription3[0],
                productWarranty: fields.productWarranty[0],
                availableUnits: fields.availableUnits[0],
                availableColors: fields.availableColors[0],
                productImage: imageResult.secure_url
                
            });
        
        
                product
                    .save()
                    .then(result => {
                        Seller.updateOne(
                            { email: req.session.seller.email },
                            { $push: { product: result._id } },
                            { multi: true, new: true },
                            function(err, user) {
                            if (err) {
                                console.log(err);
                            }
                            // console.log(user);
                            }
                        );
                        res.redirect("/additem?productAdded=true")
                        })
                    .catch(err => {
                        return res.status(500).json({
                            flag: false
                        });
                    });
          
        
        
        })
    });

}

exports.postEditItem = function(req,res,next) {
    // if(req.session.user) {
    var postId = req.body.id;
    console.log("postid: ", postId);

    var data = {
    
        productName: req.body.productName, 
        productPrice: req.body.productPrice,
        category: req.body.category,
        subCategory: req.body.subCategory,
        productDescription1: req.body.productDescription1,
        productDescription2: req.body.productDescription2,
        productDescription3: req.body.productDescription3,
        productWarranty: req.body.productWarranty,
        availableUnits: req.body.availableUnits,
        availableColors: req.body.availableColors,
   
        
    };


    Product.findOneAndUpdate( {_id:postId}, {$set: data },{new:true}, function(err, result){
        
        res.redirect("/listings");
    })

};

exports.postEditProfile = function(req,res,next) {
    // if(req.session.user) {
    var postId = req.body.id;
    console.log("postid: ", postId);

    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        company: req.body.company,
        mobile: req.body.mobile,
        password: req.body.password
    }
            
    Seller.findOneAndUpdate( {_id:postId}, {$set: data },{new:true}, function(err, result){
        // console.log("result: ", result);
        res.redirect("/dashboard");
    })

};

exports.postEditAddress = function(req,res,next) {
    var postId = req.body.id;
    console.log("postid: ", postId);

    var data = {
        address: req.body.address,       
    }
    Seller.findOneAndUpdate( {_id:postId}, {$set: data },{new:true}, function(err, result){
        res.redirect("/dashboard");
    })   
};



exports.deleteItem = function(req,res,next) {
    var productToDelete = req.params.id;
    console.log("id", productToDelete);
    
    Product.findByIdAndRemove( productToDelete , function(err, result){
        Seller.updateOne(
            { email: req.session.seller.email },
            { $pull: { product: productToDelete } },
            { multi: true, new: true },
            function(err, user) {
                if (err) {
                    console.log(err);
                }
                // console.log(user);
                res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
            }
        );
       
    })
       
       
}

exports.getLogout = function(req,res,next) {
    req.session.destroy();
    res.redirect("/login");
}

exports.deleteAccount = function(req,res,next) {
    var sellerToDelete = req.params.id;
    console.log("id", sellerToDelete);
    
    Seller.findByIdAndRemove( {_id: sellerToDelete},  function(err, result){
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
       
    });       
}
