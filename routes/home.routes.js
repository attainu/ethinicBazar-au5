const express = require('express');
const router = express.Router();
const Test = require('../models/test');
const Product = require('../models/product')

const multiparty = require('multiparty')
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose')


router.get('/search', (req, res) => {
    console.log("data is ",req.query.searchText)
    var search = req.query.searchText;
    console.log(search)
    var a = new RegExp('^' + search + '.*', "i")
    console.log(a)

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
})

router.get('/:category', function(req, res, next){
    Product.find({subcategory: req.params.category}, function(err, items){
        console.log(items)
        if(err){ return next(err); 
        }
        console.log(items._id)
        res.render('category',{
            items:items
        });

    });
});


router.get('/register',function(req,res){
    res.render('product_register')
})


router.get('/',function(req,res){
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

})



//product create for testing........
router.post('/create',function(req,res){
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
    
    res.redirect('/register')

})





//show products at home 



router.get('/product/:id',function(req,res){

    Product.findById(req.params.id, function (err, product) {

        console.log(product)
        res.render('single-product.hbs',{
            product:product
        })
        console.log("product is",product)
    })
})




// //mapping
// Product.createMapping(function(err, mapping){
// 	if (err) {
// 		console.log("error creating mapping");
// 		console.log(err);
// 	} else {
// 		console.log("Mapping created");
// 		console.log(mapping);
// 	}
// })

// var stream = Product.synchronize();
// var count = 0;

// stream.on('data', function(){
// 	count++;
// });

// stream.on('close', function(){
// 	console.log("Indexed "+ count + " documents");
// });





module.exports = router;