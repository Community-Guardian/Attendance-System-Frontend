import { BaseModel } from './base'
import type { User } from './user'
import type { Timetable } from './timetables'
import type { ClassGroup } from './school'
import type { GeolocationZone } from './geolocation'

export interface AttendanceSession extends BaseModel {
  lecturer: User
  lecturer_id?: string
  timetable: Timetable
  timetable_id?: string
  class_group: ClassGroup
  class_group_id?: string
  geolocation_zone: GeolocationZone
  geolocation_zone_id?: string
  start_time: string
  end_time: string
  is_active: boolean
}

export interface AttendanceRecord extends BaseModel {
  student: User
  student_id?: string
  session: AttendanceSession
  session_id?: string
  timestamp: string
  facial_image: string
}