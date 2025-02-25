import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTimetable } from "@/context/TimetableContext";
import dayjs from "dayjs";

// Define days of the week and time slots
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"];

// Helper function to normalize day names
const capitalizeFirstLetter = (str: string) =>
  str?.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();

export function WeeklyTimetable() {
  const { timetables } = useTimetable();

  // Structure timetable data
  const formattedTimetable: Record<string, Record<string, string>> = {};

  timetables?.forEach((session: any) => {
    const day = capitalizeFirstLetter(session.day_of_week);
    const startTime = dayjs(`1970-01-01 ${session.start_time}`).format("h:mm A");

    if (!formattedTimetable[day]) {
      formattedTimetable[day] = {};
    }

    formattedTimetable[day][startTime] = session.course?.name || "N/A";
  });

  return (
    <div className="w-full">
      {/* Table View for Large Screens */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-max border border-gray-200">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                Time
              </TableHead>
              {daysOfWeek.map((day) => (
                <TableHead
                  key={day}
                  className="text-sm font-semibold text-gray-600 text-center whitespace-nowrap"
                >
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeSlots.map((time) => (
              <TableRow key={time} className="border-t">
                <TableCell className="text-sm font-medium">{time}</TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell key={`${day}-${time}`} className="text-center text-sm">
                    {formattedTimetable[day]?.[time] || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View - Collapsed into Stacked Cards */}
      <div className="md:hidden space-y-4">
        {daysOfWeek.map((day) => (
          <div key={day} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{day}</h3>
            <div className="space-y-2">
              {timeSlots.map((time) => (
                <div key={`${day}-${time}`} className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm font-medium text-gray-600">{time}</span>
                  <span className="text-sm">{formattedTimetable[day]?.[time] || "-"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
