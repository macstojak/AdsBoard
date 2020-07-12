const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const passport = require("passport")
const Ad = require("../models/Ad");
const User = require("../models/User");
const moment = require('moment');
const _ = require("lodash");

router.get("/", (req, res)=>{
    Ad.find({}).populate("user").then(response=>{``
    let randomNumber = Math.floor(Math.random()*response.length);
     res.render("index", {ad:response[randomNumber], moment: moment});
 })
 .catch(error=>console.log(error));
});

router.get("/login", (req, res)=>{
    res.render("layout/login")
})
router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: "You must've entered wrong username or password",
    successFlash: "Welcome to AdsBoard"
    }), function(req, res) {
      
});
router.get("/logoff", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged you out!");
    res.redirect("/");
})
module.exports = router;