import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FeedbackService {
  async getAllFeedback() {
    try {
      const feedbacks = await prisma.feedback.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return feedbacks;
    } catch (error) {
      console.error('Error in getAllFeedback:', error);
      throw new Error('Failed to get feedbacks');
    }
  }

  async getFeedbackById(id: string) {
    try {
      const feedback = await prisma.feedback.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!feedback) {
        throw new Error('Feedback not found');
      }

      return feedback;
    } catch (error) {
      console.error('Error in getFeedbackById:', error);
      throw new Error('Failed to get feedback');
    }
  }

  async createFeedback(data: {
    userId: string;
    title: string;
    description: string;
    type: string;
    status: string;
  }) {
    try {
      const feedback = await prisma.feedback.create({
        data: {
          userId: data.userId,
          title: data.title,
          description: data.description,
          type: data.type,
          status: data.status
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return feedback;
    } catch (error) {
      console.error('Error in createFeedback:', error);
      throw new Error('Failed to create feedback');
    }
  }

  async updateFeedback(id: string, data: {
    title?: string;
    description?: string;
    type?: string;
    status?: string;
  }) {
    try {
      const feedback = await prisma.feedback.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          type: data.type,
          status: data.status
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return feedback;
    } catch (error) {
      console.error('Error in updateFeedback:', error);
      throw new Error('Failed to update feedback');
    }
  }

  async deleteFeedback(id: string) {
    try {
      await prisma.feedback.delete({
        where: { id }
      });

      return { message: 'Feedback deleted successfully' };
    } catch (error) {
      console.error('Error in deleteFeedback:', error);
      throw new Error('Failed to delete feedback');
    }
  }
} 