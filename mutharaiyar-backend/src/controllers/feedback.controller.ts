import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { createFeedback, getAllFeedback } from '../services/feedback.service';
import { sendFeedbackEmail } from '../utils/mailer';
import logger from '../utils/logger';

export const submitFeedback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, phone, category, rating, message } = req.body;

  if (!name || !email || !category || rating == null || !message) {
    res.status(400).json({ message: 'All fields are required.' });
    return;
  }

  const ratingNum = Number(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    return;
  }

  const feedbackData = {
    name,
    email,
    phone: phone || undefined,
    category,
    rating: ratingNum,
    message,
  };

  const feedback = await createFeedback(feedbackData);

  sendFeedbackEmail(feedbackData).catch(() => {});

  logger.info(`New feedback submitted (ID: ${feedback.id})`);
  res.status(201).json({ message: 'Feedback submitted successfully!', data: feedback });
});

export const getFeedback = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const feedback = await getAllFeedback();
  res.status(200).json({ message: 'Feedback retrieved successfully', data: feedback });
});
