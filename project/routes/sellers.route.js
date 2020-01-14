var express = require("express");
var mongoose = require("mongoose");

var router = express.Router();

var sellerController = require("../controllers/sellers.controller");

router.get("/dashboard", sellerController.getDashboard);
router.get("/sendEmail", sellerController.sendEmail);
router.get("/verifyEmail", sellerController.verifyEmail);
router.get("/editprofile/:id", sellerController.getEditProfile);
router.get("/editaddress/:id", sellerController.getEditAddress);
router.get("/listings", sellerController.getListings);
router.get("/orders", sellerController.getOrders);
router.get("/additem", sellerController.getAddItem);
router.get("/edititem/:id", sellerController.getEditItem);

router.post("/editprofile", sellerController.postEditProfile);
router.post("/editaddress", sellerController.postEditAddress);
router.post("/additem", sellerController.postAddItem);
router.post("/edititem", sellerController.postEditItem);

router.delete("/deleteitem/:id", sellerController.deleteItem);
router.delete("/deleteaccount/:id", sellerController.deleteAccount);



module.exports = router;

