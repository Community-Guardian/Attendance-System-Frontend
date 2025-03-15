import { User } from "./user";
/**
 * Types for Config app models and serializers
 */

export interface SystemSetting {
  id: string;
  attendance_radius: number;
  attendance_cutoff_time: number;
  cat_attendance_percentage: number;
  normal_attendance_percentage: number;
  site_name: string;
  term_start_date: string;
  term_end_date: string;
}

export interface CatAttendanceWeek {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

export interface TimetableRule {
  id: string;
  max_class_duration: number;
  allow_makeup_classes: boolean;
  max_classes_per_day: number;
  preferred_start_time: string;
  preferred_end_time: string;
}

export interface AuditLog {
  id: string;
  user: User;
  user_id?: string; // Used when creating/updating
  action: string;
  model_name: string;
  object_id: string;
  timestamp: string;
  details: string;
}