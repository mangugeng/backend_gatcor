import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  searchLocations,
  geocode,
  reverseGeocode,
  createGeofence,
  getGeofenceById,
  updateGeofence,
  deleteGeofence
} from '../../../controllers/location/location.controller';

const router = Router();

// Semua endpoint lokasi memerlukan autentikasi
router.use(authenticate);

// Pencarian lokasi
router.get('/search', searchLocations);

// Geocoding
router.get('/geocode', geocode);

// Reverse geocoding
router.get('/reverse-geocode', reverseGeocode);

// Geofence
router.post('/geofence', createGeofence);
router.get('/geofence/:id', getGeofenceById);
router.put('/geofence/:id', updateGeofence);
router.delete('/geofence/:id', deleteGeofence);

export default router; 