'use strict';

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
const config = require('./config');
const async = require('async')
const homeroutes = require('./routes/home.route');
const productRoute = require('./routes/product.route')
const apiRoutes = require('./api/api');
const multiparty = require("multiparty");
const cloudinary = require('cloudinary').v2;
const hbs = require('hbs')



//..........................//external helper function //.................................................................//
hbs.registerHelper('eachUnique', function(array, options) {
    
    var  dupCheck = {};
    var buffer = '';

    for( var i=0; i< array.length; i++){

      var entry = array[i];
      var uniqueKey = entry.subcategory 
      
   
      if(!dupCheck[uniqueKey]){
   
      
        dupCheck[uniqueKey] = true;
       
        buffer += options.fn(entry);
      }
    }

    
    return buffer;
  });

hbs.registerHelper('eachUnique1', function(array, options) {
    
    var  dupCheck = {};
    var buffer = '';

    for( var i=0; i< array.length; i++){

      var entry = array[i];
      var uniqueKey = entry.subcategory 
      var uniqueKey1 = entry.url
      var uniqueKey2 = entry.price

      
      console.log(dupCheck[uniqueKey1])
       
   
      if(!dupCheck[uniqueKey] && !dupCheck[uniqueKey1 ] && !dupCheck[uniqueKey2]){
       
        
      
        dupCheck[uniqueKey] = true;
        dupCheck[uniqueKey1] = true;
        dupCheck[uniqueKey2] = true;
       
        buffer += options.fn(entry);
        
      }
    }
    

    
    return buffer;
  });
//............................end helper function.............//

//cloudnary setup for product
cloudinary.config({
    cloud_name: "dlqxpkg7h",
    api_key: "661815952242859",
    api_secret: "zfP44FsPnUFcaXBvRF1TW0xfdlw"
});


app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



mongoose.connect('mongodb+srv://Ethnic:abccba@cluster0-2exsp.mongodb.net/EthinicBazar?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  
});





//used for product
app.use(homeroutes)
app.use(productRoute)
app.use('/api', apiRoutes); 



let port = 3000;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
