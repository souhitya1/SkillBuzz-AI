const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const User = require("./model/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Course = require("./model/course");
const session = require('express-session');
mongoose.connect("mongodb://127.0.0.1:27017/skillbuzz")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})
app.get("/skillbuzz",(req,res)=>{
    console.log("success",res.locals.success);
    res.render("home.ejs");
})
app.get("/skillbuzz/signup",(req,res)=>{
    res.render("signup.ejs");
})
app.post("/skillbuzz/signup",(req,res,next)=>{
   console.log(req.body);
   let {username,email,password} = req.body;
   let newUser = new User({username,email});
   User.register(newUser,password,(err,user)=>{
    if(err){
        req.flash("error",err.message);
        res.redirect("/skillbuzz/signup");
    }
    passport.authenticate("local")(req, res, () => {
        console.log("succesfully logged in")
      res.redirect("/skillbuzz");
    });
   })
})
app.get("/skillbuzz/new",(req,res)=>{
    res.render("new.ejs");
})
app.get("/skillbuzz/courses",async(req,res)=>{
    let courses = await Course.find({});
    res.render("course.ejs",{courses});
})
app.post("/skillbuzz/courses",async(req,res)=>{
    let{title,description}= req.body;
    let newCourse = new Course({
        title: title,
        description: description
    })
    await newCourse.save();
    console.log(newCourse);
    res.redirect("/skillbuzz/courses");
})
app.listen(port,()=>{
    console.log("app is listening");
})

