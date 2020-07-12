
const User = require("../models/User");
const Ad = require("../models/Ad");
const mongoose = require("mongoose");
const express = require("express");
const passport = require("passport")
const router = express.Router();

//pobierz wszystkich użytkowników
router.get("/", (req, res)=>{
    User.find().then(response=>{
        res.render("users/all", {users:response});
    })
    .catch(err=>console.log(err));
   
})
router.get("/register", (req, res)=>{
    res.render("layout/register");
})

//dodaj nowego użytkownika
router.post("/", async (req, res)=>{
    if(req.body.password === req.body.repeatPassword && req.body.check){
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            username: req.body.email
        }

       const user = new User(newUser);
      
       User.register(user, req.body.password, function(err, user){
        if(err){
            console.log(err)
            req.flash("error", err.message);
            return res.render("layout/register");
        }
            passport.authenticate("local"), (req, res)=>{

                req.flash("success", "Welcome to AdsBoard " + user.username);
                res.render("/");
            }
        })
        
       
    }else{
        res.redirect("back")
    }
  
})

//pobierz użytkownika o id
router.get("/:id",  (req, res)=>{
    const userId = req.params.id;
    User.find(userId)
    .then(response=>{
        res.render("account",{user: response.data});
    })
    .catch(err=>console.log(err));
})

module.exports = router;