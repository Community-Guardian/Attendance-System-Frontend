import { BaseModel } from './base'
import type { Course } from './courses'

export interface AttendanceReport extends BaseModel {
  course: Course
  course_id?: string
  attendance_percentage: number
  total_sessions: number
  attended_sessions: number
}
