"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Play, Square, Users, CheckCircle2, XCircle, Download, Search, Filter, Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Check, X } from 'lucide-react'

// API integration
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import type { AttendanceSession, AttendanceRecord, Course, Enrollment, User } from "@/types"
import { toast } from "sonner"

export default function ManageAttendancePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [isStartingSession, setIsStartingSession] = useState(false)
  const [isEndingSession, setIsEndingSession] = useState(false)
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null)
  const [showStudentList, setShowStudentList] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [refreshInterval, setRefreshInterval] = useState(10000) // 10 seconds by default

  // Add debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // API hooks
  const { 
    useFetchData: useFetchSessions, 
    useUpdateItem: useUpdateSession,
    useAddItem: useStartSession 
  } = useApi<AttendanceSession, AttendanceSession>(ApiService.ATTENDANCE_SESSION_URL)
  
  const { 
    useFetchData: useFetchCourses 
  } = useApi<Enrollment, Enrollment>(ApiService.LECTURER_COURSES_URL)
  
  const { 
    useFetchData: useFetchRecords,
    useUpdateItem: useUpdateRecord 
  } = useApi<AttendanceRecord, AttendanceRecord>(ApiService.ATTENDANCE_RECORD_URL)
  
  const { 
    useFetchData: useFetchStudents 
  } = useApi<User, User>(ApiService.USER_URL)

  // Fetch data with appropriate filters
  const { 
    data: activeSessions, 
    isLoading: isLoadingActive, 
    error: activeError,
    refetch: refetchActiveSessions 
  } = useFetchSessions(page, { 
    is_active: true,
    search: debouncedSearch,
    page_size: pageSize 
  })

  const { 
    data: pastSessions, 
    isLoading: isLoadingPast, 
    error: pastError,
    refetch: refetchPastSessions 
  } = useFetchSessions(page, { 
    is_active: false,
    search: debouncedSearch,
    page_size: pageSize
  })

  const { 
    data: coursesData, 
    isLoading: isLoadingCourses, 
    error: coursesError 
  } = useFetchCourses(1, { 
    is_active: true, 
    page_size: 100 
  })

  const { 
    data: studentsData, 
    isLoading: isLoadingStudents, 
    error: studentsError,
    refetch: refetchStudents
  } = useFetchStudents(1, {
    session_id: selectedSession?.id as string,
    page_size: 100
  })

  const { 
    data: recordsData, 
    isLoading: isLoadingRecords, 
    error: recordsError,
    refetch: refetchRecords
  } = useFetchRecords(1, {
    session_id: selectedSession?.id as string,
    page_size: 100,
    live: true
  })

  // Handle auto-refresh for active sessions
  useEffect(() => {
    if (activeTab !== "active") return

    const interval = setInterval(() => {
      refetchActiveSessions()
      if (selectedSession) {
        refetchRecords()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [activeTab, refreshInterval, refetchActiveSessions, selectedSession, refetchRecords])

  // Handle errors
  useEffect(() => {
    if (activeError) {
      toast.error(`Failed to load active sessions: ${activeError.message || 'Unknown error'}`)
    }
    if (pastError) {
      toast.error(`Failed to load past sessions: ${pastError.message || 'Unknown error'}`)
    }
    if (coursesError) {
      toast.error(`Failed to load courses: ${coursesError.message || 'Unknown error'}`)
    }
    if (studentsError) {
      toast.error(`Failed to load students: ${studentsError.message || 'Unknown error'}`)
    }
    if (recordsError) {
      toast.error(`Failed to load attendance records: ${recordsError.message || 'Unknown error'}`)
    }
  }, [activeError, pastError, coursesError, studentsError, recordsError])

  // Mutations
  const { mutate: startSession } = useStartSession
  const { mutate: updateSession } = useUpdateSession
  const { mutate: updateRecord } = useUpdateRecord

  // Live attendance state
  const [liveAttendance, setLiveAttendance] = useState<{
    present: number
    total: number
    recentSignIns: Array<{ id: string; name: string; time: string }>
  }>({
    present: 0,
    total: 0,
    recentSignIns: [],
  })

  // Update live attendance data when records data changes
  useEffect(() => {
    if (recordsData?.results && selectedSession) {
      const presentRecords = recordsData.results.filter(record => record.status === 'present')
      const totalStudents = selectedSession.class_group.total_students || recordsData.count || 0
      
      // Get the most recent sign-ins (up to 5)
      const recentSignIns = presentRecords
        .sort((a, b) => new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime())
        .slice(0, 5)
        .map(record => {
          // Calculate how long ago the sign-in was
          const signInTime = new Date(record.timestamp || '').getTime()
          const now = new Date().getTime()
          const diffInMinutes = Math.floor((now - signInTime) / (1000 * 60))
          
          let timeString = "Just now"
          if (diffInMinutes === 1) {
            timeString = "1 min ago"
          } else if (diffInMinutes > 1) {
            timeString = `${diffInMinutes} mins ago`
          }
          
          return {
            id: record.id || '',
            name: record.student?.first_name || 'Unknown Student',
            time: timeString
          }
        })
      
      setLiveAttendance({
        present: presentRecords.length,
        total: totalStudents,
        recentSignIns: recentSignIns
      })
    }
  }, [recordsData, selectedSession])

  const handleStartSession = () => {
    if (!selectedCourse) {
      toast.error('Please select a course')
      return
    }

    setIsStartingSession(true)
    
    startSession({ 
      timetable_id: selectedCourse,
      is_active: true
    }, {
      onSuccess: () => {
        toast.success('Attendance session started successfully')
        refetchActiveSessions()
        setSelectedCourse(null)
      },
      onError: (error) => {
        toast.error(`Failed to start session: ${error.message || 'Unknown error'}`)
      },
      onSettled: () => {
        setIsStartingSession(false)
      }
    })
  }

  const handleEndSession = (sessionId: string) => {
    setIsEndingSession(true)

    updateSession({
      id: sessionId,
      item: { is_active: false }
    }, {
      onSuccess: () => {
        toast.success('Attendance session ended successfully')
        refetchActiveSessions()
        refetchPastSessions()
        setActiveTab('past')
      },
      onError: (error) => {
        toast.error(`Failed to end session: ${error.message || 'Unknown error'}`)
      },
      onSettled: () => {
        setIsEndingSession(false)
      }
    })
  }

  const handleViewStudents = (session: AttendanceSession) => {
    setSelectedSession(session)
    setShowStudentList(true)
    refetchStudents()
    refetchRecords()
  }

  const handleToggleAttendance = (recordId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'present' ? 'absent' : 'present'
    
    updateRecord({
      id: recordId,
      item: { status: newStatus }
    }, {
      onSuccess: () => {
        toast.success(`Student marked as ${newStatus}`)
        refetchRecords()
      },
      onError: (error) => {
        toast.error(`Failed to update attendance: ${error.message || 'Unknown error'}`)
      }
    })
  }

  const handleSaveAttendance = () => {
    // Records are saved individually with the toggle function
    setShowStudentList(false)
  }

  const handleExportAttendance = async (sessionId: string) => {
    try {
      toast.info('Preparing attendance export...');
      
      // Fetch the attendance records for the session
      const response = await fetch(`${ApiService.ATTENDANCE_RECORD_URL}?session_id=${sessionId}&page_size=1000`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch attendance data: ${response.status}`);
      }
      
      const data = await response.json();
      const records : AttendanceRecord[] = data.results || [];
      
      // Get session info (assuming we need to refetch to get full details)
      const sessionResponse = await fetch(`${ApiService.ATTENDANCE_SESSION_URL}${sessionId}/`);
      const sessionData = await sessionResponse.json();
      
      // Prepare data for Excel
      const exportData = records.map(record => ({
        'Student Name': `${record.student?.first_name || ''} ${record.student?.last_name || ''}`,
        'Student ID': record.student?.student_id || 'N/A',
        'Attendance Status': record.status === 'present' ? 'Present' : 'Absent',
        'Time Recorded': record.timestamp ? new Date(record.timestamp).toLocaleString() : 'N/A'
      }));
      
      // Generate CSV string
      const headers = Object.keys(exportData[0] || {}).join(',');
      const rows = exportData.map(row => 
        Object.values(row).map(value => `"${value}"`).join(',')
      );
      const csvContent = [headers, ...rows].join('\n');
      
      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set download filename with course info if available
      const courseName = sessionData?.timetable?.course?.code || 'attendance';
      const date = new Date(sessionData?.start_time || Date.now()).toISOString().split('T')[0];
      link.download = `${courseName}_attendance_${date}.csv`;
      
      // Trigger download
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      toast.success('Attendance report downloaded successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Failed to export attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Format data for the UI
  const formattedActiveSessions = activeSessions?.results?.map(session => {
    // Find attendance records for this session
    const sessionRecords = recordsData?.results?.filter(record => 
      record.session?.id === session.id
    ) || [];
    
    // Count present students from records
    const presentStudents = sessionRecords.filter(record => 
      record.status === 'present'
    ).length;
    
    // Get total students either from session data or count from class group
    const totalStudents = session.class_group?.total_students || 
                         sessionRecords.length || 0;
    
    return {
      id: session.id || '',
      course: { 
        id: session.timetable?.course?.id || '', 
        name: session.timetable?.course?.name || 'Unknown Course',
        code: session.timetable?.course?.code || 'N/A'
      },
      startTime: new Date(session.start_time || '').toLocaleTimeString(),
      duration: `${session.timetable?.duration || 0} minutes`,
      studentsPresent: presentStudents,
      totalStudents: totalStudents,
      location:  session.geolocation_zone?.name || 'Not specified',
      status: session.is_active ? 'active' : 'completed'
    };
  }) || []

  const formattedPastSessions = pastSessions?.results?.map(session => {
    // Find attendance records for this session
    const sessionRecords = recordsData?.results?.filter(record => 
      record.session?.id === session.id
    ) || [];
    
    // Count present students from records
    const presentStudents = sessionRecords.filter(record => 
      record.status === 'present'
    ).length;
    
    // Get total students either from session data or count from class group
    const totalStudents = session.class_group?.total_students || 
                         sessionRecords.length || 0;
    
    // Calculate duration from start_time and end_time
    let durationText = 'Unknown';
    if (session.start_time && session.end_time) {
      const startTime = new Date(session.start_time);
      const endTime = new Date(session.end_time);
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
      durationText = `${durationMinutes} minutes`;
    } else if (session.timetable?.duration) {
      // Fallback to timetable duration if available
      durationText = `${session.timetable.duration} minutes`;
    }
    
    return {
      id: session.id || '',
      course: { 
        id: session.timetable?.course?.id || '', 
        name: session.timetable?.course?.name || 'Unknown Course',
        code: session.timetable?.course?.code || 'N/A'
      },
      date: new Date(session.start_time || '').toLocaleDateString(),
      startTime: new Date(session.start_time || '').toLocaleTimeString(),
      duration: durationText,
      studentsPresent: presentStudents,
      totalStudents: totalStudents,
      location: session.geolocation_zone?.name || 'Not specified',
      status: session.is_active ? 'active' : 'completed'
    };
  }) || []

  const formattedStudentRecords = recordsData?.results?.map(record => ({
    id: record.id || '',
    studentId: record.student?.id || '',
    name: record.student?.first_name || 'Unknown Student',
    studentIdNumber: record.student?.student_id || 'N/A',
    status: record.status || 'absent',
    timestamp: record.timestamp || null
  })) || []

  const availableCourses = coursesData?.results?.map(enrollment => ({
    id: enrollment.id || '',
    course_id: enrollment.course?.id || '',
    name: enrollment.course?.name || 'Unknown Course',
    code: enrollment.course?.code || 'N/A'
  })) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Attendance</h1>
        <p className="text-muted-foreground">Start, monitor, and manage attendance sessions for your courses</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Start New Session</CardTitle>
            <Select value={selectedCourse || ""} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingCourses ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading courses...
                  </div>
                ) : availableCourses.length === 0 ? (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No courses available
                  </div>
                ) : (
                  availableCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          <CardDescription>Start a new attendance session for your selected course</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button 
            onClick={handleStartSession} 
            disabled={!selectedCourse || isStartingSession}
          >
            {isStartingSession ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Session
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sessions..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select 
              value={refreshInterval.toString()} 
              onValueChange={(val) => setRefreshInterval(parseInt(val))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Refresh rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5000">Refresh: 5s</SelectItem>
                <SelectItem value="10000">Refresh: 10s</SelectItem>
                <SelectItem value="30000">Refresh: 30s</SelectItem>
                <SelectItem value="60000">Refresh: 1min</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoadingActive ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading active sessions...</span>
            </div>
          ) : formattedActiveSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No Active Sessions</p>
                <p className="text-sm text-muted-foreground mt-1">Start a new session to begin tracking attendance</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {formattedActiveSessions.map(session => (
                <Card key={session.id}>
                  <CardHeader>
                    <CardTitle>Active Session</CardTitle>
                    <CardDescription>
                      {session.course.name} ({session.course.code})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Attendance Progress</p>
                          <p className="text-2xl font-bold">
                            {session.studentsPresent}/{session.totalStudents}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Percentage</p>
                          <p className="text-2xl font-bold">
                            {session.totalStudents > 0 
                              ? Math.round((session.studentsPresent / session.totalStudents) * 100) 
                              : 0}%
                          </p>
                        </div>
                      </div>
                      <Progress 
                        value={session.totalStudents > 0 
                          ? (session.studentsPresent / session.totalStudents) * 100 
                          : 0} 
                        className="h-2" 
                      />
                      <div className="rounded-md border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Start Time</p>
                            <p className="text-sm text-muted-foreground">{session.startTime}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Duration</p>
                            <p className="text-sm text-muted-foreground">{session.duration}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Location</p>
                            <p className="text-sm text-muted-foreground">{session.location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewStudents(activeSessions?.results.find(s => s.id === session.id)!)}>
                          <Users className="mr-2 h-4 w-4" />
                          Students
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleEndSession(session.id)}
                          disabled={isEndingSession}
                        >
                          {isEndingSession ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Square className="mr-2 h-4 w-4" />
                          )}
                          End
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {selectedSession && (
                <Card>
                  <CardHeader>
                    <CardTitle>Live Sign-ins</CardTitle>
                    <CardDescription>Students signing in real-time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoadingRecords ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          <span>Loading sign-ins...</span>
                        </div>
                      ) : liveAttendance.recentSignIns.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No recent sign-ins</p>
                      ) : (
                        liveAttendance.recentSignIns.map((signIn) => (
                          <div key={signIn.id} className="flex items-center space-x-4 rounded-md border p-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <Users className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{signIn.name}</p>
                            </div>
                            <div className="text-xs text-muted-foreground">{signIn.time}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sessions..."
                  className="pl-8 w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem checked>Show all courses</DropdownMenuCheckboxItem>
                  {availableCourses.map((course) => (
                    <DropdownMenuCheckboxItem key={course.id} checked>
                      {course.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoadingPast ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading past sessions...</span>
            </div>
          ) : formattedPastSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No Past Sessions</p>
                <p className="text-sm text-muted-foreground mt-1">Past attendance sessions will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formattedPastSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="font-medium">{session.course.name}</div>
                        <div className="text-sm text-muted-foreground">{session.course.code}</div>
                      </TableCell>
                      <TableCell>{session.date}</TableCell>
                      <TableCell>{session.startTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-medium">
                            {session.studentsPresent}/{session.totalStudents}
                          </span>
                          <span className="ml-2 text-sm text-muted-foreground">
                            ({session.totalStudents > 0 
                              ? Math.round((session.studentsPresent / session.totalStudents) * 100) 
                              : 0}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewStudents(pastSessions?.results.find(s => s.id === session.id)!)}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            Students
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleExportAttendance(session.id)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Student List Dialog */}
      <Dialog open={showStudentList} onOpenChange={setShowStudentList}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSession?.timetable?.course?.name || 'Unknown Course'} - Student Attendance
            </DialogTitle>
            <DialogDescription>
              {selectedSession?.is_active
                ? "Mark or update student attendance for this session"
                : "View student attendance for this session"}
            </DialogDescription>
          </DialogHeader>
          {isLoadingRecords ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading student records...</span>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    {selectedSession?.is_active && <TableHead className="text-right">Action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formattedStudentRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{record.studentIdNumber}</TableCell>
                      <TableCell className="text-center">
                        {record.status === "present" ? (
                          <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="mx-auto h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      {selectedSession?.is_active && (
                        <TableCell className="text-right">
                          <Button
                            variant={record.status === "present" ? "destructive" : "default"}
                            size="sm"
                            onClick={() => handleToggleAttendance(record.id, record.status)}
                          >
                            {record.status === "present" ? "Mark Absent" : "Mark Present"}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <DialogFooter>
            {selectedSession?.is_active ? (
              <Button onClick={handleSaveAttendance}>Close</Button>
            ) : (
              <Button onClick={() => setShowStudentList(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
