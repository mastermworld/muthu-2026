import { Router } from 'express';
import { submitSurvey, getSurveys, getSurvey, searchMember, searchMembers } from '../controllers/survey.controller';
import { upload } from '../middleware/upload';
import validate from '../middleware/validateResource';
import { surveySchema } from '../schemas/survey.schema';

const router = Router();

// GET routes for fetching surveys
router.get('/survey', getSurveys);
router.get('/survey/search', searchMembers); // Must be before /survey/:id to avoid conflicts
router.get('/survey/search/:query', searchMember);
router.get('/survey/:id', getSurvey);

// The request will now be processed by this pipeline:
// 1. Multer ('upload') handles the file upload.
// 2. Zod ('validate') validates the request body against the surveySchema.
// 3. The controller ('submitSurvey') executes the business logic.
router.post(
  '/survey',
  upload.single('profilePicture'),
  validate(surveySchema),
  submitSurvey
);

export default router; 