const Product = require('../models/products.model')
var express = require("express");
var mongoose = require("mongoose");
var multiparty = require("multiparty");
const cloudinary = require('cloudinary').v2;

// cloudinary.config({
//     cloud_name: "dlqxpkg7h",
//     api_key: "661815952242859",
//     api_secret: "zfP44FsPnUFcaXBvRF1TW0xfdlw"
// });

cloudinary.config({
    cloud_name: "rajvijay",
    api_key: "228268787423585",
    api_secret: "8Jjxk0EPNl7jkqqhEe_N_Mmo8AE"
  });

var homePage = (req, res) => {
    Product.find({})
    .exec()
    .then(products => {
        
        res.render('index',{
        
            products:products
        });
        console.log(products)
    })
    
    .catch(err => {
        console.log(err)
    });
};


module.exports={
    homePage
}