"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, Clock, FileText, Info, Loader2 } from "lucide-react"

// API integration
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import type { AttendanceSession, Enrollment as CourseEnrollment, StudentCourseAttendance } from "@/types"

// Define simplified notification type
interface Notification {
  id: string
  type: "attendance" | "class" | "announcement" | "warning"
  title: string
  message: string
  courseId?: string
}

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState("all")

  // API hooks for fetching data
  const { useFetchData: useFetchAttendanceData } = useApi<StudentCourseAttendance, StudentCourseAttendance>(
    ApiService.ATTENDANCE_STATS_URL
  )
  const { useFetchData: useFetchSessions } = useApi<AttendanceSession, AttendanceSession>(
    ApiService.ATTENDANCE_SESSION_URL
  )
  const { useFetchData: useFetchEnrollments } = useApi<CourseEnrollment, CourseEnrollment>(
    ApiService.ENROLLMENT_BY_CURRENT_SEMESTER_URL
  )

  // Fetch data
  const { data: attendanceData, isLoading: isLoadingAttendance } = useFetchAttendanceData(1)
  const { data: sessionsData, isLoading: isLoadingSessions } = useFetchSessions(1, { is_active: true })
  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useFetchEnrollments(1)

  useEffect(() => {
    // Wait for all data to load
    if (!isLoadingAttendance && !isLoadingSessions && !isLoadingEnrollments) {
      generateNotifications()
      setIsLoading(false)
    }
  }, [isLoadingAttendance, isLoadingSessions, isLoadingEnrollments, attendanceData, sessionsData, enrollmentsData])

  // Generate notifications based on fetched data
  const generateNotifications = () => {
    let newNotifications: Notification[] = []

    // Active attendance sessions
    if (sessionsData?.results) {
      sessionsData.results.forEach(session => {
        newNotifications.push({
          id: `session-${session.id}`,
          type: "class",
          title: "Active Attendance Session",
          message: `Attendance is open for ${session.timetable.course?.name || 'Unknown Course'}.`,
          courseId: session.timetable.course?.id
        })
      })
    }

    // Attendance warnings (below 80%)
    if (attendanceData?.results) {
      const data = attendanceData as unknown as StudentCourseAttendance
      data.courses.forEach(course => {
        if (course.attendance_percentage < 80) {
          newNotifications.push({
            id: `warning-${course.course_id}`,
            type: "warning",
            title: "Attendance Warning",
            message: `Your attendance for ${course.course_name} is ${course.attendance_percentage}%, below the 80% requirement.`,
            courseId: course.course_id
          })
        }
      })
    }

    // Add enrollment-based notifications
    if (enrollmentsData?.results) {
      enrollmentsData.results.forEach((enrollment, index) => {
        newNotifications.push({
          id: `course-${enrollment.id}`,
          type: "announcement",
          title: "Course Enrollment",
          message: `You are enrolled in ${enrollment.course?.name || 'a course'} with ${enrollment.lecturer?.first_name || 'a lecturer'}.`,
          courseId: enrollment.course?.id
        })
      })
    }

    setNotifications(newNotifications)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "class":
        return <Clock className="h-5 w-5 text-green-500" />
      case "announcement":
        return <Info className="h-5 w-5 text-amber-500" />
      case "warning":
        return <Bell className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const filteredNotifications = activeTab === "important" 
    ? notifications.filter(n => n.type === "warning") 
    : notifications

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading notifications...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">View your notifications</p>
      </div>

      <div className="flex items-center">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="important">
              Important
              <Badge className="ml-2 bg-primary">{notifications.filter((n) => n.type === "warning").length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Your latest updates and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notifications to display
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-4 rounded-lg border p-4"
                >
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

