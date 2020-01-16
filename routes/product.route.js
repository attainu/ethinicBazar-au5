const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller')


router.get('/category/:category',productController.category)
router.get('/product/:id',productController.product)
router.get('/search',productController.search)
router.get('/product/register',productController.productRegister)
router.post('/product/create',productController.productCreate)


module.exports = router;