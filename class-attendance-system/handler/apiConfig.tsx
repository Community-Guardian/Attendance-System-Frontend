const BASE_URL = 'https://attendancetrackingsystem.pythonanywhere.com';
// const BASE_URL = 'http://127.0.0.1:8000';

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
export const ATTENDANCE_RECORD_URL = `${BASE_URL}/attendance/records/`;

// Borrow Accounts URLs
export const BORROW_ACCOUNT_URL = `${BASE_URL}/borrow/borrow-accounts/`;
export const FACIAL_RECOGNITION_DATA_URL = `${BASE_URL}/borrow/facial-recognition/`;
export const BORROWED_ATTENDANCE_RECORD_URL = `${BASE_URL}/borrow/borrowed-attendance/`;

// Config URLs
export const SYSTEM_SETTINGS_URL = `${BASE_URL}/config/system-settings/`;
export const CAT_ATTENDANCE_WEEK_URL = `${BASE_URL}/config/cat-attendance-week/`;
export const TIMETABLE_RULE_URL = `${BASE_URL}/config/timetable-rule/`;
export const AUDIT_LOG_URL = `${BASE_URL}/config/audit-log/`;

// Courses URLs
export const DEPARTMENT_URL = `${BASE_URL}/courses/departments/`;
export const COURSE_URL = `${BASE_URL}/courses/`;

// Geolocation URLs
export const GEOLOCATION_ZONE_URL = `${BASE_URL}/geolocation/geolocation_zones/`;

// Reports URLs
export const ATTENDANCE_REPORT_URL = `${BASE_URL}/reports/attendance-reports/`;
export const STUDENT_ATTENDANCE_HISTORY_URL = `${BASE_URL}/reports/student-history/`;
export const TIMETABLE_ADHERENCE_URL = `${BASE_URL}/reports/timetable-adherence/`;

// Timetables URLs
export const TIMETABLE_URL = `${BASE_URL}/timetables/`;
export const TIMETABLE_PDF_URL = `${BASE_URL}/timetables/timetable-pdfs/`;

// UserManager URLs
export const CUSTOM_USER_URL = `${BASE_URL}/api/users/`;
export const MAC_ADDRESS_UPDATE_URL = `${BASE_URL}/api/update-mac/`;
export const PASSWORD_RESET_URL = `${BASE_URL}/user/password/reset/`;
export const PASSWORD_RESET_CONFIRM_URL = `${BASE_URL}/reset/`;
export const TOKEN_REFRESH_URL = `${BASE_URL}/token/refresh/`;