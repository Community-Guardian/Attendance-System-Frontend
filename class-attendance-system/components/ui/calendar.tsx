import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import clsx from "clsx";
import { Timetable } from "@/types/timetables";
import { AttendanceSession } from "@/types/attendance";
import { Course } from "@/types/courses";
import { User } from "@/types";
import { GeolocationZone } from "@/types/geolocation";

type Event = {
  type: "session" | "timetable";
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
  events: ScheduleEvent[];
  holidays: { date: string; name: string }[];
  selectedDate?: Date;
  onSelect?: (date: Date) => void;
}

export function Calendar({
  events = [],
  holidays = [],
  selectedDate,
  onSelect,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDay, end: lastDay });
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const startDayIndex = getDay(firstDay) === 0 ? 6 : getDay(firstDay) - 1;
  const holidayMap = new Map(holidays.map((h) => [h.date, h.name]));

  const handleDayClick = (date: Date) => {
    if (onSelect) {
      onSelect(date);
    }
  };

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-lg">
      {/* Month Navigation */}
      <div className="flex justify-between items-center">
        <button
          className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-400 transition-all"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
        >
          &larr;
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-400 transition-all"
          onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
        >
          &rarr;
        </button>
      </div>

      {/* Days of the week headers */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-gray-700">
        {weekDays.map((day) => (
          <div key={day} className="uppercase">{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells before the first day */}
        {Array.from({ length: startDayIndex }).map((_, index) => (
          <div key={`empty-${index}`} className="p-4"></div>
        ))}

        {/* Render Days */}
        {daysInMonth.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const dayEvents = events.filter((event) => format(event.time, "yyyy-MM-dd") === dateStr);
          const holiday = holidayMap.get(dateStr);

          return (
            <div
              key={dateStr}
              className={clsx(
                "p-4 border rounded-md text-sm relative transition-transform duration-300 transform hover:scale-105 hover:shadow-lg",
                holiday && "bg-yellow-100 border-yellow-400",
                dayEvents.length > 0 && "bg-blue-50 border-blue-400",
                selectedDate?.toDateString() === date.toDateString() && "bg-gradient-to-r from-blue-300 to-blue-500 text-white"
              )}
              onClick={() => handleDayClick(date)}
            >
              <span className="font-semibold">{format(date, "d")}</span>

              {/* Holiday Label */}
              {holiday && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-md text-xs">
                  {holiday}
                </div>
              )}

              {/* Events */}
              {dayEvents.length > 0 && (
                <div className="mt-2 w-full">
                  {dayEvents.map((event, index) => (
                    <div
                      key={index}
                      className="text-xs bg-blue-200 text-blue-800 rounded-full px-2 py-0.5 mt-1 text-center"
                    >
                      {event.course.code}
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
