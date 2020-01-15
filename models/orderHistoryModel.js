var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var orderHistorySchema = new Schema({
  price: { type: Number, required: true },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  //   productImage: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

var OrderHistory = mongoose.model("OrderHistory", orderHistorySchema);
module.exports = OrderHistory;
