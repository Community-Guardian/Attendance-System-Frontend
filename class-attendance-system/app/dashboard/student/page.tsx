"use client"
import { Activity, Calendar, CheckCircle, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AttendanceSign } from "@/components/attendance-sign"
import { WeeklyTimetable } from "@/components/weekly-timetable"
import { AttendanceSummary } from "@/components/attendance-summary"
import { Notifications } from "@/components/notifications"
import { useAuth } from "@/context/AuthContext"
import { useAttendance } from "@/context/AttendanceContext"
import FullPageLoader from "@/components/custom/FullPageLoader"
import { useApi } from "@/hooks/customApi";
import { StudentAttendanceResponse } from "@/types";
import { ATTENDANCE_RECORD_URL } from "@/handler/customApiConfig";
export default function StudentDashboardPage() {
  const { user,loading } = useAuth();
  const { attendanceSessions } = useAttendance();
  const { useFetchData } = useApi<StudentAttendanceResponse>(`${ATTENDANCE_RECORD_URL}student_attendance_per_course/`);
  const { data: attendanceDataRecords, isLoading, isFetched } = useFetchData(1);

  const activeSessions = attendanceSessions.filter((session) => new Date(session.start_time) < new Date() && new Date(session.end_time) > new Date());
  const upcomingSessions = attendanceSessions.filter((session) => new Date(session.start_time) > new Date());
  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;
  if (loading || isLoading || !isFetched ) {
    return <FullPageLoader message="Fetching your dashboard data..." />;
  }
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.username} </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activeSessions.length > 0 ? (
              activeSessions.map((session) => (
                <div key={session.id}>
                  <div className="text-2xl font-bold">{session.course.name}</div>
                  <AttendanceSign sessionId={session.id} />
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center">No active sessions</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendanceDataRecords?.overall_attendance.attendance_percentage}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
            {nextSession ?
            (<p className="text-xs text-muted-foreground">Next: {nextSession.course.name},{nextSession?.start_time}</p>)
            :
            <p className="text-xs text-muted-foreground">No upcoming classes</p>
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrow Account</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <Button size="sm" className="mt-2">
              Use Facial Recognition
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
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceSummary />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Announcements & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Notifications attendanceData={attendanceDataRecords as StudentAttendanceResponse} />
        </CardContent>
      </Card>
    </div>
  )
}

