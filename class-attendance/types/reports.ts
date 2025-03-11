import { Course } from "./courses";
import { User } from ".";
import { AttendanceSession } from "./attendance";
export interface AttendanceReport {
    id: string;
    course: Partial<Course>;
    total_students: number;
    students_present: number;
    attendance_percentage: number;
    report_date: string;
  }
  
  export interface StudentAttendanceHistory {
    id: string;
    student: Partial<User>;
    session: Partial<AttendanceSession>;
    signed_by_lecturer: boolean;
    timestamp: string;
  }
  
  export interface TimetableAdherence {
    id: string;
    lecturer: Partial<User>;
    session: Partial<AttendanceSession>;
    started_on_time: boolean;
    ended_on_time: boolean;
    deviation_minutes: number;
  }