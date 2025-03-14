'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApi } from '@/hooks/useApi'
import ApiService from '@/handler/ApiService'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Plus, Trash2, ArrowLeft, Edit2 } from 'lucide-react'
import type { Course, Enrollment, ClassGroup, User } from '@/types'
import { Pagination } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

// Form validation schema
const enrollmentFormSchema = z.object({
  class_group_id: z.string().min(1, 'Class group is required'),
  lecturer_id: z.string().min(1, 'Lecturer is required'),
  semester: z.string().min(1, 'Semester is required'),
  is_active: z.boolean().default(true),
})

type EnrollmentFormData = z.infer<typeof enrollmentFormSchema>

export default function CourseEnrollmentPage() {
  const params = useParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null)

  // Add debounce effect for search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1) // Reset to first page when search changes
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const courseId = params.courseId as string
  if (!courseId) {
    router.push('/dashboard/config/courses')
    return null
  }

  // API hooks
  const {
    useFetchData: useFetchEnrollments,
    useAddItem: useAddEnrollment,
    useUpdateItem: useUpdateEnrollment,
    useDeleteItem: useDeleteEnrollment,
  } = useApi<Enrollment, Enrollment>(ApiService.COURSE_ENROLLMENTS)

  const { useFetchById: useFetchCourse } = useApi<Course, Course>(ApiService.COURSE_URL)

  const { useFetchData: useFetchClassGroups } = useApi<ClassGroup, ClassGroup>(
    ApiService.CLASS_GROUPS_URL
  )

  const { useFetchData: useFetchLecturers } = useApi<User, User>(ApiService.USER_URL)

  // Fetch data
  const { data: courseData, isLoading: isLoadingCourse } = useFetchCourse(courseId)
  const { 
    data: enrollmentsData, 
    isLoading: isLoadingEnrollments,
    error: enrollmentsError,
    refetch: refetchEnrollments
  } = useFetchEnrollments(page, {
    course: courseId,
    search: debouncedSearch,
    page_size: pageSize,
  })

  const { data: classGroupsData } = useFetchClassGroups(1)
  const { data: lecturersData } = useFetchLecturers(1,{
    role: 'lecturer',
    all: true,
  })

  // Mutation hooks
  const { mutate: addEnrollment } = useAddEnrollment
  const { mutate: updateEnrollment } = useUpdateEnrollment
  const { mutate: deleteEnrollment } = useDeleteEnrollment

  // Form handling
  const form = useForm<EnrollmentFormData>({
    resolver: zodResolver(enrollmentFormSchema),
    defaultValues: {
      is_active: true,
    },
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!showAddDialog && !editingEnrollment) {
      form.reset()
    }
  }, [showAddDialog, editingEnrollment, form])

  // Set form values when editing
  useEffect(() => {
    if (editingEnrollment) {
      form.reset({
        class_group_id: editingEnrollment.class_group || '',
        lecturer_id: editingEnrollment.lecturer?.id || '',
        semester: editingEnrollment.semester || '',
        is_active: editingEnrollment.is_active,
      })
    }
  }, [editingEnrollment, form])

  const handleSubmit = async (data: EnrollmentFormData) => {
    const enrollmentData = {
      ...data,
      course_id: courseId,
    }

    if (editingEnrollment) {
      updateEnrollment(
        {
          id: editingEnrollment.id,
          item: enrollmentData,
        },
        {
          onSuccess: () => {
            toast.success('Enrollment updated successfully')
            setEditingEnrollment(null)
            refetchEnrollments()
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to update enrollment')
          },
        }
      )
    } else {
      addEnrollment(
        enrollmentData,
        {
          onSuccess: () => {
            toast.success('Enrollment added successfully')
            setShowAddDialog(false)
            refetchEnrollments()
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.detail || 'Failed to add enrollment')
          },
        }
      )
    }
  }

  const handleDeleteEnrollment = async (enrollmentId: string) => {
    if (!confirm('Are you sure you want to remove this enrollment?')) return

    deleteEnrollment(enrollmentId, {
      onSuccess: () => {
        toast.success('Enrollment removed successfully')
        refetchEnrollments()
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || 'Failed to remove enrollment')
      },
    })
  }

  // Loading and error states
  if (isLoadingCourse) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested course could not be found.
            </p>
            <Button onClick={() => router.push('/dashboard/config/courses')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const course = courseData
  const enrollments = enrollmentsData?.results || []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/config/courses')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{course.name}</h1>
            <p className="text-muted-foreground">
              Course Code: {course.code} | Total Enrollments: {course.total_enrollments_count}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Search by course name, code, class group, or lecturer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Enrollment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Enrollment</DialogTitle>
                  <DialogDescription>
                    Add a new enrollment for {course.name}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="class_group_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Group</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a class group" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classGroupsData?.results?.map((group) => (
                                <SelectItem key={group.id} value={group.id}>
                                  {group.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lecturer_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lecturer</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a lecturer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {lecturersData?.results?.map((lecturer) => (
                                <SelectItem key={lecturer.id} value={lecturer.id}>
                                  {lecturer.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="semester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Semester</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">Semester 1</SelectItem>
                              <SelectItem value="2">Semester 2</SelectItem>
                              <SelectItem value="3">Semester 3</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Active</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      {editingEnrollment ? 'Update' : 'Add'} Enrollment
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Group</TableHead>
                  <TableHead>Lecturer</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingEnrollments ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                        <span className="ml-2">Loading enrollments...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : enrollmentsError ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-destructive">
                      Failed to load enrollments. Please try again.
                    </TableCell>
                  </TableRow>
                ) : enrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p>No enrollments found</p>
                        {debouncedSearch && (
                          <p className="text-sm">
                            Try adjusting your search query
                          </p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        {enrollment.class_group || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {enrollment.lecturer?.email || 'N/A'}
                      </TableCell>
                      <TableCell>
                        Semester {enrollment.semester}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            enrollment.is_active
                              ? 'bg-green-50 text-green-700'
                              : 'bg-red-50 text-red-700'
                          )}
                        >
                          {enrollment.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingEnrollment(enrollment)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteEnrollment(enrollment.id)}
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

          {(course?.total_enrollments_count ?? 0) > pageSize && (
            <div className="mt-4 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={Math.ceil((enrollmentsData?.count ?? 0) / pageSize)}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}