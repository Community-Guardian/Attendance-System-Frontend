import { Department,Programme } from "./school";
export interface User {
  id: string;
  email: string;
  role: 'student' | 'lecturer' | 'hod' | 'dean' | 'config_user' | 'admin';
  phone_number?: string;
  is_verified: boolean;
  date_joined: string;
  last_updated: string;
  student_id?: string;
  registered_device_mac?: string;
  borrow_account_enabled: boolean;
  registered_face?: string; // URL to the image
  face_encoding?: ArrayBuffer;
  employee_id?: string;
  department?: Partial<Department>; // Department ID
  programmes?: Partial<Programme>[];
  first_name?: string;
  last_name?: string;
}

export interface TokenRefresh {
  refresh: string;
  access: string;
}

export interface RegisterUser {
  email: string;
  password: string;
  role: 'student' | 'lecturer' | 'hod' | 'dean' | 'config_user' | 'admin';
  phone_number?: string;
  student_id?: string;
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  registered_face?: File;
}

export interface UpdateUser {
  email?: string;
  password?: string;
  role?: 'student' | 'lecturer' | 'hod' | 'dean' | 'config_user' | 'admin';
  phone_number?: string;
  student_id?: string;
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  registered_face?: File;
}

export interface ResendEmailVerification {
  email: string;
}
export interface DjangoPaginatedResponse<T> {
  
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export type StudentAttendancePerCourse = {
  course_id: string;
  course_name: string;
  attended_sessions: number;
  total_sessions: number;
  attendance_percentage: number;
};

export type OverallAttendance = {
  attended_sessions: number;
  total_sessions: number;
  attendance_percentage: number;
};

export type StudentAttendanceResponse = {
  courses: StudentAttendancePerCourse[];
  overall_attendance: OverallAttendance;
};

