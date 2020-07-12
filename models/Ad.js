const mongoose = require('mongoose');
const Ad = new mongoose.Schema({
    date: Date,
    title: String,
    photoUrl: String,
    tags: String,
    description: String,
    price: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 
    categories: Array
})
module.exports = mongoose.model("Ad", Ad);