
//for search
var Product = require('../models/product.model');
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

module.exports = router;