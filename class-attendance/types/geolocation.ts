/**
 * Types for Geolocation app models and serializers
 */

export interface GeolocationZone {
  id: string;
  name: string;
  coordinates: Coordinates[]; // GeoJSON format
  capacity: number;
  radius: number;
  is_active: boolean;
}
export interface Coordinates{
  lat: number;
  lon: number;
}
export interface GeolocationCheckRequest {
  latitude: number;
  longitude: number;
  session_id: string;
}