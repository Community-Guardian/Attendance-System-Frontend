/**
 * Types for Geolocation app models and serializers
 */

export interface GeolocationZone {
  id: string;
  name: string;
  coordinates: string; // GeoJSON format
  capacity: number;
  radius: number;
  is_active: boolean;
}

export interface GeolocationCheckRequest {
  latitude: number;
  longitude: number;
  session_id: string;
}