import { Request, Response } from 'express';
import { RatingService } from '../../services/rating.service';

const ratingService = new RatingService();

export const createRating = async (req: Request, res: Response) => {
  try {
    // Implementasi logika pembuatan rating
    res.status(201).json({ message: 'Rating berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getAllRatings = async (req: Request, res: Response) => {
  try {
    // Implementasi logika mendapatkan semua rating
    res.status(200).json({ message: 'Berhasil mendapatkan semua rating' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getRatingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Implementasi logika mendapatkan rating by ID
    res.status(200).json({ message: `Berhasil mendapatkan rating dengan ID ${id}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const updateRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    const updatedRating = await ratingService.updateRating(id, { rating, review });

    return res.status(200).json({
      success: true,
      message: 'Rating berhasil diupdate',
      data: updatedRating
    });
  } catch (error) {
    console.error('Error in updateRating controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengupdate rating',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const deleteRating = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await ratingService.deleteRating(id);

    return res.status(200).json({
      success: true,
      message: 'Rating berhasil dihapus'
    });
  } catch (error) {
    console.error('Error in deleteRating controller:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat menghapus rating',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserRatings = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // Implementasi logika mendapatkan rating user
    res.status(200).json({ message: `Berhasil mendapatkan rating user dengan ID ${userId}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

export const getOrderRatings = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    // Implementasi logika mendapatkan rating order
    res.status(200).json({ message: `Berhasil mendapatkan rating order dengan ID ${orderId}` });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}; 