var express = require("express");
var mongoose = require("mongoose");

var Seller = require("./../models/sellerModel");
var router = express.Router();

router.get("/", (req, res, next) => {
  Seller.find()
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.get("/:sellerId", (req, res, next) => {
  Seller.find({ _id: req.params.sellerId })
    .exec()
    .then(result => {
      console.log(result);
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Data not found" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res, next) => {
  var seller = new Seller({
    _id: mongoose.Types.ObjectId(),
    sellerName: req.body.sellerName,
    companyName: req.body.companyName,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    address: req.body.address,
    uploadImageUrl: req.body.uploadImageUrl
  });
  seller
    .save(seller)
    .then(result => {
      console.log(result);
      res.status(200).json({ result: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:productId", (req, res, next) => {
  Seller.remove({ _id: req.params.productId })
    .exec()
    .then(response => {
      console.log(response);
      res.status(200).json({ result: response });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.put("/:productId", (req, res, next) => {
  Seller.update({ _id: req.params.productId }, req.body)
    .exec()
    .then(response => {
      console.log(response);
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
