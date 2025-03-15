"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, Check, Download, Loader2, Search, X } from "lucide-react"
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
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import { toast } from "sonner"

export default function AttendanceHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)

  // Add debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // API hooks
  const { useFetchData } = useApi<AttendanceRecord, AttendanceRecord>(ApiService.ATTENDANCE_RECORD_URL)
  
  // Prepare query parameters
  const queryParams: Record<string, any> = {
    page,
    page_size: pageSize,
    search: debouncedSearch,
  }
  
  // Add date filter if selected
  if (date) {
    queryParams.date = format(date, "yyyy-MM-dd")
  }
  
  // Add course filter if selected
  if (selectedCourses.length > 0) {
    queryParams.course = selectedCourses.join(',')
  }

  // Fetch attendance records with filters
  const { 
    data: attendanceData, 
    isLoading, 
    error, 
    refetch: refetchRecords 
  } = useFetchData(page, queryParams)

  // Extract records from the response
  const attendanceRecords = attendanceData?.results || []
  
  // Get unique courses for the filter dropdown
  const uniqueCourses = Array.from(
    new Set(attendanceRecords
      .filter(record => record.session?.timetable.course?.id)
      .map(record => ({
        id: record.session.timetable.course.id,
        name: record.session.timetable.course.name || "Unknown Course",
        code: record.session.timetable.course.code || "N/A"
      }))
    )
  ).reduce((acc: {id: string, name: string, code: string}[], current) => {
    if (!acc.some(course => course.id === current.id)) {
      acc.push(current);
    }
    return acc;
  }, []);

  // Show error toast when API call fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load attendance records", {
        description: error.message || "Please try again later"
      })
    }
  }, [error])

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString)
      return format(date, "PPP p") // Format: May 10, 2023 9:15 AM
    } catch (e) {
      return "Invalid date"
    }
  }

  const exportToCSV = () => {
    const headers = ["Date", "Time", "Course", "Course Code", "Lecturer", "Verified by Lecturer"]

    const csvData = attendanceRecords.map((record) => {
      const date = new Date(record.timestamp)
      return [
        format(date, "yyyy-MM-dd"),
        format(date, "HH:mm:ss"),
        record.session.timetable?.course?.name || "N/A",
        record.session?.timetable.course?.code || "N/A",
        `${record.session?.lecturer?.first_name || ""} ${record.session?.lecturer?.last_name || ""}`.trim() || "N/A",
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
                  {uniqueCourses.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No courses available
                    </div>
                  ) : (
                    uniqueCourses.map((course) => (
                      <DropdownMenuCheckboxItem
                        key={course.id}
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCourses([...selectedCourses, course.id])
                          } else {
                            setSelectedCourses(selectedCourses.filter((id) => id !== course.id))
                          }
                          setPage(1) // Reset to first page when filter changes
                        }}
                      >
                        {course.name} ({course.code})
                      </DropdownMenuCheckboxItem>
                    ))
                  )}
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
                  <Calendar 
                    mode="single" 
                    selected={date} 
                    onSelect={(newDate) => {
                      setDate(newDate)
                      setPage(1) // Reset to first page when filter changes
                    }} 
                    initialFocus 
                  />
                </PopoverContent>
              </Popover>
              {(searchQuery || selectedCourses.length > 0 || date) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchQuery("")
                    setDebouncedSearch("")
                    setSelectedCourses([])
                    setDate(undefined)
                    setPage(1)
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear filters</span>
                </Button>
              )}
            </div>
            <Button onClick={exportToCSV} disabled={attendanceRecords.length === 0 || isLoading}>
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
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading attendance records...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-red-500">
                      Error loading attendance records. Please try again.
                    </TableCell>
                  </TableRow>
                ) : attendanceRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No attendance records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{formatDateTime(record.timestamp)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{record.session?.timetable.course?.name || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">{record.session?.timetable.course?.code || "N/A"}</div>
                      </TableCell>
                      <TableCell>
                        {record.session?.lecturer ? 
                          `${record.session.lecturer.first_name || ''} ${record.session.lecturer.last_name || ''}`.trim() || "N/A"
                          : "N/A"}
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
          
          {attendanceData && attendanceData.count > pageSize && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, attendanceData.count)} of {attendanceData.count} records
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={!attendanceData.next}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

