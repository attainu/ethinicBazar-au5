// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// let ProductSchema = new Schema({
//     productname: {
//         type: String,
//         required: true,
//         max: 100
//     },
//     productImageUrl: {
//         type: String,
//         required: true
       
//     },
//     category: {
//         type: String, 
//         required: true
//     },

//     subcategory: {
//         type: String, 
//         required: true
//     },
    
//     productdetails: {
//         type: String, 
//         required: true
//     },

//     material: {
//         type: String, 
//         required: true
//     },

//     specifications: {
//         type: String, 
//         required: true
//     },

//     warranty: {
//         type: Number, 
//         required: true
//     },
//     quantity: {
//         type: Number, 
//         required: true
//     },
//     colors: {
//         type: String, 
//         required: true
//     },
//     price: {
//         type: Number, 
//         required: true
//     }
    
// });


// // Export the model
// var Product = mongoose.model('Product', ProductSchema);
// module.exports = Product

const mongoose = require('mongoose');
// var mongoosastic = require('mongoosastic');
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

    // url:{
    //     type:String,
    //     required:true
    // },
    // color:{
    //     type:String,
   
    // }
    
});
ProductSchema.index({ name: "text", subcategory: "text",},
    { weights: { title: 5, body: 3, } })
// // Export the model
var Product = mongoose.model('Product', ProductSchema);
module.exports = Product