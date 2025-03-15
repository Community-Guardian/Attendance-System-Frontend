/**
 * API Service Interface
 * 
 * This file provides a centralized interface for all API endpoints.
 * It serves as a reference for URL constants throughout the application.
 * The class acts purely as a namespace for endpoint URLs - no implementation logic.
 */

import {
  // Authentication & User Management
  REGISTER_URL,
  LOGIN_URL,
  LOGOUT_URL,
  TOKEN_VERIFY_URL,
  PASSWORD_CHANGE_URL,
  RESEND_EMAIL_URL,
  PASSWORD_RESET_URL,
  PASSWORD_RESET_CONFIRM_URL,
  TOKEN_REFRESH_URL,
  USER_URL,
  MASS_REGISTER_URL,
  EMAIL_CONFIRMATION_URL,
  TOKEN_URL,

  // Attendance Management
  ATTENDANCE_SESSION_URL,
  ATTENDANCE_RECORD_URL,
  CLOSE_SESSION_URL,
  ATTENDANCE_STATS_URL,
  GEOLOCATION_CHECK_URL,
  SIGN_ATTENDANCE_URL,

  // Course Management
  COURSE_URL,
  COURSES_BY_DEPARTMENT_URL,
  COURSES_BY_PROGRAMME_URL,
  ENROLLMENT_URL,
  ACTIVE_ENROLLMENTS_URL,
  COURSE_ENROLLMENTS,
  COURSE_STATS_URL,
  LECTURER_COURSES_URL,
  ASSIGN_PROGRAMMES_URL,
  ENROLLMENT_BY_CURRENT_SEMESTER_URL,
  ENROLLMENT_ATTENDANCE_SUMMARY_URL,

  // School Management
  SCHOOL_URL,
  DEPARTMENT_URL,
  PROGRAM_URL,
  CLASS_GROUPS_URL,
  SEMESTER_URL,
  CURRENT_SEMESTER_URL,
  ACADEMIC_YEAR_URL,
  SCHOOL_STATS,
  DEPARTMENT_STATS,

  // Timetable Management
  TIMETABLE_URL,
  EXAM_TIMETABLE_URL,
  TIMETABLE_SLOTS_URL,
  TIMETABLE_CONFLICTS_URL,
  GENERATE_TIMETABLE_URL,
  GENERATE_EXAM_TIMETABLE_URL,
  TIMETABLES_BY_SEMESTER,
  UPCOMING_EXAMS_URL,
  EXAM_IN_RANGE,


  // Configuration & Settings
  SYSTEM_SETTINGS_URL,
  CAT_WEEKS_URL,
  TIMETABLE_RULES_URL,
  AUDIT_LOGS_URL,

  // Geolocation
  GEOLOCATION_ZONE_URL,
  ACTIVE_ZONES_URL,

  // Reports
  ATTENDANCE_REPORTS_URL,
  STUDENT_ATTENDANCE_HISTORY_URL,
  TIMETABLE_ADHERENCE_URL,

  // Helper function
  withId,
} from './apiConfig';

/**
 * ApiService
 * 
 * A static class that provides a clean interface to all backend API endpoints.
 * This is purely a set of URL constants - no implementation logic is included.
 * 
 * Example usage:
 * import ApiService from '@/handler/ApiService';
 * 
 * // Use endpoints directly
 * axios.get(ApiService.COURSE_URL)
 */
class ApiService {
  /**
   * Authentication & User Management
   * ---------------------------------
   * Endpoints for handling user registration, authentication and profile management.
   */
  static REGISTER_URL = REGISTER_URL;                     // User registration endpoint
                                                          // POST: {email, password1, password2, role}
  static LOGIN_URL = LOGIN_URL;                           // User login endpoint
                                                          // POST: {email, password}
  static LOGOUT_URL = LOGOUT_URL;                         // User logout endpoint
                                                          // POST: {refresh} (refresh token)
  static TOKEN_URL = TOKEN_URL;                           // JWT token obtain endpoint
                                                          // POST: {email, password}
  static TOKEN_VERIFY_URL = TOKEN_VERIFY_URL;             // JWT token verification endpoint
                                                          // POST: {token}
  static TOKEN_REFRESH_URL = TOKEN_REFRESH_URL;           // JWT token refresh endpoint
                                                          // POST: {refresh} (refresh token)
  static PASSWORD_CHANGE_URL = PASSWORD_CHANGE_URL;       // Change user password endpoint
                                                          // POST: {new_password1, new_password2}
  static PASSWORD_RESET_URL = PASSWORD_RESET_URL;         // Request password reset endpoint
                                                          // POST: {email}
  static PASSWORD_RESET_CONFIRM_URL = PASSWORD_RESET_CONFIRM_URL;  // Confirm password reset endpoint
                                                          // POST: {token, uid, new_password1, new_password2}
  static RESEND_EMAIL_URL = RESEND_EMAIL_URL;             // Resend verification email endpoint
                                                          // POST: {email}
  static EMAIL_CONFIRMATION_URL = EMAIL_CONFIRMATION_URL; // Confirm email endpoint
                                                          // GET: Used with key parameter from email link
  static USER_URL = USER_URL;                             // User CRUD operations endpoint
                                                          // GET: List/retrieve users with optional filtering
                                                          // POST: Create new user
                                                          // PATCH/PUT: Update user
                                                          // DELETE: Remove user
  static MASS_REGISTER_URL = MASS_REGISTER_URL;           // Bulk user registration endpoint
                                                          // POST: {users: [{email, role, ...otherFields}]}

  /**
   * Attendance Management
   * ---------------------
   * Endpoints for handling attendance sessions, records and verification.
   */
  static ATTENDANCE_SESSION_URL = ATTENDANCE_SESSION_URL;       // Attendance sessions CRUD endpoint
                                                                // GET: List/retrieve sessions with optional filtering
                                                                // POST: {course, date, time_slot, location, geolocation_zone}
  static CLOSE_SESSION_URL = CLOSE_SESSION_URL;                 // Close attendance session endpoint
                                                                // POST: No body required, uses session ID in URL
                                                                // Usage: withId(CLOSE_SESSION_URL, sessionId)
  static ATTENDANCE_RECORD_URL = ATTENDANCE_RECORD_URL;         // Attendance records CRUD endpoint
                                                                // GET: List/retrieve records with optional filtering
                                                                // POST: {session, student, status, verification_method}
  static ATTENDANCE_STATS_URL = ATTENDANCE_STATS_URL;           // Student attendance statistics endpoint
                                                                // GET: ?student_id=<uuid>&course_id=<uuid>
  static GEOLOCATION_CHECK_URL = GEOLOCATION_CHECK_URL;         // Check if within geofence endpoint
                                                                // POST: {latitude, longitude, geolocation_zone_id}
  static SIGN_ATTENDANCE_URL = SIGN_ATTENDANCE_URL;             // Student sign attendance endpoint
                                                                // POST: {session_id, verification_method, geolocation_data}

  /**
   * Course Management
   * -----------------
   * Endpoints for handling courses, enrollments and related operations.
   */
  static COURSE_URL = COURSE_URL;                               // Course CRUD operations endpoint
                                                                // GET: List/retrieve courses with optional filtering
                                                                // POST: {code, name, credits, department, description}
  static COURSES_BY_DEPARTMENT_URL = COURSES_BY_DEPARTMENT_URL; // Courses by department endpoint
                                                                // GET: ?department_id=<uuid>
  static COURSES_BY_PROGRAMME_URL = COURSES_BY_PROGRAMME_URL;   // Courses by programme endpoint
                                                                // GET: ?programme_id=<uuid>
  static COURSE_STATS_URL = COURSE_STATS_URL;                   // Course statistics endpoint
                                                                // GET: Uses course ID in URL
                                                                // Usage: withId(COURSE_STATS_URL, courseId)
  static LECTURER_COURSES_URL = LECTURER_COURSES_URL;           // Get current lecturer's courses
                                                                // GET: Returns courses for logged-in lecturer in current semester
  static ASSIGN_PROGRAMMES_URL = ASSIGN_PROGRAMMES_URL;         // Assign programmes to course
                                                                // POST: {programme_ids: [uuid1, uuid2, ...]}
                                                                // Usage: withId(ASSIGN_PROGRAMMES_URL, courseId)
  static ENROLLMENT_URL = ENROLLMENT_URL;                       // Enrollment CRUD operations endpoint
                                                                // GET: List/retrieve enrollments with optional filtering
                                                                // POST: {course, student, semester, active}
  static ACTIVE_ENROLLMENTS_URL = ACTIVE_ENROLLMENTS_URL;       // Get active enrollments endpoint
                                                                // GET: ?student_id=<uuid> (optional)
  static ENROLLMENT_BY_CURRENT_SEMESTER_URL = ENROLLMENT_BY_CURRENT_SEMESTER_URL; // Current semester enrollments
                                                                // GET: Returns enrollments for current semester based on user role
  static ENROLLMENT_ATTENDANCE_SUMMARY_URL = ENROLLMENT_ATTENDANCE_SUMMARY_URL;   // Enrollment attendance summary
                                                                // GET: Uses enrollment ID in URL
                                                                // Usage: withId(ENROLLMENT_ATTENDANCE_SUMMARY_URL, enrollmentId) 
  static COURSE_ENROLLMENTS = COURSE_ENROLLMENTS;               // Course-specific enrollments endpoint
                                                                // GET: ?course_id=<uuid>
                                                                // POST: {course_id, student_id, class_group_id}

  /**
   * School Management
   * -----------------
   * Endpoints for handling institution structure and academic calendar.
   */
  static SCHOOL_URL = SCHOOL_URL;                     // Schools CRUD operations endpoint
                                                      // GET: List/retrieve schools with optional filtering
                                                      // POST: {name, code, address}
  static SCHOOL_STATS = SCHOOL_STATS;                 // School statistics endpoint
                                                      // GET: Uses school ID in URL
                                                      // Usage: withId(SCHOOL_STATS, schoolId)
  static DEPARTMENT_URL = DEPARTMENT_URL;             // Departments CRUD operations endpoint
                                                      // GET: List/retrieve departments with optional filtering
                                                      // POST: {name, code, school}
  static DEPARTMENT_STATS = DEPARTMENT_STATS;         // Department statistics endpoint
                                                      // GET: Uses department ID in URL
                                                      // Usage: withId(DEPARTMENT_STATS, departmentId)
  static PROGRAM_URL = PROGRAM_URL;                   // Programs CRUD operations endpoint
                                                      // GET: List/retrieve programs with optional filtering
                                                      // POST: {name, code, department, duration}
  static CLASS_GROUPS_URL = CLASS_GROUPS_URL;         // Class groups CRUD operations endpoint
                                                      // GET: List/retrieve class groups with optional filtering
                                                      // POST: {name, program, academic_year, capacity}
  static SEMESTER_URL = SEMESTER_URL;                 // Semesters CRUD operations endpoint
                                                      // GET: List/retrieve semesters with optional filtering
                                                      // POST: {name, start_date, end_date, academic_year}
  static CURRENT_SEMESTER_URL = CURRENT_SEMESTER_URL; // Current semester endpoint
                                                      // GET: Returns the currently active semester
  static ACADEMIC_YEAR_URL = ACADEMIC_YEAR_URL;       // Academic years CRUD operations endpoint
                                                      // GET: List/retrieve academic years with optional filtering
                                                      // POST: {name, start_date, end_date}

  /**
   * Timetable Management
   * --------------------
   * Endpoints for handling timetables, slots and related operations.
   */
  static TIMETABLE_URL = TIMETABLE_URL;               // Timetable CRUD operations endpoint
                                                      // GET: List/retrieve timetables with optional filtering
                                                      // POST: {course_enrollment_id, day_of_week, start_time, end_time, location}
  static GENERATE_TIMETABLE_URL = GENERATE_TIMETABLE_URL; // Generate timetable endpoint
                                                         // POST: {semester_id} - From TimetableViewSet.generate
  static TIMETABLES_BY_SEMESTER = TIMETABLES_BY_SEMESTER; // Get timetables by semester endpoint
                                                         // GET: ?semester=<uuid> - From TimetableViewSet.by_semester
 static TIMETABLE_SLOTS_URL = TIMETABLE_SLOTS_URL;   // Timetable slots CRUD operations endpoint
                                                      // GET: List/retrieve timetable slots with optional filtering
                                                      // POST: {day_of_week, start_time, end_time}
  static TIMETABLE_CONFLICTS_URL = TIMETABLE_CONFLICTS_URL; // Timetable conflicts check endpoint
                                                           // POST: Check for conflicts
  
  static EXAM_TIMETABLE_URL = EXAM_TIMETABLE_URL;     // Exam timetable CRUD operations endpoint
                                                      // GET: List/retrieve exam timetables with optional filtering
                                                      // POST: {course_id, exam_date, start_time, end_time, location_id, semester_id}
  static GENERATE_EXAM_TIMETABLE_URL = GENERATE_EXAM_TIMETABLE_URL; // Generate exam timetable endpoint
                                                                   // POST: {semester_id} - From ExaminationTimetableViewSet.generate
  static UPCOMING_EXAMS_URL = UPCOMING_EXAMS_URL;     // Get upcoming exams endpoint
                                                      // GET: Returns upcoming exams - From ExaminationTimetableViewSet.upcoming_exams
  static EXAM_IN_RANGE = EXAM_IN_RANGE;               // Get exams within date range endpoint
                                                      // GET: ?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD - From ExaminationTimetableViewSet.exams_in_range
  /**
   * Configuration & Settings
   * ------------------------
   * Endpoints for handling system-wide settings and configuration.
   */
  static SYSTEM_SETTINGS_URL = SYSTEM_SETTINGS_URL;         // System settings CRUD endpoint
                                                           // GET: Retrieve system settings
                                                           // POST/PUT: {attendance_radius, attendance_cutoff_time, etc.}
  static CAT_WEEKS_URL = CAT_WEEKS_URL;                     // CAT weeks CRUD endpoint
                                                           // GET: List/retrieve CAT weeks with optional filtering
                                                           // POST: {name, start_date, end_date}
  static TIMETABLE_RULES_URL = TIMETABLE_RULES_URL;         // Timetable rules CRUD endpoint
                                                           // GET: Retrieve timetable rules
                                                           // POST: {max_class_duration, allow_makeup classes}
  static AUDIT_LOGS_URL = AUDIT_LOGS_URL;                   // Audit logs endpoint
                                                           // GET: List/retrieve audit logs with optional filtering
                                                           // Query params: ?user=<uuid>&model_name=<name>&action=<action>

  /**
   * Geolocation
   * -----------
   * Endpoints for handling geolocation-based attendance tracking.
   */
  static GEOLOCATION_ZONE_URL = GEOLOCATION_ZONE_URL;       // Geolocation zones CRUD endpoint
                                                           // GET: List/retrieve zones with optional filtering
                                                           // POST: {name, coordinates, capacity, radius}
  static ACTIVE_ZONES_URL = ACTIVE_ZONES_URL;              // Get active geolocation zones endpoint
                                                          // GET: Returns all currently active zones

  /**
   * Reports
   * -------
   * Endpoints for handling reports, analytics, and data exports.
   */
  static ATTENDANCE_REPORTS_URL = ATTENDANCE_REPORTS_URL;   // Attendance reports endpoint
                                                           // GET: ?course_id=<uuid>&start_date=<date>&end_date=<date>
  static STUDENT_ATTENDANCE_HISTORY_URL = STUDENT_ATTENDANCE_HISTORY_URL; // Student history endpoint
                                                                        // GET: ?student_id=<uuid>&course_id=<uuid> (course optional)
  static TIMETABLE_ADHERENCE_URL = TIMETABLE_ADHERENCE_URL; // Timetable adherence endpoint
                                                          // GET: ?lecturer_id=<uuid>&start_date=<date>&end_date=<date>

  /**
   * Helper method to replace {id} placeholder in URL with actual ID
   * @param url Base URL with {id} placeholder
   * @param id ID to insert
   * @returns URL with ID inserted
   */
  static withId = withId;
}

export default ApiService;