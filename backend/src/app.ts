import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import authRoutes from "./routes/auth.routes";
import settingsRoutes from './routes/settings.routes';
import promptsRoutes from './routes/prompts.routes';
import contentIdeasRoutes from "./routes/contentIdeas.routes";
import projectRoutes from "./routes/project.routes";
import userProfileRoutes from "./routes/userProfile.routes";
// Load environment variables
dotenv.config();

const app: Express = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(requestLogger);
}

app.get('/health', (_req, res) => {
  const mode = (process.env.NODE_ENV || "").trim().toLowerCase();
  res.json({
    success: true,
    status: "ok",
    message: "ArtFlow Backend API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    devSkipLogin: mode === "development",
  });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({ 
    success: true,
    message: 'ArtFlow Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/content-ideas", contentIdeasRoutes);
app.use("/api/prompts", promptsRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;

