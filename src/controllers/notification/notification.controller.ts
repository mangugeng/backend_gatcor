import { Request, Response } from 'express';
import { NotificationService } from '../../services/notification.service';

const notificationService = new NotificationService();

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, title, message, type, data } = req.body;

    const notification = await notificationService.createNotification({
      userId,
      title,
      message,
      type,
      data
    });

    return res.status(201).json({
      success: true,
      message: 'Notifikasi berhasil dibuat',
      data: notification
    });
  } catch (error) {
    console.error('Error in createNotification controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat membuat notifikasi',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await notificationService.getAllNotifications(page, limit);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan daftar notifikasi',
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    console.error('Error in getAllNotifications controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan daftar notifikasi',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getNotificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await notificationService.getNotificationById(id);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan detail notifikasi',
      data: notification
    });
  } catch (error) {
    console.error('Error in getNotificationById controller:', error);
    if (error instanceof Error && error.message === 'Notification not found') {
      return res.status(404).json({
        success: false,
        message: 'Notifikasi tidak ditemukan'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan detail notifikasi',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, message, type, data } = req.body;

    const notification = await notificationService.updateNotification(id, {
      title,
      message,
      type,
      data
    });

    return res.status(200).json({
      success: true,
      message: 'Notifikasi berhasil diupdate',
      data: notification
    });
  } catch (error) {
    console.error('Error in updateNotification controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate notifikasi',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await notificationService.deleteNotification(id);

    return res.status(200).json({
      success: true,
      message: 'Notifikasi berhasil dihapus'
    });
  } catch (error) {
    console.error('Error in deleteNotification controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus notifikasi',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await notificationService.getUserNotifications(userId, page, limit);

    return res.status(200).json({
      success: true,
      message: 'Berhasil mendapatkan notifikasi user',
      data: result.data,
      meta: result.meta
    });
  } catch (error) {
    console.error('Error in getUserNotifications controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mendapatkan notifikasi user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id);

    return res.status(200).json({
      success: true,
      message: 'Notifikasi berhasil ditandai sebagai sudah dibaca',
      data: notification
    });
  } catch (error) {
    console.error('Error in markAsRead controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menandai notifikasi',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 