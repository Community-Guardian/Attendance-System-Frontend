"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BookOpen, Clock, Loader2, Users, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// API integration
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import type { AttendanceSession, AttendanceRecord, Course, Enrollment } from "@/types"

// Define interface for processed dashboard data
interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  activeSessions: number;
  lowAttendanceCourses: number;
  courseStats: Array<{
    name: string;
    code: string;
    attendance: number;
    students: number;
  }>;
  recentSessions: Array<{
    id: string;
    course: string;
    code: string;
    date: string;
    time: string;
    attendance: string;
    percentage: number;
  }>;
}

export default function LecturerDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalStudents: 0,
    totalCourses: 0,
    activeSessions: 0,
    lowAttendanceCourses: 0,
    courseStats: [],
    recentSessions: []
  })
  
  // API hooks for fetching data
  const { useFetchData: useFetchCourses } = useApi<Enrollment, Enrollment>(
    ApiService.LECTURER_COURSES_URL
  )
  
  const { useFetchData: useFetchActiveSessions } = useApi<AttendanceSession, AttendanceSession>(
    ApiService.ATTENDANCE_SESSION_URL
  )
  
  const { useFetchData: useFetchAttendanceRecords } = useApi<AttendanceRecord, AttendanceRecord>(
    ApiService.ATTENDANCE_RECORD_URL
  )
  
  // Fetch data
  const { data: coursesData, isLoading: isLoadingCourses, error: coursesError } = 
    useFetchCourses(1, { page_size: 100 })
  
  const { data: sessionsData, isLoading: isLoadingSessions, error: sessionsError } = 
    useFetchActiveSessions(1, { page_size: 30 })
  
  const { data: recordsData, isLoading: isLoadingRecords, error: recordsError } = 
    useFetchAttendanceRecords(1, { page_size: 100 })
  
  // Handle errors
  useEffect(() => {
    if (coursesError) {
      toast.error(`Failed to load lecturer courses: ${coursesError.message || 'Unknown error'}`)
    }
    if (sessionsError) {
      toast.error(`Failed to load attendance sessions: ${sessionsError.message || 'Unknown error'}`)
    }
    if (recordsError) {
      toast.error(`Failed to load attendance records: ${recordsError.message || 'Unknown error'}`)
    }
  }, [coursesError, sessionsError, recordsError])

  // Process data when it's loaded
  useEffect(() => {
    if (!isLoadingCourses && !isLoadingSessions && !isLoadingRecords) {
      try {
        // Get courses taught by the current lecturer
        const courses = coursesData?.results || [];
        const totalCourses = courses.length;
        
        // Get active sessions data
        const sessions = sessionsData?.results || [];
        const activeSessions = sessions.filter(session => session.is_active);
        
        // Get attendance records
        const records = recordsData?.results || [];
        
        // Calculate total students across all courses
        let totalStudents = 0;
        const courseStudentCounts: Record<string, number> = {};
        
        courses.forEach(course => {
          const studentCount = course.class_group?.total_students || 0;
          totalStudents += studentCount;
          
          if (course.id) {
            courseStudentCounts[course.id] = studentCount;
          }
        });
        
        // Process course statistics with attendance data
        const courseStats = courses.map(course => {
          // Find sessions for this course
          const courseSessions = sessions.filter(
            session => session.timetable?.course?.id === course.id
          );
          
          // Calculate attendance percentage for this course
          let attendedCount = 0;
          let totalCount = 0;
          
          courseSessions.forEach(session => {
            // Count records for this session
            const sessionRecords = records.filter(record => record.session?.id === session.id);
            attendedCount += sessionRecords.length;
            totalCount += courseStudentCounts[course.id] || 0;
          });
          
          const attendancePercentage = totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0;
          
          return {
            name: course.course.name || "Unnamed Course",
            code: course.course.code || "",
            attendance: attendancePercentage,
            students: courseStudentCounts[course.id] || 0
          };
        });
        
        // Count courses with low attendance (below 70%)
        const lowAttendanceCourses = courseStats.filter(course => course.attendance < 70).length;
        
        // Process recent sessions for display
        const recentSessions = sessions
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5) // Get 5 most recent sessions
          .map(session => {
            const courseId = session.timetable?.course?.id;
            const studentCount = courseStudentCounts[courseId] || 0;
            
            // Count attendance for this session
            const sessionRecords = records.filter(record => record.session?.id === session.id);
            const attendanceCount = sessionRecords.length;
            const attendancePercentage = studentCount > 0 ? Math.round((attendanceCount / studentCount) * 100) : 0;
            
            return {
              id: session.id,
              course: session.timetable?.course?.name || "Unknown Course",
              code: session.timetable?.course?.code || "N/A",
              date: new Date(session.timestamp).toLocaleDateString(),
              time: session.start_time || "N/A",
              attendance: `${attendanceCount}/${studentCount}`,
              percentage: attendancePercentage
            };
          });
        
        // Set dashboard data
        setDashboardData({
          totalStudents,
          totalCourses,
          activeSessions: activeSessions.length,
          lowAttendanceCourses,
          courseStats,
          recentSessions
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error processing dashboard data:', error);
        toast.error('Failed to process dashboard data');
        setIsLoading(false);
      }
    }
  }, [
    isLoadingCourses, 
    isLoadingSessions, 
    isLoadingRecords,
    coursesData,
    sessionsData,
    recordsData
  ]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[500px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-xl font-medium text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lecturer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your courses and attendance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across {dashboardData.totalCourses} courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeSessions}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.activeSessions === 0 
                ? "No active sessions" 
                : dashboardData.activeSessions === 1 
                  ? "Session currently running" 
                  : "Sessions currently running"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalCourses}</div>
            <p className="text-xs text-muted-foreground">This semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Attendance</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.lowAttendanceCourses}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.lowAttendanceCourses === 1 
                ? "Course below 70% attendance" 
                : "Courses below 70% attendance"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Course Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance by Course</CardTitle>
              <CardDescription>Average attendance percentage for each course</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              {dashboardData.courseStats.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <p className="text-muted-foreground">No course data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dashboardData.courseStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="attendance" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Your most recent attendance sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData.recentSessions.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <p className="text-muted-foreground">No recent sessions available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardData.recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center space-x-4 rounded-md border p-4">
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">
                          {session.course} ({session.code})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.date} at {session.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{session.attendance}</p>
                        <p
                          className={`text-sm ${
                            session.percentage >= 80
                              ? "text-green-500"
                              : session.percentage >= 70
                                ? "text-amber-500"
                                : "text-red-500"
                          }`}
                        >
                          {session.percentage}% attendance
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

