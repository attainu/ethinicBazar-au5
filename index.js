var express = require("express");
var app = express();
var session = require("express-session");
var hbs = require("hbs");

var bodyParser = require("body-parser");

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

var buyerRoutes = require("./routes/buyer");
var sellerRoutes = require("./routes/seller");
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
    res.redirect("/login?shouldLogin=true");
  } else {
    next();
  }
};

// app.use("/buyer", authMiddleware, buyerRoutes);
// app.use("/seller", authMiddleware, sellerRoutes);
app.use("/user", userRoutes);

app.get("/userSignup", function(req, res) {
  res.render("UserSignup.hbs");
});

app.get("/userLogin", function(req, res) {
  var mismatch = req.query.mismatch;
  var shouldLogin = req.query.shouldLogin;
  res.render("UserLogin.hbs", {
    mismatch: mismatch,
    shouldLogin: shouldLogin
  });
});

app.post("/userLogin", function(req, res, next) {
  User.findOne({ email: req.body.email })
    .populate("addresses")
    .populate("cart")
    .populate("orderHistory")
    .exec()
    .then(result => {
      if (req.body.password !== result.password) {
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

app.post("/delete", authMiddleware, (req, res) => {
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

app.get("/userLogout", authMiddleware, (req, res) => {
  req.session.destroy();
  res.redirect("/userLogin");
});

app.get("/product", authMiddleware, (req, res) => {
  res.render("product");
});

app.post("/product", authMiddleware, (req, res) => {
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
app.listen(7000, () => {
  console.log("Listening on port 7000");
});
