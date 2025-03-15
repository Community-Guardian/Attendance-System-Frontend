import { Timetable } from './timetables';
import { User } from './user';
import { ClassGroup } from './school';
import { GeolocationZone } from './geolocation';
/**
 * Types for Attendance app models and serializers
 */

export interface AttendanceSession {
  id: string;
  timetable: Timetable;
  timetable_id?: string; // Used when creating/updating
  lecturer: User;
  lecturer_id?: string; // Used when creating/updating
  class_group: ClassGroup;
  class_group_id?: string; // Used when creating/updating
  start_time: string;
  end_time: string;
  timestamp: string;
  geolocation_zone: GeolocationZone;
  geolocation_zone_id?: string; // Used when creating/updating
  is_active: boolean;
}

export interface AttendanceRecord {
  id: string;
  session: AttendanceSession;
  session_id?: string; // Used when creating/updating
  student: User;
  student_id?: string; // Used when creating/updating
  timestamp: string;
  verification_method: string;
  facial_image: File | string;
  status: 'present' | 'absent' | 'late' | 'excused';
}