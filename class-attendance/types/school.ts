/**
 * Types for School app models and serializers
 */

export interface School {
  id: string;
  name: string;
  dean: string;
  dean_id?: string; // Used when creating/updating
  total_departments: number;
  total_programmes: number;
  total_students: number;
  total_lecturers: number;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  school: string;
  school_id?: string; // Used when creating/updating
  hod: string;
  total_programmes: number;
  total_students: number;
  total_lecturers: number;
  programmes: Programme[];
}

export interface Programme {
  id: string;
  name: string;
  code: string;
  department: string;
  department_id?: string; // Used when creating/updating
  total_students: number;
  class_groups: ClassGroup[];
}

export interface ClassGroup {
  id: string;
  programme: string;
  programme_id?: string; // Used when creating/updating
  year: number;
  total_students: number;
}

export interface Semester {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  academic_year: string;
  academic_year_id?: string; // Used when creating/updating
  duration: number; // In days
  is_current: boolean;
}

export interface AcademicYear {
  id: string;
  year: string;
  active_semesters: Semester[];
}