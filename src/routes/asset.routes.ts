import { Router } from 'express';
import multer from 'multer';
import {
  uploadAsset,
  getAssetById,
  deleteAsset,
  getAllAssets,
  updateAsset,
  processAsset,
  getAssetUrl
} from '../controllers/asset/asset.controller';

const router = Router();
const upload = multer();

// Asset routes
router.post('/upload', upload.single('file'), uploadAsset);
router.get('/:id', getAssetById);
router.delete('/:id', deleteAsset);
router.get('/', getAllAssets);
router.put('/:id', updateAsset);
router.post('/:id/process', processAsset);
router.get('/:id/url', getAssetUrl);

export default router; 