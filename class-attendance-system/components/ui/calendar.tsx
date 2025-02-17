import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import clsx from "clsx";
import { Timetable } from "@/types/timetables";
import { AttendanceSession } from "@/types/attendance";
import { Course } from "@/types/courses";
import { User } from "@/types";
import { GeolocationZone } from "@/types/geolocation";
type Event = {
  type: "session"| "timetable";
  time: Date;
  id: string;
  timetable: Partial<Timetable>;
  lecturer: Partial<User>;
  course: Partial<Course>;
  start_time: string;
  end_time: string;
  is_makeup_class: boolean;
  geolocation_zone: Partial<GeolocationZone>;
};
interface ScheduleEvent extends Event {
  type: "session" | "timetable";
  time: Date;
  timetable: Partial<Timetable>;
  lecturer: Partial<User>;
  course: Partial<Course>;
  geolocation_zone: Partial<GeolocationZone>;
}
interface CalendarProps {
  events: ScheduleEvent[]
  holidays: { date: string; name: string }[]; // [{ date: "2025-02-20", name: "Public Holiday" }]
  selectedDate?: Date; // Add selectedDate as an optional prop
  onSelect?: (date: Date) => void; // Add onSelect function to handle date selection
}

export function Calendar({ events = [], holidays = [], selectedDate, onSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get the first and last day of the month
  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);

  // Generate all days in the month
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });

  // Days of the week (Monday - Sunday)
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Get the start day of the month (0 = Sunday, 6 = Saturday)
  const startDayIndex = getDay(firstDay) === 0 ? 6 : getDay(firstDay) - 1; // Adjust for Monday start

  // Memoize holidays lookup for better performance
  const holidayMap = new Map(holidays.map(h => [h.date, h.name]));

  const handleDayClick = (date: Date) => {
    if (onSelect) {
      onSelect(date); // Call the onSelect function passed in as a prop
    }
  };

  return (
    <div className="space-y-4">
      {/* Month Selector */}
      <div className="flex justify-between items-center">
        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
        >
          &larr; Previous
        </button>
        <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          className="p-2 bg-gray-200 rounded"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
        >
          Next &rarr;
        </button>
      </div>

      {/* Days of the week headers */}
      <div className="grid grid-cols-7 gap-2 text-center font-bold">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty spaces before the first day */}
        {Array.from({ length: startDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} className="p-4"></div>
        ))}

        {/* Render each day */}
        {daysInMonth.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");

          // Default to empty array if the event is not found in the events object
          const dayEvents = events.filter(event => format(event.time, "yyyy-MM-dd") === dateStr);
          const holiday = holidayMap.get(dateStr);

          return (
            <div
              key={dateStr}
              className={clsx(
                "p-2 border rounded-md flex flex-col items-center text-sm relative",
                holiday && "bg-red-100 border-red-400",
                dayEvents.length > 0 && "bg-blue-50 border-blue-400",
                selectedDate?.toDateString() === date.toDateString() && "bg-blue-200" // Highlight selected day
              )}
              onClick={() => handleDayClick(date)} // Call the click handler
            >
              <span className="font-semibold">{format(date, "d")}</span>

              {/* Holiday Label */}
              {holiday && (
                <div className="absolute top-0 text-xs bg-red-500 text-white px-1 rounded-md">
                  {holiday}
                </div>
              )}

              {/* Events */}
              {dayEvents.length > 0 && (
                <div className="mt-2 w-full">
                  {dayEvents.map((event, index) => (
                    <div key={index} className="text-xs bg-blue-200 rounded px-1 py-0.5 mt-1 text-center">
                      {event.course.code} {/* or any other property that is a string or a React component */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
