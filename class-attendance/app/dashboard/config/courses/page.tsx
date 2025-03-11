'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Download, Edit, Loader2, Plus, Search, Trash2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { Course } from '@/types'

// Define types for course data
interface CourseWithDetails extends Course {
  id: string
  code: string
  name: string
  department: string
  programmes: string[]
  lecturers: string[]
  students: number
  credits: number
  status: 'active' | 'inactive' | 'archived'
}

export default function CourseManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<CourseWithDetails | null>(null)
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    department: '',
    programmes: [] as string[],
    lecturers: [] as string[],
    credits: 3,
    status: 'active' as 'active' | 'inactive' | 'archived',
  })
  const { toast } = useToast()

  // Mock data
  const departments = [
    { id: 'cs', name: 'Computer Science' },
    { id: 'it', name: 'Information Technology' },
    { id: 'ee', name: 'Electrical Engineering' },
    { id: 'me', name: 'Mechanical Engineering' },
    { id: 'bs', name: 'Business School' },
  ]

  const programmes = [
    { id: 'bsc-cs', name: 'BSc Computer Science', departmentId: 'cs' },
    { id: 'bsc-it', name: 'BSc Information Technology', departmentId: 'it' },
    { id: 'bsc-ee', name: 'BSc Electrical Engineering', departmentId: 'ee' },
    { id: 'bsc-me', name: 'BSc Mechanical Engineering', departmentId: 'me' },
    { id: 'bba', name: 'Bachelor of Business Administration', departmentId: 'bs' },
    { id: 'msc-cs', name: 'MSc Computer Science', departmentId: 'cs' },
    { id: 'msc-it', name: 'MSc Information Technology', departmentId: 'it' },
  ]

  const lecturers = [
    { id: 'lec1', name: 'Dr. John Smith', departmentId: 'cs' },
    { id: 'lec2', name: 'Prof. Jane Wilson', departmentId: 'cs' },
    { id: 'lec3', name: 'Dr. Sarah Davis', departmentId: 'it' },
    { id: 'lec4', name: 'Prof. Michael Wilson', departmentId: 'it' },
    { id: 'lec5', name: 'Dr. Lisa Johnson', departmentId: 'ee' },
    { id: 'lec6', name: 'Prof. Thomas White', departmentId: 'me' },
    { id: 'lec7', name: 'Dr. Emily Brown', departmentId: 'bs' },
    { id: 'lec8', name: 'Prof. Robert Green', departmentId: 'bs' },
  ]

  const courses: CourseWithDetails[] = [
    {
      id: '1',
      code: 'CS301',
      name: 'Database Systems',
      department: 'Computer Science',
      programmes: ['BSc Computer Science', 'MSc Computer Science'],
      lecturers: ['Dr. John Smith'],
      students: 40,
      credits: 4,
      status: 'active',
    },
    {
      id: '2',
      code: 'CS302',
      name: 'Software Engineering',
      department: 'Computer Science',
      programmes: ['BSc Computer Science'],
      lecturers: ['Prof. Jane Wilson'],
      students: 45,
      credits: 3,
      status: 'active',
    },
    {
      id: '3',
      code: 'IT301',
      name: 'Web Development',
      department: 'Information Technology',
      programmes: ['BSc Information Technology', 'MSc Information Technology'],
      lecturers: ['Dr. Sarah Davis'],
      students: 38,
      credits: 3,
      status: 'active',
    },
    {
      id: '4',
      code: 'IT302',
      name: 'Mobile App Development',
      department: 'Information Technology',
      programmes: ['BSc Information Technology'],
      lecturers: ['Prof. Michael Wilson'],
      students: 35,
      credits: 3,
      status: 'active',
    },
    {
      id: '5',
      code: 'EE301',
      name: 'Circuit Analysis',
      department: 'Electrical Engineering',
      programmes: ['BSc Electrical Engineering'],
      lecturers: ['Dr. Lisa Johnson'],
      students: 30,
      credits: 4,
      status: 'active',
    },
    {
      id: '6',
      code: 'ME301',
      name: 'Thermodynamics',
      department: 'Mechanical Engineering',
      programmes: ['BSc Mechanical Engineering'],
      lecturers: ['Prof. Thomas White'],
      students: 28,
      credits: 4,
      status: 'active',
    },
    {
      id: '7',
      code: 'BUS301',
      name: 'Business Ethics',
      department: 'Business School',
      programmes: ['Bachelor of Business Administration'],
      lecturers: ['Dr. Emily Brown'],
      students: 50,
      credits: 3,
      status: 'inactive',
    },
    {
      id: '8',
      code: 'CS201',
      name: 'Data Structures',
      department: 'Computer Science',
      programmes: ['BSc Computer Science'],
      lecturers: ['Dr. John Smith', 'Prof. Jane Wilson'],
      students: 60,
      credits: 4,
      status: 'active',
    },
    {
      id: '9',
      code: 'IT201',
      name: 'Network Fundamentals',
      department: 'Information Technology',
      programmes: ['BSc Information Technology'],
      lecturers: ['Dr. Sarah Davis'],
      students: 42,
      credits: 3,
      status: 'inactive',
    },
    {
      id: '10',
      code: 'BUS201',
      name: 'Marketing Principles',
      department: 'Business School',
      programmes: ['Bachelor of Business Administration'],
      lecturers: ['Prof. Robert Green'],
      students: 55,
      credits: 3,
      status: 'archived',
    },
  ]

  useEffect(() => {
    // Simulate API call to fetch courses
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter courses based on search, department, and status
  const filteredCourses = courses.filter((course) => {
    let matchesQuery = true
    let matchesDepartment = true
    let matchesStatus = true

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesQuery =
        course.code.toLowerCase().includes(query) ||
        course.name.toLowerCase().includes(query) ||
        course.lecturers.some(lecturer => lecturer.toLowerCase().includes(query))
    }

    if (selectedDepartment) {
      matchesDepartment = course.department === departments.find((d) => d.id === selectedDepartment)?.name
    }

    if (selectedStatus) {
      matchesStatus = course.status === selectedStatus
    }

    return matchesQuery && matchesDepartment && matchesStatus
  })

  const handleSelectCourse = (id: string) => {
    setSelectedCourses(prev => 
      prev.includes(id) 
        ? prev.filter(courseId => courseId !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCourses([])
    } else {
      setSelectedCourses(filteredCourses.map(course => course.id))
    }
    setSelectAll(!selectAll)
  }

  const handleAddCourse = () => {
    setIsProcessing(true)

    // Validate inputs
    if (!newCourse.code || !newCourse.name || !newCourse.department) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      setIsProcessing(false)
      return
    }

    // Simulate API call to add course
    setTimeout(() => {
      setIsProcessing(false)
      setShowAddDialog(false)
      setNewCourse({
        code: '',
        name: '',
        department: '',
        programmes: [],
        lecturers: [],
        credits: 3,
        status: 'active',
      })

      toast({
        title: 'Course Added',
        description: `${newCourse.code} - ${newCourse.name} has been added successfully.`,
      })
    }, 1000)
  }

  const handleEditCourse = () => {
    if (!currentCourse) return
    
    setIsProcessing(true)

    // Simulate API call to update course
    setTimeout(() => {
      setIsProcessing(false)
      setShowEditDialog(false)
      setCurrentCourse(null)

      toast({
        title: 'Course Updated',
        description: `${currentCourse.code} - ${currentCourse.name} has been updated successfully.`,
      })
    }, 1000)
  }

  const handleDeleteCourse = (id: string) => {
    // Simulate API call to delete course
    const course = courses.find((c) => c.id === id)
    
    if (course) {
      toast({
        title: 'Course Deleted',
        description: `${course.code} - ${course.name} has been deleted successfully.`,
      })
    }
  }

  const handleBulkAction = (action: 'activate' | 'deactivate' | 'archive' | 'delete') => {
    if (selectedCourses.length === 0) {
      toast({
        title: 'No Courses Selected',
        description: 'Please select at least one course to perform this action.',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)

    // Simulate API call for bulk action
    setTimeout(() => {
      setIsProcessing(false)
      setSelectedCourses([])
      setSelectAll(false)

      const actionMap = {
        activate: 'activated',
        deactivate: 'deactivated',
        archive: 'archived',
        delete: 'deleted',
      }

      toast({
        title: 'Bulk Action Completed',
        description: `${selectedCourses.length} courses have been ${actionMap[action]} successfully.`,
      })
    }, 1500)
  }

  const getStatusBadge = (status: 'active' | 'inactive' | 'archived') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'inactive':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Inactive</Badge>
      case 'archived':
        return <Badge variant="secondary">Archived</Badge>
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
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
          <Button variant="outline" onClick={() => {}}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setSelectedStatus(null)}>All Courses</TabsTrigger>
          <TabsTrigger value="active" onClick={() => setSelectedStatus('active')}>Active</TabsTrigger>
          <TabsTrigger value="inactive" onClick={() => setSelectedStatus('inactive')}>Inactive</TabsTrigger>
          <TabsTrigger value="archived" onClick={() => setSelectedStatus('archived')}>Archived</TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Manage all courses in the system</CardDescription>
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
                <Select value={selectedDepartment || 'all'} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(searchQuery || selectedDepartment || selectedStatus) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedDepartment(null)
                      setSelectedStatus(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear filters</span>
                  </Button>
                )}
              </div>
              
              {selectedCourses.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedCourses.length} selected
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Bulk Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBulkAction('activate')}>
                        Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('deactivate')}>
                        Deactivate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleBulkAction('delete')}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectAll} 
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all courses"
                        />
                      </TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Programmes</TableHead>
                      <TableHead>Lecturers</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-24 text-center">
                          No courses found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedCourses.includes(course.id)}
                              onCheckedChange={() => handleSelectCourse(course.id)}
                              aria-label={`Select ${course.name}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{course.code}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.department}</TableCell>
                          <TableCell>
                            {course.programmes.length > 1 ? (
                              <span>{course.programmes[0]} +{course.programmes.length - 1}</span>
                            ) : (
                              course.programmes[0]
                            )}
                          </TableCell>
                          <TableCell>
                            {course.lecturers.length > 1 ? (
                              <span>{course.lecturers[0]} +{course.lecturers.length - 1}</span>
                            ) : (
                              course.lecturers[0]
                            )}
                          </TableCell>
                          <TableCell>{course.students}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>{getStatusBadge(course.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setCurrentCourse(course)
                                  setShowEditDialog(true)
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Add Course Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Create a new course and assign it to departments, programmes, and lecturers.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  value={newCourse.code}
                  onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credits">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  max="6"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 3 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={newCourse.department}
                onValueChange={(value) => setNewCourse({ ...newCourse, department: value })}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="programmes">Programmes</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    {newCourse.programmes.length > 0
                      ? `${newCourse.programmes.length} selected`
                      : 'Select programmes'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {programmes
                    .filter(
                      (prog) =>
                        !newCourse.department ||
                        departments.find((d) => d.name === newCourse.department)?.id === prog.departmentId
                    )
                    .map((prog) => (
                      <DropdownMenuCheckboxItem
                        key={prog.id}
                        checked={newCourse.programmes.includes(prog.name)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewCourse({
                              ...newCourse,
                              programmes: [...newCourse.programmes, prog.name],
                            })
                          } else {
                            setNewCourse({
                              ...newCourse,
                              programmes: newCourse.programmes.filter((p) => p !== prog.name),
                            })
                          }
                        }}
                      >
                        {prog.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lecturers">Lecturers</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    {newCourse.lecturers.length > 0
                      ? `${newCourse.lecturers.length} selected`
                      : 'Select lecturers'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {lecturers
                    .filter(
                      (lec) =>
                        !newCourse.department ||
                        departments.find((d) => d.name === newCourse.department)?.id === lec.departmentId
                    )
                    .map((lec) => (
                      <DropdownMenuCheckboxItem
                        key={lec.id}
                        checked={newCourse.lecturers.includes(lec.name)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewCourse({
                              ...newCourse,
                              lecturers: [...newCourse.lecturers, lec.name],
                            })
                          } else {
                            setNewCourse({
                              ...newCourse,
                              lecturers: newCourse.lecturers.filter((l) => l !== lec.name),
                            })
                          }
                        }}
                      >
                        {lec.name}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newCourse.status}
                onValueChange={(value: 'active' | 'inactive' | 'archived') => 
                  setNewCourse({ ...newCourse, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCourse} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Course'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      {currentCourse && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update course details and assignments.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-code">Course Code</Label>
                  <Input
                    id="edit-code"
                    value={currentCourse.code}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, code: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-credits">Credits</Label>
                  <Input
                    id="edit-credits"
                    type="number"
                    min="1"
                    max="6"
                    value={currentCourse.credits}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, credits: parseInt(e.target.value) || 3 })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Course Name</Label>
                <Input
                  id="edit-name"
                  value={currentCourse.name}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Select
                  value={currentCourse.department}
                  onValueChange={(value) => setCurrentCourse({ ...currentCourse, department: value })}
                >
                  <SelectTrigger id="edit-department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={currentCourse.status}
                  onValueChange={(value: 'active' | 'inactive' | 'archived') => 
                    setCurrentCourse({ ...currentCourse, status: value })
                  }
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-programmes">Programmes</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      {currentCourse.programmes.length > 0
                        ? `${currentCourse.programmes.length} selected`
                        : 'Select programmes'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {programmes
                      .filter(
                        (prog) =>
                          !currentCourse.department ||
                          departments.find((d) => d.name === currentCourse.department)?.id === prog.departmentId
                      )
                      .map((prog) => (
                        <DropdownMenuCheckboxItem
                          key={prog.id}
                          checked={currentCourse.programmes.includes(prog.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCurrentCourse({
                                ...currentCourse,
                                programmes: [...currentCourse.programmes, prog.name],
                              })
                            } else {
                              setCurrentCourse({
                                ...currentCourse,
                                programmes: currentCourse.programmes.filter((p) => p !== prog.name),
                              })
                            }
                          }}
                        >
                          {prog.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-lecturers">Lecturers</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      {currentCourse.lecturers.length > 0
                        ? `${currentCourse.lecturers.length} selected`
                        : 'Select lecturers'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {lecturers
                      .filter(
                        (lec) =>
                          !currentCourse.department ||
                          departments.find((d) => d.name === currentCourse.department)?.id === lec.departmentId
                      )
                      .map((lec) => (
                        <DropdownMenuCheckboxItem
                          key={lec.id}
                          checked={currentCourse.lecturers.includes(lec.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setCurrentCourse({
                                ...currentCourse,
                                lecturers: [...currentCourse.lecturers, lec.name],
                              })
                            } else {
                              setCurrentCourse({
                                ...currentCourse,
                                lecturers: currentCourse.lecturers.filter((l) => l !== lec.name),
                              })
                            }
                          }}
                        >
                          {lec.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCourse} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Course'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
