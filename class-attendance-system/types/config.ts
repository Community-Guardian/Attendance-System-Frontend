export interface SystemSetting {
    id: string;
    attendance_radius: number;
    attendance_cutoff_time: string;
    created_at: string;
    updated_at: string;
    last_modified_by: string | null;
  }
  
  export interface CatAttendanceWeek {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    last_modified_by: string | null;
  }
  
  export interface TimetableRule {
    id: string;
    max_class_duration: number;
    allow_makeup_classes: boolean;
    created_at: string;
    updated_at: string;
    last_modified_by: string | null;
  }
  
  export interface AuditLog {
    id: string;
    user: string | null;
    model_name: string;
    object_id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    changes: string;
    timestamp: string;
  }