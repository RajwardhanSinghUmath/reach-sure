const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  ambulanceType: { type: String, required: true },
  licenseNumber: { type: String, required: true },
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
  fixedPrice: { type: Number, required: true },
  variablePrice: { type: Number, required: true },
  ambulanceNumber: { type: String, required: true },
  status: { type: String, enum: ["online", "offline"], default: "online" },
})

// Create a 2dsphere index for geospatial queries
ambulanceSchema.index({ location: "2dsphere" })

module.exports = mongoose.models.Ambulance || mongoose.model("Ambulance", ambulanceSchema)

// export default mongoose.models.Ambulance || mongoose.model("Ambulance", ambulanceSchema)