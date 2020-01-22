var mongoose = require("mongoose");
var userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    require: true
  },
  userEmail: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required"
  },
  userPassword: {
    type: String,
    required: true,
    min: [6, "Password must be atlest 6 characters length"]
  },
  userMobile: {
    type: Number,
    required: true,
    unique: true
  },
  userImage: {
    type: String,
    default:
      "https://res.cloudinary.com/dgq5a8zjh/image/upload/v1579671007/default-user-image_yvgeay.png"
  },
  userAddresses: [
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
  ],
  cartLength: {
    type: Number,
    default: 0
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});
var User = mongoose.model("User", userSchema);
module.exports = User;
