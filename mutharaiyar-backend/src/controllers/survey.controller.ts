import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { createSurvey, getAllSurveys, getSurveyById, getSurveysWithPagination, searchMemberByQuery, searchMembersByQuery } from '../services/survey.service';
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

  const surveyData = {
    ...req.body,
    profilePicture: `uploads/${file.filename}`, // Save relative path that matches static file serving
    birthdate: new Date(req.body.birthdate).toISOString(), // Ensure date format
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