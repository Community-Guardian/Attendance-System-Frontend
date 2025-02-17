import { GeolocationZone } from "./geolocation";
import { User } from ".";
import { Timetable } from "./timetables";
import { Course } from "./courses";
export interface AttendanceSession {
    id: string;
    timetable: Partial<Timetable>;
    lecturer: Partial<User>;
    course: Partial<Course>;
    start_time: string;
    end_time: string;
    is_makeup_class: boolean;
    geolocation_zone: Partial<GeolocationZone>;
  }
  
  export interface AttendanceRecord {
    id: string;
    session: Partial<AttendanceSession>;
    student: Partial<User>;
    timestamp: string;
    latitude: number;
    longitude: number;
    signed_by_lecturer: boolean;
  }