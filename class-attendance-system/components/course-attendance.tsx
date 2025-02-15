"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

const initialCourseData = [
  { id: 1, code: "MATH101", name: "Mathematics 101", lecturer: "Dr. John Doe", attendance: "95%" },
  { id: 2, code: "PHYS202", name: "Physics 202", lecturer: "Prof. Jane Smith", attendance: "88%" },
  { id: 3, code: "CHEM301", name: "Chemistry 301", lecturer: "Dr. Alice Johnson", attendance: "92%" },
  { id: 4, code: "BIO401", name: "Biology 401", lecturer: "Prof. Bob Williams", attendance: "87%" },
  { id: 5, code: "CS501", name: "Computer Science 501", lecturer: "Dr. Eve Brown", attendance: "93%" },
]

export function CourseAttendance({ role }: { role: "student" | "lecturer" | "hod" | "dp_academics" | "config" }) {
  const [courseData, setCourseData] = useState(initialCourseData)
  const [editingCourse, setEditingCourse] = useState<number | null>(null)
  const [newCourse, setNewCourse] = useState({ code: "", name: "", lecturer: "" })

  const handleEdit = (id: number) => {
    setEditingCourse(id)
  }

  const handleSave = (id: number) => {
    setEditingCourse(null)
    toast({
      title: "Course Updated",
      description: `Course ${id} has been updated successfully.`,
    })
  }

  const handleDelete = (id: number) => {
    setCourseData(courseData.filter((course) => course.id !== id))
    toast({
      title: "Course Deleted",
      description: `Course ${id} has been deleted successfully.`,
    })
  }

  const handleAddCourse = () => {
    if (!newCourse.code || !newCourse.name || !newCourse.lecturer) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields for the new course.",
        variant: "destructive",
      })
      return
    }
    setCourseData([...courseData, { id: courseData.length + 1, ...newCourse, attendance: "N/A" }])
    setNewCourse({ code: "", name: "", lecturer: "" })
    toast({
      title: "Course Added",
      description: "The new course has been added successfully.",
    })
  }

  return (
    <div className="space-y-4">
      {(role === "hod" || role === "config") && (
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label htmlFor="courseCode">Course Code</Label>
            <Input
              id="courseCode"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
              placeholder="e.g., CS101"
            />
          </div>
          <div>
            <Label htmlFor="courseName">Course Name</Label>
            <Input
              id="courseName"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              placeholder="e.g., Introduction to Computer Science"
            />
          </div>
          <div>
            <Label htmlFor="lecturerName">Lecturer Name</Label>
            <Input
              id="lecturerName"
              value={newCourse.lecturer}
              onChange={(e) => setNewCourse({ ...newCourse, lecturer: e.target.value })}
              placeholder="e.g., Dr. John Doe"
            />
          </div>
        </div>
      )}
      {(role === "hod" || role === "config") && <Button onClick={handleAddCourse}>Add Course</Button>}
      <Table>
        <TableCaption>Course Attendance Percentages</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Lecturer</TableHead>
            <TableHead>Attendance</TableHead>
            {(role === "hod" || role === "config") && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {courseData.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.code}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>
                {editingCourse === course.id ? (
                  <Input
                    value={course.lecturer}
                    onChange={(e) =>
                      setCourseData(
                        courseData.map((c) => (c.id === course.id ? { ...c, lecturer: e.target.value } : c)),
                      )
                    }
                  />
                ) : (
                  course.lecturer
                )}
              </TableCell>
              <TableCell>{course.attendance}</TableCell>
              {(role === "hod" || role === "config") && (
                <TableCell>
                  {editingCourse === course.id ? (
                    <Button onClick={() => handleSave(course.id)}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(course.id)}>Edit</Button>
                  )}
                  <Button variant="destructive" onClick={() => handleDelete(course.id)}>
                    Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

