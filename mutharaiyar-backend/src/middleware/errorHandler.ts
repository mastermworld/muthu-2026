import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import logger from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'An unexpected error occurred';

  // Log the full error for debugging
  logger.error(err);

  // Handle specific Prisma errors for user-friendly messages
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        // Unique constraint violation
        const fields = (err.meta as { target?: string[] })?.target?.join(', ');
        message = `A record with this ${fields} already exists.`;
        statusCode = 409; // Conflict
        break;
      case 'P2025':
        // Record to update or delete not found
        message = 'The requested record was not found.';
        statusCode = 404; // Not Found
        break;
      default:
        message = 'A database error occurred.';
        break;
    }
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    // Include stack trace in development for easier debugging
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler; 