// Base URL Configuration
// const BASE_URL = 'https://attendancetrackingsystem.pythonanywhere.com';
const BASE_URL = 'http://127.0.0.1:8000';

export { BASE_URL };

// ==========================================
// Authentication & User Management Endpoints
// ==========================================
export const REGISTER_URL = `${BASE_URL}/register/`;
export const LOGIN_URL = `${BASE_URL}/login/`;
export const LOGOUT_URL = `${BASE_URL}/logout/`;
export const VERIFY_TOKEN_URL = `${BASE_URL}/token/verify/`;
export const CHANGE_PASSWORD_URL = `${BASE_URL}/password/change/`;
export const RESEND_EMAIL_URL = `${BASE_URL}/resend-email/`;
export const RESET_PASSWORD_URL = `${BASE_URL}/password/reset/`;
export const PASSWORD_RESET_CONFIRM_URL = `${BASE_URL}/reset/`;

// Token Management
export const REFRESH_TOKEN_URL = `${BASE_URL}/token/refresh/`;
export const TOKEN_REFRESH_URL = `${BASE_URL}/token/refresh/`; // Duplicate - consider removing

// User Management
export const USER_URL = `${BASE_URL}/api/users/`;
export const CUSTOM_USER_URL = `${BASE_URL}/api/users/`; // Duplicate - consider removing
export const MASS_REGISTER_URL = `${BASE_URL}/api/users/mass_register/`;

// ==========================================
// Attendance Management Endpoints
// ==========================================
// Session Management
export const ATTENDANCE_SESSION_URL = `${BASE_URL}/attendance/attendance_sessions/`;
export const ATTENDANCE_RECORD_URL = `${BASE_URL}/attendance/attendance_records/`;

// Borrowed Attendance
export const BORROW_ACCOUNT_URL = `${BASE_URL}/borrow/borrow-accounts/`;
export const FACIAL_RECOGNITION_DATA_URL = `${BASE_URL}/borrow/facial-recognition/`;
export const BORROWED_ATTENDANCE_RECORD_URL = `${BASE_URL}/borrow/borrowed-attendance/`;

// ==========================================
// Course Management Endpoints
// ==========================================
export const COURSE_URL = `${BASE_URL}/courses/courses/`;
export const COURSE_ENROLLMENTS = `${BASE_URL}/courses/enrollments/`;
export const COURSE_ATTENDANCE_SETTINGS = `${BASE_URL}/courses/enrollments/settings/`;
export const COURSE_STUDENTS = `${BASE_URL}/courses/enrollments/students/`;

// ==========================================
// School Management Endpoints
// ==========================================
// Institution Structure
export const SCHOOL_URL = `${BASE_URL}/school/schools/`;
export const DEPARTMENT_URL = `${BASE_URL}/school/departments/`;
export const PROGRAM_URL = `${BASE_URL}/school/programs/`;
export const CLASS_GROUPS_URL = `${BASE_URL}/school/class-groups/`;

// Academic Calendar
export const SEMESTER_URL = `${BASE_URL}/school/semesters/`;
export const ACADEMIC_YEAR_URL = `${BASE_URL}/school/academic-years/`;

// ==========================================
// Timetable Management Endpoints
// ==========================================
export const TIMETABLE_URL = `${BASE_URL}/timetable/timetables/`;
export const EXAM_TIMETABLE_URL = `${BASE_URL}/timetable/exams/`;
export const TIMETABLE_SLOTS_URL = `${BASE_URL}/timetable/slots/`;
export const TIMETABLE_CONFLICTS_URL = `${BASE_URL}/timetable/conflicts/`;
export const GENERATE_TIMETABLE_URL = `${BASE_URL}/timetable/timetables/generate/`;

// ==========================================
// Configuration & Settings Endpoints
// ==========================================
// System Settings
export const SYSTEM_SETTINGS_URL = `${BASE_URL}/config/system-settings/`;
export const CAT_ATTENDANCE_WEEK_URL = `${BASE_URL}/config/cat-weeks/`;
export const TIMETABLE_RULE_URL = `${BASE_URL}/config/timetable-rules/`;
export const AUDIT_LOG_URL = `${BASE_URL}/config/audit-logs/`;

// Geolocation
export const GEOLOCATION_ZONE_URL = `${BASE_URL}/geolocation/geolocation_zones/`;
export const GEOLOCATION_LOGS_URL = `${BASE_URL}/geolocation/logs/`;
export const GEOLOCATION_SETTINGS_URL = `${BASE_URL}/geolocation/settings/`;

// ==========================================
// Reporting Endpoints
// ==========================================
// Attendance Reports
export const ATTENDANCE_REPORT_URL = `${BASE_URL}/reports/attendance-reports/`;
export const STUDENT_ATTENDANCE_HISTORY_URL = `${BASE_URL}/reports/student-history/`;
export const TIMETABLE_ADHERENCE_URL = `${BASE_URL}/reports/timetable-adherence/`;

// Analytics
export const ATTENDANCE_ANALYTICS_URL = `${BASE_URL}/reports/analytics/attendance/`;
export const COURSE_ANALYTICS_URL = `${BASE_URL}/reports/analytics/courses/`;
export const STUDENT_ANALYTICS_URL = `${BASE_URL}/reports/analytics/students/`;

// Export Reports
export const EXPORT_ATTENDANCE_REPORT_URL = `${BASE_URL}/reports/export/attendance/`;
export const EXPORT_COURSE_REPORT_URL = `${BASE_URL}/reports/export/courses/`;
export const EXPORT_STUDENT_REPORT_URL = `${BASE_URL}/reports/export/students/`;

// ==========================================
// Dashboard Endpoints
// ==========================================
// Admin Dashboard
export const ADMIN_DASHBOARD_STATS_URL = `${BASE_URL}/dashboard/admin/stats/`;
export const ADMIN_DASHBOARD_ANALYTICS_URL = `${BASE_URL}/dashboard/admin/analytics/`;

// Lecturer Dashboard
export const LECTURER_DASHBOARD_STATS_URL = `${BASE_URL}/dashboard/lecturer/stats/`;
export const LECTURER_COURSES_URL = `${BASE_URL}/dashboard/lecturer/courses/`;

// Student Dashboard
export const STUDENT_DASHBOARD_STATS_URL = `${BASE_URL}/dashboard/student/stats/`;
export const STUDENT_COURSES_URL = `${BASE_URL}/dashboard/student/courses/`;

// HOD Dashboard
export const HOD_DASHBOARD_STATS_URL = `${BASE_URL}/dashboard/hod/stats/`;
export const DEPARTMENT_ANALYTICS_URL = `${BASE_URL}/dashboard/hod/department/`;

// Dean Dashboard
export const DEAN_DASHBOARD_STATS_URL = `${BASE_URL}/dashboard/dean/stats/`;
export const SCHOOL_ANALYTICS_URL = `${BASE_URL}/dashboard/dean/school/`;
