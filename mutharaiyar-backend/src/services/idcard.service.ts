import { PrismaClient } from '@prisma/client';
import { IDCardTemplateType } from '../schemas/idcard.schema';

const prisma = new PrismaClient();

export class IDCardService {

  async getAllTemplates() {
    return prisma.iDCardTemplate.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getTemplateById(id: number) {
    return prisma.iDCardTemplate.findUnique({ where: { id } });
  }

  async getActiveTemplate() {
    return prisma.iDCardTemplate.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTemplate(data: IDCardTemplateType) {
    if (data.isActive) {
      await prisma.iDCardTemplate.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });
    }
    return prisma.iDCardTemplate.create({ data });
  }

  async updateTemplate(id: number, data: Partial<IDCardTemplateType>) {
    if (data.isActive) {
      await prisma.iDCardTemplate.updateMany({
        where: { isActive: true, NOT: { id } },
        data: { isActive: false },
      });
    }
    return prisma.iDCardTemplate.update({ where: { id }, data });
  }

  async deleteTemplate(id: number) {
    return prisma.iDCardTemplate.delete({ where: { id } });
  }

  async setActiveTemplate(id: number) {
    await prisma.iDCardTemplate.updateMany({ data: { isActive: false } });
    return prisma.iDCardTemplate.update({ where: { id }, data: { isActive: true } });
  }

  async duplicateTemplate(id: number, newName?: string) {
    const original = await this.getTemplateById(id);
    if (!original) throw new Error('Template not found');

    const { id: _, createdAt, updatedAt, ...templateData } = original;
    return this.createTemplate({
      ...templateData,
      name: newName || `${original.name} (Copy)`,
      isActive: false,
      isDefault: false,
    } as IDCardTemplateType);
  }

}
