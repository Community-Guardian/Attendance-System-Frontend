import { BaseModel } from './base'
import type { Course } from './courses'
import type { ClassGroup } from './school'

export interface Timetable extends BaseModel {
  course: Course
  lecturer: string
  class_group: ClassGroup
  day_of_week: number
  start_time: string
  end_time: string
  location: string
  location_name: string
  duration: number
  available_slots: number
  is_makeup_class: boolean
  course_enrollment_id?: string
}
