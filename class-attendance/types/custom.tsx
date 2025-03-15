// Course-specific attendance stats for students
interface StudentCourseAttendanceStats {
    course_id: string;           // Integer ID of the course
    course_name: string;         // String name of the course
    attended_sessions: number;   // Integer count of sessions attended
    total_sessions: number;      // Integer count of total available sessions
    attendance_percentage: number; // Float percentage rounded to 2 decimal places
  }
  
  // Overall attendance summary for students
  interface StudentOverallAttendanceStats {
    attended_sessions: number;    // Integer sum of all attended sessions
    total_sessions: number;       // Integer sum of all available sessions
    attendance_percentage: number; // Float percentage rounded to 2 decimal places
  }
  // Course-specific attendance stats for lecturers
interface LecturerCourseAttendanceStats {
    course_id: string;              // Integer ID of the course
    course_name: string;            // String name of the course
    total_students_attended: number; // Integer count of students who attended
    total_students: number;         // Integer count of total enrolled students
    attendance_percentage: number;   // Float percentage rounded to 2 decimal places
  }
  
  // Overall attendance summary for lecturers
  interface LecturerOverallAttendanceStats {
    attended_sessions: number;     // Integer sum of all students who attended across courses
    total_sessions: number;        // Integer sum of all enrolled students across courses
    attendance_percentage: number;  // Float percentage rounded to 2 decimal places
  }
//   {
//     "courses": Array<CourseAttendanceStats>,
//     "overall_attendance": OverallAttendanceStats
//   }
    // Course-specific attendance stats for students
export interface StudentCourseAttendance{
    courses: StudentCourseAttendanceStats[]
    overall_attendance: StudentOverallAttendanceStats
}
export interface LecturerCourseAttendance{
    courses: LecturerCourseAttendanceStats
    overall_attendance: LecturerOverallAttendanceStats
}