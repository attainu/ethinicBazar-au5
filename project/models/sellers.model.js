var mongoose=require('mongoose');
var Schema = mongoose.Schema;

//Sellers Schema
var sellerSchema= new Schema({
  firstname: {
    type: String,
    required: true
  },

  lastname: {
    type: String,
    required: true
  },

  company: {
    type: String,
    unique: true,
    required: true
  },
 
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true
  },

  mobile: {
    type: Number,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  profileImageUrl: {
    type: String,
    required: true
  },

  product:[{
    type: Schema.Types.ObjectId,
    ref: "Product"
  }]
    
});

var Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
