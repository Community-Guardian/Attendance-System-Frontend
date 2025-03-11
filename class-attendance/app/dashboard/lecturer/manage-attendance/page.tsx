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

const studentsData = [
  { id: 1, name: "Alice Johnson", status: "present" },
  { id: 2, name: "Bob Smith", status: "absent" },
  { id: 3, name: "Charlie Brown", status: "present" },
  { id: 4, name: "Diana Ross", status: "late" },
  { id: 5, name: "Edward Norton", status: "present" },
]

export default function ManageAttendancePage() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<string | null>("CS101")
  const [isStartingSession, setIsStartingSession] = useState(false)
  const [isEndingSession, setIsEndingSession] = useState(false)
  const [selectedSession, setSelectedSession] = useState<any | null>(null)
  const [showStudentList, setShowStudentList] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [liveAttendance, setLiveAttendance] = useState<{
    present: number
    total: number
    recentSignIns: Array<{ id: string; name: string; time: string }>
  }>({
    present: 28,
    total: 40,
    recentSignIns: [
      { id: "1", name: "Alice Johnson", time: "Just now" },
      { id: "2", name: "Bob Smith", time: "1 min ago" },
      { id: "3", name: "Charlie Brown", time: "3 mins ago" },
    ],
  })

  useEffect(() => {
    // Only run this effect when the active tab is "active"
    if (activeTab !== "active") return

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (liveAttendance.present < liveAttendance.total) {
        const newPresent = Math.min(liveAttendance.present + 1, liveAttendance.total)

        // Generate a random student name for the sign-in
        const names = [
          "David Wilson",
          "Emma Davis",
          "Frank Miller",
          "Grace Taylor",
          "Henry Clark",
          "Ivy Robinson",
          "Jack Lewis",
          "Kate Moore",
        ]
        const randomName = names[Math.floor(Math.random() * names.length)]

        // Update the state with new attendance data
        setLiveAttendance((prev) => ({
          ...prev,
          present: newPresent,
          recentSignIns: [
            { id: Date.now().toString(), name: randomName, time: "Just now" },
            ...prev.recentSignIns
              .map((signIn) => ({
                ...signIn,
                time:
                  signIn.time === "Just now"
                    ? "1 min ago"
                    : signIn.time === "1 min ago"
                      ? "2 mins ago"
                      : signIn.time === "2 mins ago"
                        ? "3 mins ago"
                        : signIn.time,
              }))
              .slice(0, 4),
          ],
        }))
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [activeTab, liveAttendance])

  // Dummy data
  const courses = [
    { id: "101", name: "Database Systems", code: "CS301" },
    { id: "102", name: "Software Engineering", code: "CS302" },
    { id: "103", name: "Computer Networks", code: "CS303" },
  ]

  const activeSessions = [
    {
      id: "1",
      course: { id: "101", name: "Database Systems", code: "CS301" },
      startTime: "09:00 AM",
      duration: "2 hours",
      studentsPresent: 36,
      totalStudents: 40,
      location: "Computer Science Building",
      status: "active",
    },
  ]

  const pastSessions = [
    {
      id: "2",
      course: { id: "102", name: "Software Engineering", code: "CS302" },
      date: "May 15, 2023",
      startTime: "02:00 PM",
      duration: "2 hours",
      studentsPresent: 38,
      totalStudents: 45,
      location: "Engineering Block",
      status: "completed",
    },
    {
      id: "3",
      course: { id: "103", name: "Computer Networks", code: "CS303" },
      date: "May 14, 2023",
      startTime: "11:00 AM",
      duration: "2 hours",
      studentsPresent: 28,
      totalStudents: 35,
      location: "Computer Science Building",
      status: "completed",
    },
  ]

  const students = [
    { id: "1", name: "Alice Johnson", studentId: "CS/001/19", status: "present" },
    { id: "2", name: "Bob Smith", studentId: "CS/002/19", status: "present" },
    { id: "3", name: "Charlie Brown", studentId: "CS/003/19", status: "absent" },
    { id: "4", name: "Diana Prince", studentId: "CS/004/19", status: "present" },
    { id: "5", name: "Edward Stark", studentId: "CS/005/19", status: "absent" },
    { id: "6", name: "Fiona Gallagher", studentId: "CS/006/19", status: "present" },
    { id: "7", name: "George Wilson", studentId: "CS/007/19", status: "present" },
    { id: "8", name: "Hannah Baker", studentId: "CS/008/19", status: "absent" },
    { id: "9", name: "Ian Malcolm", studentId: "CS/009/19", status: "present" },
    { id: "10", name: "Jane Foster", studentId: "CS/010/19", status: "present" },
  ]

  const handleStartSession = () => {
    setIsStartingSession(true)

    // Simulate API call
    setTimeout(() => {
      setIsStartingSession(false)
      toast({
        title: "Session Started",
        description: `Attendance session for ${selectedCourse} has been started.`,
      })
      // Reset form
      setSelectedCourse(null)
    }, 1500)
  }

  const handleEndSession = (sessionId: string) => {
    setIsEndingSession(true)

    // Simulate API call
    setTimeout(() => {
      setIsEndingSession(false)
      toast({
        title: "Session Ended",
        description: "Attendance session has been ended successfully.",
      })
      // Update UI
      setActiveTab("past")
    }, 1500)
  }

  const handleViewStudents = (session: any) => {
    setSelectedSession(session)
    setShowStudentList(true)
  }

  const handleToggleAttendance = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  const handleSaveAttendance = () => {
    toast({
      title: "Attendance Updated",
      description: `Updated attendance for ${selectedStudents.length} students.`,
    })
    setShowStudentList(false)
    setSelectedStudents([])
  }

  const handleExportAttendance = (sessionId: string) => {
    toast({
      title: "Export Started",
      description: "Attendance report is being downloaded.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Attendance</h1>
        <p className="text-muted-foreground">Start, monitor, and manage attendance sessions for your courses</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Real-time Attendance</CardTitle>
            <Select value={selectedCourse || ""} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CS101">CS101</SelectItem>
                <SelectItem value="CS201">CS201</SelectItem>
                <SelectItem value="CS301">CS301</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>Mark attendance for {selectedCourse}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentsData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      student.status === "present" ? "text-green-600" :
                      student.status === "absent" ? "text-red-600" :
                      "text-yellow-600"
                    }`}>
                      {student.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="w-24">
                        <Check className="mr-2 h-4 w-4" /> Present
                      </Button>
                      <Button size="sm" variant="outline" className="w-24">
                        <X className="mr-2 h-4 w-4" /> Absent
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button>Save Attendance</Button>
          </div>
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
          </div>

          {activeSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Clock className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No Active Sessions</p>
                <p className="text-sm text-muted-foreground mt-1">Start a new session to begin tracking attendance</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Active Session</CardTitle>
                  <CardDescription>
                    {activeSessions[0].course.name} ({activeSessions[0].course.code})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Attendance Progress</p>
                        <p className="text-2xl font-bold">
                          {liveAttendance.present}/{liveAttendance.total}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Percentage</p>
                        <p className="text-2xl font-bold">
                          {Math.round((liveAttendance.present / liveAttendance.total) * 100)}%
                        </p>
                      </div>
                    </div>
                    <Progress value={(liveAttendance.present / liveAttendance.total) * 100} className="h-2" />
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Start Time</p>
                          <p className="text-sm text-muted-foreground">{activeSessions[0].startTime}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">{activeSessions[0].duration}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">{activeSessions[0].location}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewStudents(activeSessions[0])}>
                        <Users className="mr-2 h-4 w-4" />
                        Students
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEndSession(activeSessions[0].id)}
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

              <Card>
                <CardHeader>
                  <CardTitle>Live Sign-ins</CardTitle>
                  <CardDescription>Students signing in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {liveAttendance.recentSignIns.length === 0 ? (
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
                  {courses.map((course) => (
                    <DropdownMenuCheckboxItem key={course.id} checked>
                      {course.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

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
                {pastSessions.map((session) => (
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
                          ({Math.round((session.studentsPresent / session.totalStudents) * 100)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{session.location}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewStudents(session)}>
                          <Users className="mr-2 h-4 w-4" />
                          Students
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExportAttendance(session.id)}>
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
        </TabsContent>
      </Tabs>

      {/* Student List Dialog */}
      <Dialog open={showStudentList} onOpenChange={setShowStudentList}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedSession?.course.name} - Student Attendance</DialogTitle>
            <DialogDescription>
              {selectedSession?.status === "active"
                ? "Mark or update student attendance for this session"
                : "View student attendance for this session"}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  {selectedSession?.status === "active" && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell className="text-center">
                      {student.status === "present" ? (
                        <CheckCircle2 className="mx-auto h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="mx-auto h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    {selectedSession?.status === "active" && (
                      <TableCell className="text-right">
                        <Button
                          variant={student.status === "present" ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleToggleAttendance(student.id)}
                        >
                          {student.status === "present" ? "Mark Absent" : "Mark Present"}
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            {selectedSession?.status === "active" ? (
              <Button onClick={handleSaveAttendance}>Save Changes</Button>
            ) : (
              <Button onClick={() => setShowStudentList(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
