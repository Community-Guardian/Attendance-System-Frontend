export interface Department {
    id: string;
    name: string;
    hod: string | null;
  }
  
  export interface Course {
    id: string;
    name: string;
    code: string;
    department: string;
    lecturers: string[];
    students: string[];
  }