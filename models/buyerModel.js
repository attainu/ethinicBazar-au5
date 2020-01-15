var mongoose = require("mongoose");

var buyerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  buyerName: {
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
  alternateMobile: {
    type: Number
  },
  address: {
    type: String,
    required: true
  }
});

var Buyer = mongoose.model("Buyer", buyerSchema);
module.exports = Buyer;
