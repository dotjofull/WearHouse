const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

module.exports = connectDB;