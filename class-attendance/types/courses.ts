import { Department,Programme,ClassGroup } from './school';
import { User } from './user';
/**
 * Types for Courses app models and serializers
 */

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  description: string;
  department: Department;
  department_id?: string; // Used when creating/updating
  programmes: Programme[];
  programme_ids?: string[]; // Used when creating/updating
  prerequisites: Course[];
  prerequisites_ids?: string[]; // Used when creating/updating
  active_enrollments_count: number;
  total_enrollments_count: number;
}

export interface Enrollment {
  id: string;
  class_group: ClassGroup;
  class_group_id?: string; // Used when creating/updating
  course: Course;
  course_id?: string; // Used when creating/updating
  lecturer: User;
  lecturer_id?: string; // Used when creating/updating
  semester?: string;
  year?: string;
  is_active: boolean;
}