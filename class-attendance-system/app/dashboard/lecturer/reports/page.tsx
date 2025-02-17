"use client"

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useReports } from "@/context/ReportContext"

export default function LecturerReportsPage() {
  const {
    attendanceReports,
    loading,
    error,
    fetchAttendanceReports,
  } = useReports()

  useEffect(() => {
    fetchAttendanceReports()
  }, [])

  if (loading) return <div className="text-center text-blue-600 dark:text-blue-400 text-xl font-semibold">Loading Reports...</div>
  if (error) return <div className="text-center text-red-600 dark:text-red-400 text-lg font-semibold">Error: {error}</div>

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Course Reports</h1>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Average Attendance", value: "50%" },
          { title: "Total Classes", value: "5" },
          { title: "Highest Attendance Course", value: "50%", subtitle: "Human Computer Interaction" },
          { title: "Lowest Attendance Course", value: "10%", subtitle: "Machine Learning" }
        ].map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-gray-800 shadow-md border border-gray-300 dark:border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              {stat.subtitle && <p className="text-xs text-gray-600 dark:text-gray-400">{stat.subtitle}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attendance Reports Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Attendance Reports</h2>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg shadow-md">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <tr>
                {["Course", "Total Students", "Present Students", "Attendance (%)", "Report Date"].map((header) => (
                  <th key={header} className="py-3 px-4 text-left text-sm font-medium border-b border-gray-300 dark:border-gray-600">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attendanceReports.length > 0 ? (
                attendanceReports.map((report, index) => (
                  <tr key={report.id} className={`${index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : "bg-white dark:bg-gray-800"} border-b border-gray-300 dark:border-gray-700`}>
                    <td className="py-3 px-4">{report.course.name}</td>
                    <td className="py-3 px-4">{report.total_students}</td>
                    <td className="py-3 px-4">
                      {Array.isArray(report.students_present) && report.students_present.length > 0 ? (
                        report.students_present.map((student) => (
                          <div key={student.id} className="text-xs text-gray-900 dark:text-gray-100">{student.name}</div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-600 dark:text-gray-400">No students present</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-700 dark:text-blue-400">{report.attendance_percentage}%</td>
                    <td className="py-3 px-4">{new Date(report.report_date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-600 dark:text-gray-400">No reports available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
