import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const courses = [
  { id: 1, name: "Mathematics 101", students: 30, averageAttendance: 92 },
  { id: 2, name: "Physics 202", students: 25, averageAttendance: 88 },
  { id: 3, name: "Chemistry 301", students: 20, averageAttendance: 95 },
  { id: 4, name: "Biology 401", students: 22, averageAttendance: 90 },
  { id: 5, name: "Computer Science 501", students: 28, averageAttendance: 93 },
]

export function CourseOverview() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Avg. Attendance</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course.id}>
            <TableCell>{course.name}</TableCell>
            <TableCell>{course.students}</TableCell>
            <TableCell>{course.averageAttendance}%</TableCell>
            <TableCell>
              <Button size="sm">View Details</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

