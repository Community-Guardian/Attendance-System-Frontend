"use client"

import { useState, useEffect, useMemo } from "react"
import { Download, Edit, Loader2, Plus, Search, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import type { Course } from "@/types"
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import { DjangoPaginatedResponse } from "@/types"

// Define types for course data
interface CourseEnrollment {
  id: string
  course: {
    id: string
    code: string | null
    name: string | null
    department: string | null
    status: 'active' | 'inactive' | 'archived' | null
  }
  class_group: {
    id: string
    name: string | null
    programme: string | null
    students_count: number | null
  } | null
  lecturer: {
    id: string
    full_name: string | null
    email: string | null
  } | null
  semester: string | null
  year: string | null
  is_active: boolean
}

export default function CourseManagementPage() {
  const { useFetchData } = useApi<DjangoPaginatedResponse<CourseEnrollment>>(ApiService.COURSE_ENROLLMENTS)
  const { data: enrollmentsData, isLoading, error } = useFetchData(1)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<CourseEnrollment | null>(null)
  const { toast } = useToast()

  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    department: '',
    programmes: [] as string[],
    lecturers: [] as string[],
    status: 'active' as 'active' | 'inactive' | 'archived'
  })

  // Extract unique departments from enrollments data with null handling
  const departments = useMemo(() => {
    if (!enrollmentsData?.results?.length) return []
    
    return Array.from(
      new Set(
        enrollmentsData.results
          .map(enrollment => enrollment.course?.department)
          .filter((dept): dept is string => !!dept) // Type guard to filter out null/undefined
      )
    ).sort()
  }, [enrollmentsData?.results])

  // Filter enrollments based on search, department, and status with null handling
  const filteredEnrollments = useMemo(() => {
    if (!enrollmentsData?.results?.length) return []
    
    return enrollmentsData.results.filter((enrollment) => {
      if (!enrollment?.course) return false

      let matchesQuery = true
      let matchesDepartment = true
      let matchesStatus = true

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const code = enrollment.course.code?.toLowerCase() || ''
        const name = enrollment.course.name?.toLowerCase() || ''
        const lecturerName = enrollment.lecturer?.full_name?.toLowerCase() || ''
        
        matchesQuery =
          code.includes(query) ||
          name.includes(query) ||
          lecturerName.includes(query)
      }

      if (selectedDepartment) {
        matchesDepartment = enrollment.course.department?.toLowerCase() === selectedDepartment.toLowerCase()
      }

      if (selectedStatus) {
        matchesStatus = enrollment.course.status === selectedStatus
      }

      return matchesQuery && matchesDepartment && matchesStatus
    })
  }, [enrollmentsData?.results, searchQuery, selectedDepartment, selectedStatus])

  const handleSelectEnrollment = (id: string) => {
    setSelectedCourses((prev) => 
      prev.includes(id) ? prev.filter((courseId) => courseId !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCourses([])
    } else {
      setSelectedCourses(filteredEnrollments.map((enrollment) => enrollment.id))
    }
    setSelectAll(!selectAll)
  }


  const handleEditCourse = async () => {
    if (!currentCourse) return

    setIsProcessing(true)
    try {
      // Edit API call implementation
      toast({
        title: "Course Updated",
        description: "The course has been updated successfully.",
      })
      setShowEditDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteCourse = async (id: string) => {
    try {
      // Delete API call implementation
      toast({
        title: "Course Deleted",
        description: "The course has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkAction = async (action: "activate" | "deactivate" | "archive" | "delete") => {
    if (selectedCourses.length === 0) {
      toast({
        title: "No Courses Selected",
        description: "Please select at least one course to perform this action.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      // Bulk action API call implementation
      const actionMap = {
        activate: "activated",
        deactivate: "deactivated",
        archive: "archived",
        delete: "deleted",
      }

      toast({
        title: "Bulk Action Completed",
        description: `${selectedCourses.length} courses have been ${actionMap[action]} successfully.`,
      })
      setSelectedCourses([])
      setSelectAll(false)
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} courses. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Helper function to safely get student count
  const getStudentCount = (enrollment: CourseEnrollment): number => {
    return enrollment.class_group?.students_count ?? 0
  }

  // Helper function to safely get programme name
  const getProgrammeName = (enrollment: CourseEnrollment): string => {
    return enrollment.class_group?.programme || 'N/A'
  }

  // Helper function to get status badge with fallback
  const getStatusBadge = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge variant="success">Active</Badge>
      case 'inactive':
        return <Badge variant="warning">Inactive</Badge>
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage courses across departments</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedStatus(null)}>
            All Courses
          </TabsTrigger>
          <TabsTrigger value="active" onClick={() => setSelectedStatus("active")}>
            Active
          </TabsTrigger>
          <TabsTrigger value="inactive" onClick={() => setSelectedStatus("inactive")}>
            Inactive
          </TabsTrigger>
          <TabsTrigger value="archived" onClick={() => setSelectedStatus("archived")}>
            Archived
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>
              {error ? (
                <span className="text-destructive">Failed to load courses</span>
              ) : (
                `Manage your course enrollments (${filteredEnrollments.length} total)`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search courses..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {departments.length > 0 && (
                  <Select 
                    value={selectedDepartment || "all"} 
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        disabled={isLoading || !!error}
                      />
                    </TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-destructive">
                        Failed to load courses. Please try again later.
                      </TableCell>
                    </TableRow>
                  ) : filteredEnrollments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No courses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEnrollments.map((enrollment) => (
                      <TableRow key={enrollment.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedCourses.includes(enrollment.id)}
                            onCheckedChange={() => handleSelectEnrollment(enrollment.id)}
                          />
                        </TableCell>
                        <TableCell>{enrollment.course?.code || 'N/A'}</TableCell>
                        <TableCell>{enrollment.course?.name || 'N/A'}</TableCell>
                        <TableCell>{enrollment.course?.department || 'N/A'}</TableCell>
                        <TableCell>{getProgrammeName(enrollment)}</TableCell>
                        <TableCell>{getStudentCount(enrollment)}</TableCell>
                        <TableCell>{getStatusBadge(enrollment.course?.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentCourse(enrollment)
                              setShowEditDialog(true)
                            }}
                            disabled={isLoading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Edit Course Dialog */}
      {currentCourse && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Course Details</DialogTitle>
              <DialogDescription>View and manage course attendance settings.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Course Information */}
              <div className="grid gap-2">
                <Label>Course Details</Label>
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Code:</span>
                    <span className="text-sm">{currentCourse.course?.code}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{currentCourse.course?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Department:</span>
                    <span className="text-sm">{currentCourse.course?.department}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    <span>{getStatusBadge(currentCourse.course?.status)}</span>
                  </div>
                </div>
              </div>

              {/* Class Group Information */}
              <div className="grid gap-2">
                <Label>Class Group</Label>
                <div className="rounded-lg border p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Group:</span>
                    <span className="text-sm">{currentCourse.class_group?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Programme:</span>
                    <span className="text-sm">{currentCourse.class_group?.programme}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Students:</span>
                    <span className="text-sm">{currentCourse.class_group?.students_count}</span>
                  </div>
                </div>
              </div>

              {/* Attendance Settings */}
              <div className="grid gap-2">
                <Label>Attendance Settings</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="auto-end"
                      checked={autoEndSession}
                      onCheckedChange={(checked) => setAutoEndSession(checked as boolean)}
                    />
                    <Label htmlFor="auto-end" className="text-sm font-normal">
                      Automatically end attendance session after class duration
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="late-submissions"
                      checked={allowLateSubmissions}
                      onCheckedChange={(checked) => setAllowLateSubmissions(checked as boolean)}
                    />
                    <Label htmlFor="late-submissions" className="text-sm font-normal">
                      Allow late attendance submissions (up to 15 minutes)
                    </Label>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid gap-2">
                <Label>Quick Actions</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/lecturer/manage-attendance?courseId=${currentCourse.id}`)}
                  >
                    View Attendance Records
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/lecturer/student-performance?courseId=${currentCourse.id}`)}
                  >
                    Student Performance
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Close
              </Button>
              <Button onClick={handleSaveSettings} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )} 
    </div>
  )
}

