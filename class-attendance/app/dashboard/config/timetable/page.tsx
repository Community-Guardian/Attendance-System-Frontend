'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Download, Loader2, Plus, RefreshCw, Settings, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

import { useApi } from '@/hooks/useApi'
import ApiService from '@/handler/ApiService'
import type { Timetable, ClassGroup, Course, AcademicYear, Semester } from '@/types'

// Day of week mapping
const dayMapping: Record<number, string> = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday'
}

export default function TimetableGenerationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('')
  const [selectedClassGroup, setSelectedClassGroup] = useState<string | null>("all")
  const [page, setPage] = useState(1)

  // Use the API hooks for fetching data
  const { useFetchData: useFetchTimetables,useAddItem: useAddTimetable,useUpdateItem: useUpdateTimetable,useDeleteItem: useDeleteTimetable } = useApi<Timetable, Timetable>(ApiService.TIMETABLE_URL)
  const { useFetchData: useFetchClassGroups } = useApi<ClassGroup, ClassGroup>(ApiService.CLASS_GROUPS_URL)
  const { useFetchData: useFetchSemesters } = useApi<Semester, Semester>(ApiService.SEMESTER_URL)
  const { useFetchData: useFetchAcademicYears } = useApi<AcademicYear, AcademicYear>(ApiService.ACADEMIC_YEAR_URL)
  const { useAddItem: useGenerateTimetable } = useApi<{},{}>(ApiService.GENERATE_TIMETABLE_URL)

  const { data: timetables, isLoading: isLoadingTimetables, refetch: refetchTimetables } = useFetchTimetables(page, {
    semester: selectedSemester,
    academic_year: selectedAcademicYear
  })
  const { data: classGroups } = useFetchClassGroups(1)
  const { data: semesters } = useFetchSemesters(1)
  const { data: academicYears } = useFetchAcademicYears(1)

  // Mutation hooks for timetable operations
  const addTimetableMutation = useAddTimetable
  const updateTimetableMutation = useUpdateTimetable
  const deleteTimetableMutation = useDeleteTimetable
  const generateTimetableMutation = useGenerateTimetable

  const handleAddTimetable = (timetableData: Partial<Timetable>) => {
    if (addTimetableMutation.status === 'pending') return
    addTimetableMutation.mutate(timetableData, {
      onSuccess: async () => {
        await refetchTimetables()
        toast.success('Timetable entry added successfully')
      },
      onError: (error: any) => {
        toast.error('Failed to add timetable entry')
        console.error('Add timetable error:', error)
      }
    })
  }

  const handleUpdateTimetable = (id: string, timetableData: Partial<Timetable>) => {
    if (updateTimetableMutation.status === 'pending') return
    updateTimetableMutation.mutate({ id, item: timetableData }, {
      onSuccess: async () => {
        await refetchTimetables()
        toast.success('Timetable entry updated successfully')
      },
      onError: (error: any) => {
        toast.error('Failed to update timetable entry')
        console.error('Update timetable error:', error)
      }
    })
  }

  const handleDeleteTimetable = (id: string) => {
    if (deleteTimetableMutation.status === 'pending') return
    if (window.confirm('Are you sure you want to delete this timetable entry?')) {
      deleteTimetableMutation.mutate(id, {
        onSuccess: async () => {
          await refetchTimetables()
          toast.success('Timetable entry deleted successfully')
        },
        onError: (error: any) => {
          toast.error('Failed to delete timetable entry')
          console.error('Delete timetable error:', error)
        }
      })
    }
  }

  const handleGenerateTimetable = async () => {
    if (!selectedSemester || !selectedAcademicYear) {
      toast.error('Please select both semester and academic year')
      return
    }
    
    if (generateTimetableMutation.status === 'pending') return
    
    setIsGenerating(true)
    setGenerationProgress(0)
    
    generateTimetableMutation.mutate({
      academic_year: selectedAcademicYear,
      semester: selectedSemester,
    }, {
      onSuccess: async (data: any) => {
        setGenerationProgress(100)
        await refetchTimetables()
        toast.success('Generation successful',{
          description: data.message ||'Timetable generated successfully'
        })
        setShowGenerateDialog(false)
      },
      onError: (error: any) => {
        toast.error('Failed to generate timetable')
        console.error('Timetable generation error:', error)
      },
      onSettled: () => {
        setIsGenerating(false)
      }
    })
  }

  // Filter timetables based on selections
  const filteredTimetables = timetables?.results || []

  useEffect(() => {
    // Wait for all data to be loaded
    if (!isLoadingTimetables && semesters && academicYears && classGroups) {
      setIsLoading(false)
      
      // Set default selections if available
      if (semesters?.results?.length > 0) {
        const currentSemester = semesters.results.find(s => s.is_current)
        setSelectedSemester(currentSemester?.id || semesters.results[0].id)
      }
      
      if (academicYears?.results?.length > 0) {
        const currentYear = academicYears.results.find(y => y.is_active)
        setSelectedAcademicYear(currentYear?.id || academicYears.results[0].id)
      }
    }
  }, [isLoadingTimetables, semesters, academicYears, classGroups])

  // Format time in 12-hour format with AM/PM
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
  }

  const timeSlots = ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00']
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const [academicYearSemesters, setAcademicYearSemesters] = useState<Semester[]>([])

  useEffect(() => {
    if (selectedAcademicYear) {
      const activeSemesters = academicYears?.results?.find((year: AcademicYear) => year.id === selectedAcademicYear)?.active_semesters || []
      setAcademicYearSemesters(activeSemesters)
    }
  }, [selectedAcademicYear, academicYears])

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable Management</h1>
          <p className="text-muted-foreground">Manage and generate class timetables</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button onClick={() => setShowGenerateDialog(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Timetable
          </Button>
          <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle>Timetable Entries</CardTitle>
                <CardDescription>View and manage class timetables</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears?.results?.map((year: AcademicYear) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.year}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYearSemesters?.map((semester: Semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTimetables.length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center space-y-2 text-center">
                <Calendar className="h-8 w-8 text-muted-foreground" />
                <p className="text-lg font-medium">No timetable entries found</p>
                <p className="text-sm text-muted-foreground">
                  Generate a timetable to get started
                </p>
              </div>
            ) : (
              <div className="max-h-[600px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Lecturer</TableHead>
                      <TableHead>Class Group</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimetables.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.course.name}</div>
                            <div className="text-sm text-muted-foreground">{entry.course.code}</div>
                          </div>
                        </TableCell>
                        <TableCell>{entry.lecturer}</TableCell>
                        <TableCell>{entry.class_group.name}</TableCell>
                        <TableCell>{typeof entry.day_of_week === 'number' ? dayMapping[entry.day_of_week] : entry.day_of_week}</TableCell>
                        <TableCell>
                          {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{entry.location_name}</div>
                            {entry.is_makeup_class && (
                              <Badge variant="outline" className="mt-1">Makeup Class</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleUpdateTimetable(entry.id, {lecturer: 'New Lecturer'})}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTimetable(entry.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))} 
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-muted-foreground">
                Total entries: {filteredTimetables.length}
              </p>
              <Button variant="outline" size="sm" onClick={() => handleAddTimetable({lecturer: 'New Lecturer'})}>
                <Download className="mr-2 h-4 w-4" />
                Export Timetable
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Generate Timetable Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate Timetable</DialogTitle>
            <DialogDescription>
              Automatically generate a timetable based on courses, enrollments and available venues.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="generateYear">Academic Year</Label>
                <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                  <SelectTrigger id="generateYear">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears?.results?.map((year: any) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.year}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="generateSemester">Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger id="generateSemester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters?.results?.map((semester: any) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    )) || []}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="generateClass">Class Group (Optional)</Label>
              <Select value={selectedClassGroup as string} onValueChange={setSelectedClassGroup}>
                <SelectTrigger id="generateClass">
                  <SelectValue placeholder="Select class group (or all)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Class Groups</SelectItem>
                  {classGroups?.results?.map((group: ClassGroup) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  )) || []}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800 text-sm mt-2">
              <p><strong>Note:</strong> Generating a new timetable will replace any existing entries for the selected semester.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateTimetable} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating... {Math.round(generationProgress)}%
                </>
              ) : (
                'Generate Timetable'
              )}
            </Button>
          </DialogFooter>
          {isGenerating && (
            <Progress value={generationProgress} className="mt-2" />
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Timetable Settings</DialogTitle>
            <DialogDescription>Configure timetable generation rules</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Max Class Duration</Label>
              <Input type="number" placeholder="Maximum hours per session" defaultValue={3} />
              <p className="text-sm text-muted-foreground">Maximum duration of a single class in hours</p>
            </div>
            <div className="grid gap-2">
              <Label>Allow Makeup Classes</Label>
              <Select defaultValue="true">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Allow scheduling makeup classes on weekends</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success('Settings saved');
              setShowSettingsDialog(false);
            }}>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
