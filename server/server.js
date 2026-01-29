import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';


dotenv.config();

const app = express();
const port = 8081;
const mongoURI = process.env.MONGODB_URI;

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ Could not connect to MongoDB', err));

// Middleware
// Helmet defaults can block loading images across origins in dev (5173 -> 8081).
// Allow cross-origin resource loading while keeping other protections.
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const isProduction = process.env.NODE_ENV === 'production';
const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '');
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);
const defaultProdOrigins = ['https://neildaterao.com', 'https://www.neildaterao.com'];
const defaultDevOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (!isProduction) {
      return callback(null, defaultDevOrigins.includes(normalizeOrigin(origin)));
    }

    const allowlist = allowedOrigins.length > 0 ? allowedOrigins : defaultProdOrigins;
    if (allowlist.includes(normalizeOrigin(origin))) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Fix ES Module issue for path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`🌎 Running in mode: ${process.env.NODE_ENV}`);

// API Routes
import router from './routes/index.js';
app.use('/api', router); // ✅ Prevents frontend/backend route conflicts

// ✅ Serve React Frontend **Only in Production**
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../client/dist');

  // ✅ Serve static frontend files
  app.use(express.static(distPath, { index: false }));

  // ✅ Catch-all: If no API routes match, serve React
  app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' }); // ✅ Prevents API calls from returning index.html
    }
    res.sendFile(path.resolve(distPath, 'index.html'), (err) => {
      if (err) {
        console.error('❌ Failed to send index.html:', err);
        res.status(500).send('Error loading frontend');
      }
    });
  });

  console.log(`✅ Serving React frontend from: ${distPath}`);
}

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
