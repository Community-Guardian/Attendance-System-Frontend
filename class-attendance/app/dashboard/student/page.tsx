"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, FileText } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// integration
import { StudentCourseAttendance,Timetable,AttendanceSession,AttendanceRecord } from "@/types"
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"

import { format } from "date-fns"

export default function StudentDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const date = new Date()
  const day = format(date, "EEEE")
  const { useFetchData:useFetchAttendanceData } = useApi<StudentCourseAttendance,StudentCourseAttendance>(ApiService.ATTENDANCE_STATS_URL,1000)
  const { useFetchData:useFetchTimetableData }  = useApi<Timetable,Timetable>(ApiService.TIMETABLE_URL,1000)
  const { useFetchData:useFetchSession }  = useApi<AttendanceSession,AttendanceSession>(ApiService.TIMETABLE_URL,1000)
  const { useFetchData:useFetchRecord }  = useApi<AttendanceRecord,AttendanceRecord>(ApiService.TIMETABLE_URL,1000)
  
  const { data:fetchedAttendanceData, error, isFetched } = useFetchAttendanceData(1)
  const { data:fetchedTimetableData, error:timetableError, isFetched:timetableIsFetched } = useFetchTimetableData(1,{ day_of_week: day })
  const { data:fetchedSessionData, error:sessionError, isFetched:sessionIsFetched } = useFetchSession(1,{is_active:true})
  const { data:fetchedRecordData, error:recordError, isFetched:recordIsFetched } = useFetchRecord(1)

  const attendanceData = fetchedAttendanceData as unknown as StudentCourseAttendance
  const timetableData = fetchedTimetableData?.results  || []
  const sessionData = fetchedSessionData?.results || []
  const recordData = fetchedRecordData?.results || []
  useEffect(() => {
    if (isFetched) {
      setIsLoading(false)
    }
  }, [isFetched])

  const chartData = attendanceData?.courses?.map((course) => ({
    name: course.course_name || "Unnamed Course",
    attendance: course.attendance_percentage || 0,
  })) || []

  // Calculate attendance values safely
  const overallPercentage = attendanceData?.overall_attendance?.attendance_percentage?.toFixed(1) || "0.0"
  const attendedSessions = attendanceData?.overall_attendance?.attended_sessions || 0
  const totalSessions = attendanceData?.overall_attendance?.total_sessions || 0
// Add this function inside your component
const getNextClassText = (timetables: Timetable[]) => {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  // Sort timetables by start time
  const sortedTimetables = [...timetables].sort((a, b) => {
    const aTime = parseTimeToMinutes(a.start_time)
    const bTime = parseTimeToMinutes(b.start_time)
    return aTime - bTime
  })
  
  // Find the next class (first class that hasn't started yet)
  const nextClass = sortedTimetables.find(t => {
    const classStartTime = parseTimeToMinutes(t.start_time)
    return classStartTime > currentTime
  })
  
  // Find current ongoing class
  const currentClass = sortedTimetables.find(t => {
    const classStartTime = parseTimeToMinutes(t.start_time)
    const classEndTime = parseTimeToMinutes(t.end_time)
    return currentTime >= classStartTime && currentTime < classEndTime
  })
  
  if (currentClass) {
    return `Current class: ${currentClass.course?.name || 'Unknown'} until ${formatTime(currentClass.end_time)}`
  } else if (nextClass) {
    return `Next class: ${nextClass.course?.name || 'Unknown'} at ${formatTime(nextClass.start_time)}`
  } else {
    return "No more classes scheduled for today"
  }
}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your attendance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "Loading..." : `${overallPercentage}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "" : `${attendedSessions} of ${totalSessions} sessions`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{!timetableIsFetched ? "Loading..." : fetchedTimetableData?.results.length}</div>
            <p className="text-xs text-muted-foreground">
              {!timetableIsFetched ? "Loading..." : 
                timetableData?.length > 0 ? 
                  getNextClassText(timetableData) : 
                  "No classes scheduled for today"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Attendance</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : sessionData.length}</div>
            {sessionData.length > 0 ? (
              sessionData.map((session) => (
                <p key={session.id} className="text-xs text-muted-foreground">{session.timetable.course.name} - {formatTime(session.start_time)}</p>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No pending attendance</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance by Course</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Course</CardTitle>
              <CardDescription>Your attendance percentage for each course this semester</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {isLoading ? (
                <div className="flex items-center justify-center h-[350px]">Loading chart data...</div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="attendance" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px]">No attendance data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Activity</CardTitle>
              <CardDescription>Your recent attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              {!recordIsFetched ? (
                <div className="text-center py-6">Loading activity data...</div>
              ):
              recordData.map((record) => {
                return (
                  <div className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{record.session.timetable.course.name}</p>
                      <p className="text-sm text-muted-foreground">Attended • {format(new Date(record.timestamp), "MMMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                )               
              }
              )}
              {isLoading ? (
                <div className="text-center py-6">Loading activity data...</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Database Systems</p>
                      <p className="text-sm text-muted-foreground">Attended • Today at 9:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Software Engineering</p>
                      <p className="text-sm text-muted-foreground">Attended • Yesterday at 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Computer Networks</p>
                      <p className="text-sm text-muted-foreground">Attended • Yesterday at 11:00 AM</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}