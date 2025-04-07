import { Router } from 'express';
import { 
  uploadAsset,
  getAssetById,
  deleteAsset,
  getAllAssets,
  updateAssetMetadata,
  processAsset,
  getAssetUrl
} from '../../../controllers/asset/asset.controller';
import { authenticateUser } from '../../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

// Asset Routes
router.post('/upload', uploadAsset);
router.get('/:id', getAssetById);
router.delete('/:id', deleteAsset);
router.get('/', getAllAssets);
router.put('/:id', updateAssetMetadata);
router.post('/:id/process', processAsset);
router.get('/:id/url', getAssetUrl);

export default router; 