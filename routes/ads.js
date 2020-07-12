const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Ad = require("../models/Ad");
const moment = require("moment");
const isLoggedIn = require("../middleware");


router.get("/", async (req, res)=>{
    if(Object.keys(req.query).length>0){
        const search = req.query.search?req.query.search:null;
        const query=  Object.keys(req.query);
        let date = req.query.date?req.query.date.split("-"):null;
        const user = req.query.user?req.query.user:null;
        const categories = query.slice(1,query.length);
        if(date){
            let tomorrow = _.cloneDeep(date);
            date=date.join("-");
            
            tomorrow[2]=(parseInt(tomorrow[2])+1).toString();
            tomorrow=tomorrow.join("-");
           
          
        }else{
            tomorrow=null;
        }
     
        
        Ad.find({ $or: 
            [
            {"title": {$in: new RegExp(search,"i")}}, 
            {
                "date":{"$gte" : date, 
                        "$lt" : tomorrow }
            },
            {"user": {$in: user}},
            {"categories":{ $in: categories }}
            ]
            }).populate("user").then(async response=>{
                    if(!response){
                        
                        res.render("ads/list", {ads: {title:"Nothing found"}, moment:moment});
                    }else{
                        
                        res.render("ads/list", {ads: response, moment: moment, categories: categories})
                    }
            })
    }else{
    Ad.find().populate("user").then(async response=>{
        if(!response){
            fakeResponse = [{
                title:"TEMPLATE AD: Rower",
                price: "120zł",
                photoUrl: "https://thumbs.img-sprzedajemy.pl/1000x901c/72/a0/14/sprzedam-rower-marki-wigry-495571164.jpg",
                description: "Zdezelowane Wigry mam do sprzedania",
                date: Date.now(),
                user: "Janusz"

            }],
            
            // fakeUser = {
            //     _id: mongoose.Types.ObjectId(1),
            //     firstName: "Jan",
            //     lastName: "Nowak",
            //     phone: "555111022"
            // }
            res.render("ads/list", {ads: fakeResponse, moment:moment});
        }else{
            const categories = response.map(el=>{return el.categories}).join(",").split(",")
            const uniqueCategories = [...new Set(categories)]
            res.render("ads/list", {ads: response, moment: moment, categories: uniqueCategories})
        }
    })
    .catch(err=>console.log(err))
}
})
router.get("/show/:id", (req, res)=>{
    Ad.find({_id:req.params.id}).populate("user").then(response=>{
        res.render("ads/show", {ad:response[0]})
    })
})


router.get("/new", async (req, res)=>{
    res.render("ads/new");
});

router.get("/edit/:id", isLoggedIn, async (req,res)=>{
    Ad.find({_id:req.params.id}).then(response=>{
        res.render("ads/edit", {ad: response[0], moment: moment})
    });
});

router.post("/", async (req,res)=>{
    const newCategories= req.body.categories.split(',');
    const newAd = {
        date: Date.now(),
        title: req.body.title,
        photoUrl: req.body.photoUrl,
        tags: req.body.tags,
        description: req.body.description,
        price: req.body.price,
        user: req.user._id,
        categories: newCategories
    }
    const ad = await new Ad(newAd);
    ad.save();
    res.redirect("/");
});

router.put("/:id", isLoggedIn, async (req, res)=>{
    const newCategories= req.body.categories.split(',');
    const newAd = {
        date: req.body.date,
        title: req.body.title,
        photoUrl: req.body.photoUrl,
        tags: req.body.tags,
        description: req.body.description,
        price: req.body.price,
        user: req.user._id,
        categories: newCategories
    }
    Ad.findByIdAndUpdate(req.params.id, newAd).then(response=>{
        res.redirect("/")
    })
    .catch(error=>console.log(error));
});

router.delete("/:id", isLoggedIn, (req,res)=>{
        Ad.findOneAndDelete(req.params.id).then(response=>{
            res.redirect("/")
        }).catch(error=>console.log(error))
});

module.exports = router;