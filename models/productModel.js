var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  price: { type: Number, required: true },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true }
  //   productImage: { type: String, required: true }
});

var Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
