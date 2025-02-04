import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "your_mongodb_connection_string_here";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};
