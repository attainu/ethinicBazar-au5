var express = require("express");
var router = express.Router();
var User = require("../models/userModel");
var Address = require("../models/addressModel");
var userController = require("../controllers/userController");
var mongoose = require("mongoose");

var authMiddleware = function(req, res, next) {
  if (!req.session.user) {
    res.redirect("/userLogin?shouldLogin=true");
  } else {
    next();
  }
};

router.get("/", authMiddleware, userController.userDashboard);
// router.post("/", userController.newUser);

router.post("/edit", authMiddleware, userController.editUser);
router.get("/edit", authMiddleware, userController.editUserForm);

router.post("/address", authMiddleware, userController.createAddress);
router.get("/address", authMiddleware, userController.createAddressForm);
router.post("/address/:id", authMiddleware, userController.deleteAddress);

router.get("/cart", authMiddleware, userController.cartPage);
router.post("/cart", authMiddleware, userController.addItemsToCart);
router.post("/cart/:id", authMiddleware, userController.deleteCartItem);

router.get("/orderHistory", authMiddleware, userController.orderHistoryPage);
router.post(
  "/orderHistory",
  authMiddleware,
  userController.itemAddedToOrderHistory
);

module.exports = router;
