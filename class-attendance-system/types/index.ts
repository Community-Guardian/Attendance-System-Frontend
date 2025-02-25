export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'lecturer' | 'hod' | 'dp_academics' | 'config_user' | 'admin';
  department: string | null;
  mac_address: string | null;
  borrow_account_enabled: boolean;
  registered_face: string | null;
  full_name: string;
  created_at: string;
  updated_at: string;
  last_modified_by: string | null;
  is_active: boolean;
  is_superuser: boolean;
  is_staff: boolean;
  first_name: string;
  last_name: string;
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

