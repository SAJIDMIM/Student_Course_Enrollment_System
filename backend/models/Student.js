const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d+$/, "Phone number must contain only digits"],
    },
    course: {
      type: String,
      required: true,
      enum: ["BSc (Hons) in Computer Science", "BSc (Hons) in Information Technology", "BSc (Hons) in Software Engineering", "BSc (Hons) in Data Science"],
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Graduated", "Dropped"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
