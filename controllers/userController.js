var express = require("express");
var mongoose = require("mongoose");
var User = require("../models/userModel");
var Address = require("../models/addressModel");
var cloudinary = require("cloudinary").v2;
var multipary = require("multiparty");

cloudinary.config({
  cloud_name: "dgq5a8zjh",
  api_key: "641339485594975",
  api_secret: "AUiaAT0cigGwmevOurEe5xX70ZQ"
});

var userDashboard = (req, res, next) => {
  res.render("profile", req.session.user);
};

var editUser = async (req, res, next) => {
  var updatedUser = await User.findByIdAndUpdate(
    { _id: req.session.user._id },
    { $set: req.body },
    { new: true }
  )
    .populate("cart")
    .populate("orderHistory")
    .populate("userAddresses");

  req.session.user = updatedUser;
  res.redirect("/user");
};

var editUserForm = (req, res, next) => {
  res.render("edit", req.session.user);
};

var createAddress = async function(req, res) {
  var newAddr = await Address.create(req.body);
  var updatedUser = await User.findByIdAndUpdate(
    { _id: req.session.user._id },
    { $push: { userAddresses: newAddr._id } },
    { new: true }
  ).populate("userAddresses");
  // var populatedUser = await updatedUser.populate("addresses");
  req.session.user = updatedUser;
  console.log("session data: ", req.session.user);
  res.redirect("/user");
};

var createAddressForm = (req, res) => {
  res.render("address.hbs", {
    addressAdded: req.query.addressAdded
  });
};

var deleteAddress = async function(req, res) {
  var idToDelete = req.params.id;
  console.log(idToDelete);
  var updatedUser = await User.findByIdAndUpdate(
    { _id: req.session.user._id },
    { $pull: { userAddresses: idToDelete } },
    { new: true }
  )
    .populate("userAddresses")
    .populate("cart")
    .populate("orderHistory");
  req.session.user = updatedUser;
  console.log(updatedUser);
  res.redirect("/user");
};

var cartPage = (req, res, next) => {
  var itemDeleted = req.query.itemDeleted;
  var cartLength = req.session.user.cartLength;
  if (cartLength !== 0) {
    res.render("cart.hbs", { ...req.session.user, itemDeleted: itemDeleted });
  } else {
    res.render("emptyCart.hbs");
  }
};

var addItemsToCart = (req, res) => {
  return User.findByIdAndUpdate(
    { _id: req.session.user._id },
    {
      $push: { cart: mongoose.Types.ObjectId(req.body.id) },
      $inc: { cartLength: 1 }
    },

    { new: true, multi: true }
  )
    .populate("userAddresses")
    .populate("cart")
    .populate("orderHistory")
    .then(result => {
      req.session.user = result;
      console.log(req.session.user);
      res.redirect(`/product/${req.body.id}?addedToCart=true`);
    });
};

var deleteCartItem = async (req, res) => {
  var idToDelete = req.params.id;
  console.log(idToDelete);
  var updatedUser = await User.findByIdAndUpdate(
    { _id: req.session.user._id },
    { $pull: { cart: idToDelete }, $inc: { cartLength: -1 } },
    { new: true }
  )
    .populate("cart")
    .populate("userAddresses");

  req.session.user = updatedUser;
  res.redirect("/user/cart?itemDeleted=true");
};

var orderHistoryPage = (req, res, next) => {
  res.render("orderHistory", req.session.user);
};

var itemAddedToOrderHistory = async (req, res) => {
  console.log(req.body);
  var user = await User.findById(req.body.id);
  var billing = [];
  user.cart.forEach(id => {
    user.orderHistory.push(id);
  });
  user.cart = [];
  user.cartLength = 0;

  var updatedUser = await User.findByIdAndUpdate(req.body.id, user, {
    new: true
  })
    .populate("orderHistory")
    .populate("userAddresses")
    .populate("cart");

  req.session.user = updatedUser;
  res.redirect("/user/thankYou");
};

var addItemDirectlyToOrderHistory = (req, res) => {
  return User.findByIdAndUpdate(
    { _id: req.session.user._id },
    { $push: { orderHistory: mongoose.Types.ObjectId(req.body.id) } },
    { new: true }
  )
    .populate("userAddresses")
    .populate("cart")
    .populate("orderHistory")
    .then(result => {
      req.session.user = result;
      console.log(req.session.user);
      res.redirect("/user/thankYou");
    });
};

module.exports = {
  userDashboard,
  editUser,
  editUserForm,
  createAddress,
  createAddressForm,
  deleteAddress,
  cartPage,
  addItemsToCart,
  deleteCartItem,
  orderHistoryPage,
  itemAddedToOrderHistory,
  addItemDirectlyToOrderHistory
};
