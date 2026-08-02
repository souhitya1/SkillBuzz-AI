const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    courseId: {type: mongoose.Schema.Types.ObjectId, ref: "Course"},
     completedLessons: [String],
      courseCompleted :{
        type: Boolean,
        default: false
     }
});

module.exports = mongoose.model("Progress",progressSchema);