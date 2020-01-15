// var express = require("express");
// var router = express.Router();
// var Buyer = require("../models/buyerModel");
// var mongoose = require("mongoose");

// router.get("/", (req, res, next) => {
//   Buyer.find()
//     .exec()
//     .then(result => {
//       console.log(result);
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       console.log("Error: ", err);
//       res.status(5000).json({
//         error: err
//       });
//     });
// });
// router.get("/:buyerId", (req, res, next) => {
//   var _id = req.params.buyerId;
//   Buyer.findById(_id)
//     .exec()
//     .then(doc => {
//       console.log(doc);
//       if (doc) {
//         res.status(200).json({
//           data: doc
//         });
//       } else {
//         res.status(404).json({
//           message: "Data not found"
//         });
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// router.post("/", (req, res, next) => {
//   var buyer = new Buyer({
//     _id: mongoose.Types.ObjectId(),
//     buyerName: req.body.buyerName,
//     email: req.body.email,
//     password: req.body.password,
//     mobile: req.body.mobile,
//     address: req.body.address
//   });
//   buyer
//     .save()
//     .then(result => {
//       console.log(result);
//       res.status(201).json({
//         savedData: result
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// router.delete("/:buyerId", (req, res, next) => {
//   Buyer.remove({ _id: req.params.buyerId })
//     .exec()
//     .then(response => {
//       console.log(response);
//       res.status(200).json({ result: response });
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     });
// });

// router.put("/:buyerId", (req, res, next) => {
//   Buyer.findOneAndUpdate({ _id: req.params.buyerId }, req.body)
//     .exec()
//     .then(result => {
//       console.log(result);
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       console.log("error: ", err);
//       res.status(404).json({ error: err });
//     });
// });

// module.exports = router;
