import mongoose from "mongoose"

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://rajwardhansinghumath:EccfpsaRmU6wBZXg@cluster0.p2gfo.mongodb.net/reach-sure?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return
    }

    await mongoose.connect(MONGODB_URI)
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

export default connectDB

