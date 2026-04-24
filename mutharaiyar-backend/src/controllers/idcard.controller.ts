import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { IDCardService } from '../services/idcard.service';
import logger from '../utils/logger';

const idCardService = new IDCardService();

const parseId = (raw: string): number | null => {
  const n = parseInt(raw, 10);
  return isNaN(n) ? null : n;
};

export const getTemplates = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const templates = await idCardService.getAllTemplates();
  res.status(200).json({ message: 'Templates retrieved successfully', data: templates });
});

export const getTemplate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) { res.status(400).json({ message: 'Invalid template ID' }); return; }

  const template = await idCardService.getTemplateById(id);
  if (!template) { res.status(404).json({ message: 'Template not found' }); return; }

  res.status(200).json({ message: 'Template retrieved successfully', data: template });
});

export const getActiveTemplate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const template = await idCardService.getActiveTemplate();

  if (!template) {
    const defaultTemplate = {
      id: 0,
      name: 'Default Template',
      organizationTitle: 'Mutharaiyar Community',
      organizationLogo: '',
      style: 'modern',
      layout: 'horizontal',
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#60a5fa',
      textColor: '#ffffff',
      fontFamily: 'Inter',
      showQR: true,
      qrPosition: 'right',
      showFields: {
        photo: true, name: true, memberId: true, jobTitle: true,
        department: false, email: true, phone: true, address: true,
        bloodGroup: false, emergencyContact: false, validFrom: true,
        validUntil: false, signature: false,
      },
      isActive: true,
      isDefault: true,
    };
    res.status(200).json({ message: 'Using default template', data: defaultTemplate });
    return;
  }

  res.status(200).json({ message: 'Active template retrieved successfully', data: template });
});

export const createOrUpdateTemplate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { id, ...templateData } = req.body;

  let template;
  if (id) {
    const numId = typeof id === 'number' ? id : parseInt(id, 10);
    template = await idCardService.updateTemplate(numId, templateData);
    logger.info(`Template updated successfully with ID: ${numId}`);
  } else {
    template = await idCardService.createTemplate(templateData);
    logger.info(`New template created successfully with ID: ${template.id}`);
  }

  res.status(201).json({ message: 'Template saved successfully', data: template });
});

export const deleteTemplate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) { res.status(400).json({ message: 'Invalid template ID' }); return; }

  await idCardService.deleteTemplate(id);
  logger.info(`Template deleted successfully with ID: ${id}`);

  res.status(200).json({ message: 'Template deleted successfully' });
});

export const setActiveTemplate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) { res.status(400).json({ message: 'Invalid template ID' }); return; }

  const template = await idCardService.setActiveTemplate(id);
  logger.info(`Template activated successfully with ID: ${id}`);

  res.status(200).json({ message: 'Template activated successfully', data: template });
});

export const duplicateTemplate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) { res.status(400).json({ message: 'Invalid template ID' }); return; }

  const { name } = req.body;
  const newTemplate = await idCardService.duplicateTemplate(id, name);
  logger.info(`Template duplicated. Original: ${id}, New: ${newTemplate.id}`);

  res.status(201).json({ message: 'Template duplicated successfully', data: newTemplate });
});

