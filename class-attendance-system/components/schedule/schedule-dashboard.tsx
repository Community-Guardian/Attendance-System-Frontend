"use client";

import { useEffect, useState } from "react";
import { useTimetable } from "@/context/TimetableContext";
import { useAttendance } from "@/context/AttendanceContext";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionDetails } from "./session-details";
import { DailySchedule } from "./daily-schedule";
import { WeeklySchedule } from "./weekly-schedule";
import { CalendarDays, Clock, List, CalendarIcon } from "lucide-react";
import { format, parseISO, setHours, setMinutes, setSeconds } from "date-fns";
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
// Maps numeric days (0 = Sunday, 6 = Saturday) to weekday names
const weekdayMap: Record<number, Timetable["day_of_week"]> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
};

export function ScheduleDashboard() {
  const { timetables, fetchTimetables, loading: timetableLoading } = useTimetable();
  const { attendanceSessions, fetchAttendanceSessions, loading: sessionLoading } = useAttendance();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    fetchTimetables();
    fetchAttendanceSessions();
  }, []);
  const holidays = [
    { date: "2025-02-20", name: "Public Holiday" },
    { date: "2025-04-25", name: "Labour Day" },
  ];
  const selectedDayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday

  // Filter active attendance sessions for the selected date
  const activeSessions = attendanceSessions
    .filter((session: AttendanceSession) => {
      const sessionDate = parseISO(session.start_time);
      return sessionDate.toDateString() === selectedDate.toDateString();
    })
    .map((session) => ({
      ...session,
      type: "session" as const,
      time: parseISO(session.start_time),
      timetable: session.timetable as Partial<Timetable>,
      lecturer: session.lecturer as Partial<User>,
      course: session.course as Partial<Course>,
      geolocation_zone: session.geolocation_zone as Partial<GeolocationZone>,
    }));

  // Filter timetable entries based on the selected day of the week (Monday - Friday only)
  const timetableEntries =
    weekdayMap[selectedDayOfWeek] !== undefined
      ? timetables.filter((entry: Timetable) => entry.day_of_week === weekdayMap[selectedDayOfWeek])
      : [];

  // Convert timetable entries to Date objects using selectedDate
  const timetableEvents = timetableEntries.map((entry: Timetable) => {
    const [hours, minutes] = entry.start_time.split(":").map(Number);
    return {
      ...entry,
      type: "timetable" as const,
      time: setSeconds(setMinutes(setHours(new Date(selectedDate), hours), minutes), 0),
      timetable: {
        id: entry.id,
        course: entry.course,
        lecturer: entry.lecturer,
        day_of_week: entry.day_of_week,
        start_time: entry.start_time,
        end_time: entry.end_time,
        is_makeup_class: entry.is_makeup_class,
      },
      geolocation_zone: {} as Partial<GeolocationZone>, // Placeholder
    };
  });

  // Combine and sort all events for the selected date
  const allEvents: ScheduleEvent[] = [
    ...activeSessions.map((session) => ({
      ...session,
      type: "session" as const,
      time: parseISO(session.start_time),
    })),
    ...timetableEvents.map((entry) => ({
      id: entry.id,
      type: "timetable" as const,
      time: setSeconds(setMinutes(setHours(new Date(selectedDate), Number(entry.start_time.split(":")[0])), Number(entry.start_time.split(":")[1])), 0),
      timetable: {
        id: entry.id,
        course: entry.course,
        lecturer: entry.lecturer,
        day_of_week: entry.day_of_week,
        start_time: entry.start_time,
        end_time: entry.end_time,
        is_makeup_class: entry.is_makeup_class,
      },
      course: {}, // Add actual course data
      lecturer: {}, // Add actual lecturer data
      start_time: entry.start_time,
      end_time: entry.end_time,
      is_makeup_class: entry.is_makeup_class,
      geolocation_zone: {}, // Add geolocation data
    })),
  ].sort((a, b) => a.time.getTime() - b.time.getTime());
  
  // Get dates with events for calendar highlighting
  const datesWithEvents = [
    ...new Set([
      ...attendanceSessions.map((session: AttendanceSession) => parseISO(session.start_time).toDateString()),
      ...timetableEntries.map(() => selectedDate.toDateString()), // Assume timetable days always have events
    ]),
  ].map((dateStr) => new Date(dateStr));

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">View your timetable and active sessions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-rows-2">
        {/* Schedule Section */}
        <Card className="order-2 md:order-1">
          <Tabs defaultValue="daily" className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Schedule for {format(selectedDate, "MMMM d, yyyy")}</CardTitle>
                <TabsList>
                  <TabsTrigger value="daily">
                    <List className="h-4 w-4 mr-2" />
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="weekly">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Weekly
                  </TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="daily">
                <DailySchedule
                  events={allEvents}
                  onSessionClick={setSelectedSession}
                  loading={timetableLoading || sessionLoading}
                />
              </TabsContent>
              <TabsContent value="weekly">
                <WeeklySchedule
                  selectedDate={selectedDate}
                  onSessionClick={setSelectedSession}
                  loading={timetableLoading || sessionLoading}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Calendar Section */}
        <Card className="order-1 md:order-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
          <Calendar
            events={allEvents}
            holidays={holidays}
            selectedDate={selectedDate} // Pass selected date
            onSelect={(date) => setSelectedDate(date)} // Set the selected date
          />
          </CardContent>
        </Card>
      </div>

      {/* Session Details */}
      <SessionDetails sessionId={selectedSession} onClose={() => setSelectedSession(null)} />
    </div>
  );
}
