export interface Timetable {
    id: string;
    course: string;
    lecturer: string;
    day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    start_time: string;
    end_time: string;
    is_makeup_class: boolean;
  }
  
  export interface TimetablePDF {
    id: string;
    file: string;
    uploaded_at: string;
  }