const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");

app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);  

app.listen(port,()=>{
    console.log("app is listening");
})
app.use("/skillbuzz",(req,res)=>{
    res.render("home.ejs");
})


