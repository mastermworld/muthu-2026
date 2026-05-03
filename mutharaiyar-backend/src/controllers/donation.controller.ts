import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { createDonation, getAllDonations } from '../services/donation.service';
import logger from '../utils/logger';

/**
 * @desc    Record a new donation intent
 * @route   POST /api/donation
 * @access  Public
 */
export const submitDonation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { donorName, email, phone } = req.body;
  const donation = await createDonation({ donorName, email, phone });
  logger.info(`New donation intent recorded with ID: ${donation.id}`);
  res.status(201).json({ status: 'success', message: 'Donation recorded successfully.', data: donation });
});

/**
 * @desc    Get all donation records
 * @route   GET /api/donation
 * @access  Public
 */
export const getDonations = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const donations = await getAllDonations();
  res.status(200).json({ status: 'success', data: donations });
});
