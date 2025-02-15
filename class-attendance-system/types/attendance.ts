export interface AttendanceSession {
    id: string;
    timetable: string;
    lecturer: string;
    course: string;
    start_time: string;
    end_time: string;
    is_makeup_class: boolean;
    geolocation_zone: string;
  }
  
  export interface AttendanceRecord {
    id: string;
    session: string;
    student: string;
    timestamp: string;
    latitude: number;
    longitude: number;
    signed_by_lecturer: boolean;
  }