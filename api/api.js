
//for search
const Product = require('../models/product')
var router = require('express').Router();
router.post('/search', function(req, res, next){
    console.log(req.body.search_term)
	console.log(req.body.search_term)
	Product.search({
		query_string: { query: req.body.search_term }
	}, function(err,results){
        if (err) return next(err);
        console.log(results)
		res.json(results);
	}); 
});

//auto suggest


//for testing......
router.get('/search_category', function(req, res) {
    var regex = new RegExp(req.query["term"], 'i');
    var query = Product.find({subcategory: regex}, { 'subcategory': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);
        
       
   query.exec(function(err, users) {
       if (!err) {
         
          var result = buildResultSet(users);
          res.send(result, {
             'Content-Type': 'application/json'
          }, 200);
       } else {
          res.send(JSON.stringify(err), {
             'Content-Type': 'application/json'
          }, 404);
       }
    });
})


router.get('/category',function(req,res){

    Product.find(function(err,result){
        res.json(result)
    })
})


module.exports = router;