var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var addressSchema = new Schema({
  pin: { type: Number, required: true },
  locality: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  landmark: String
});

var Address = mongoose.model("Address", addressSchema);
module.exports = Address;
