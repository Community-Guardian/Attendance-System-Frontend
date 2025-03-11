"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, Check, Download, Search, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AttendanceRecord } from "@/types"
// Mock attendance records
const mockRecords: AttendanceRecord[] = [
  {
    id: "1",
    session: {
      id: "101",
      course: { id: "101", name: "Database Systems", code: "CS301" },
      lecturer: { id: "user123", first_name: "John", last_name: "Doe" },
    },
    student: { id: "student1", first_name: "Alice", last_name: "Johnson" },
    timestamp: "2023-05-10T09:15:00Z",
    latitude: -1.2921,
    longitude: 36.8219,
    signed_by_lecturer: true,
    facial_image: "https://example.com/images/facial1.jpg",
  },
  {
    id: "2",
    session: {
      id: "102",
      course: { id: "102", name: "Software Engineering", code: "CS302" },
      lecturer: { id: "user124", first_name: "Jane", last_name: "Smith" },
    },
    student: { id: "student1", first_name: "Alice", last_name: "Johnson" },
    timestamp: "2023-05-10T14:10:00Z",
    latitude: -1.2925,
    longitude: 36.8225,
    signed_by_lecturer: true,
    facial_image: "https://example.com/images/facial2.jpg",
  },
  {
    id: "3",
    session: {
      id: "103",
      course: { id: "103", name: "Computer Networks", code: "CS303" },
      lecturer: { id: "user125", first_name: "Robert", last_name: "Brown" },
    },
    student: { id: "student1", first_name: "Alice", last_name: "Johnson" },
    timestamp: "2023-05-11T11:05:00Z",
    latitude: -1.293,
    longitude: 36.823,
    signed_by_lecturer: false,
    facial_image: "https://example.com/images/facial3.jpg",
  },
  {
    id: "4",
    session: {
      id: "104",
      course: { id: "104", name: "Artificial Intelligence", code: "CS304" },
      lecturer: { id: "user126", first_name: "Michael", last_name: "Wilson" },
    },
    student: { id: "student1", first_name: "Alice", last_name: "Johnson" },
    timestamp: "2023-05-12T09:08:00Z",
    latitude: -1.2935,
    longitude: 36.8235,
    signed_by_lecturer: true,
    facial_image: "https://example.com/images/facial4.jpg",
  },
  {
    id: "5",
    session: {
      id: "105",
      course: { id: "105", name: "Web Development", code: "CS305" },
      lecturer: { id: "user127", first_name: "Sarah", last_name: "Davis" },
    },
    student: { id: "student1", first_name: "Alice", last_name: "Johnson" },
    timestamp: "2023-05-13T14:12:00Z",
    latitude: -1.294,
    longitude: 36.824,
    signed_by_lecturer: true,
    facial_image: "https://example.com/images/facial5.jpg",
  },
]
export default function AttendanceHistoryPage() {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])

  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      try {
        // Replace with actual API call
        const response = await fetch("/api/student/attendance-history")
        const data = await response.json()
        setAttendanceRecords(data)
        setFilteredRecords(data)
      } catch (error) {
        console.error("Failed to fetch attendance history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttendanceHistory()
  }, [])

  
  useEffect(() => {
    // Apply filters
    let filtered = mockRecords;
  
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((record) => {
        const courseName = record.session?.course?.name?.toLowerCase() || "";
        const courseCode = record.session?.course?.code?.toLowerCase() || "";
        const lecturerName = `${record.session?.lecturer?.first_name || ""} ${record.session?.lecturer?.last_name || ""}`.toLowerCase();
  
        return courseName.includes(query) || courseCode.includes(query) || lecturerName.includes(query);
      });
    }
  
    // Course filter
    if (selectedCourses.length > 0) {
      filtered = filtered.filter((record) => selectedCourses.includes(record.session?.course?.id || ""));
    }
  
    // Date filter
    if (date) {
      const selectedDate = format(date, "yyyy-MM-dd");
      filtered = filtered.filter((record) => record.timestamp?.startsWith(selectedDate));
    }
  
    setFilteredRecords(filtered);
  }, [searchQuery, selectedCourses, date, mockRecords]);
  
// Get unique courses for filter
  const uniqueCourses = Array.from(
    new Set(mockRecords.map((record) => record.session?.course?.id).filter(Boolean)) // Ensure valid course IDs
  ).map((courseId) => {
    const record = mockRecords.find((record) => record.session?.course?.id === courseId);
    return {
      id: courseId,
      name: record?.session?.course?.name || "",
      code: record?.session?.course?.code || "",
    };
  });


  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return format(date, "PPP p") // Format: May 10, 2023 9:15 AM
  }

  const exportToCSV = () => {
    const headers = ["Date", "Time", "Course", "Course Code", "Lecturer", "Verified by Lecturer"]

    const csvData = filteredRecords.map((record) => {
      const date = new Date(record.timestamp)
      return [
        format(date, "yyyy-MM-dd"),
        format(date, "HH:mm:ss"),
        record.session?.course?.name,
        record.session?.course?.code,
        `${record.session?.lecturer?.first_name} ${record.session?.lecturer?.last_name}`,
        record.signed_by_lecturer ? "Yes" : "No",
      ]
    })

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `attendance_history_${format(new Date(), "yyyy-MM-dd")}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
        <p className="text-muted-foreground">View and filter your past attendance records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Your attendance history for all courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by course or lecturer..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Courses</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {uniqueCourses.map((course) => (
                    <DropdownMenuCheckboxItem
                      key={course.id}
                      checked={selectedCourses.includes(course.id as string)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCourses([...selectedCourses , course.id as string])
                        } else {
                          setSelectedCourses(selectedCourses.filter((id) => id !== course.id))
                        }
                      }}
                    >
                      {course.name} ({course.code})
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              {(searchQuery || selectedCourses.length > 0 || date) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCourses([])
                    setDate(undefined)
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear filters</span>
                </Button>
              )}
            </div>
            <Button onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead className="text-center">Verified</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading attendance records...
                    </TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDateTime(record.timestamp)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{record.session?.course?.name}</div>
                        <div className="text-sm text-muted-foreground">{record.session?.course?.code}</div>
                      </TableCell>
                      <TableCell>
                        {record.session?.lecturer?.first_name} {record.session?.lecturer?.last_name}
                      </TableCell>
                      <TableCell className="text-center">
                        {record.signed_by_lecturer ? (
                          <div className="flex justify-center">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <X className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

