require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const User = require("./model/user");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Course = require("./model/course");
const session = require('express-session');
const generatecourse = require("./utils/generatecourse");
const Progress = require("./model/progress");
const Joi = require("joi");
const {validateCourse} = require("./validation");
const getgradient = require("./utils/getgradient");
const generateCertificate = require("./utils/generateCertificate");

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})

function isLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first");
        return res.redirect("/skillbuzz/login");
    }
    next();
}

app.get("/skillbuzz", (req, res) => {
    res.render("home.ejs");
})

app.use("/skillbuzz",require("./routes/authentication.routes"));
app.get("/skillbuzz/new", isLoggedIn, (req, res) => {
    res.render("new.ejs");
})

app.get("/skillbuzz/courses", isLoggedIn, async (req, res) => {
    let courses = await Course.find({ createdBy: req.user._id });
    res.render("course.ejs", { courses, getgradient});
})

app.get("/skillbuzz/courses/:id", isLoggedIn, async (req, res) => {
    let course = await Course.findById(req.params.id);
    let progress = await Progress.findOne({ userId: req.user._id, courseId: course._id });
    if (!progress) {
        progress = new Progress({ userId: req.user._id, courseId: course._id });
        await progress.save();
    }
    res.render("show.ejs", { course, progress , getgradient});
})

app.post("/skillbuzz/courses", isLoggedIn,validateCourse, async (req, res) => {
    let { title, description } = req.body;
    let newCourse = new Course({
        title: title,
        description: description,
        createdBy: req.user._id,
        status: "Generating"
    })
    await newCourse.save();
    res.redirect(`/skillbuzz/courses/${newCourse._id}`);

    try {
        const generate = await generatecourse(title, description);
        newCourse.title = generate.title;
        newCourse.description = generate.description;
        newCourse.modules = generate.modules;
        newCourse.finalTest = generate.finalTest;
        newCourse.status = "Ready";
        await newCourse.save();
    } catch (err) {
        console.log("Generation failed", err);
        newCourse.status = "Failed";
        await newCourse.save();
    }
})

app.post("/skillbuzz/courses/:id/complete/:lessonkey", isLoggedIn, async (req, res) => {
    let progress = await Progress.findOne({ userId: req.user._id, courseId: req.params.id });
    let key = req.params.lessonkey;
    if (progress.completedLessons.includes(key)) {
        progress.completedLessons = progress.completedLessons.filter(k => k != key);
    } else {
        progress.completedLessons.push(key);
    }
    await progress.save();
    res.redirect(`/skillbuzz/courses/${req.params.id}`);
})
app.post("/skillbuzz/courses/:id/finaltest",isLoggedIn,async(req,res)=>{
 let course = await Course.findById(req.params.id);
 let progress = await Progress.findOne({userId: req.user.id, courseId: course._id});
 console.log(`final test ${course.finalTest}`);
 if (!course.finalTest || course.finalTest.length === 0) {
        req.flash("error", "This course doesn't have a final test yet.");
        return res.redirect(`/skillbuzz/courses/${course._id}`);
    }
 let correctCount = 0;
    course.finalTest.forEach((q, i) => {
        let submitted = (req.body["answer" + i] || "").trim().toLowerCase();
        let correct = (q.correctAnswer || "").trim().toLowerCase();
        console.log(`Q${i}: submitted="${submitted}" | correct="${correct}" | match=${submitted === correct}`);
        if (submitted === correct){
            correctCount++;
        }
    });

    let scorePercent = Math.round((correctCount / course.finalTest.length) * 100);
    if(scorePercent>=80){
        progress.courseCompleted= true
        await progress.save();
        req.flash("sucess",`You completed the course by ${scorePercent}%`);
    }else{
      req.flash("error",`You scored ${scorePercent}%, Course not completed`);
    }
    res.redirect(`/skillbuzz/courses/${course._id}`);
})
app.get("/skillbuzz/courses/:id/certificate",async(req,res)=>{
 let course = await Course.findById(req.params.id);
 let progress = await Progress.findOne({userId: req.user._id, courseId: course._id});
 if(!progress || !progress.courseCompleted){
    req.flash("error", "You need to complete the course first.");
    return res.redirect(`/skillbuzz/courses/${course._id}`);
 }
 generateCertificate(res,course.title,req.user.username);
})
app.listen(port, () => {
    console.log("app is listening");
})