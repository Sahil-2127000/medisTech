// Clinic times (slots, "today", queue ETAs) are Indian time. Render runs in UTC, so pin the zone.
process.env.TZ = 'Asia/Kolkata';

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
const contactRoutes = require('./routes/contactRoutes');
const path = require('path');

// Initialize app & connect to Database
const app = express();
// Behind Render's proxy: needed for secure cookies and https links
app.set('trust proxy', 1);

// Allowed browser origins: local dev, the Capacitor app, plus any hosted website from CLIENT_ORIGINS (comma-separated)
const allowedOrigins = [
  'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174',
  'http://localhost', 'https://localhost', 'capacitor://localhost',
  ...(process.env.CLIENT_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean),
];
connectDB();

// Global Middleware
app.use(cors({
  // Website dev servers + the Capacitor Android/iOS app WebView origins
  origin: allowedOrigins,
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
app.use('/api/contact', contactRoutes);

// Lightweight health check (no database) — pinged to keep the free Render instance awake
app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, uptime: Math.round(process.uptime()) });
});

// General health check route
app.get('/', (req, res) => {
  res.send('MedisTech Backend API is running!');
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
    origin: allowedOrigins,
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
// Trigger restart
