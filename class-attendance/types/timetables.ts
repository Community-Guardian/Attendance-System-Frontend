/**
 * Types for Timetables app models and serializers
 */

// Import required types from other modules
import { Course } from './courses';
import { ClassGroup } from './school';

export interface Timetable {
  id: string;
  course: Course;
  lecturer: string;
  class_group: ClassGroup;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string; // ISO time format HH:MM:SS
  end_time: string;   // ISO time format HH:MM:SS
  location: string;   // Name of location
  location_name: string;
  duration: number;   // in minutes
  available_slots: number;
  is_makeup_class: boolean;
  course_enrollment_id?: string; // Used when creating/updating
}

export interface ExaminationTimetable {
  id: string;
  course: Course;
  course_id?: string; // Used when creating/updating
  class_groups: ClassGroup[];
  class_group_ids?: string[]; // Used when creating/updating
  semester: string;
  semester_id?: string; // Used when creating/updating
  exam_date: string;  // ISO date format YYYY-MM-DD
  start_time: string; // ISO time format HH:MM:SS
  end_time: string;   // ISO time format HH:MM:SS
  location: string;
  location_id?: string; // Used when creating/updating
  duration: number;   // in minutes
  class_groups_list: string[];
  is_ongoing: boolean;
  has_finished: boolean;
}

export interface TimetableCreateRequest {
  course_enrollment_id: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string; // ISO time format HH:MM:SS
  end_time: string;   // ISO time format HH:MM:SS
  location_id: string;
  is_makeup_class?: boolean;
}

export interface ExaminationTimetableCreateRequest {
  course_id: string;
  class_group_ids: string[];
  semester_id: string;
  exam_date: string;  // ISO date format YYYY-MM-DD
  start_time: string; // ISO time format HH:MM:SS
  end_time: string;   // ISO time format HH:MM:SS
  location_id: string;
}

export interface GenerateTimetableRequest {
  semester: string; // UUID of semester
}

export interface TimetableBySemesterParams {
  semester: string; // UUID of semester
}

export interface ExamsInRangeParams {
  start_date: string; // ISO date format YYYY-MM-DD
  end_date: string;   // ISO date format YYYY-MM-DD
}