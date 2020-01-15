var express = require("express");
var router = express.Router();
var Address = require("../models/addressModel");
var User = require("./../models/userModel");
var mongoose = require("mongoose");

router.post("/user/:id", (req, res, next) => {
  Address.create(req.body)
    .then(newAddress => {
      User.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { addresses: newAddress } },
        "new: true"
      );
    })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.json(err);
    });
});
module.exports = router;
