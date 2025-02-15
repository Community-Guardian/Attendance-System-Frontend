import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const timeSlots = ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]

export function WeeklyTimetable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          {daysOfWeek.map((day) => (
            <TableHead key={day}>{day}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {timeSlots.map((time) => (
          <TableRow key={time}>
            <TableCell>{time}</TableCell>
            {daysOfWeek.map((day) => (
              <TableCell key={`${day}-${time}`}>
                {/* Replace this with actual class data */}
                {Math.random() > 0.7 ? "Class" : ""}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

