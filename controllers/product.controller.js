const Product = require("../models/products.model");
var express = require("express");
var mongoose = require("mongoose");

const multiparty = require("multiparty");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "rajvijay",
  api_key: "228268787423585",
  api_secret: "8Jjxk0EPNl7jkqqhEe_N_Mmo8AE"
});

<<<<<<< HEAD
var category = (req, res) =>{
   
    Product.find({subCategory: req.params.category}, function(err, items){
        console.log(items)
        if(err){ return next(err); 
        }
        console.log(items._id)
        res.render('category',{
            items:items
        });
=======
var category = (req, res) => {
  Product.find({ subCategory: req.params.category }, function(err, items) {
    console.log(items);
    if (err) {
      return next(err);
    }
    if (!req.session.user) {
      isLoggedIn = false;
    } else {
      isLoggedIn = true;
    }
    console.log(items._id);
    res.render("category", {
      items: items,
      isLoggedIn: isLoggedIn
    });
  });
};
>>>>>>> 24a327d15f6d220089117cb97a498d1b079bdd34

var product = (req, res) => {
  Product.findById(req.params.id, function(err, product) {
    console.log(product);
    if (!req.session.user) {
      isLoggedIn = false;
    } else {
      isLoggedIn = true;
    }
    res.render("single-product.hbs", {
      product: product,
      addedToCart: req.query.addedToCart,
      isLoggedIn: isLoggedIn
    });
    console.log("product is", product);
  });
};

var search = (req, res) => {
  var search = req.query.searchText;

<<<<<<< HEAD
var productcategory = (req,res) =>{
    Product.find({category: req.params.productcategory}, function(err, category){
       console.log(category)
        if(err){ return next(err); 
        }
      
        res.render('productcategory',{
            category:category
        });

    });

}

var product = (req,res) =>{
    Product.findById(req.params.id, function (err, product) {
=======
  var a = new RegExp("^" + search + ".*", "i");
>>>>>>> 24a327d15f6d220089117cb97a498d1b079bdd34

  // var SEARCH = search.toUpperCase()
  Product.find({
    $or: [
      { subcategory: new RegExp(search, "gi") },
      { name: new RegExp(search, "gi") },
      { productdescription1: new RegExp(search, "gi") }
    ]
  })

    .exec()
    .then(docs => {
      console.log(docs);
      return res.render("search-result", {
        category: "Search results -" + search,
        products: docs
        // category: "Result : " + SEARCH,
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        Error: err
      });
    });
};

var productRegister = (req, res) => {};

<<<<<<< HEAD
    // var SEARCH = search.toUpperCase()
    Product.find({
        $or: [{ subCategory: new RegExp(search , "gi") },
        { productName: new RegExp(search, "gi") },
        {productDescription1: new RegExp(search,"gi")}
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
=======
var productCreate = (req, res) => {
  var form = new multiparty.Form({});
>>>>>>> 24a327d15f6d220089117cb97a498d1b079bdd34

  form.parse(req, function(err, fields, files) {
    cloudinary.uploader.upload(
      files.image[0].path,
      { resource_type: "image" },
      function(err, res) {
        var url = res.url;
        let product = new Product({
          name: fields.name[0],
          price: fields.price[0],
          category: new mongoose.Types.ObjectId(),
          productdescription1: fields.productdescription1[0],
          productdescription2: fields.productdescription2[0],
          productdescription3: fields.productdescription3[0],
          warranty: fields.warranty[0],
          quantity: fields.quantity[0],
          AvailableColors: fields.AvailableColors[0],
          subcategory: fields.subcategory[0],
          url: url
        });
        product
          .save()

          .then(result => {
            res.status(200).json({
              docs: [result]
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    );
  });

  res.redirect("/product/register");
};

<<<<<<< HEAD
// var pagination = (req,res)=>{
//     console.log(req.query.search)
//     var pageNo = parseInt(req.query.pageNo)
//     var size = parseInt(req.query.size)
//     var query = {}

//     query.skip = size * (pageNo - 1)
//     query.limit = size

//     Product.find({},{},query,function (err, product) { 
//         if(err) {
//             response = {"error" : true,"message" : "Error fetching data"};
//         } else {
//             res.render('category.hbs',{
//                 products:product  
    
//             })     
//         }
//     })  
// }

module.exports={
    category,
    product,
    search,
    productRegister,
    productCreate,
    productcategory
}
=======
module.exports = {
  category,
  product,
  search,
  productRegister,
  productCreate
};
>>>>>>> 24a327d15f6d220089117cb97a498d1b079bdd34
