import { User } from ".";

export interface Department {
    id: string;
    name: string;
    hod: Partial<User> | null;
  }
  
  export interface Course {
    id: string;
    name: string;
    code: string;
    department: Partial<Department>;
    lecturers: Partial<User[]>;
    students: Partial<User[]>;
  }