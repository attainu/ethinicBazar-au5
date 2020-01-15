var mongoose = require("mongoose");

var sellerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  sellerName: {
    type: String,
    unique: true,
    require: true
  },
  companyName: {
    type: String,
    unique: true,
    require: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required"
  },
  password: {
    type: String,
    required: true,
    min: [6, "Password must be atlest 6 characters length"]
  },
  mobile: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  uploadImageUrl: {
    type: String,
    required: true
  }
});

var Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
