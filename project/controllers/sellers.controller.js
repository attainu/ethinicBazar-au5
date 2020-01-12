var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require('body-parser')
var cloudinary = require('cloudinary').v2;
var multiparty = require("multiparty");
var ObjectId = require('mongodb').ObjectID;
var Seller = require("../models/sellers.model");
var Product = require("../models/products.model");
var Request = require("request");



exports.getEthnicHub = function(req, res, next) {

    res.render("homepage");

};

exports.getHome = function(req, res, next){

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
                    //   console.log(result);
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
            
        });
    }
};


exports.postLogin = function(req, res,next){
    
    var login = {
        email: req.body.email,
        password: req.body.password
    };

    const RECAPTCHA_SECRET = "6LcpXcUUAAAAABi6OcRsG4mpS3ylTlxk3sQl1ibr";
    var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
    recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
    recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
    recaptcha_url += "remoteip=" + req.connection.remoteAddress;

    Request(recaptcha_url, function(error, resp, body) {
        body = JSON.parse(body);
        if(body.success !== undefined && !body.success) {
            return res.redirect("/login?invalid=true");
        } else
        // res.header("Content-Type", "application/json").send(body);
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

        cloudinary.uploader.upload(files.productImageUrl[0].path, {resource_type: "image"}, function(error, res1) {
            console.log("error", error);
            imageResult = res1;
        

            var product = new Product({
    
                productname: fields.productname[0], 
                price: fields.price[0],
                category: fields.category[0],
                productdetails: fields.productdetails[0],
                material: fields.material[0],
                specifications: fields.specifications[0],
                warranty: fields.warranty[0],
                quantity: fields.quantity[0],
                colors: fields.colors[0],
                productImageUrl: imageResult.secure_url
                
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
    
        productname: req.body.productname, 
        price: req.body.price,
        category: req.body.category,
        productdetails: req.body.productdetails,
        material: req.body.material,
        specifications: req.body.specifications,
        warranty: req.body.warranty,
        quantity: req.body.quantity,
        colors: req.body.colors
        
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

exports.deleteAccount = function(req,res,next) {
    var sellerToDelete = req.params.id;
    console.log("id", sellerToDelete);
    
    Seller.findByIdAndRemove( {_id: sellerToDelete},  function(err, result){
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });       
}

exports.getLogout = function(req,res,next) {
    req.session.destroy();
    res.redirect("/");
}