const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userPhone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Validate phone number format
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  userName: {
    type: String,
    required: true,
    trim: true, // Remove extra spaces
  },
  hospital: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  pickupLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  ambulanceType: {
    type: String,
    required: true,
    enum: ['BLS', 'ALS - with EMT', 'ALS - without EMT'],
  },
  distance: {
    type: Number,
    required: true,
    min: 0, // Ensure distance is non-negative
  },
  cost: {
    type: Number,
    required: true,
    min: 0, // Ensure cost is non-negative
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'arrived', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  acceptedAt: {
    type: Date,
  },
  arrivedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
});

// Add geospatial index for pickupLocation
BookingSchema.index({ pickupLocation: '2dsphere' });

module.exports = mongoose.model('Booking', BookingSchema);