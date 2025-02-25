import { Progress } from "@/components/ui/progress"
import { useApi } from "@/hooks/customApi";
import { StudentAttendanceResponse } from "@/types";
import { ATTENDANCE_RECORD_URL } from "@/handler/customApiConfig";

export function AttendanceSummary() {
  const { useFetchData } = useApi<StudentAttendanceResponse>(`${ATTENDANCE_RECORD_URL}student_attendance_per_course/`);
  const { data: attendancePerCourseRecords, isLoading, isFetched } = useFetchData(1);

  if (isLoading || !isFetched || !attendancePerCourseRecords || attendancePerCourseRecords.courses.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-center">
        No attendance records available.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Attendance Summary</h2>
      <div className="space-y-4">
        {attendancePerCourseRecords.courses.map((record) => (
          <div key={record.course_id} className="space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                {record.course_name}
              </span>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                {record.attendance_percentage}%
              </span>
            </div>
            <Progress value={record.attendance_percentage} className="h-2 sm:h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
