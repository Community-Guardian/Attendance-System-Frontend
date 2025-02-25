"use client";

import { Activity, Book, Calendar, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StartAttendanceSession } from "@/components/start-attendance-session";
import { WeeklyTimetable } from "@/components/weekly-timetable";
import { CourseOverview } from "@/components/course-overview";
import { Notifications } from "@/components/notifications";
import { useUser } from "@/context/userContext";
import { useApi } from "@/hooks/customApi";
import { StudentAttendanceResponse } from "@/types";
import { ATTENDANCE_RECORD_URL } from "@/handler/customApiConfig";
import { useTimetable } from "@/context/TimetableContext";
import { useReports } from "@/context/ReportContext";
import { useRouter } from "next/navigation";
const getFullDateTime = (time: string, dayOfWeek: string) => {
  const today = new Date();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const classDayIndex = daysOfWeek.indexOf(dayOfWeek);
  const todayIndex = today.getDay();

  // Calculate the date for the correct weekday
  let classDate = new Date(today);
  classDate.setDate(today.getDate() + ((classDayIndex - todayIndex + 7) % 7)); // Ensure correct upcoming weekday

  // Set the class time
  const [hours, minutes, seconds] = time.split(":").map(Number);
  classDate.setHours(hours, minutes, seconds, 0);

  return classDate;
};

export default function LecturerDashboardPage() {
  const { user, loading } = useUser();
  const { useFetchData } = useApi<StudentAttendanceResponse>(`${ATTENDANCE_RECORD_URL}student_attendance_per_course/`);
  const { data: attendanceDataRecords, isLoading, isFetched } = useFetchData(1);
  const { timetables } = useTimetable();
  const { attendanceReports } = useReports();

  const router = useRouter();

  const now = new Date();

  const currentClass = timetables.find((timetable) => {
    const startDateTime = getFullDateTime(timetable.start_time, timetable.day_of_week);
    const endDateTime = getFullDateTime(timetable.end_time, timetable.day_of_week);
    return startDateTime <= now && endDateTime >= now;
  });

  const upcomingClasses = timetables
    .map((timetable) => ({
      ...timetable,
      startDateTime: getFullDateTime(timetable.start_time, timetable.day_of_week),
    }))
    .filter((timetable) => timetable.startDateTime > now)
    .sort((a, b) => a.startDateTime.getTime() - b.startDateTime.getTime());

  const nextClass = upcomingClasses.length > 0 ? upcomingClasses[0] : null;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">
        {loading ? "Loading..." : `Welcome, ${user?.username || "Lecturer"}`}
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Class</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {currentClass ? (
              <div className="text-2xl font-bold">{currentClass.course.name}</div>
            ) : (
              <div className="text-gray-500 text-center">No active class</div>
            )}
            {/* <StartAttendanceSessionById /> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceDataRecords?.courses.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            {nextClass ? (
              <p className="text-xs text-muted-foreground">
                Next: {nextClass.course.name} at {nextClass.start_time}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">No upcoming classes</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ attendanceReports.length || 0}</div>
            <Button size="sm" className="mt-2" onClick={() => router.push("/dashboard/lecturer/reports")} >
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyTimetable />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Course Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <CourseOverview attendanceData={attendanceDataRecords as StudentAttendanceResponse} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcements & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <Notifications /> */}
        </CardContent>
      </Card>
    </div>
  );
}
