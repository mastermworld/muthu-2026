import { PrismaClient, Feedback } from '@prisma/client';

const prisma = new PrismaClient();

interface FeedbackInput {
  name: string;
  email: string;
  phone?: string;
  category: string;
  rating: number;
  message: string;
}

export const createFeedback = async (data: FeedbackInput): Promise<Feedback> => {
  return prisma.feedback.create({ data });
};

export const getAllFeedback = async (): Promise<Feedback[]> => {
  return prisma.feedback.findMany({ orderBy: { createdAt: 'desc' } });
};
