const mongoose = require("mongoose");
const Student = require("./models/Student");



// Sample courses
const courses = ["Computer Science", "Business Management", "Engineering", "Mathematics"];

// Sample students
const students = [
  { name: "Alice Johnson", email: "alice@example.com", phone: "0712345671", course: "Computer Science", status: "Active" },
  { name: "Bob Smith", email: "bob@example.com", phone: "0712345672", course: "Engineering", status: "Pending" },
  { name: "Charlie Brown", email: "charlie@example.com", phone: "0712345673", course: "Business Management", status: "Graduated" },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("MongoDB connected");

    await Student.deleteMany({});
    console.log("Existing students cleared");

    await Student.insertMany(students);
    console.log("Sample students seeded");

    console.log("Courses available:", courses);

    mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("Seeding error:", err);
    mongoose.disconnect();
  }
};

seedDB();
