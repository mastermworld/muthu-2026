import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { createSurvey, getAllSurveys, getSurveyById, getSurveysWithPagination, searchMemberByQuery, searchMembersByQuery } from '../services/survey.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import logger from '../utils/logger';

/**
 * @desc    Submit a new survey
 * @route   POST /api/survey
 * @access  Public
 */
export const submitSurvey = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { file } = req;
  if (!file) {
    res.status(400).json({ message: 'Profile picture is required.' });
    return;
  }

  const mobileCount = await prisma.survey.count({ where: { mobile: req.body.mobile } });
  if (mobileCount >= 3) {
    res.status(409).json({ status: 'error', message: `A record with this mobile number already exists 3 times.`, field: 'mobile' });
    return;
  }

  const emailCount = await prisma.survey.count({ where: { email: req.body.email } });
  if (emailCount >= 3) {
    res.status(409).json({ status: 'error', message: `A record with this email address already exists 3 times.`, field: 'email' });
    return;
  }

  if (req.body.altMobile) {
    const altMobileCount = await prisma.survey.count({ where: { altMobile: req.body.altMobile } });
    if (altMobileCount >= 3) {
      res.status(409).json({ status: 'error', message: `A record with this alternative mobile number already exists 3 times.`, field: 'altMobile' });
      return;
    }
  }

  let formattedDate = req.body.birthdate;
  if (req.body.birthdate && req.body.birthdate.includes('-')) {
    const parts = req.body.birthdate.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      formattedDate = `${day}/${month}/${year}`;
    }
  }

  const surveyData = {
    ...req.body,
    profilePicture: `uploads/${file.filename}`,
    birthdate: formattedDate,
  };

  const newSurvey = await createSurvey(surveyData);

  logger.info(`New survey submitted successfully with ID: ${newSurvey.id}`);
  
  res.status(201).json({ message: 'Survey submitted successfully!', data: newSurvey });
});

/**
 * @desc    Get all surveys
 * @route   GET /api/survey
 * @access  Public
 */
export const getSurveys = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = req.query;
  
  if (page || limit) {
    // Return paginated results
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    
    const result = await getSurveysWithPagination(pageNum, limitNum);
    res.status(200).json({ message: 'Surveys retrieved successfully', data: result });
  } else {
    // Return all surveys
    const surveys = await getAllSurveys();
    res.status(200).json({ message: 'Surveys retrieved successfully', data: surveys });
  }
});

/**
 * @desc    Get survey by ID
 * @route   GET /api/survey/:id
 * @access  Public
 */
export const getSurvey = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid survey ID' });
    return;
  }

  const survey = await getSurveyById(id);
  
  if (!survey) {
    res.status(404).json({ message: 'Survey not found' });
    return;
  }
  
  res.status(200).json({ message: 'Survey retrieved successfully', data: survey });
});

/**
 * @desc    Search for a member by userID, email, or phone
 * @route   GET /api/survey/search/:query
 * @access  Public
 */
export const searchMember = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { query } = req.params;
  
  if (!query || query.length < 2) {
    res.status(400).json({ message: 'Search query must be at least 2 characters long' });
    return;
  }
  
  const member = await searchMemberByQuery(query);
  
  if (!member) {
    res.status(404).json({ message: 'Member not found' });
    return;
  }
  
  res.status(200).json({ message: 'Member found successfully', data: member });
});

/**
 * @desc    Search for multiple members by query
 * @route   GET /api/survey/search
 * @access  Public
 */
export const searchMembers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { q, limit } = req.query;
  
  if (!q || (q as string).length < 2) {
    res.status(400).json({ message: 'Search query must be at least 2 characters long' });
    return;
  }
  
  const limitNum = parseInt(limit as string) || 10;
  const members = await searchMembersByQuery(q as string, limitNum);
  
  res.status(200).json({ 
    message: 'Search completed successfully', 
    data: members,
    count: members.length 
  });
}); 