const Product = require('../models/product')
var express = require("express");
var mongoose = require("mongoose");

const multiparty = require('multiparty')
const cloudinary = require('cloudinary').v2;


var category = (req, res) =>{
    Product.find({subcategory: req.params.category}, function(err, items){
        console.log(items)
        if(err){ return next(err); 
        }
        console.log(items._id)
        res.render('category',{
            items:items
        });

    });

}

var product = (req,res) =>{
    Product.findById(req.params.id, function (err, product) {

        console.log(product)
        res.render('single-product.hbs',{
            product:product
        })
        console.log("product is",product)
    })
}

var search = (req,res) =>{
    
    var search = req.query.searchText;
  
    var a = new RegExp('^' + search + '.*', "i")
  

    // var SEARCH = search.toUpperCase()
    Product.find({
        $or: [{ subcategory: new RegExp(search , "gi") },
        { name: new RegExp(search, "gi") },
        {productdescription1: new RegExp(search,"gi")}
        ]
         })
         
        .exec()
        .then(docs => {
            console.log(docs)
            return res.render('search-result', {
                category:"Search results -"+search,
                products: docs,
                // category: "Result : " + SEARCH,
               
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                Error: err
            })
        })
}

var productRegister = (req,res)=>{

}

var productCreate = (req,res)=>{
    var form = new multiparty.Form({    
    });
   
    form.parse(req, function(err, fields, files) { 
        cloudinary.uploader.upload(files.image[0].path, {resource_type: "image"}, function(err,res){
            var url = res.url
            let product = new Product(
                {
                    name: fields.name[0],
                    price: fields.price[0],
                    category: new mongoose.Types.ObjectId(),
                    productdescription1: fields.productdescription1[0],
                    productdescription2: fields.productdescription2[0],
                    productdescription3: fields.productdescription3[0],
                    warranty: fields.warranty[0],
                    quantity: fields.quantity[0],
                    AvailableColors: fields.AvailableColors[0],
                    subcategory:fields.subcategory[0],
                    url:url,
                }
            )     
            product.save()
           
            .then(result => {
                res.status(200).json({
                    docs:[result]
                });
            })
            .catch(err => {
                console.log(err);
            });   
        }     
        );  
    })
    
    res.redirect('/product/register')
}

module.exports={
    category,
    product,
    search,
    productRegister,
    productCreate
}