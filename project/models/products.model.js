const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ProductSchema = new Schema({
    productname: {
        type: String,
        required: true,
        max: 100
    },
    productImageUrl: {
        type: String,
        required: true
       
    },
    category: {
        type: String, 
        required: true
    },
    
    productdetails: {
        type: String, 
        required: true
    },

    material: {
        type: String, 
        required: true
    },

    specifications: {
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
    colors: {
        type: String, 
        required: true
    },
    price: {
        type: Number, 
        required: true
    }
    
});


// Export the model
var Product = mongoose.model('Product', ProductSchema);
module.exports = Product