import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import surveyRoutes from './routes/survey.routes';
import idCardRoutes from './routes/idcard.routes';
import locationRoutes from './routes/location.routes';
import feedbackRoutes from './routes/feedback.routes';
import logger from './utils/logger';
import errorHandler from './middleware/errorHandler';
import { upload } from './middleware/upload';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Core Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Serve uploaded files statically
// This makes files in the 'uploads' directory accessible via URL, e.g., http://localhost:8080/uploads/filename.jpg
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Simple upload endpoint for logos
app.post('/api/upload', upload.single('organizationLogo'), (req: express.Request, res: express.Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    
    const filePath = `/uploads/${req.file.filename}`;
    res.json({ filePath });
  } catch (error) {
    logger.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// API Routes
// All routes defined in survey.routes.ts will be prefixed with /api
app.use('/api', surveyRoutes);
app.use('/api/idcard', idCardRoutes);
app.use('/api', locationRoutes);
app.use('/api', feedbackRoutes);

// Centralized Error Handler
// This MUST be the last middleware registered
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
  console.log(`API documentation might be available at http://localhost:${port}/api-docs`);
}); 