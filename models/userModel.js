var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
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
  image: {
    type: String,
    default: "blank.jfif"
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address"
    }
  ],
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ],
  orderHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});

var User = mongoose.model("User", userSchema);
module.exports = User;
