"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCourses } from "@/context/CoursesContext"
import { Course } from "@/types/courses"
import { User } from "@/types"
export function CourseList({ role }: { role: "student" | "lecturer" | "hod" | "dp_academics" | "config" }) {
  const { courses, fetchCourses, createCourse, updateCourse } = useCourses()
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    code: "",
    name: "",
    lecturers: [],
    department: {
      id: "",
      name: "",
      hod: null
    },
    students: [],
  })

  useEffect(() => {
    fetchCourses() // Fetch courses when the component mounts
  }, [])

  const handleAddCourse = async () => {
    if (role !== "config") return
    if (!newCourse.code || !newCourse.name || !newCourse.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields for the new course.",
        variant: "destructive",
      })
      return
    }
    
    try {
      await createCourse(newCourse)
      setNewCourse({ code: "", name: "", lecturers: [], department: {
        id: "",
        name: "",
        hod: null
      }, students: [] }) // Reset form
      toast({
        title: "Course Added",
        description: "The new course has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReassignLecturer = async (courseId: string, newLecturer: string) => {
    if (role !== "hod") return

    try {
      const courseToUpdate = courses.find(course => course.id === courseId)
      if (!courseToUpdate) return

      const newLecturerUser: Partial<User> = { id: newLecturer, username: newLecturer }; // Create a new User object for the new lecturer
      const updatedLecturers = [...courseToUpdate.lecturers, newLecturerUser]; // Add the new lecturer to the array
  
      // await updateCourse(courseId, { lecturers: updatedLecturers })
  

      toast({
        title: "Lecturer Reassigned",
        description: `The lecturer for course ${courseId} has been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reassign lecturer. Please try again.",
        variant: "destructive",
      })
    }
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
              <TableHead>Department</TableHead>
              <TableHead>Lecturers</TableHead>
              {role === "hod" && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.department.name}</TableCell>
                  <TableCell>{course.lecturers.map((lecturer) => lecturer?.username).join(", ") || "None"}</TableCell>
                  {role === "hod" && (
                    <TableCell>
                      <Button onClick={() => handleReassignLecturer(course.id, "New Lecturer")}>
                        Reassign
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  No courses available.
                </TableCell>
              </TableRow>
            )}
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
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newCourse.department?.name}
                  onChange={(e) => setNewCourse({ ...newCourse, department: { id: "", name: e.target.value, hod: null } })}
                  placeholder="e.g., Computer Science"
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
