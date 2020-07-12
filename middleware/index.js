module.exports = isLoggedIn = (req, res, next) =>{
       console.log("ISLOGEDIN", req.user)
        if(req.user){
            next();
        }else{
            req.flash("error", "No user found")
            res.status(404).render("/");
        }
   
   
}

