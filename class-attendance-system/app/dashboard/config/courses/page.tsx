import type { Metadata } from "next"
import { CourseManagement } from "@/components/course-management"

export const metadata: Metadata = {
  title: "Course Management",
  description: "Manage courses in the Class Attendance System.",
}

export default function CourseManagementPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Course Management</h2>
      <CourseManagement />
    </div>
  )
}

