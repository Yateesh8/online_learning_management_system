const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    dueDate: {
      type: Date,
    },
    type: {
      type: String,
      enum: ["TEXT", "QUIZ"],
      default: "TEXT"
    },
    timeLimit: {
      type: Number, // in minutes
    },
    questions: [
      {
        questionText: String,
        options: [String],
        correctOptionIndex: Number,
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);