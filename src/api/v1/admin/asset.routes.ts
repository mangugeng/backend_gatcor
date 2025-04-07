import express from 'express';
import { authenticateUser } from '../../../middleware/auth.middleware';
import {
  upload,
  uploadAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset
} from '../../../controllers/admin/asset.controller';

const router = express.Router();

router.post('/upload', authenticateUser, upload.single('file'), uploadAsset);
router.get('/', authenticateUser, getAssets);
router.get('/:id', authenticateUser, getAssetById);
router.put('/:id', authenticateUser, updateAsset);
router.delete('/:id', authenticateUser, deleteAsset);

export default router; 