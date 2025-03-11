export interface AcademicYear {
    id: string;
    year: string;
    is_active: boolean;
    active_semesters?: Semester[];
  }
  
  export interface Semester {
    id: string;
    name: 'Semester 1' | 'Semester 2' | 'Trimester';
    academic_year: string; // AcademicYear ID
    start_date: string;
    end_date: string;
    is_active: boolean;
    duration?: number;
    is_current?: boolean;
  }
  
  export interface School {
    id: string;
    name: string;
    dean: string | null; // CustomUser ID
    total_departments?: number;
    total_programmes?: number;
    total_class_groups?: number;
    total_students?: number;
    total_lecturers?: number;
  }
  
  export interface Department {
    id: string;
    name: string;
    school: string; // School ID
    hod: string | null; // CustomUser ID
    total_programmes?: number;
    total_class_groups?: number;
    total_students?: number;
    total_lecturers?: number;
  }
  
  export interface Programme {
    id: string;
    name: string;
    code: string;
    department: string; // Department ID
    lecturers: string[]; // Array of CustomUser IDs
    total_students?: number;
  }
  
  export interface ClassGroup {
    id: string;
    programme: string; // Programme ID
    year: number;
    students: string[]; // Array of CustomUser IDs
    total_students?: number;
    name?: string;
  }