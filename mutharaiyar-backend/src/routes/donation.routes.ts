import { Router } from 'express';
import { submitDonation, getDonations } from '../controllers/donation.controller';
import validateResource from '../middleware/validateResource';
import { donationSchema } from '../schemas/donation.schema';

const router = Router();

router.post('/donation', validateResource(donationSchema), submitDonation);
router.get('/donation', getDonations);

export default router;
