import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const lecturers = [
  { id: 1, name: "Dr. Smith", courses: ["CS101", "CS201"] },
  { id: 2, name: "Prof. Johnson", courses: ["MATH201"] },
  { id: 3, name: "Dr. Brown", courses: ["PHYS301", "PHYS401"] },
]

export function LecturerAssignment() {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Assigned Courses</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lecturers.map((lecturer) => (
            <TableRow key={lecturer.id}>
              <TableCell>{lecturer.name}</TableCell>
              <TableCell>{lecturer.courses.join(", ")}</TableCell>
              <TableCell>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Assign Course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CS301">CS301</SelectItem>
                    <SelectItem value="MATH301">MATH301</SelectItem>
                    <SelectItem value="PHYS201">PHYS201</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

