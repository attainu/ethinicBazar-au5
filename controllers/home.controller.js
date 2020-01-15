const Product = require('../models/product')
var express = require("express");
var mongoose = require("mongoose");

var homePage = (req, res) => {
    Product.find({})
    .exec()
    .then(products => {
        
        res.render('index',{
            products:products
        });
    })
    .catch(err => {
        console.log(err)
    });
};


module.exports={
    homePage
}