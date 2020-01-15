const express = require('express');
const router = express.Router();
// const Product = require('../models/product')
const homeController = require('../controllers/home.controller')

// const multiparty = require('multiparty')
// const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose')

//home routes 
router.get('/',homeController.homePage)


module.exports = router;