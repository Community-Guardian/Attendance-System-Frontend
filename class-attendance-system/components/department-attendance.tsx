import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const departmentAttendanceData = [
  { id: 1, department: "Computer Science", attendance: "92%" },
  { id: 2, department: "Electrical Engineering", attendance: "88%" },
  { id: 3, department: "Mechanical Engineering", attendance: "90%" },
  { id: 4, department: "Civil Engineering", attendance: "87%" },
  { id: 5, department: "Chemical Engineering", attendance: "91%" },
]

export function DepartmentAttendance() {
  return (
    <Table>
      <TableCaption>Department Attendance Percentages</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Department</TableHead>
          <TableHead>Attendance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departmentAttendanceData.map((dept) => (
          <TableRow key={dept.id}>
            <TableCell className="font-medium">{dept.department}</TableCell>
            <TableCell>{dept.attendance}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

