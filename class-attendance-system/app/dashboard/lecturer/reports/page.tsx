"use client"

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useReports } from "@/context/ReportContext"
import { useApi } from "@/hooks/customApi";
import { StudentAttendanceResponse } from "@/types";
import { ATTENDANCE_SESSION_URL } from "@/handler/customApiConfig";

export default function LecturerReportsPage() {
  const { attendanceReports, loading, error, fetchAttendanceReports } = useReports()

  useEffect(() => {
    fetchAttendanceReports()
  }, [])

  const { useFetchData } = useApi<StudentAttendanceResponse>(
    `${ATTENDANCE_SESSION_URL}student_attendance_per_course/`
  );
  const { data: attendanceDataRecords, isLoading } = useFetchData(1);
  const highestAttendance = attendanceDataRecords?.courses.sort((a, b) => b.attendance_percentage - a.attendance_percentage)[0];
  const lowestAttendance = attendanceDataRecords?.courses.sort((a, b) => a.attendance_percentage - b.attendance_percentage)[0];

  if (loading || isLoading) return <div className="text-center text-blue-600 dark:text-blue-400 text-lg font-semibold">Loading Reports...</div>;
  if (error) return <div className="text-center text-red-600 dark:text-red-400 text-lg font-semibold">Error: {error}</div>;

  return (
    <div className="space-y-6 px-4 md:px-6 py-6">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">Course Reports</h1>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Average Attendance", value: `${attendanceDataRecords?.overall_attendance.attendance_percentage}%` },
          { title: "Total Classes", value: `${attendanceDataRecords?.overall_attendance.total_sessions}` },
          { title: "Highest Attendance Course", value: `${highestAttendance?.attendance_percentage}%`, subtitle: `${highestAttendance?.course_name}` },
          { title: "Lowest Attendance Course", value: `${lowestAttendance?.attendance_percentage}%`, subtitle: `${lowestAttendance?.course_name}` },
        ].map((stat, index) => (
          <Card key={index} className="shadow-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              {stat.subtitle && <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.subtitle}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Reports Table */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">Attendance Reports</h2>

        <div className="overflow-x-auto mt-4">
          <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md text-sm md:text-base">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <tr>
                {["Course", "Total Students", "Present Students", "Attendance (%)", "Report Date"].map((header) => (
                  <th key={header} className="py-2 md:py-3 px-3 md:px-4 text-left font-medium border-b border-gray-300 dark:border-gray-600">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceReports.length > 0 ? (
                attendanceReports.map((report, index) => (
                  <tr key={report.id} className={`${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"} border-b border-gray-300 dark:border-gray-700`}>
                    <td className="py-2 md:py-3 px-3 md:px-4">{report.course.name}</td>
                    <td className="py-2 md:py-3 px-3 md:px-4">{report.total_students}</td>
                    <td className="py-2 md:py-3 px-3 md:px-4">
                      {report.students_present > 0 ? (
                        <div className="text-xs md:text-sm text-gray-900 dark:text-gray-100">{report.students_present}</div>
                      ) : (
                        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400">No students present</div>
                      )}
                    </td>
                    <td className="py-2 md:py-3 px-3 md:px-4 font-bold text-blue-700 dark:text-blue-400">{report.attendance_percentage}%</td>
                    <td className="py-2 md:py-3 px-3 md:px-4">{new Date(report.report_date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-600 dark:text-gray-400">No reports available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
