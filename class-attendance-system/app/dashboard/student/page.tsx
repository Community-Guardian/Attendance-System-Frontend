"use client";
import { useEffect, useState } from "react";
import { Activity, Calendar, CheckCircle, Calculator, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendanceSign } from "@/components/attendance-sign";
import { WeeklyTimetable } from "@/components/weekly-timetable";
import { AttendanceSummary } from "@/components/attendance-summary";
import { Notifications } from "@/components/notifications";
import { SignAttendanceModal } from "./components/sign-attendance-modal";
import { useAuth } from "@/context/AuthContext";
import { useAttendance } from "@/context/AttendanceContext";
import FullPageLoader from "@/components/custom/FullPageLoader";
import { useApi } from "@/hooks/customApi";
import { StudentAttendanceResponse } from "@/types";
import { ATTENDANCE_SESSION_URL } from "@/handler/customApiConfig";

export default function StudentDashboardPage() {
  const { user, loading } = useAuth();
  const { attendanceSessions } = useAttendance();
  const { useFetchData } = useApi<StudentAttendanceResponse>(
    `${ATTENDANCE_SESSION_URL}student_attendance_per_course/`
  );
  const { data: attendanceDataRecords, isLoading, isFetched } = useFetchData(1);

  const [showSignModal, setShowSignModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const activeSessions = attendanceSessions.filter(
    (session) =>
      new Date(session.start_time) < new Date() &&
      new Date(session.end_time) > new Date()
  );
  const upcomingSessions = attendanceSessions.filter(
    (session) => new Date(session.start_time) > new Date()
  );
  const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0] : null;

  if (loading || isLoading || !isFetched) {
    return <FullPageLoader message="Fetching your dashboard data..." />;
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.username}</h2>
      </div>

      {/* Overview Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Active Sessions */}
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {activeSessions.length > 0 ? (
              activeSessions.map((session) => (
                <div key={session.id} className="space-y-2">
                  <div className="text-lg font-semibold truncate">{session.course.name}</div>
                  <Button onClick={() =>{ setSelectedSession(session.id) ;setShowSignModal(true)  }} > 
                    Sign Attendance
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center text-sm">No active sessions</div>
            )}
          </CardContent>
        </Card>

        {/* Overall Attendance */}
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceDataRecords?.overall_attendance.attendance_percentage}%
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
            {nextSession ? (
              <p className="text-xs text-muted-foreground">
                Next: {nextSession.course.name}, {new Date(nextSession.start_time).toLocaleString()}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">No upcoming classes</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timetable & Attendance Summary */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyTimetable />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceSummary />
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Notifications attendanceData={attendanceDataRecords as StudentAttendanceResponse} />
        </CardContent>
      </Card>

      <SignAttendanceModal
        open={showSignModal}
        sessionId={selectedSession}
        onClose={() => {
          setShowSignModal(false);
          setSelectedSession(null);
        }}
      />
    </div>
  );
}
