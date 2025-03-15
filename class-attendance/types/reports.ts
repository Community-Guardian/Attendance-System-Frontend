import { Course } from './courses';
import { AttendanceSession } from './attendance';
import { User } from './user';
/**
 * Types for Reports app models and serializers
 */

export interface AttendanceReport {
  id: string;
  course: Course;
  course_id?: string; // Used when creating/updating
  date_generated: string;
  attendance_percentage: number;
  detailed_data: any;
}

export interface StudentAttendanceHistory {
  id: string;
  student: User;
  student_id?: string; // Used when creating/updating
  session: AttendanceSession;
  session_id?: string; // Used when creating/updating
  status: 'present' | 'absent' | 'late' | 'excused';
  timestamp: string;
}

export interface TimetableAdherence {
  id: string;
  lecturer: User;
  lecturer_id?: string; // Used when creating/updating
  session: AttendanceSession;
  session_id?: string; // Used when creating/updating
  started_on_time: boolean;
  ended_on_time: boolean;
  deviation_minutes: number;
}