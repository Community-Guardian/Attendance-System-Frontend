export interface User {
  id: string
  name: string
  email: string
  role: "student" | "lecturer"
}

export interface Student extends User {
  studentId: string
  macAddress?: string
  useFacialRecognition: boolean
}

export interface Lecturer extends User {
  lecturerId: string
}

export interface Course {
  id: string
  name: string
  code: string
  lecturerId: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  courseId: string
  date: Date
  status: "present" | "absent" | "late"
}

export interface AttendanceSession {
  id: string
  courseId: string
  date: Date
  startTime: Date
  endTime: Date
  location: {
    latitude: number
    longitude: number
    radius: number // in meters
  }
}

