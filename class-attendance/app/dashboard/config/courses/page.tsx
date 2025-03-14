'use client'

import { useState, useEffect } from 'react'
import { Edit, Loader2, Plus, Search, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useApi } from '@/hooks/useApi'
import ApiService from '@/handler/ApiService'
import { Pagination } from '@/components/ui/pagination'
import { Department, Course, Enrollment, User, Programme } from '@/types'
import { MultiCombobox } from '@/components/ui/multi-combobox'
import { Textarea } from '@/components/ui/textarea'

interface EnrollmentDialogProps {
  courseId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_COURSE_FORM: Partial<Course> = {
  code: '',
  name: '',
  department: null as unknown as Partial<Department>,  // Add department field
  description: '',
  prerequisites: [] as Partial<Course>[],  // Add prerequisites field
  programmes: [] as Partial<Programme>[],  // Add programmes field
}

export default function CourseManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [courseForm, setCourseForm] = useState<Partial<Course>>(DEFAULT_COURSE_FORM)

  const { 
    useFetchData: useFetchCourses, 
    useAddItem: useAddCourse,
    useUpdateItem: useUpdateCourse,
    useDeleteItem: useDeleteCourse
  } = useApi<Course, Course>(ApiService.COURSE_URL)

  const { 
    useFetchData: useFetchDepartments 
  } = useApi<Department, Department>(ApiService.DEPARTMENT_URL)

  const {
    useFetchData: useFetchEnrollments,
    useAddItem: useAddEnrollment,
    useDeleteItem: useDeleteEnrollment
  } = useApi<Enrollment, Enrollment>(ApiService.COURSE_ENROLLMENTS)

  const { data: coursesData, isLoading: isLoadingCourses, refetch: refetchCourses } = useFetchCourses(page, {
    search: debouncedSearch,
    department: selectedDepartment === 'all' ? '' : selectedDepartment
  })

  const { data: departmentsData } = useFetchDepartments(1, {
    page_size: 100
  })

  const { mutate: addCourse, isPending: isAddingCourse } = useAddCourse
  const { mutate: updateCourse, isPending: isUpdatingCourse } = useUpdateCourse
  const { mutate: deleteCourse } = useDeleteCourse

  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleFormChange = (
    field: keyof Course | 'prerequisites' | 'programmes' | 'department',
    value: any
  ) => {
    if (field === 'prerequisites') {
      const prerequisitesList = Array.isArray(value) ? value : [value];
      if (showEditDialog && currentCourse) {
        setCurrentCourse(prev => prev ? {
          ...prev,
          prerequisites: prerequisitesList.map(id => ({ id } as Course))
        } : null);
      } else {
        setCourseForm(prev => ({
          ...prev,
          prerequisites: prerequisitesList.map(id => ({ id } as Course))
        }));
      }
      return; // Exit early after handling prerequisites
    }

    if (showEditDialog && currentCourse) {
      setCurrentCourse(prev => prev ? { ...prev, [field]: value } : null);
    } else {
      setCourseForm(prev => {
        if (field === 'department') {
          return {
            ...prev,
            department: typeof value === 'object' ? value : { id: value } as Partial<Department>
          };
        }
        if (field === 'programmes') {
          const programmesList = Array.isArray(value) ? value : [value];
          return {
            ...prev,
            programmes: programmesList.map(id => ({ id } as Partial<Programme>))
          };
        }
        return { ...prev, [field]: value };
      });
    }
  };

  const validateCourseForm = (form: Partial<Course>): string[] => {
    const errors: string[] = []
    if (!form.code?.trim()) errors.push('Course code is required')
    if (!form.name?.trim()) errors.push('Course name is required')
    if (!form.department) errors.push('Department is required')
    return errors
  }

  const handleSubmitCourse = async (isEdit: boolean) => {
    const form = isEdit ? currentCourse : courseForm
    console.log(form);
    
    const errors = validateCourseForm(form as Course)
    
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
      return
    }

    // Transform the data to match API requirements
    if (!form) {
      throw new Error("Form data is required");
    }

    const transformedData = {
      ...form,
      department_id: form.department ? (typeof form.department === 'object' ? form.department.id : form.department) : undefined,
      programme_ids: form.programmes?.map(p => typeof p === 'object' ? p.id : p) ?? [],
      prerequisites_ids: form.prerequisites?.map(p => typeof p === 'object' ? p.id : p) ?? [],
    }

    try {
      if (isEdit && currentCourse?.id) {
        await updateCourse({
          id: currentCourse.id,
          item: transformedData as Course
        }, {
          onSuccess: () => {
            toast.success('Course updated successfully')
            setShowEditDialog(false)
            setCurrentCourse(null)
            refetchCourses()
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to update course')
          }
        })
      } else {
        await addCourse(transformedData as Course, {
          onSuccess: () => {
            toast.success('Course added successfully')
            setShowAddDialog(false)
            setCourseForm(DEFAULT_COURSE_FORM)
            refetchCourses()
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to add course')
          }
        })
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || `Failed to ${isEdit ? 'update' : 'add'} course`)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return

    try {
      await deleteCourse(courseId ,{
        onError: (error: any) => {
          toast.error(error?.response?.data?.detail || 'Failed to delete course')
        },
        onSuccess: () => {
          toast.success('Course deleted successfully')
        }
      })
      refetchCourses()
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || 'Failed to delete course')
    }
  }

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No courses found</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {searchQuery || selectedDepartment !== 'all'
          ? "No courses match your search criteria. Try adjusting your filters."
          : "Get started by adding your first course."}
      </p>
      <Button onClick={() => setShowAddDialog(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Course
      </Button>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Course Management</h1>
          <p className="text-muted-foreground">
            {coursesData?.count 
              ? `${coursesData.count} course${coursesData.count === 1 ? '' : 's'} total`
              : 'Manage your courses'}
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departmentsData?.results.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!coursesData?.results?.length ? (
            <EmptyState />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coursesData.results.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.code}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>
                        {departmentsData?.results.find(d => d.id === course.department)?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setCurrentCourse(course)
                              setShowEditDialog(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              router.push(`/dashboard/config/courses/${course.id}/enrollments`)
                            }}
                          >
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {coursesData.count > pageSize && (
                <div className="mt-4 flex justify-center">
                  <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(coursesData.count / pageSize)}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Course Dialog */}
      <Dialog open={showAddDialog || showEditDialog} onOpenChange={() => {
        setShowAddDialog(false)
        setShowEditDialog(false)
        setCurrentCourse(null)
        setCourseForm(DEFAULT_COURSE_FORM)
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showEditDialog ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={showEditDialog ? currentCourse?.code : courseForm.code}
                onChange={(e) => handleFormChange('code', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={showEditDialog ? currentCourse?.name : courseForm.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={showEditDialog 
                  ? (typeof currentCourse?.department === 'object' 
                      ? currentCourse?.department?.id 
                      : currentCourse?.department || '') 
                  : (typeof courseForm.department === 'object'
                      ? courseForm.department?.id
                      : courseForm.department || '')}
                onValueChange={(value) => handleFormChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departmentsData?.results.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <MultiCombobox
                options={coursesData?.results
                  .filter(course => course.id !== currentCourse?.id)
                  .map(course => ({
                    value: course.id,
                    label: `${course.code} - ${course.name}`
                  })) || []}
                  selected={(showEditDialog 
                    ? (currentCourse?.prerequisites?.map(p => typeof p === 'object' ? p.id : p) || [])
                    : (courseForm.prerequisites?.map(p => typeof p === 'object' ? p.id : p) || []))
                    .filter((p): p is string => p !== undefined)}
                onChange={(values) => handleFormChange('prerequisites', values)}
                placeholder="Select Prerequisites"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Select courses that must be completed before taking this course
              </p>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={showEditDialog ? currentCourse?.description : courseForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Enter course description"
                className="h-32"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Provide a brief description of the course content and objectives
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddDialog(false)
                setShowEditDialog(false)
                setCurrentCourse(null)
                setCourseForm(DEFAULT_COURSE_FORM)
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSubmitCourse(showEditDialog)}
              disabled={isAddingCourse || isUpdatingCourse}
            >
              {(isAddingCourse || isUpdatingCourse) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {showEditDialog ? 'Update' : 'Add'} Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
