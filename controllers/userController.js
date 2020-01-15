var express = require("express");
var mongoose = require("mongoose");
var User = require("../models/userModel");
var Address = require("../models/addressModel");

var userDashboard = (req, res, next) => {
  res.render("profile", req.session.user);
};

var newUser = (req, res, next) => {
  var user = new User({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile
  });

  user
    .save()
    .then(result => {
      console.log(result);
      req.session.user = result;
      res.redirect("/user");
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

var editUser = async (req, res, next) => {
  var updatedUser = await User.findByIdAndUpdate(
    { _id: req.session.user._id },
    { $set: req.body },
    { new: true }
  )
    .populate("cart")
    .populate("orderHistory")
    .populate("addresses");

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
    { $push: { addresses: newAddr._id } },
    { new: true }
  ).populate("addresses");
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
    { $pull: { addresses: idToDelete } },
    { new: true }
  )
    .populate("addresses")
    .populate("cart")
    .populate("orderHistory");
  req.session.user = updatedUser;
  console.log(updatedUser);
  res.redirect("/user");
};

var cartPage = (req, res, next) => {
  var itemDeleted = req.query.itemDeleted;
  res.render("cart.hbs", { ...req.session.user, itemDeleted: itemDeleted });
};

var addItemsToCart = (req, res) => {
  return User.findByIdAndUpdate(
    { _id: req.session.user._id },
    { $push: { cart: mongoose.Types.ObjectId(req.body.id) } },
    { new: true }
  )
    .populate("addresses")
    .populate("cart")
    .then(result => {
      req.session.user = result;
      console.log(req.session.user);
      res.redirect("/productList");
    });
};

var deleteCartItem = async (req, res) => {
  var idToDelete = req.params.id;
  console.log(idToDelete);
  var updatedUser = await User.findByIdAndUpdate(
    { _id: req.session.user._id },
    { $pull: { cart: idToDelete } },
    { new: true }
  )
    .populate("cart")
    .populate("addresses");

  req.session.user = updatedUser;
  res.redirect("/user/cart?itemDeleted=true");
};

var orderHistoryPage = (req, res, next) => {
  res.render("orderHistory", req.session.user);
};

var itemAddedToOrderHistory = async (req, res) => {
  console.log(req.body);
  var user = await User.findById(req.body.id);
  user.cart.forEach(id => {
    user.orderHistory.push(id);
  });
  user.cart = [];

  var updatedUser = await User.findByIdAndUpdate(req.body.id, user, {
    new: true
  })
    .populate("orderHistory")
    .populate("addresses")
    .populate("cart");

  req.session.user = updatedUser;
  res.redirect("/user/orderHistory");
};

module.exports = {
  userDashboard,
  newUser,
  editUser,
  editUserForm,
  createAddress,
  createAddressForm,
  deleteAddress,
  cartPage,
  addItemsToCart,
  deleteCartItem,
  orderHistoryPage,
  itemAddedToOrderHistory
};
