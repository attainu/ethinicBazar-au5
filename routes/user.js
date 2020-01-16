var express = require("express");
var router = express.Router();
var User = require("../models/userModel");
var Address = require("../models/addressModel");
var userController = require("../controllers/userController");
var mongoose = require("mongoose");

router.get("/", userController.userDashboard);

router.post("/edit", userController.editUser);
router.get("/edit", userController.editUserForm);

router.post("/address", userController.createAddress);
router.get("/address", userController.createAddressForm);
router.post("/address/:id", userController.deleteAddress);

router.get("/cart", userController.cartPage);
router.post("/cart", userController.addItemsToCart);
router.post("/cart/:id", userController.deleteCartItem);

router.get("/orderHistory", userController.orderHistoryPage);
router.post("/orderHistory", userController.itemAddedToOrderHistory);

module.exports = router;
