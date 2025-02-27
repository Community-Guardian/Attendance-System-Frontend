"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCourses } from "@/context/CoursesContext"

export function CourseManagement() {
  const {
    courses,
    departments,
    loading,
    error,
    fetchCourses,
    fetchDepartments,
    createCourse,
    updateCourse,
    deleteCourse,
  } = useCourses()

  const [newCourse, setNewCourse] = useState({ code: "", name: "", department: "" })
  const [editingCourse, setEditingCourse] = useState<{ id: string; code: string; name: string; department: string } | null>(null)

  useEffect(() => {
    fetchCourses()
    fetchDepartments()
  }, [])

  const handleAddCourse = () => {
    if (newCourse.code && newCourse.name && newCourse.department) {
      createCourse(newCourse)
      setNewCourse({ code: "", name: "", department: "" })
    }
  }

  const handleUpdateCourse = () => {
    if (editingCourse) {
      updateCourse(editingCourse.id, {
        code: editingCourse.code,
        name: editingCourse.name,
        department: editingCourse.department,
      })
      setEditingCourse(null)
    }
  }

  const handleDeleteCourse = (id: string) => {
    deleteCourse(id)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Course Management</h2>

      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.code}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.department?.name || "No Department"}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  className="mr-2"
                  onClick={() => setEditingCourse(course)}
                >
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteCourse(course.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add New Course */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">Add New Course</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">Code</Label>
              <Input
                id="code"
                value={newCourse.code}
                onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Department</Label>
              <Select
                value={newCourse.department}
                onValueChange={(value) => setNewCourse({ ...newCourse, department: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAddCourse}>Add Course</Button>
        </DialogContent>
      </Dialog>

      {/* Edit Course */}
      {editingCourse && (
        <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-code" className="text-right">Code</Label>
                <Input
                  id="edit-code"
                  value={editingCourse.code}
                  onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingCourse.name}
                  onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Department</Label>
                <Select
                  value={editingCourse.department}
                  onValueChange={(value) => setEditingCourse({ ...editingCourse, department: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleUpdateCourse}>Update Course</Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
