import { BaseModel } from './base'

export interface GeolocationZone extends BaseModel {
  name: string
  coordinates: {
    latitude: number
    longitude: number
    radius: number
  }
  capacity: number
  is_active: boolean
  distance?: number
}
