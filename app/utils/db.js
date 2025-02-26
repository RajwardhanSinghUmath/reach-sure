
const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://rajwardhansinghumath:EccfpsaRmU6wBZXg@cluster0.p2gfo.mongodb.net/reach-sure?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      console.log('⚡ MongoDB already connected');
      return;
    }

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
