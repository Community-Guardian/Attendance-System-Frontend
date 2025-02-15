import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const attendanceData = [
  { id: 1, course: "Mathematics 101", date: "2023-06-01", status: "Present" },
  { id: 2, course: "Physics 202", date: "2023-06-02", status: "Absent" },
  { id: 3, course: "Chemistry 301", date: "2023-06-03", status: "Present" },
  { id: 4, course: "Biology 401", date: "2023-06-04", status: "Late" },
  { id: 5, course: "Computer Science 501", date: "2023-06-05", status: "Present" },
]

export function AttendanceList() {
  return (
    <Table>
      <TableCaption>A list of your recent attendance records.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendanceData.map((record) => (
          <TableRow key={record.id}>
            <TableCell className="font-medium">{record.course}</TableCell>
            <TableCell>{record.date}</TableCell>
            <TableCell>{record.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

