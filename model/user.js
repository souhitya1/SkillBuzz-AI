const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userschema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true
    }
})
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose, {
    usernameField: "email"     // ← We will login using email
});
module.exports = mongoose.model("User",userschema);