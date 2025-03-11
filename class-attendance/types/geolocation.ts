export interface GeolocationZone {
  id: string;
  name: string;
  coordinates: Coordinate[];
  capacity: number;
  is_active: boolean;
  current_count?: number;
  distance?: number;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}