import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import MemoryStore from 'memorystore';
import { setupAuth } from '../dist/auth.js';
import { registerRoutes } from '../dist/routes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Create Express app
const app = express();
app.use(express.json());

// Production mode
process.env.NODE_ENV = 'production';

// Setup session
const SessionStore = MemoryStore(session);
const sessionSettings = {
  secret: process.env.SESSION_SECRET || 'autovest-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 86400000, // 1 day
    secure: process.env.NODE_ENV === 'production'
  },
  store: new SessionStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  })
};

app.use(session(sessionSettings));
app.use(passport.initialize());
app.use(passport.session());

// Setup auth routes
setupAuth(app);

// Register API routes
const server = registerRoutes(app);

// Export for Vercel serverless function
export default app;