// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');
const socketIo = require('socket.io');
const driverRoutes = require('./routes/driverRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reachsure';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));
// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reachsure', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join a room based on user type (driver or user)
  socket.on('join', ({ type, id }) => {
    socket.join(`${type}_${id}`);
    console.log(`${type} with ID ${id} joined`);
  });
  
  // Handle new booking
  socket.on('newBooking', (bookingData) => {
    // Broadcast to all drivers within range
    io.to('driver_room').emit('bookingAlert', bookingData);
  });
  
  // Handle driver acceptance
  socket.on('acceptBooking', ({ bookingId, driverId, driverDetails }) => {
    // Notify the user that a driver accepted
    io.to(`user_${bookingId}`).emit('driverAccepted', {
      bookingId,
      driverId,
      driverDetails
    });
  });
  
  // Handle driver location updates
  socket.on('updateLocation', ({ driverId, location }) => {
    // Broadcast to specific booking user
    const bookingId = getBookingIdByDriverId(driverId); // Implement this function
    if (bookingId) {
      io.to(`user_${bookingId}`).emit('driverLocation', {
        driverId,
        location
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper function to get bookingId by driverId (implement with DB query)
function getBookingIdByDriverId(driverId) {
  // This would be a DB query in production
  // For now, return null as placeholder
  return null;
}

module.exports = { app, io };