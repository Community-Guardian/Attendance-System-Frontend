import { User } from ".";
import { Department,Programme } from "./school";
// Type definitions for courses
export interface Course {
  id: string;
  name: string;
  code: string;
  department: Partial<Department>;
  programmes: Partial<Programme>[];
  lecturers: Partial<User>[];
  students: Partial<User>[];
  prerequisites: Partial<Course>[];  // Add this line if missing
  description?: string;
  active_enrollments_count?: number;
  total_enrollments_count?: number;
}

export interface Enrollment {
  id: string;
  class_group: string; // ClassGroup ID
  course: Partial<Course>; // Course ID
  student: Partial<User>; // CustomUser ID
  lecturer: Partial<User>; // CustomUser ID
  semester: string; // Semester ID
  is_active: boolean;
}