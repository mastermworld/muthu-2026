import { PrismaClient, Survey } from '@prisma/client';

const prisma = new PrismaClient();

type SurveyCreateInput = Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>;

export const createSurvey = async (surveyData: SurveyCreateInput): Promise<Survey> => {
  return prisma.survey.create({ data: surveyData });
};

export const getAllSurveys = async (): Promise<Survey[]> => {
  return prisma.survey.findMany({ orderBy: { createdAt: 'desc' } });
};

export const getSurveyById = async (id: number): Promise<Survey | null> => {
  return prisma.survey.findUnique({ where: { id } });
};

export const getSurveysWithPagination = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [surveys, total] = await Promise.all([
    prisma.survey.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.survey.count(),
  ]);

  return {
    surveys,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

/**
 * Search by numeric ID, email, or phone number.
 * Falls back to a LIKE search on fullName if nothing exact is found.
 */
export const searchMemberByQuery = async (query: string): Promise<Survey | null> => {
  const numericId = Number(query);
  if (!isNaN(numericId) && Number.isInteger(numericId)) {
    const byId = await prisma.survey.findUnique({ where: { id: numericId } });
    if (byId) return byId;
  }

  const byEmail = await prisma.survey.findFirst({ where: { email: query } });
  if (byEmail) return byEmail;

  const byPhone = await prisma.survey.findFirst({ where: { mobile: query } });
  if (byPhone) return byPhone;

  return prisma.survey.findFirst({
    where: { fullName: { contains: query } },
  });
};

export const searchMembersByQuery = async (query: string, limit: number = 10): Promise<Survey[]> => {
  if (!query || query.length < 2) return [];

  return prisma.survey.findMany({
    where: {
      OR: [
        { fullName: { contains: query } },
        { email: { contains: query } },
        { mobile: { contains: query } },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};
