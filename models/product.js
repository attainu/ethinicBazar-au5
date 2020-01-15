const mongoose = require('mongoose');
// var mongoosastic = require('mongoosastic');
const Schema = mongoose.Schema;
ObjectId = Schema.Types;

let ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 90
    },
    picture: {
        type: String, 
    },
    category: {
        type: String,
        required:true,
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
ProductSchema.index({ name: "text", subcategory: "text",},
    { weights: { title: 5, body: 3, } })
// Export the model
module.exports = mongoose.model('Product', ProductSchema);