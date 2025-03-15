"use client"

import { useState, useEffect, useMemo } from "react"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// API integration
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import type { StudentCourseAttendance, AttendanceRecord, Semester } from "@/types"

export default function AttendanceTrendsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState("semester")
  const [selectedSemester, setSelectedSemester] = useState("")
  
  // API hooks for fetching data
  const { useFetchData: useFetchAttendanceData } = useApi<StudentCourseAttendance, StudentCourseAttendance>(
    ApiService.ATTENDANCE_STATS_URL
  )
  const { useFetchData: useFetchAttendanceRecords } = useApi<AttendanceRecord, AttendanceRecord>(
    ApiService.ATTENDANCE_RECORD_URL
  )
  const { useFetchData: useFetchSemesters } = useApi<Semester, Semester>(
    ApiService.SEMESTER_URL
  )

  // Fetch data
  const { data: fetchedAttendanceData, isLoading: isLoadingAttendance, error: attendanceError } = 
    useFetchAttendanceData(1, { timeframe: selectedTimeframe, semester: selectedSemester })
  const { data: recordsData, isLoading: isLoadingRecords, error: recordsError } = 
    useFetchAttendanceRecords(1, { timeframe: selectedTimeframe, semester: selectedSemester })
  const { data: semestersData, isLoading: isLoadingSemesters } = useFetchSemesters(1, { page_size: 100 })
  const attendanceData = fetchedAttendanceData as unknown as StudentCourseAttendance

  useEffect(() => {
    if (!isLoadingAttendance && !isLoadingRecords && !isLoadingSemesters) {
      setIsLoading(false)
    }
  }, [isLoadingAttendance, isLoadingRecords, isLoadingSemesters])

  useEffect(() => {
    if (attendanceError) {
      toast.error("Failed to load attendance statistics", {
        description: attendanceError.message || "Please try again later"
      })
    }
    if (recordsError) {
      toast.error("Failed to load attendance records", {
        description: recordsError.message || "Please try again later"
      })
    }
  }, [attendanceError, recordsError])

  // Get current semester if available
  useEffect(() => {
    if (semestersData?.results) {
      const currentSemester = semestersData.results.find(sem => sem.is_current)
      if (currentSemester) {
        setSelectedSemester(currentSemester.id)
      } else if (semestersData.results.length > 0) {
        setSelectedSemester(semestersData.results[0].id)
      }
    }
  }, [semestersData])

  // Handler for timeframe selection
  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value)
    setIsLoading(true)
  }

  // Calculate attendance statistics
  const stats = useMemo(() => {
    if (!attendanceData) return {
      overallPercentage: 0,
      attendedSessions: 0,
      totalSessions: 0,
      onTimeRate: 0,
      lowestAttendance: 0,
      lowestCourse: "N/A",
      courseAttendance: []
    }

    const overallPercentage = attendanceData.overall_attendance?.attendance_percentage || 0
    const attendedSessions = attendanceData.overall_attendance?.attended_sessions || 0
    const totalSessions = attendanceData.overall_attendance?.total_sessions || 0
    
    // Calculate on-time rate from records if available
    let onTimeCount = 0
    let lateCount = 0
    
    recordsData?.results?.forEach(record => {
      if (record.status === 'present') {
        // Check if the record has both session start time and attendance timestamp
        if (record.session.start_time && record.timestamp) {
          // Parse times to compare them
          const sessionTime = new Date(`2000-01-01T${record.session.start_time}`)
          const attendanceTime = new Date(`2000-01-01T${record.timestamp}`)
          
          // Calculate difference in minutes
          const diffInMinutes = (attendanceTime.getTime() - sessionTime.getTime()) / (1000 * 60)
          
          // If difference is more than 60 minutes (1 hour), mark as late
          if (diffInMinutes > 60) {
            lateCount++
          } else {
            onTimeCount++
          }
        } else if (record.is_late) {
          // Fallback to is_late flag if available
          lateCount++
        } else {
          // If no timestamp data but marked present, assume on time
          onTimeCount++
        }
      }
    })
    
    const totalAttended = onTimeCount + lateCount
    const onTimeRate = totalAttended > 0 ? (onTimeCount / totalAttended) * 100 : 0
    
    // Find course with lowest attendance
    let lowestAttendance = 100
    let lowestCourse = "N/A"
    attendanceData.courses?.forEach(course => {
      if (course.attendance_percentage !== null && course.attendance_percentage < lowestAttendance) {
        lowestAttendance = course.attendance_percentage
        lowestCourse = `${course.course_name || "Unnamed Course"}${course.course_id ? ` (${course.course_id})` : ''}`
      }
    })

    // Format course attendance data
    const courseAttendance = attendanceData.courses?.map(course => ({
      name: course.course_name || "Unnamed Course",
      code: course.course_id || "",
      percentage: course.attendance_percentage || 0,
      attended: course.attended_sessions || 0,
      total: course.total_sessions || 0
    })) || []
    
    return {
      overallPercentage,
      attendedSessions,
      totalSessions,
      onTimeRate,
      lowestAttendance,
      lowestCourse,
      courseAttendance
    }
  }, [attendanceData, recordsData])

  // Calculate attendance by day of week
  const weekdayStats = useMemo(() => {
    if (!recordsData?.results) return {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0
    }

    const dayTotals: Record<string, number> = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 }
    const dayAttended: Record<string, number> = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 }
    
    recordsData.results.forEach(record => {
      const day = new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' })
      if (day in dayTotals) {
        dayTotals[day]++
        if (record.status === 'present') {
          dayAttended[day]++
        }
      }
    })
    
    const dayPercentages: Record<string, number> = {}
    Object.keys(dayTotals).forEach(day => {
      dayPercentages[day] = dayTotals[day] > 0 ? (dayAttended[day] / dayTotals[day]) * 100 : 0
    })
    
    return dayPercentages
  }, [recordsData])

  // Calculate attendance by time of day
  const timeStats = useMemo(() => {
    if (!recordsData?.results) return {
      morning: 0,
      afternoon: 0,
      evening: 0
    }
    
    const timeTotals = { morning: 0, afternoon: 0, evening: 0 }
    const timeAttended = { morning: 0, afternoon: 0, evening: 0 }
    
    recordsData.results.forEach(record => {
      if (!record.time) return
      
      const hour = parseInt(record.time.split(':')[0])
      let timeSlot = ''
      
      if (hour >= 8 && hour < 12) timeSlot = 'morning'
      else if (hour >= 12 && hour < 16) timeSlot = 'afternoon'
      else if (hour >= 16 && hour <= 20) timeSlot = 'evening'
      
      if (timeSlot) {
        timeTotals[timeSlot as keyof typeof timeTotals]++
        if (record.status === 'present') {
          timeAttended[timeSlot as keyof typeof timeAttended]++
        }
      }
    })
    
    return {
      morning: timeTotals.morning > 0 ? (timeAttended.morning / timeTotals.morning) * 100 : 0,
      afternoon: timeTotals.afternoon > 0 ? (timeAttended.afternoon / timeTotals.afternoon) * 100 : 0,
      evening: timeTotals.evening > 0 ? (timeAttended.evening / timeTotals.evening) * 100 : 0
    }
  }, [recordsData])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Trends</h1>
        <p className="text-muted-foreground">Analyze your attendance patterns over time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overallPercentage.toFixed(1)}%</div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div 
                className="h-2 rounded-full bg-green-500" 
                style={{ width: `${Math.min(100, stats.overallPercentage)}%` }} 
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Target: 90%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendedSessions}/{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalSessions - stats.attendedSessions} classes missed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onTimeRate.toFixed(1)}%</div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div 
                className="h-2 rounded-full bg-blue-500" 
                style={{ width: `${Math.min(100, stats.onTimeRate)}%` }} 
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowestAttendance.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{stats.lowestCourse}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance by Course</CardTitle>
                <CardDescription>Your attendance rate for each course</CardDescription>
              </div>
              <Select 
                value={selectedTimeframe} 
                onValueChange={handleTimeframeChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Current Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semester">Current Semester</SelectItem>
                  <SelectItem value="year">Academic Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.courseAttendance.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No attendance data available</p>
              ) : (
                stats.courseAttendance.map((course, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {course.name} {course.code ? `(${course.code})` : ''}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course.attended}/{course.total} classes attended
                        </p>
                      </div>
                      <span className="text-sm font-medium">{course.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div 
                        className={`h-2 rounded-full ${
                          course.percentage >= 90 ? "bg-green-500" : 
                          course.percentage >= 75 ? "bg-blue-500" : 
                          "bg-amber-500"
                        }`} 
                        style={{ width: `${Math.min(100, course.percentage)}%` }} 
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>Your attendance pattern by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end gap-2">
              <div className="relative flex h-full w-full flex-col justify-end">
                <div className="absolute -left-4 bottom-0 top-0 flex w-6 flex-col justify-between text-xs text-muted-foreground">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                <div className="flex h-full items-end gap-2 pl-6">
                  {Object.entries(weekdayStats).map(([day, percentage]) => (
                    <div key={day} className="w-full">
                      <div 
                        className="bg-blue-500 w-8 rounded-t-md" 
                        style={{ height: `${Math.min(100, percentage)}%` }}
                      />
                      <p className="mt-2 text-center text-xs">{day.slice(0,3)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance by Time</CardTitle>
            <CardDescription>Your attendance rate by class time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Morning (8:00 - 12:00)</p>
                  <span className="text-sm font-medium">{timeStats.morning.toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div 
                    className={`h-2 rounded-full ${timeStats.morning >= 90 ? "bg-green-500" : "bg-blue-500"}`} 
                    style={{ width: `${Math.min(100, timeStats.morning)}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Afternoon (12:00 - 16:00)</p>
                  <span className="text-sm font-medium">{timeStats.afternoon.toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div 
                    className={`h-2 rounded-full ${timeStats.afternoon >= 90 ? "bg-green-500" : "bg-blue-500"}`}
                    style={{ width: `${Math.min(100, timeStats.afternoon)}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Evening (16:00 - 20:00)</p>
                  <span className="text-sm font-medium">{timeStats.evening.toFixed(1)}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div 
                    className={`h-2 rounded-full ${timeStats.evening >= 90 ? "bg-green-500" : 
                      timeStats.evening >= 75 ? "bg-blue-500" : "bg-amber-500"}`}
                    style={{ width: `${Math.min(100, timeStats.evening)}%` }} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

