// const BASE_URL = 'https://attendancetrackingsystem.pythonanywhere.com';
const BASE_URL = 'http://127.0.0.1:8000';

export { BASE_URL };

// API Endpoints for User, Authentication and Password reset
// Auth Urls
export const REGISTER_URL = `${BASE_URL}/register/`;
export const LOGIN_URL = `${BASE_URL}/login/`;
export const LOGOUT_URL = `${BASE_URL}/logout/`;
export const VERIFY_TOKEN_URL = `${BASE_URL}/token/verify/`;
export const CHANGE_PASSWORD_URL = `${BASE_URL}/password/change`;
export const RESEND_EMAIL_URL = `${BASE_URL}/resend-email/`;
export const RESET_PASSWORD_URL = `${BASE_URL}/password/reset/`;
// User Urls
export const USER_URL = `${BASE_URL}/api/users/`;

// Token Refresh URL
export const REFRESH_TOKEN_URL = `${BASE_URL}/token/refresh/`;

// Attendance URLs
export const ATTENDANCE_SESSION_URL = `${BASE_URL}/attendance/attendance_sessions/`;
export const ATTENDANCE_RECORD_URL = `${BASE_URL}/attendance/attendance_records/`;

// Borrow Accounts URLs
export const BORROW_ACCOUNT_URL = `${BASE_URL}/borrow/borrow-accounts/`;
export const FACIAL_RECOGNITION_DATA_URL = `${BASE_URL}/borrow/facial-recognition/`;
export const BORROWED_ATTENDANCE_RECORD_URL = `${BASE_URL}/borrow/borrowed-attendance/`;


// Courses URLs
export const COURSE_ENROLLMENTS = `${BASE_URL}/courses/enrollments/`;
export const COURSE_URL = `${BASE_URL}/courses/courses/`;

// Geolocation URLs
export const GEOLOCATION_ZONE_URL = `${BASE_URL}/geolocation/geolocation_zones/`;

// School Management URLs
export const SCHOOL_URL = `${BASE_URL}/school/schools/`;
export const SEMESTER_URL = `${BASE_URL}/school/semesters/`;
export const ACADEMIC_YEAR_URL = `${BASE_URL}/school/academic-years/`;
export const DEPARTMENT_URL = `${BASE_URL}/school/departments/`;
export const PROGRAM_URL = `${BASE_URL}/school/programs/`;
export const CLASS_GROUPS_URL = `${BASE_URL}/school/class-groups/`;

// Config URLs
export const SYSTEM_SETTINGS_URL = `${BASE_URL}/config/system-settings/`;
export const CAT_ATTENDANCE_WEEK_URL = `${BASE_URL}/config/cat-weeks/`;
export const TIMETABLE_RULE_URL = `${BASE_URL}/config/timetable-rules/`;
export const AUDIT_LOG_URL = `${BASE_URL}/config/audit-logs/`;

// Timetables URLs
export const TIMETABLE_URL = `${BASE_URL}/timetable/timetables/`;
export const EXAM_TIMETABLE_URL = `${BASE_URL}/timetable/exams/`;

// UserManager URLs
export const CUSTOM_USER_URL = `${BASE_URL}/api/users/`;
export const MASS_REGISTER_URL = `${BASE_URL}/users/mass_register/`;
export const PASSWORD_RESET_URL = `${BASE_URL}/user/password/reset/`;
export const PASSWORD_RESET_CONFIRM_URL = `${BASE_URL}/reset/`;
export const TOKEN_REFRESH_URL = `${BASE_URL}/token/refresh/`;

// Reports URLs
export const ATTENDANCE_REPORT_URL = `${BASE_URL}/reports/attendance-reports/`;
export const STUDENT_ATTENDANCE_HISTORY_URL = `${BASE_URL}/reports/student-history/`;
export const TIMETABLE_ADHERENCE_URL = `${BASE_URL}/reports/timetable-adherence/`;
