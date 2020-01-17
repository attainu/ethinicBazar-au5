var express = require("express");
var bodyParser = require("body-parser");
var hbs = require("hbs");
var multiparty = require("multiparty");
var cloudinary = require("cloudinary").v2;
var session = require("express-session");
var path = require("path");
var mongodb = require("mongodb");
var ObjectId = require("mongodb").ObjectID;
var mongoose = require("mongoose");
var Request = require("request");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var passport = require("passport");

var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "hbs");

var signuploginRoutes = require("./routes/signuplogin.route");
var sellerRoutes = require("./routes/sellers.route");
const homeroutes = require("./routes/home.route");
const productRoute = require("./routes/product.route");
const apiRoutes = require("./api/api");
var userRoutes = require("./routes/user");

var User = require("./models/userModel");
var Product = require("./models/products.model");
("use strict");

const config = require("./config");

//..........................//external helper function //.................................................................//
hbs.registerHelper("eachUnique", function(array, options) {
  var dupCheck = {};
  var buffer = "";

  for (var i = 0; i < array.length; i++) {
    var entry = array[i];
    var uniqueKey = entry.subcategory;

    if (!dupCheck[uniqueKey]) {
      dupCheck[uniqueKey] = true;

      buffer += options.fn(entry);
    }
  }

  return buffer;
});

hbs.registerHelper("eachUnique1", function(array, options) {
  var dupCheck = {};
  var buffer = "";

  for (var i = 0; i < array.length; i++) {
    var entry = array[i];
    var uniqueKey = entry.subcategory;
    var uniqueKey1 = entry.url;
    var uniqueKey2 = entry.price;

    console.log(dupCheck[uniqueKey1]);

    if (
      !dupCheck[uniqueKey] &&
      !dupCheck[uniqueKey1] &&
      !dupCheck[uniqueKey2]
    ) {
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

app.use(
  session({
    secret: "ethnicHub-secret"
  })
);

mongoose.connect(
  "mongodb+srv://Ethnic:abccba@cluster0-2exsp.mongodb.net/EthinicBazar?retryWrites=true&w=majority",
  {
    useNewUrlParser: true
  }
);

mongoose.Promise = global.Promise;

app.use(passport.initialize());
app.use(passport.session());

app.use("/", homeroutes);
app.use("/", productRoute);
app.use("/api", apiRoutes);

app.use("/", signuploginRoutes);
//used for product

var authMiddleware = function(req, res, next) {
  if (!req.session.user) {
    res.redirect("/userLogin?shouldLogin=true");
  } else {
    next();
  }
};

app.use("/user", userRoutes);
app.get("/userSignup", function(req, res) {
  res.render("userSignup.hbs", {
    emailAlreadyExists: req.query.emailAlreadyExists
  });
});
app.get("/userLogin", function(req, res) {
  var mismatch = req.query.mismatch;
  var shouldLogin = req.query.shouldLogin;
  res.render("userLogin.hbs", {
    mismatch: mismatch,
    shouldLogin: shouldLogin,
    captchaNotTicked: req.query.captchaNotTicked
  });
});
//************Forgot Password ******************************//
app.get("/forgotPassword", (req, res) => {
  res.render("forgot");
});

app.post("/forgotPassword", function(req, res, next) {
  async.waterfall(
    [
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ userEmail: req.body.userEmail }, function(err, user) {
          if (!user) {
            return res.render("forgot", {
              flag: false
            });
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function(err) {
            console.log(user);
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "vivekregmi5@gmail.com",
            pass: "Infinity!422"
          }
        });
        var mailOptions = {
          to: user.userEmail,
          from: "vivekregmi5@gmail.com",
          subject: "Ecommerce Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/userReset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log("mail sent");
          done(err, "done");
        });
      }
    ],
    function(err) {
      if (err) return next(err);
      return res.render("forgot", {
        flag: true
      });
    }
  );
});

app.get("/userReset/:token", function(req, res) {
  console.log(req.params.token);
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    },
    function(err, user) {
      if (!user) {
        return res.redirect("/forgotPassword");
      }
      res.render("userResetPassword", { token: req.params.token });
    }
  );
});

app.post("/userReset/:token", function(req, res) {
  console.log("reached");
  async.waterfall(
    [
      function(done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
          },
          function(err, user) {
            if (!user) {
              return res.redirect("back");
            }
            if (req.body.userPassword === req.body.confirm_password) {
              user.userPassword = req.body.userPassword;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            } else {
              return res.redirect("back");
            }
          }
        );
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: "vivekregmi5@gmail.com",
            pass: "Infinity!422"
          }
        });
        var mailOptions = {
          to: user.userEmail,
          from: "learntocodeinfo@mail.com",
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.userEmail +
            " has just been changed.\n"
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          done(err);
        });
      }
    ],
    function(err) {
      res.redirect("/userLogin");
    }
  );
});

//************Forgot Password ******************************//
app.post("/userLogin", function(req, res, next) {
  console.log(req.body);

  const RECAPTCHA_SECRET = "6LcpXcUUAAAAABi6OcRsG4mpS3ylTlxk3sQl1ibr";
  var recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?";
  recaptcha_url += "secret=" + RECAPTCHA_SECRET + "&";
  recaptcha_url += "response=" + req.body["g-recaptcha-response"] + "&";
  recaptcha_url += "remoteip=" + req.connection.remoteAddress;

  Request(recaptcha_url, async function(error, resp, body) {
    body = JSON.parse(body);
    if (body.success !== undefined && !body.success) {
      return res.redirect("/userLogin?captchaNotTicked=true");
    } else {
      var updatedUser = await User.findOne({ userEmail: req.body.userEmail })
        .populate("userAddresses")
        .populate("cart")
        .populate("orderHistory");

      if (updatedUser.userPassword === req.body.userPassword) {
        req.session.user = updatedUser;
        res.redirect("/");
      } else {
        res.redirect("/userLogin?mismatch=true");
      }
    }
  });
});

app.get("/userLogout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.post("/user/image", authMiddleware, async (req, res) => {
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
            .populate("userAddresses")
            .populate("cart");
          req.session.user = updatedUser;
          res.redirect("/user");
        }
      }
    );
  });
});

app.post("/user", async (req, res, next) => {
  var resultUser = await User.findOne({ userEmail: req.body.userEmail });
  console.log("***************", resultUser);
  if (resultUser) {
    res.redirect("/userSignup?emailAlreadyExists=true");
  } else {
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
  }
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

app.use(function(req, res, next) {
  if (req.session.seller) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.use("/", sellerRoutes);

// app.use("/buyer", authMiddleware, buyerRoutes);
// app.use("/seller", authMiddleware, sellerRoutes);

// app.get("/product", (req, res) => {
//   res.render("product");
// });
// app.post("/product", (req, res) => {
//   Product.create(req.body)
//     .then(product => {
//       res.send(product);
//     })
//     .catch(err => {
//       res.send(err);
//     });
// });
// app.get("/productList", async (req, res) => {
//   var products = await Product.find();
//   res.render("productList", {
//     products: products
//   });
// // });
// app.get("/home", (req, res) => {
//   res.render("index");
// });
app.get("*", function(req, res) {
  res.render("notFound");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

// app.use(
//   session({
//     secret: "kdjfwjef wefhkwjef wkej fhwkejf",
//     cookie: {
//       maxAge: 1000 * 500,
//       path: "/",
//       httpOnly: true
//     }
//   })
// );
// var buyerRoutes = require("./routes/buyer");
// var sellerRoutes = require("./routes/seller");
