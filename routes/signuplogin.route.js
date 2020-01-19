var express = require("express");
var mongoose = require("mongoose");

var router = express.Router();

var sellerController = require("../controllers/sellers.controller");

router.get("/sellerhome", sellerController.getsellerHome);
router.get("/signup", sellerController.getSignup);
router.get("/login", sellerController.getLogin);
router.post("/signup", sellerController.postSignup);
router.post("/login", sellerController.postLogin);

router.get("/forgot", sellerController.getForgot);
router.post("/forgot", sellerController.postForgot);
router.get("/reset/:token", sellerController.verify);
router.post("/reset/:token", sellerController.token);
router.get("/logout", sellerController.getLogout);

module.exports = router;