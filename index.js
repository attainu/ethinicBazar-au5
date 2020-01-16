var express = require("express");
var app = express();
var session = require("express-session");
var hbs = require("hbs");
var multiparty = require("multiparty");
var cloudinary = require("cloudinary").v2;

var bodyParser = require("body-parser");

cloudinary.config({
  cloud_name: "dgq5a8zjh",
  api_key: "641339485594975",
  api_secret: "AUiaAT0cigGwmevOurEe5xX70ZQ"
});

app.set("view engine", "hbs");
var mongoose = require("mongoose");
var User = require("./models/userModel");
app.use(
  session({
    secret: "kdjfwjef wefhkwjef wkej fhwkejf",
    cookie: {
      maxAge: 1000 * 500,
      path: "/",
      httpOnly: true
    }
  })
);

// var buyerRoutes = require("./routes/buyer");
// var sellerRoutes = require("./routes/seller");
var userRoutes = require("./routes/user");
var Product = require("./models/productModel");

mongoose.connect("mongodb://localhost/ethinic-bazaar", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

var authMiddleware = function(req, res, next) {
  if (!req.session.user) {
    res.redirect("/userLogin?shouldLogin=true");
  } else {
    next();
  }
};

app.post("/user", (req, res, next) => {
  console.log(req.body);
  var user = new User({
    _id: mongoose.Types.ObjectId(),
    userName: req.body.userName,
    userEmail: req.body.userEmail,
    userPassword: req.body.userPassword,
    userMobile: req.body.userMobile
  });

  user
    .save()
    .then(result => {
      console.log(result);
      req.session.user = result;
      res.redirect("/user");
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
// app.use("/buyer", authMiddleware, buyerRoutes);
// app.use("/seller", authMiddleware, sellerRoutes);
app.use("/user", userRoutes);

app.get("/userSignup", function(req, res) {
  res.render("userSignup.hbs");
});

app.get("/userLogin", function(req, res) {
  var mismatch = req.query.mismatch;
  var shouldLogin = req.query.shouldLogin;
  res.render("userLogin.hbs", {
    mismatch: mismatch,
    shouldLogin: shouldLogin
  });
});

app.post("/userLogin", function(req, res, next) {
  console.log(req.body);
  User.findOne({ userEmail: req.body.userEmail })
    .populate("userAddresses")
    .populate("cart")
    .populate("orderHistory")
    .exec()
    .then(result => {
      if (req.body.userPassword !== result.userPassword) {
        res.redirect("/userLogin?mismatch=true");
      } else {
        req.session.user = result;
        console.log("session data after login: ", req.session.user);
        res.status(200).redirect("/user");
      }
    })

    .catch(err => {
      console.log(err);
      res.redirect("/userLogin?mismatch=true");
    });
});

app.post("/delete", (req, res) => {
  console.log(req.body);
  User.findByIdAndDelete({ _id: req.body.id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).redirect("/userSignup");
    })
    .catch(err => {
      console.log("err");
      res.status(500).json(err);
    });
});

app.get("/userLogout", (req, res) => {
  req.session.destroy();
  res.redirect("/userLogin");
});

app.get("/product", (req, res) => {
  res.render("product");
});

app.post("/product", (req, res) => {
  Product.create(req.body)
    .then(product => {
      res.send(product);
    })
    .catch(err => {
      res.send(err);
    });
});

app.get("/productList", async (req, res) => {
  var products = await Product.find();

  res.render("productList", {
    products: products
  });
});

app.get("/home", (req, res) => {
  res.render("index");
});

app.get("*", function(req, res) {
  res.render("notFound");
});

app.post("/user/image", async (req, res) => {
  var form = new multiparty.Form();
  await form.parse(req, function(err, fields, files) {
    console.log("pic path: ", files.file[0].path);
    cloudinary.uploader.upload(
      files.file[0].path,
      { resource_type: "image" },
      async function(err, result) {
        if (err) {
          console.log("error message: ", err);
        } else {
          var updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            {
              $set: { userImage: result.secure_url }
            },
            { new: true }
          )
            .populate("orderHistory")
            .populate("addresses")
            .populate("cart");
          req.session.user = updatedUser;
          res.redirect("/user");
        }
      }
    );
  });
});
app.listen(7000, () => {
  console.log("Listening on port 7000");
});
