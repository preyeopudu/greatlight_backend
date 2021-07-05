const express = require("express");
const router = express.Router();
var mongoose = require("mongoose");
const passport = require("passport");
const User = require("../model/User");
const Withdraw = require("../model/Withdraw");
const Receipt = require("../model/Receipt");
const Notification = require("../model/Notification");
const Crypto = require("../model/crypto");
const Bill = require("../model/bill");
const Ad = require("../model/Ad");

// User.register(new User({ username: "Light" }), "fortune&godaddict");
// User.register(new User({username:"Vendor"}),"@Greatlight123")

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.username == "Light") {
    return next();
  }
  req.flash("error", "Not permitted");
  res.redirect("/admin");
}

router.get("/", (req, res) => {
  res.redirect("/admin/login");
});

router.get("/admin/login", (req, res) => {
  res.render("login");
});

router.get("/admin", isAdmin, (req, res) => {
  res.render("admin");
});

router.get("/transfer", isAdmin, (req, res) => {
  res.render("admin");
});

router.post("/transfer", isAdmin, (req, res) => {
  User.findOne({ username: req.body.email }, (err, user) => {
    if (err || user == null) {
      req.flash("error", "user does not exist");
      res.redirect("/admin");
    } else {
      user.deposit = Number(user.deposit) + Number(req.body.amount);
      user.save();
      Bill.findOneAndDelete({}, (err) => {
        if (err) {
          console.log(err);
        } else {
          Bill.create(
            { text: `Transferred ${req.body.amount} NGN to ${req.body.email}` },
            () => {
              req.flash("success", "Transfer successful");
              res.redirect("/receipts");
            }
          );
        }
      });
    }
  });
});

router.get("/withdrawals", isAdmin, (req, res) => {
  Withdraw.find({}, (err, withdraws) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.render("withdraw", { withdraws: withdraws });
    }
  });
});

router.get("/crypto", isAdmin, (req, res) => {
  Crypto.find({}, (err, cryptos) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.render("crypto", { cryptos: cryptos });
    }
  });
});

router.get("/ad", isAdmin, (req, res) => {
  res.render("ad");
});

router.post("/admin/ads", isAdmin, (req, res) => {
  Ad.findOneAndDelete({}, (err) => {
    if (err) {
      console.log(err);
    } else {
      Ad.create(
        { title: req.body.title, content: req.body.text },
        (err, ad) => {
          if (err) {
            console.log(err);
          } else {
            console.log(ad);
            req.flash("success", "Ad post has been sent");
            res.redirect("/ad");
          }
        }
      );
    }
  });
});

router.post("/transfer/crypto/:id", (req, res) => {
  Crypto.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.redirect("/crypto");
    }
  });
});

router.post("/transfer/withdrawals/:id", (req, res) => {
  Withdraw.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.redirect("/withdrawals");
    }
  });
});

router.get("/receipts", (req, res) => {
  Bill.find({}, (err, receipt) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.render("receipt", { receipts: receipt.reverse() });
    }
  });
});

router.get("/notification", isAdmin, (req, res) => {
  res.render("notification");
});

router.post("/admin/notifications", isAdmin, (req, res) => {
  User.updateMany({ notice: false }, { notice: true }, (err, writeResult) => {
    console.log(writeResult);
  });
  Notification.create(
    { title: req.body.title, text: req.body.text },
    (err, notification) => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "Notification has been sent");
        res.redirect("/notification");
      }
    }
  );
});

router.post(
  "/admin/login",
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
  }),
  (req, res) => {
    req.flash("success", "welcome back");
    res.redirect("/admin");
  }
);

router.get("/admin/logout", (req, res) => {
  req.logOut();
  req.flash("success", "successfully logged out");
  res.redirect("/admin/login");
});

module.exports = router;
