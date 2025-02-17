import type { Metadata } from "next"
import { CourseList } from "@/components/course-list"

export const metadata: Metadata = {
  title: "Student Courses",
  description: "View your enrolled courses.",
}

export default function StudentCoursesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Courses</h1>
      <CourseList role="student" />
    </div>
  )
}

