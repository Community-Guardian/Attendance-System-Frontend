"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const initialCourseData = [
  { id: 1, code: "MATH101", name: "Mathematics 101", lecturer: "Dr. John Doe" },
  { id: 2, code: "PHYS202", name: "Physics 202", lecturer: "Prof. Jane Smith" },
  { id: 3, code: "CHEM301", name: "Chemistry 301", lecturer: "Dr. Alice Johnson" },
  { id: 4, code: "BIO401", name: "Biology 401", lecturer: "Prof. Bob Williams" },
  { id: 5, code: "CS501", name: "Computer Science 501", lecturer: "Dr. Eve Brown" },
]

export function CourseList({ role }: { role: "student" | "lecturer" | "hod" | "dp_academics" | "config" }) {
  const [courseData, setCourseData] = useState(initialCourseData)
  const [newCourse, setNewCourse] = useState({ code: "", name: "", lecturer: "" })

  const handleAddCourse = () => {
    if (role !== "config") return
    if (!newCourse.code || !newCourse.name || !newCourse.lecturer) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields for the new course.",
        variant: "destructive",
      })
      return
    }
    setCourseData([...courseData, { id: courseData.length + 1, ...newCourse }])
    setNewCourse({ code: "", name: "", lecturer: "" })
    toast({
      title: "Course Added",
      description: "The new course has been added successfully.",
    })
  }

  const handleReassignLecturer = (courseId: number, newLecturer: string) => {
    if (role !== "hod") return
    setCourseData(courseData.map((course) => (course.id === courseId ? { ...course, lecturer: newLecturer } : course)))
    toast({
      title: "Lecturer Reassigned",
      description: `The lecturer for course ${courseId} has been updated.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>List of Courses</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Lecturer</TableHead>
              {role === "hod" && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseData.map((course) => (
              <TableRow key={course.id}>
                <TableCell className="font-medium">{course.code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>{course.lecturer}</TableCell>
                {role === "hod" && (
                  <TableCell>
                    <Button onClick={() => handleReassignLecturer(course.id, "New Lecturer")}>Reassign</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {role === "config" && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                  placeholder="e.g., CS101"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                  placeholder="e.g., Introduction to Computer Science"
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="lecturerName">Lecturer Name</Label>
                <Input
                  id="lecturerName"
                  value={newCourse.lecturer}
                  onChange={(e) => setNewCourse({ ...newCourse, lecturer: e.target.value })}
                  placeholder="e.g., Dr. John Doe"
                />
              </div>
            </div>
            <Button onClick={handleAddCourse} className="mt-4">
              Add Course
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

