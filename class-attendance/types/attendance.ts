import { Timetable } from "./timetables";
import { User } from ".";
import { Course } from "./courses";
import { GeolocationZone } from "./geolocation";
export interface AttendanceSession {
  id: string;
  timetable: Partial<Timetable>; // Timetable ID
  lecturer: Partial<User>; // CustomUser ID
  course: Partial<Course>; // Course ID
  start_time: string;
  end_time: string;
  is_makeup_class: boolean;
  geolocation_zone: Partial<GeolocationZone>; // GeolocationZone ID
  class_group: string; // ClassGroup ID
  is_active: boolean;
}

export interface AttendanceRecord {
  id: string;
  session: Partial<AttendanceSession>; // AttendanceSession ID
  student: Partial<User>; // CustomUser ID
  timestamp: string;
  latitude: number;
  longitude: number;
  signed_by_lecturer: boolean;
  facial_image: string; // URL to the image
}