require("dotenv").config();
const express = require("express");
const passport = require('passport');
const flash = require("connect-flash")
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const app = express();
const methodOverride = require("method-override")
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.DB_PATH, { useNewUrlParser: true,  useUnifiedTopology: true  })
.then(() => console.log( 'Database Connected' ))
.catch(err => console.log( err ));

mongoose.set('useFindAndModify', false);

const bodyParser = require("body-parser");
const adRoutes = require("./routes/ads");
const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");
app.use(methodOverride('_method'));
app.use(flash());
app.set("view engine", "ejs");
app.set("views", "views");
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success=req.flash("success");
   next();
});

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// app.use((req, res, next)=>{
//     user=req.user;
// })
// authorize((req, res, next)=>{
//     if(user){
//         next();
//     }else{
//         res.status(404).send("Unauthorized move");
//     }
// })



app.use("/", indexRoutes);
app.use("/ads", adRoutes);
app.use("/users", userRoutes);


app.listen(4000, ()=>{
    console.log("server started")
})