import { Router } from 'express';
import { 
  getTemplates,
  getTemplate,
  getActiveTemplate,
  createOrUpdateTemplate,
  deleteTemplate,
  setActiveTemplate,
  duplicateTemplate
} from '../controllers/idcard.controller';
import validate from '../middleware/validateResource';
import { idCardTemplateSchema } from '../schemas/idcard.schema';
import { upload } from '../middleware/upload';

const router = Router();

// Template Management Routes
router.get('/templates', getTemplates);
router.get('/template/active', getActiveTemplate);
router.get('/template/:id', getTemplate);

router.post('/template', 
  upload.single('organizationLogo'),
  validate(idCardTemplateSchema),
  createOrUpdateTemplate
);

router.put('/template/:id/activate', setActiveTemplate);
router.post('/template/:id/duplicate', duplicateTemplate);
router.delete('/template/:id', deleteTemplate);

export default router; 