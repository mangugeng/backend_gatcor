import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SurveyService {
  async getAllSurveys() {
    try {
      const surveys = await prisma.survey.findMany({
        include: {
          questions: true,
          responses: {
            include: {
              answers: true
            }
          }
        }
      });

      return surveys;
    } catch (error) {
      console.error('Error in getAllSurveys:', error);
      throw new Error('Failed to get surveys');
    }
  }

  async getSurveyById(id: string) {
    try {
      const survey = await prisma.survey.findUnique({
        where: { id },
        include: {
          questions: true,
          responses: {
            include: {
              answers: true
            }
          }
        }
      });

      if (!survey) {
        throw new Error('Survey not found');
      }

      return survey;
    } catch (error) {
      console.error('Error in getSurveyById:', error);
      throw new Error('Failed to get survey');
    }
  }

  async createSurvey(data: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    questions: {
      text: string;
      type: string;
      options?: string[];
      required: boolean;
    }[];
  }) {
    try {
      const survey = await prisma.survey.create({
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          isActive: data.isActive,
          questions: {
            create: data.questions.map(question => ({
              text: question.text,
              type: question.type,
              options: question.options,
              required: question.required
            }))
          }
        },
        include: {
          questions: true
        }
      });

      return survey;
    } catch (error) {
      console.error('Error in createSurvey:', error);
      throw new Error('Failed to create survey');
    }
  }

  async updateSurvey(id: string, data: {
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
    questions?: {
      id?: string;
      text: string;
      type: string;
      options?: string[];
      required: boolean;
    }[];
  }) {
    try {
      const survey = await prisma.survey.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          isActive: data.isActive,
          questions: data.questions ? {
            upsert: data.questions.map(question => ({
              where: { id: question.id || '' },
              create: {
                text: question.text,
                type: question.type,
                options: question.options,
                required: question.required
              },
              update: {
                text: question.text,
                type: question.type,
                options: question.options,
                required: question.required
              }
            }))
          } : undefined
        },
        include: {
          questions: true
        }
      });

      return survey;
    } catch (error) {
      console.error('Error in updateSurvey:', error);
      throw new Error('Failed to update survey');
    }
  }

  async deleteSurvey(id: string) {
    try {
      await prisma.survey.delete({
        where: { id }
      });

      return { message: 'Survey deleted successfully' };
    } catch (error) {
      console.error('Error in deleteSurvey:', error);
      throw new Error('Failed to delete survey');
    }
  }

  async addSurveyResponse(surveyId: string, data: {
    userId: string;
    answers: {
      questionId: string;
      answer: string | string[];
    }[];
  }) {
    try {
      const response = await prisma.surveyResponse.create({
        data: {
          surveyId,
          userId: data.userId,
          answers: {
            create: data.answers.map(answer => ({
              questionId: answer.questionId,
              answer: Array.isArray(answer.answer) ? answer.answer : [answer.answer]
            }))
          }
        },
        include: {
          answers: true
        }
      });

      return response;
    } catch (error) {
      console.error('Error in addSurveyResponse:', error);
      throw new Error('Failed to add survey response');
    }
  }

  async getSurveyResponses(surveyId: string) {
    try {
      const responses = await prisma.surveyResponse.findMany({
        where: { surveyId },
        include: {
          answers: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return responses;
    } catch (error) {
      console.error('Error in getSurveyResponses:', error);
      throw new Error('Failed to get survey responses');
    }
  }
} 