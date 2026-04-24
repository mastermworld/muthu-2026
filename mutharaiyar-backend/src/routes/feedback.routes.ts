import { Router } from 'express';
import { submitFeedback, getFeedback } from '../controllers/feedback.controller';

const router = Router();

router.post('/feedback', submitFeedback);
router.get('/feedback', getFeedback);

export default router;
