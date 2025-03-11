const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

class ApiService {
  // Authentication
  static REGISTER_URL = `${BASE_URL}/register/`;
  static LOGIN_URL = `${BASE_URL}/login/`;
  static LOGOUT_URL = `${BASE_URL}/logout/`;
  static VERIFY_TOKEN_URL = `${BASE_URL}/token/verify/`;
  static CHANGE_PASSWORD_URL = `${BASE_URL}/password/change`;
  static RESEND_EMAIL_URL = `${BASE_URL}/resend-email/`;
  static RESET_PASSWORD_URL = `${BASE_URL}/password/reset/`;
  
  // Users
  static USER_URL = `${BASE_URL}/api/users/`;

  // Token Refresh
  static REFRESH_TOKEN_URL = `${BASE_URL}/token/refresh/`;

  // Attendance
  static ATTENDANCE_SESSION_URL = `${BASE_URL}/attendance/attendance_sessions/`;
  static ATTENDANCE_RECORD_URL = `${BASE_URL}/attendance/attendance_records/`;

  // Borrow Accounts
  static BORROW_ACCOUNT_URL = `${BASE_URL}/borrow/borrow-accounts/`;
  static FACIAL_RECOGNITION_DATA_URL = `${BASE_URL}/borrow/facial-recognition/`;
  static BORROWED_ATTENDANCE_RECORD_URL = `${BASE_URL}/borrow/borrowed-attendance/`;

  // Courses
  static COURSE_ENROLLMENTS = `${BASE_URL}/courses/enrollments/`;
  static COURSE_URL = `${BASE_URL}/courses/courses/`;

  // Geolocation
  static GEOLOCATION_ZONE_URL = `${BASE_URL}/geolocation/geolocation_zones/`;

  // School Management
  static SCHOOL_URL = `${BASE_URL}/school/schools/`;
  static SEMESTER_URL = `${BASE_URL}/school/semesters/`;
  static ACADEMIC_YEAR_URL = `${BASE_URL}/school/academic-years/`;
  static DEPARTMENT_URL = `${BASE_URL}/school/departments/`;
  static PROGRAM_URL = `${BASE_URL}/school/programs/`;
  static CLASS_GROUPS_URL = `${BASE_URL}/school/class-groups/`;

  // Config
  static SYSTEM_SETTINGS_URL = `${BASE_URL}/config/system-settings/`;
  static CAT_ATTENDANCE_WEEK_URL = `${BASE_URL}/config/cat-weeks/`;
  static TIMETABLE_RULE_URL = `${BASE_URL}/config/timetable-rules/`;
  static AUDIT_LOG_URL = `${BASE_URL}/config/audit-logs/`;

  // Timetables
  static TIMETABLE_URL = `${BASE_URL}/timetable/timetables/`;
  static EXAM_TIMETABLE_URL = `${BASE_URL}/timetable/exams/`;

  // UserManager
  static CUSTOM_USER_URL = `${BASE_URL}/api/users/`;
  static MASS_REGISTER_URL = `${BASE_URL}/users/mass_register/`;
  static PASSWORD_RESET_URL = `${BASE_URL}/user/password/reset/`;
  static PASSWORD_RESET_CONFIRM_URL = `${BASE_URL}/reset/`;
  static TOKEN_REFRESH_URL = `${BASE_URL}/token/refresh/`;

  // Reports
  static ATTENDANCE_REPORT_URL = `${BASE_URL}/reports/attendance-reports/`;
  static STUDENT_ATTENDANCE_HISTORY_URL = `${BASE_URL}/reports/student-history/`;
  static TIMETABLE_ADHERENCE_URL = `${BASE_URL}/reports/timetable-adherence/`;
}

export default ApiService;
