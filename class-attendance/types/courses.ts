import { User } from ".";
import { Department,Programme } from "./school";
// Type definitions for courses
export interface Course {
  id: string;
  name: string;
  code: string;
  department: Partial<Department>; // Department ID
  programmes: Partial<Programme>[]; // Array of Programme IDs
  lecturers: Partial<User>[]; // Array of CustomUser IDs
  students: Partial<User>[]; // Array of CustomUser IDs
}

export interface Enrollment {
  id: string;
  class_group: string; // ClassGroup ID
  course: Partial<Course>; // Course ID
  student: Partial<User>; // CustomUser ID
}