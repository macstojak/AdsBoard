const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const User = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    phone: String,
    
})
User.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", User);