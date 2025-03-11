import { Course } from "./courses";
export interface Timetable {
  id: string;
  course: Partial<Course>; // Course ID
  lecturer: string; // CustomUser ID
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
  is_makeup_class: boolean;
  duration?: number;
  available_slots?: string[];
}

export interface ExaminationTimetable {
  id: string;
  course: Partial<Course>; // Course ID
  exam_date: string;
  start_time: string;
  end_time: string;
  location: string;
  class_groups: string[]; // Array of ClassGroup IDs
  duration?: number;
  class_groups_list?: string[];
  is_ongoing?: boolean;
  has_finished?: boolean;
}