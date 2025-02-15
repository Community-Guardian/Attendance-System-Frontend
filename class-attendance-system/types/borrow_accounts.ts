export interface BorrowAccount {
    id: string;
    student: string;
    is_active: boolean;
    created_at: string;
  }
  
  export interface FacialRecognitionData {
    id: string;
    student: string;
    encoding: ArrayBuffer;
    created_at: string;
  }
  
  export interface BorrowedAttendanceRecord {
    id: string;
    session: string;
    student: string;
    borrow_account: string;
    timestamp: string;
    latitude: number;
    longitude: number;
    signed_by_lecturer: boolean;
  }