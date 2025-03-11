// Import types from the provided files
import type { Department, Programme } from "./school"
import type { Course } from "./courses"
import type { AttendanceSession, AttendanceRecord } from "./attendance"
import type { Timetable } from "./timetables"
import type { AttendanceReport, StudentAttendanceHistory } from "./reports"

// Re-export all types
export type {
  Department,
  Programme,
  Course,
  AttendanceSession,
  AttendanceRecord,
  Timetable,
  AttendanceReport,
  StudentAttendanceHistory,
}

// Define additional types needed for the frontend
export interface User {
  id: string
  email: string
  role: "student" | "lecturer" | "hod" | "dean" | "config_user" | "admin"
  phone_number?: string
  is_verified: boolean
  date_joined: string
  last_updated: string
  student_id?: string
  registered_device_mac?: string
  registered_face?: string // URL to the image
  face_encoding?: ArrayBuffer
  employee_id?: string
  department?: Partial<Department> // Department ID
  programmes?: Partial<Programme>[]
  first_name?: string
  last_name?: string
}

export interface TokenRefresh {
  refresh: string
  access: string
}

export interface StudentAttendancePerCourse {
  course_id: string
  course_name: string
  attended_sessions: number
  total_sessions: number
  attendance_percentage: number
}

export interface OverallAttendance {
  attended_sessions: number
  total_sessions: number
  attendance_percentage: number
}

export interface StudentAttendanceResponse {
  courses: StudentAttendancePerCourse[]
  overall_attendance: OverallAttendance
}

export interface GeolocationZone {
  id: string
  name: string
  latitude: number
  longitude: number
  radius: number
}

