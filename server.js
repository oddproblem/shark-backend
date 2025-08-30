import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/db.js'; // Note the `.js` extension for ESM

// Load environment variables
dotenv.config();

const app = express();

// Connect to DB
connectDB(
  process.env.MONGO_URI ||
  "mongodb+srv://abys7315:Abys2875%40%23@sparkathon.ho8cuvo.mongodb.net/?retryWrites=true&w=majority&appName=sparkathon"
);

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || process.env.REACT_APP_API_BASE_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Routes (ESM needs explicit `.js` extensions unless you set up resolver)
// --- FIX START ---
// Reverted the import statements back to the default import syntax.
// This is the correct way to import CommonJS modules (which use module.exports)
// into an ES module file.
import authRoutes from './routes/authRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
// --- FIX END ---


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/audit', auditRoutes);

// Health check endpoint for Render/load balancers
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Event Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      team: '/api/team', 
      admin: '/api/admin',
      attendance: '/api/attendance',
      leaderboard: '/api/leaderboard',
      audit: '/api/audit'
    }
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
