/**
 * API Configuration
 * 
 * This file centralizes all API endpoints based on the Django backend structure.
 * All endpoints are directly extracted from Django urls.py files and corresponding views.
 */

// Base URL Configuration - Change this based on your environment
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export { BASE_URL };

// ===================================================================
// Authentication & User Management
// ===================================================================
// From attendance/urls.py - Django REST Auth endpoints
export const LOGIN_URL = `${BASE_URL}/login/`;  // From dj_rest_auth.urls
export const LOGOUT_URL = `${BASE_URL}/logout/`;  // From dj_rest_auth.urls
export const PASSWORD_CHANGE_URL = `${BASE_URL}/password/change/`;  // From dj_rest_auth.urls
export const PASSWORD_RESET_URL = `${BASE_URL}/password/reset/`;  // From dj_rest_auth.urls
export const REGISTER_URL = `${BASE_URL}/register/`;  // From dj_rest_auth.registration.urls
export const TOKEN_URL = `${BASE_URL}/token/`;  // TokenObtainPairView in attendance/urls.py
export const TOKEN_REFRESH_URL = `${BASE_URL}/token/refresh/`;  // CustomTokenRefreshView in userManager/urls.py
export const TOKEN_VERIFY_URL = `${BASE_URL}/token/verify/`;  // TokenVerifyView in userManager/urls.py

// From userManager/urls.py - Custom auth endpoints
export const EMAIL_CONFIRMATION_URL = `${BASE_URL}/register/account-confirm-email/`;  // confirm_email function
export const RESEND_EMAIL_URL = `${BASE_URL}/resend-email/`;  // ResendEmailVerificationView
export const PASSWORD_RESET_CONFIRM_URL = `${BASE_URL}/api/reset/`;  // PasswordResetConfirmView

// ===================================================================
// User Management
// ===================================================================
// From userManager/urls.py - UserViewSet endpoints
export const USER_URL = `${BASE_URL}/api/users/`;  // UserViewSet - CRUD operations
export const MASS_REGISTER_URL = `${BASE_URL}/api/users/mass_register//`;  // @action in UserViewSet
// ===================================================================
// Attendance Management
// ===================================================================
// From attendance_app/urls.py - AttendanceSessionViewSet endpoints
export const ATTENDANCE_SESSION_URL = `${BASE_URL}/attendance/attendance_sessions/`;  // AttendanceSessionViewSet - CRUD
export const CLOSE_SESSION_URL = `${BASE_URL}/attendance/attendance_sessions/{id}/close_session/`;  // @action to close session
export const ATTENDANCE_STATS_URL = `${BASE_URL}/attendance/attendance_records/student_attendance_per_course/`;  // @action in AttendanceSessionViewSet

// From attendance_app/urls.py - AttendanceRecordViewSet endpoints
export const ATTENDANCE_RECORD_URL = `${BASE_URL}/attendance/attendance_records/`;  // AttendanceRecordViewSet - CRUD
export const GEOLOCATION_CHECK_URL = `${BASE_URL}/attendance/attendance_records/is_within_geofence/`;  // @action in AttendanceRecordViewSet
export const SIGN_ATTENDANCE_URL = `${BASE_URL}/attendance/attendance_records/sign_attendance/`;  // @action in AttendanceRecordViewSet

// ===================================================================
// Course Management
// ===================================================================
// From courses/urls.py - CourseViewSet endpoints
export const COURSE_URL = `${BASE_URL}/courses/courses/`;  // CourseViewSet - CRUD operations
export const COURSES_BY_DEPARTMENT_URL = `${BASE_URL}/courses/courses/by_department/`;  // @action in CourseViewSet
export const COURSES_BY_PROGRAMME_URL = `${BASE_URL}/courses/courses/by_programme/`;  // @action in CourseViewSet
export const COURSE_STATS_URL = `${BASE_URL}/courses/courses/{id}/stats/`;  // @action in CourseViewSet - course statistics
export const LECTURER_COURSES_URL = `${BASE_URL}/courses/courses/lecturer_courses/`;  // @action in CourseViewSet - get logged-in lecturer's courses
export const ASSIGN_PROGRAMMES_URL = `${BASE_URL}/courses/courses/{id}/assign_programmes/`;  // @action in CourseViewSet - assign programmes to course

// From courses/urls.py - EnrollmentViewSet endpoints
export const ENROLLMENT_URL = `${BASE_URL}/courses/enrollments/`;  // EnrollmentViewSet - CRUD operations
export const ACTIVE_ENROLLMENTS_URL = `${BASE_URL}/courses/enrollments/active_courses/`;  // @action in EnrollmentViewSet
export const ENROLLMENT_BY_CURRENT_SEMESTER_URL = `${BASE_URL}/courses/enrollments/current_semester/`;  // @action in EnrollmentViewSet
export const ENROLLMENT_ATTENDANCE_SUMMARY_URL = `${BASE_URL}/courses/enrollments/{id}/attendance_summary/`;  // @action in EnrollmentViewSet
export const COURSE_ENROLLMENTS = `${BASE_URL}/courses/enrollments/`;  // EnrollmentViewSet with filter by course_id
// ===================================================================

// ===================================================================
// Timetable Management
// ===================================================================
// From timetables/views.py - TimetableViewSet endpoints
export const TIMETABLE_URL = `${BASE_URL}/timetable/timetables/`;  // TimetableViewSet - CRUD operations
export const GENERATE_TIMETABLE_URL = `${BASE_URL}/timetable/timetables/generate/`;  // TimetableViewSet.generate - POST method
export const TIMETABLES_BY_SEMESTER = `${BASE_URL}/timetable/timetables/by_semester/`;  // TimetableViewSet.by_semester - GET ?semester=uuid
export const TIMETABLE_SLOTS_URL = `${BASE_URL}/timetable/slots/`;  // TimetableSlotsViewSet - CRUD operations
export const TIMETABLE_CONFLICTS_URL = `${BASE_URL}/timetable/timetables/check_conflicts/`;  // @action check_conflicts in TimetableViewSet

// From timetables/views.py - ExaminationTimetableViewSet endpoints
export const EXAM_TIMETABLE_URL = `${BASE_URL}/timetable/exams/`;  // ExaminationTimetableViewSet - CRUD operations
export const GENERATE_EXAM_TIMETABLE_URL = `${BASE_URL}/timetable/exams/generate/`;  // ExaminationTimetableViewSet.generate - POST method
export const UPCOMING_EXAMS_URL = `${BASE_URL}/timetable/exams/upcoming_exams/`;  // ExaminationTimetableViewSet.upcoming_exams - GET
export const EXAM_IN_RANGE = `${BASE_URL}/timetable/exams/exams_in_range/`;  // ExaminationTimetableViewSet.exams_in_range - GET ?start_date&end_date

// ===================================================================
// Geolocation
// ===================================================================
// From geolocation/urls.py
export const GEOLOCATION_ZONE_URL = `${BASE_URL}/geolocation/geolocation_zones/`;  // GeolocationZoneViewSet - CRUD operations
export const ACTIVE_ZONES_URL = `${BASE_URL}/geolocation/geolocation_zones/active_zones/`;  // @action in GeolocationZoneViewSet
// ===================================================================
// School Structure
// ===================================================================
// From school/urls.py - defined in router, but specific file not provided
export const SCHOOL_URL = `${BASE_URL}/school/schools/`;  // SchoolViewSet endpoints (reference in attendance/urls.py)
export const SCHOOL_STATS = `${BASE_URL}/school/schools/{id}/statistics/`;  // SchoolViewSet - get school statistics
export const DEPARTMENT_URL = `${BASE_URL}/school/departments/`;  // DepartmentViewSet endpoints (reference in attendance/urls.py)
export const DEPARTMENT_STATS = `${BASE_URL}/school/departments/{id}/statistics/`;  // DepartmentViewSet - get department statistics
export const PROGRAM_URL = `${BASE_URL}/school/programs/`;  // ProgrammeViewSet endpoints (reference in attendance/urls.py)
export const CLASS_GROUPS_URL = `${BASE_URL}/school/class-groups/`;  // ClassGroupViewSet endpoints (reference in attendance/urls.py)
export const SEMESTER_URL = `${BASE_URL}/school/semesters/`;  // SemesterViewSet endpoints (reference in attendance/urls.py)
export const CURRENT_SEMESTER_URL = `${BASE_URL}/school/semesters/current/`;  // SemesterViewSet - get current semester only
export const ACADEMIC_YEAR_URL = `${BASE_URL}/school/academic-years/`;  // AcademicYearViewSet endpoints (reference in attendance/urls.py)

// ===================================================================
// System Configuration
// ===================================================================
// From config/urls.py
export const SYSTEM_SETTINGS_URL = `${BASE_URL}/config/system-settings/`;  // SystemSettingViewSet - CRUD operations
export const CAT_WEEKS_URL = `${BASE_URL}/config/cat-weeks/`;  // CatAttendanceWeekViewSet - CRUD operations
export const TIMETABLE_RULES_URL = `${BASE_URL}/config/timetable-rules/`;  // TimetableRuleViewSet - CRUD operations
export const AUDIT_LOGS_URL = `${BASE_URL}/config/audit-logs/`;  // AuditLogViewSet - CRUD operations

// ===================================================================
// Reports
// ===================================================================
// From reports/urls.py - Specific API views
export const ATTENDANCE_REPORTS_URL = `${BASE_URL}/reports/attendance-reports/`;  // AttendanceReportListView
export const STUDENT_ATTENDANCE_HISTORY_URL = `${BASE_URL}/reports/student-history/`;  // StudentAttendanceHistoryView
export const TIMETABLE_ADHERENCE_URL = `${BASE_URL}/reports/timetable-adherence/`;  // TimetableAdherenceView

// ===================================================================
// Helper function to generate URL with ID parameter
// ===================================================================
/**
 * Replaces {id} placeholder in URL with actual ID
 * @param url Base URL with {id} placeholder
 * @param id ID to insert
 * @returns URL with ID inserted
 */
export const withId = (url: string, id: string | number): string => {
  return url.replace('{id}', id.toString());
};

/**
 * Standard API endpoint structure for ViewSets
 * These follow the REST convention for Django REST Framework ViewSets
 */
export const API_ENDPOINTS = {
  // For any ViewSet, these standard endpoints are available:
  // LIST: GET /{base_url}/
  // CREATE: POST /{base_url}/
  // RETRIEVE: GET /{base_url}/{id}/
  // UPDATE: PUT /{base_url}/{id}/
  // PARTIAL_UPDATE: PATCH /{base_url}/{id}/
  // DESTROY: DELETE /{base_url}/{id}/
};