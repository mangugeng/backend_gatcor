import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export class LocationService {
  private readonly RADAR_API_KEY: string;
  private readonly RADAR_BASE_URL: string = 'https://api.radar.io/v1';
  private readonly OSM_BASE_URL: string = 'https://nominatim.openstreetmap.org';

  constructor() {
    this.RADAR_API_KEY = process.env.RADAR_API_KEY || '';
    if (!this.RADAR_API_KEY) {
      throw new Error('Radar API key is required');
    }
  }

  async searchLocations(query: string) {
    try {
      const response = await axios.get(`${this.RADAR_BASE_URL}/search/autocomplete`, {
        params: {
          query,
          layers: 'address,place,postalCode'
        },
        headers: {
          'Authorization': this.RADAR_API_KEY
        }
      });

      return response.data.addresses.map((place: any) => ({
        id: place.id,
        name: place.formattedAddress,
        address: place.formattedAddress,
        location: {
          lat: place.latitude,
          lng: place.longitude
        },
        type: place.type
      }));
    } catch (error) {
      console.error('Error in searchLocations:', error);
      throw new Error('Failed to search locations');
    }
  }

  async geocode(address: string) {
    try {
      const response = await axios.get(`${this.OSM_BASE_URL}/search`, {
        params: {
          q: address,
          format: 'json',
          limit: 1
        }
      });

      if (response.data.length === 0) {
        throw new Error('No results found');
      }

      const result = response.data[0];
      return {
        id: result.place_id,
        address: result.display_name,
        location: {
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon)
        },
        type: result.type
      };
    } catch (error) {
      console.error('Error in geocode:', error);
      throw new Error('Failed to geocode address');
    }
  }

  async reverseGeocode(lat: number, lng: number) {
    try {
      const response = await axios.get(`${this.OSM_BASE_URL}/reverse`, {
        params: {
          lat,
          lon: lng,
          format: 'json'
        }
      });

      if (!response.data) {
        throw new Error('No results found');
      }

      return {
        id: response.data.place_id,
        address: response.data.display_name,
        location: {
          lat: parseFloat(response.data.lat),
          lng: parseFloat(response.data.lon)
        },
        type: response.data.type
      };
    } catch (error) {
      console.error('Error in reverseGeocode:', error);
      throw new Error('Failed to reverse geocode coordinates');
    }
  }

  async createGeofence(data: {
    name: string;
    description?: string;
    center: { lat: number; lng: number };
    radius: number;
    type: string;
  }) {
    try {
      const response = await axios.post(`${this.RADAR_BASE_URL}/geofences`, {
        description: data.description,
        type: data.type,
        coordinates: [data.center.lng, data.center.lat],
        radius: data.radius,
        metadata: {
          name: data.name
        }
      }, {
        headers: {
          'Authorization': this.RADAR_API_KEY
        }
      });

      return {
        id: response.data.id,
        name: data.name,
        description: data.description,
        center: data.center,
        radius: data.radius,
        type: data.type
      };
    } catch (error) {
      console.error('Error in createGeofence:', error);
      throw new Error('Failed to create geofence');
    }
  }

  async getGeofenceById(id: string) {
    try {
      const response = await axios.get(`${this.RADAR_BASE_URL}/geofences/${id}`, {
        headers: {
          'Authorization': this.RADAR_API_KEY
        }
      });

      return {
        id: response.data.id,
        name: response.data.metadata.name,
        description: response.data.description,
        center: {
          lat: response.data.coordinates[1],
          lng: response.data.coordinates[0]
        },
        radius: response.data.radius,
        type: response.data.type
      };
    } catch (error) {
      console.error('Error in getGeofenceById:', error);
      throw new Error('Failed to get geofence');
    }
  }

  async updateGeofence(id: string, data: {
    name?: string;
    description?: string;
    center?: { lat: number; lng: number };
    radius?: number;
    type?: string;
  }) {
    try {
      const response = await axios.patch(`${this.RADAR_BASE_URL}/geofences/${id}`, {
        description: data.description,
        type: data.type,
        coordinates: data.center ? [data.center.lng, data.center.lat] : undefined,
        radius: data.radius,
        metadata: data.name ? { name: data.name } : undefined
      }, {
        headers: {
          'Authorization': this.RADAR_API_KEY
        }
      });

      return {
        id: response.data.id,
        name: response.data.metadata.name,
        description: response.data.description,
        center: {
          lat: response.data.coordinates[1],
          lng: response.data.coordinates[0]
        },
        radius: response.data.radius,
        type: response.data.type
      };
    } catch (error) {
      console.error('Error in updateGeofence:', error);
      throw new Error('Failed to update geofence');
    }
  }

  async deleteGeofence(id: string) {
    try {
      await axios.delete(`${this.RADAR_BASE_URL}/geofences/${id}`, {
        headers: {
          'Authorization': this.RADAR_API_KEY
        }
      });

      return { message: 'Geofence deleted successfully' };
    } catch (error) {
      console.error('Error in deleteGeofence:', error);
      throw new Error('Failed to delete geofence');
    }
  }
} 