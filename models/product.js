const mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;
ObjectId = Schema.Types;

let ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
    picture: {
        type: String,
  
       
    },
    category: {
        type: String,
    },
    subcategory:{
        type:String,
        required:true
    },
    productdescription1: {
        type: String, 
        required: true
    },
    productdescription2: {
        type: String, 
        required: true
    },
    productdescription3: {
        type: String, 
        required: true
    },
    warranty: {
        type: Number, 
        required: true
    },
   
    quantity: {
        type: Number, 
        required: true
    },
    AvailableColors: {
        type: String, 
        
    },
    price: {
        type: Number, 
        required: true
    },
    url:{
        type:String,
        required:true
    },
    color:{
        type:String,
   
    }
    
});
ProductSchema.plugin(mongoosastic, {
	hosts: [
	'http://0.0.0.0:9200/'
	]
});

// Export the model
module.exports = mongoose.model('Product', ProductSchema);