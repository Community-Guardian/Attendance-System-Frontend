export interface AttendanceReport {
    id: string;
    course: string;
    total_students: number;
    students_present: number;
    attendance_percentage: number;
    report_date: string;
  }
  
  export interface StudentAttendanceHistory {
    id: string;
    student: string;
    session: string;
    signed_by_lecturer: boolean;
    timestamp: string;
  }
  
  export interface TimetableAdherence {
    id: string;
    lecturer: string;
    session: string;
    started_on_time: boolean;
    ended_on_time: boolean;
    deviation_minutes: number;
  }