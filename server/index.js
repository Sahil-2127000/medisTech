require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const blogRoutes = require('./routes/blogRoutes');
const documentRoutes = require('./routes/documentRoutes');
const vitalRoutes = require('./routes/vitalRoutes');
const path = require('path');

// Initialize app & connect to Database
const app = express();
connectDB();

// Global Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Handle both resolution standards dynamically
  credentials: true // Explicitly instruct Google Chrome/Safari to shuttle explicit cookies 
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static upload directory natively
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/vitals', vitalRoutes);

// General health check route
app.get('/', (req, res) => {
  res.send('Clinic@Flow Backend API is running!');
});

// Start listening
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});

// Initialize Socket.io
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  }
});

// Make io accessible in our routes natively
app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('A client connected via WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
