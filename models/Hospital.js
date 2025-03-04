const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
})

// Create a 2dsphere index for geospatial queries
hospitalSchema.index({ location: "2dsphere" })

module.exports = mongoose.models.Hospital || mongoose.model("Hospital", hospitalSchema)

// export default mongoose.models.Hospital || mongoose.model("Hospital", hospitalSchema)