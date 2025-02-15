import type { Metadata } from "next"
import { CourseList } from "@/components/course-list"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Lecturer Courses",
  description: "Manage your courses.",
}

export default function LecturerCoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Button>Add New Course</Button>
      </div>
      <CourseList />
    </div>
  )
}

