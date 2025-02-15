import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const courses = [
  { id: 1, code: "CS101", name: "Introduction to Computer Science", lecturer: "Dr. Smith" },
  { id: 2, code: "MATH201", name: "Advanced Calculus", lecturer: "Prof. Johnson" },
  { id: 3, code: "PHYS301", name: "Quantum Mechanics", lecturer: "Dr. Brown" },
]

export function CourseManagement() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Lecturer</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.code}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>{course.lecturer}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" className="mr-2">
                  Edit
                </Button>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button className="mt-4">Add New Course</Button>
    </div>
  )
}

