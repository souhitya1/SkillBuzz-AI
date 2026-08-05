const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../model/user");

router.get("/signup", (req, res) => {
    res.render("signup.ejs");
})

router.post("/signup", async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ username, email });
        let registeruser = await User.register(newUser, password);
        req.logIn(registeruser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Successfully signed up");
            res.redirect("/skillbuzz");
        })
    } catch (err) {
        req.flash("error", "Error in sign up");
        res.redirect("/skillbuzz/signup");
    }
})

router.get("/login", (req, res) => {
    res.render("login.ejs");
})

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/skillbuzz/login',
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Successfully logged in");
        res.redirect("/skillbuzz");
    }
)

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged out successfully");
        res.redirect("/skillbuzz");
    })
})

module.exports = router;
