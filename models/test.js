const mongoose = require('mongoose');          //Placing mongoose package in a variable mongoose
const Schema = mongoose.Schema;                // Assigning mongoose schema to variable 



//creating CategorySchema
const TestSchema = new Schema({
  name: { type: String, unique: true, lowercase: true },
 
});


//Exporting the category schema to reuse  
module.exports = mongoose.model('Test', TestSchema);