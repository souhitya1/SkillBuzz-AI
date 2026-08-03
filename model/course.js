const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

const moduleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    lessons: [lessonSchema]
})

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    modules: [moduleSchema],
    finalTest: [{
        question: String,
        options: [String],
        correctAnswer: String
    }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
        type: String,
        enum: ["Generating", "Failed", "Ready"],
        default: "Generating"
    },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Course", courseSchema);