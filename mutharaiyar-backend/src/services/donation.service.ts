import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDonation = async (data: { donorName: string; email: string; phone: string }) => {
  return prisma.donation.create({ data });
};

export const getAllDonations = async () => {
  return prisma.donation.findMany({ orderBy: { createdAt: 'desc' } });
};
