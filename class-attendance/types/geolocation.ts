import { BaseModel } from './base'

export interface Coordinate {
  lat: number
  lon: number
}

export interface GeolocationZone extends BaseModel {
  name: string
  coordinates: Coordinate[]
  capacity: number
  is_active: boolean
  distance?: number
  radius?: number
}
