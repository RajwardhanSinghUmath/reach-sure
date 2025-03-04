const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        return /^\d{10}$/.test(v) // Validate phone number format
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  ambulanceType: {
    type: String,
    required: true,
    enum: ["BLS", "ALS - with EMT", "ALS - without EMT"],
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  fixedPrice: {
    type: Number,
    required: true,
    min: 0, // Ensure price is non-negative
  },
  variablePrice: {
    type: Number,
    required: true,
    min: 0, // Ensure price is non-negative
  },
  photo: {
    type: String,
    trim: true,
  },
  ambulanceNumber: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["online", "offline", "busy"],
    default: "offline",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Add geospatial index for location
DriverSchema.index({ location: "2dsphere" })

module.exports = mongoose.models.Driver || mongoose.model("Driver", DriverSchema)

// export default mongoose.models.Driver || mongoose.model("Driver", DriverSchema)

