import type { Course } from "./courses"
import type { User } from "."

export interface AttendanceSession {
  id: string
  course: Partial<Course>
  startTime: string
  endTime?: string
  date?: string
  duration: string
  studentsPresent: number
  totalStudents: number
  location: string
  status: "active" | "completed" | "cancelled"
}

export interface AttendanceReport {
  id: string
  course: Partial<Course>
  date: string
  totalStudents: number
  studentsPresent: number
  attendancePercentage: number
}

export interface StudentAttendance {
  id: string
  student: Partial<User>
  status: "present" | "absent" | "late"
  timestamp?: string
}

export interface CourseAttendanceSummary {
  courseId: string
  courseName: string
  courseCode: string
  totalSessions: number
  averageAttendance: number
  totalStudents: number
}

