var express = require("express");
var mongoose = require("mongoose");

var router = express.Router();

var sellerController = require("../controllers/sellers.controller");

router.get("/ethnichub", sellerController.getEthnicHub);
router.get("/", sellerController.getHome);
router.get("/signup", sellerController.getSignup);
router.get("/login", sellerController.getLogin);
router.post("/signup", sellerController.postSignup);
router.post("/login", sellerController.postLogin);
router.get("/logout", sellerController.getLogout);

module.exports = router;