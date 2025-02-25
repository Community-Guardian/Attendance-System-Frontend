"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCourses } from "@/context/CoursesContext"
import { Course } from "@/types/courses"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export function CourseList({ role }: { role: "student" | "lecturer" | "hod" | "dp_academics" | "config" }) {
  const { courses, fetchCourses, createCourse, updateCourse } = useCourses()
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    code: "",
    name: "",
    lecturers: [],
    department: { id: "", name: "", hod: null },
    students: [],
  })
  const [editingCourse, setEditingCourse] = useState<Partial<Course> | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchCourses()
  }, [])

  const handleAddCourse = async () => {
    if (role !== "config" && role !== "dp_academics") return

    if (!newCourse.code || !newCourse.name || !newCourse.department) {
      toast({ title: "Missing Information", description: "Fill in all fields.", variant: "destructive" })
      return
    }

    try {
      await createCourse(newCourse)
      setNewCourse({ code: "", name: "", lecturers: [], department: { id: "", name: "", hod: null }, students: [] })
      toast({ title: "Course Added", description: "Successfully added." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to add course.", variant: "destructive" })
    }
  }

  const handleEditCourse = (course: Course) => setEditingCourse(course)

  const handleUpdateCourse = async () => {
    if (!editingCourse || (role !== "config" && role !== "dp_academics")) return

    try {
      await updateCourse(editingCourse.id!, editingCourse)
      setEditingCourse(null)
      toast({ title: "Course Updated", description: "Successfully updated." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to update course.", variant: "destructive" })
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
              <TableHead>Actions</TableHead>
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
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {role === "lecturer" && (
                          <>
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/lecturer/attendance/${course.id}`)}>
                           View Attendance
                             </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/lecturer/reports/${course.id}`)}>
                                View Report
                                </DropdownMenuItem>

                          </>
                        )}
                        {role === "hod" && (
                          <DropdownMenuItem onClick={() => alert("Reassign Lecturer not implemented")}>
                            Reassign Lecturer
                          </DropdownMenuItem>
                        )}
                        {(role === "config" || role === "dp_academics") && (
                          <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                            Edit Course
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
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

      {(role === "config" || role === "dp_academics") && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCourse ? "Edit Course" : "Add New Course"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="grid w-full gap-1.5">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  value={editingCourse ? editingCourse.code : newCourse.code}
                  onChange={(e) =>
                    editingCourse
                      ? setEditingCourse({ ...editingCourse, code: e.target.value })
                      : setNewCourse({ ...newCourse, code: e.target.value })
                  }
                  placeholder="e.g., CS101"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  value={editingCourse ? editingCourse.name : newCourse.name}
                  onChange={(e) =>
                    editingCourse
                      ? setEditingCourse({ ...editingCourse, name: e.target.value })
                      : setNewCourse({ ...newCourse, name: e.target.value })
                  }
                  placeholder="e.g., Intro to Computer Science"
                />
              </div>
              <div className="grid w-full gap-1.5">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={editingCourse ? editingCourse.department?.name : newCourse.department?.name}
                  onChange={(e) =>
                    editingCourse
                      ? setEditingCourse({ ...editingCourse, department: { id: "", name: e.target.value, hod: null } })
                      : setNewCourse({ ...newCourse, department: { id: "", name: e.target.value, hod: null } })
                  }
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>
            {editingCourse ? (
              <Button onClick={handleUpdateCourse} className="mt-4">
                Update Course
              </Button>
            ) : (
              <Button onClick={handleAddCourse} className="mt-4">
                Add Course
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
