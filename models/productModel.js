var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  productName: {
    type: String,
    required: true,
    max: 90
  },
  productImage: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  productDescription1: {
    type: String,
    required: true
  },
  productDescription2: {
    type: String,
    required: true
  },
  productDescription3: {
    type: String,
    required: true
  },
  productWarranty: {
    type: Number,
    required: true
  },

  availableUnits: {
    type: Number,
    required: true
  },
  availableColors: {
    type: String
  },
  productPrice: {
    type: Number,
    required: true
  }
  //   productImage: { type: String, required: true }
});

var Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
