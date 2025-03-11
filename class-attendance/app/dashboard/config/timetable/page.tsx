'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Download, FileUp, Loader2, Plus, RefreshCw, Save, Search, Settings, Trash2, Upload, X } from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

// Define types for timetable data
interface TimetableEntry {
  id: string
  courseCode: string
  courseName: string
  lecturer: string
  day: string
  startTime: string
  endTime: string
  venue: string
  department: string
  programme: string
  year: string
  color?: string
}

interface Venue {
  id: string
  name: string
  capacity: number
  type: string
  building: string
  floor: string
}

interface Constraint {
  id: string
  type: 'lecturer' | 'venue' | 'course' | 'programme'
  entityId: string
  entityName: string
  constraint: 'unavailable_time' | 'preferred_time' | 'max_hours_per_day' | 'specific_venue'
  value: string
  priority: 'low' | 'medium' | 'high'
}

export default function TimetableGenerationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [showConstraintDialog, setShowConstraintDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState('1')
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2023-2024')
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([])
  const [draggedEntry, setDraggedEntry] = useState<TimetableEntry | null>(null)
  const [constraints, setConstraints] = useState<Constraint[]>([])
  const [newConstraint, setNewConstraint] = useState<Partial<Constraint>>({
    type: 'lecturer',
    constraint: 'unavailable_time',
    priority: 'medium',
  })
  const [generationSettings, setGenerationSettings] = useState({
    maxIterations: 1000,
    populationSize: 50,
    mutationRate: 0.1,
    crossoverRate: 0.8,
    elitismCount: 5,
    timeSlotPreference: 'morning', // 'morning', 'afternoon', 'evening', 'distributed'
    avoidBackToBack: true,
    minimizeRoomChanges: true,
    respectConstraints: true,
    optimizeForStudents: true,
    optimizeForLecturers: true,
  })
  const [generationQuality, setGenerationQuality] = useState<'draft' | 'standard' | 'optimal'>('standard')
  const { toast } = useToast()
  const router = useRouter()

  // Mock data
  const departments = [
    { id: 'cs', name: 'Computer Science' },
    { id: 'it', name: 'Information Technology' },
    { id: 'ee', name: 'Electrical Engineering' },
    { id: 'me', name: 'Mechanical Engineering' },
  ]

  const programmes = [
    { id: 'bsc-cs', name: 'BSc Computer Science', departmentId: 'cs' },
    { id: 'bsc-it', name: 'BSc Information Technology', departmentId: 'it' },
    { id: 'bsc-ee', name: 'BSc Electrical Engineering', departmentId: 'ee' },
    { id: 'bsc-me', name: 'BSc Mechanical Engineering', departmentId: 'me' },
  ]

  const years = [
    { id: '1', name: 'Year 1' },
    { id: '2', name: 'Year 2' },
    { id: '3', name: 'Year 3' },
    { id: '4', name: 'Year 4' },
  ]

  const semesters = [
    { id: '1', name: 'Semester 1' },
    { id: '2', name: 'Semester 2' },
    { id: '3', name: 'Semester 3' },
  ]

  const academicYears = [
    { id: '2023-2024', name: '2023-2024' },
    { id: '2022-2023', name: '2022-2023' },
    { id: '2021-2022', name: '2021-2022' },
  ]

  const venues: Venue[] = [
    { id: 'v1', name: 'CS Lab 1', capacity: 40, type: 'Lab', building: 'CS Building', floor: '1' },
    { id: 'v2', name: 'CS Lab 2', capacity: 40, type: 'Lab', building: 'CS Building', floor: '1' },
    { id: 'v3', name: 'IT Lab 1', capacity: 35, type: 'Lab', building: 'IT Building', floor: '2' },
    { id: 'v4', name: 'IT Lab 2', capacity: 35, type: 'Lab', building: 'IT Building', floor: '2' },
    { id: 'v5', name: 'EE Lab 1', capacity: 30, type: 'Lab', building: 'Engineering Block', floor: '1' },
    { id: 'v6', name: 'Lecture Hall A', capacity: 100, type: 'Lecture', building: 'Main Building', floor: 'G' },
    { id: 'v7', name: 'Lecture Hall B', capacity: 80, type: 'Lecture', building: 'Main Building', floor: 'G' },
    { id: 'v8', name: 'Seminar Room 1', capacity: 25, type: 'Seminar', building: 'Main Building', floor: '1' },
    { id: 'v9', name: 'Seminar Room 2', capacity: 25, type: 'Seminar', building: 'Main Building', floor: '1' },
  ]

  const lecturers = [
    { id: 'lec1', name: 'Dr. John Smith', departmentId: 'cs' },
    { id: 'lec2', name: 'Prof. Jane Wilson', departmentId: 'cs' },
    { id: 'lec3', name: 'Dr. Sarah Davis', departmentId: 'it' },
    { id: 'lec4', name: 'Prof. Michael Wilson', departmentId: 'it' },
    { id: 'lec5', name: 'Dr. Lisa Johnson', departmentId: 'ee' },
    { id: 'lec6', name: 'Prof. Thomas White', departmentId: 'me' },
  ]

  const courses = [
    { id: 'c1', code: 'CS301', name: 'Database Systems', departmentId: 'cs' },
    { id: 'c2', code: 'CS302', name: 'Software Engineering', departmentId: 'cs' },
    { id: 'c3', code: 'IT301', name: 'Web Development', departmentId: 'it' },
    { id: 'c4', code: 'IT302', name: 'Mobile App Development', departmentId: 'it' },
    { id: 'c5', code: 'EE301', name: 'Circuit Analysis', departmentId: 'ee' },
    { id: 'c6', code: 'ME301', name: 'Thermodynamics', departmentId: 'me' },
  ]

  const mockTimetableEntries: TimetableEntry[] = [
    {
      id: '1',
      courseCode: 'CS301',
      courseName: 'Database Systems',
      lecturer: 'Dr. John Smith',
      day: 'Monday',
      startTime: '09:00',
      endTime: '11:00',
      venue: 'CS Lab 1',
      department: 'Computer Science',
      programme: 'BSc Computer Science',
      year: 'Year 3',
      color: '#3b82f6',
    },
    {
      id: '2',
      courseCode: 'CS302',
      courseName: 'Software Engineering',
      lecturer: 'Prof. Jane Wilson',
      day: 'Monday',
      startTime: '14:00',
      endTime: '16:00',
      venue: 'CS Lab 2',
      department: 'Computer Science',
      programme: 'BSc Computer Science',
      year: 'Year 3',
      color: '#10b981',
    },
    {
      id: '3',
      courseCode: 'IT301',
      courseName: 'Web Development',
      lecturer: 'Dr. Sarah Davis',
      day: 'Tuesday',
      startTime: '09:00',
      endTime: '11:00',
      venue: 'IT Lab 1',
      department: 'Information Technology',
      programme: 'BSc Information Technology',
      year: 'Year 3',
      color: '#f59e0b',
    },
    {
      id: '4',
      courseCode: 'IT302',
      courseName: 'Mobile App Development',
      lecturer: 'Prof. Michael Wilson',
      day: 'Wednesday',
      startTime: '14:00',
      endTime: '16:00',
      venue: 'IT Lab 2',
      department: 'Information Technology',
      programme: 'BSc Information Technology',
      year: 'Year 3',
      color: '#ec4899',
    },
    {
      id: '5',
      courseCode: 'EE301',
      courseName: 'Circuit Analysis',
      lecturer: 'Dr. Lisa Johnson',
      day: 'Thursday',
      startTime: '09:00',
      endTime: '11:00',
      venue: 'EE Lab 1',
      department: 'Electrical Engineering',
      programme: 'BSc Electrical Engineering',
      year: 'Year 3',
      color: '#8b5cf6',
    },
  ]

  const mockConstraints: Constraint[] = [
    {
      id: '1',
      type: 'lecturer',
      entityId: 'lec1',
      entityName: 'Dr. John Smith',
      constraint: 'unavailable_time',
      value: 'Monday, 14:00-16:00',
      priority: 'high',
    },
    {
      id: '2',
      type: 'venue',
      entityId: 'v1',
      entityName: 'CS Lab 1',
      constraint: 'unavailable_time',
      value: 'Friday, 16:00-18:00',
      priority: 'medium',
    },
    {
      id: '3',
      type: 'course',
      entityId: 'c1',
      entityName: 'CS301 - Database Systems',
      constraint: 'specific_venue',
      value: 'CS Lab 1',
      priority: 'medium',
    },
    {
      id: '4',
      type: 'programme',
      entityId: 'bsc-cs',
      entityName: 'BSc Computer Science',
      constraint: 'max_hours_per_day',
      value: '6',
      priority: 'high',
    },
  ]

  useEffect(() => {
    // Simulate API call to fetch timetable entries and constraints
    setTimeout(() => {
      setTimetableEntries(mockTimetableEntries)
      setConstraints(mockConstraints)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleDragStart = (entry: TimetableEntry) => {
    setDraggedEntry(entry)
  }

  const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-primary/10')
  }

  const handleDragLeave = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.classList.remove('bg-primary/10')
  }

  const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, day: string, timeSlot: string) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-primary/10')
    
    if (draggedEntry) {
      // Extract start time from the time slot
      const startTime = timeSlot.split(' - ')[0]
      
      // Calculate end time (assuming 2-hour slots)
      const [hours, minutes] = startTime.split(':').map(Number)
      const endHours = hours + 2
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      
      // Create updated entry
      const updatedEntry = {
        ...draggedEntry,
        day,
        startTime,
        endTime,
      }
      
      // Update the timetable entries
      setTimetableEntries(prev => 
        prev.map(entry => entry.id === draggedEntry.id ? updatedEntry : entry)
      )
      
      toast({
        title: 'Timetable Updated',
        description: `${draggedEntry.courseName} moved to ${day} at ${startTime}`,
      })
    }
    
    setDraggedEntry(null)
  }

  const handleGenerateTimetable = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    // Simulate timetable generation with progress updates
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 10
        if (newProgress >= 100) {
          clearInterval(interval)
          
          // Simulate API call to generate timetable
          setTimeout(() => {
            setIsGenerating(false)
            setShowGenerateDialog(false)
            setGenerationProgress(0)
            
            // Generate random timetable entries
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
            const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00']
            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#f43f5e']
            
            const newEntries: TimetableEntry[] = []
            
            courses.forEach((course, index) => {
              const dept = departments.find(d => d.id === course.departmentId)
              const prog = programmes.find(p => p.departmentId === course.departmentId)
              const lec = lecturers.find(l => l.departmentId === course.departmentId)
              const venue = venues.find(v => v.type === (course.departmentId === 'cs' || course.departmentId === 'it' ? 'Lab' : 'Lecture'))
              
              // Randomly select day and time
              const day = days[Math.floor(Math.random() * days.length)]
              const startTimeIndex = Math.floor(Math.random() * timeSlots.length)
              const startTime = timeSlots[startTimeIndex]
              
              // Calculate end time (2 hours later)
              const [hours, minutes] = startTime.split(':').map(Number)
              const endHours = hours + 2
              const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
              
              newEntries.push({
                id: (index + 1).toString(),
                courseCode: course.code,
                courseName: course.name,
                lecturer: lec?.name || 'TBA',
                day,
                startTime,
                endTime,
                venue: venue?.name || 'TBA',
                department: dept?.name || 'Unknown',
                programme: prog?.name || 'Unknown',
                year: 'Year 3',
                color: colors[index % colors.length],
              })
            })
            
            setTimetableEntries(newEntries)
            
            toast({
              title: 'Timetable Generated',
              description: 'The timetable has been generated successfully.',
            })
          }, 1000)
          
          return 100
        }
        return newProgress
      })
    }, 200)
  }

  const handleAddConstraint = () => {
    if (!newConstraint.entityId || !newConstraint.value) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }
    
    // Create new constraint
    const constraint: Constraint = {
      id: (constraints.length + 1).toString(),
      type: newConstraint.type as 'lecturer' | 'venue' | 'course' | 'programme',
      entityId: newConstraint.entityId,
      entityName: newConstraint.entityName || '',
      constraint: newConstraint.constraint as 'unavailable_time' | 'preferred_time' | 'max_hours_per_day' | 'specific_venue',
      value: newConstraint.value,
      priority: newConstraint.priority as 'low' | 'medium' | 'high',
    }
    
    // Add to constraints list
    setConstraints([...constraints, constraint])
    
    // Reset form
    setNewConstraint({
      type: 'lecturer',
      constraint: 'unavailable_time',
      priority: 'medium',
    })
    
    // Close dialog
    setShowConstraintDialog(false)
    
    toast({
      title: 'Constraint Added',
      description: 'The constraint has been added successfully.',
    })
  }

  const handleDeleteConstraint = (id: string) => {
    setConstraints(constraints.filter(c => c.id !== id))
    
    toast({
      title: 'Constraint Deleted',
      description: 'The constraint has been deleted successfully.',
    })
  }

  const handleSaveSettings = () => {
    setShowSettingsDialog(false)
    
    toast({
      title: 'Settings Saved',
      description: 'Timetable generation settings have been saved successfully.',
    })
  }

  const getQualityDescription = () => {
    switch (generationQuality) {
      case 'draft':
        return 'Quick generation with basic constraint satisfaction. May require manual adjustments.'
      case 'standard':
        return 'Balanced approach with good constraint satisfaction and optimization.'
      case 'optimal':
        return 'Thorough optimization with maximum constraint satisfaction. Takes longer to generate.'
    }
  }

  const getQualitySettings = () => {
    switch (generationQuality) {
      case 'draft':
        return {
          maxIterations: 500,
          populationSize: 30,
          mutationRate: 0.2,
          crossoverRate: 0.7,
          elitismCount: 3,
        }
      case 'standard':
        return {
          maxIterations: 1000,
          populationSize: 50,
          mutationRate: 0.1,
          crossoverRate: 0.8,
          elitismCount: 5,
        }
      case 'optimal':
        return {
          maxIterations: 2000,
          populationSize: 100,
          mutationRate: 0.05,
          crossoverRate: 0.9,
          elitismCount: 10,
        }
    }
  }

  const timeSlots = ['08:00 - 10:00', '10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00', '16:00 - 18:00']
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable Generation</h1>
          <p className="text-muted-foreground">Automatically generate and customize class timetables</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button onClick={() => setShowGenerateDialog(true)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate Timetable
          </Button>
          <Button variant="outline" onClick={() => setShowConstraintDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Constraint
          </Button>
          <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Timetable Preview</CardTitle>
            <CardDescription>Drag and drop to adjust the generated timetable</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <div className="min-w-[800px]">
                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Time</TableHead>
                      {days.map((day) => (
                        <TableHead key={day}>{day}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeSlots.map((timeSlot) => (
                      <TableRow key={timeSlot}>
                        <TableCell className="font-medium">{timeSlot}</TableCell>
                        {days.map((day) => {
                          const entry = timetableEntries.find(
                            (e) => 
                              e.day === day && 
                              e.startTime === timeSlot.split(' - ')[0]
                          )
                          
                          return (
                            <TableCell 
                              key={`${day}-${timeSlot}`}
                              className="h-24 border"
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, day, timeSlot)}
                            >
                              {entry && (
                                <div 
                                  className="rounded-md p-2 text-xs"
                                  style={{ backgroundColor: `${entry.color}20`, borderLeft: `3px solid ${entry.color}` }}
                                  draggable
                                  onDragStart={() => handleDragStart(entry)}
                                >
                                  <div className="font-medium">{entry.courseName}</div>
                                  <div>{entry.courseCode}</div>
                                  <div className="mt-1 text-muted-foreground">{entry.lecturer}</div>
                                  <div className="text-muted-foreground">{entry.venue}</div>
                                </div>
                              )}
                            </TableCell>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-2">
                <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Academic Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Constraints</CardTitle>
            <CardDescription>Rules and preferences for timetable generation</CardDescription>
          </CardHeader>
          <CardContent>
            {constraints.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center space-y-2 text-center">
                <Settings className="h-8 w-8 text-muted-foreground" />
                <p className="text-lg font-medium">No constraints defined</p>
                <p className="text-sm text-muted-foreground">
                  Add constraints to improve timetable generation
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowConstraintDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Constraint
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {constraints.map((constraint) => (
                  <div 
                    key={constraint.id} 
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            constraint.priority === 'high' 
                              ? 'destructive' 
                              : constraint.priority === 'medium' 
                                ? 'default' 
                                : 'outline'
                          }
                        >
                          {constraint.priority}
                        </Badge>
                        <span className="font-medium">{constraint.entityName}</span>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {constraint.constraint === 'unavailable_time' && 'Unavailable at'}
                        {constraint.constraint === 'preferred_time' && 'Prefers'}
                        {constraint.constraint === 'max_hours_per_day' && 'Max hours per day:'}
                        {constraint.constraint === 'specific_venue' && 'Requires venue:'}
                        {' '}
                        {constraint.value}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteConstraint(constraint.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Generate Timetable Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Generate Timetable</DialogTitle>
            <DialogDescription>
              Automatically generate a timetable based on courses, constraints, and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                  <SelectTrigger id="academicYear">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment || 'all'} onValueChange={setSelectedDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="programme">Programme</Label>
              <Select value={selectedProgramme || 'all'} onValueChange={setSelectedProgramme}>
                <SelectTrigger id="programme">
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Programmes</SelectItem>
                  {programmes
                    .filter(
                      (prog) =>
                        !selectedDepartment || prog.departmentId === selectedDepartment
                    )
                    .map((prog) => (
                      <SelectItem key={prog.id} value={prog.id}>
                        {prog.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="year">Year of Study</Label>
              <Select value={selectedYear || 'all'} onValueChange={setSelectedYear}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Generation Quality</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={generationQuality === 'draft' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setGenerationQuality('draft')}
                >
                  Draft
                </Button>
                <Button
                  type="button"
                  variant={generationQuality === 'standard' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setGenerationQuality('standard')}
                >
                  Standard
                </Button>
                <Button
                  type="button"
                  variant={generationQuality === 'optimal' ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => setGenerationQuality('optimal')}
                >
                  Optimal
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{getQualityDescription()}</p>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="respectConstraints">Respect All Constraints</Label>
                <Switch
                  id="respectConstraints"
                  checked={generationSettings.respectConstraints}
                  onCheckedChange={(checked) => 
                    setGenerationSettings({ ...generationSettings, respectConstraints: checked })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="avoidBackToBack">Avoid Back-to-Back Classes</Label>
                <Switch
                  id="avoidBackToBack"
                  checked={generationSettings.avoidBackToBack}
                  onCheckedChange={(checked) => 
                    setGenerationSettings({ ...generationSettings, avoidBackToBack: checked })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="minimizeRoomChanges">Minimize Room Changes</Label>
                <Switch
                  id="minimizeRoomChanges"
                  checked={generationSettings.minimizeRoomChanges}
                  onCheckedChange={(checked) => 
                    setGenerationSettings({ ...generationSettings, minimizeRoomChanges: checked })
                  }
                />
              </div>
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

      {/* Add Constraint Dialog */}
      <Dialog open={showConstraintDialog} onOpenChange={setShowConstraintDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Constraint</DialogTitle>
            <DialogDescription>
              Define constraints and preferences for timetable generation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="constraintType">Constraint Type</Label>
              <Select
                value={newConstraint.type}
                onValueChange={(value: 'lecturer' | 'venue' | 'course' | 'programme') => 
                  setNewConstraint({ ...newConstraint, type: value })
                }
              >
                <SelectTrigger id="constraintType">
                  <SelectValue placeholder="Select constraint type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecturer">Lecturer</SelectItem>
                  <SelectItem value="venue">Venue</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="programme">Programme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="entity">
                {newConstraint.type === 'lecturer' && 'Lecturer'}
                {newConstraint.type === 'venue' && 'Venue'}
                {newConstraint.type === 'course' && 'Course'}
                {newConstraint.type === 'programme' && 'Programme'}
              </Label>
              <Select
                value={newConstraint.entityId}
                onValueChange={(value) => {
                  let entityName = ''
                  
                  if (newConstraint.type === 'lecturer') {
                    entityName = lecturers.find(l => l.id === value)?.name || ''
                  } else if (newConstraint.type === 'venue') {
                    entityName = venues.find(v => v.id === value)?.name || ''
                  } else if (newConstraint.type === 'course') {
                    const course = courses.find(c => c.id === value)
                    entityName = course ? `${course.code} - ${course.name}` : ''
                  } else if (newConstraint.type === 'programme') {
                    entityName = programmes.find(p => p.id === value)?.name || ''
                  }
                  
                  setNewConstraint({ 
                    ...newConstraint, 
                    entityId: value,
                    entityName,
                  })
                }}
              >
                <SelectTrigger id="entity">
                  <SelectValue placeholder={`Select ${newConstraint.type}`} />
                </SelectTrigger>
                <SelectContent>
                  {newConstraint.type === 'lecturer' && lecturers.map((lecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </SelectItem>
                  ))}
                  {newConstraint.type === 'venue' && venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </SelectItem>
                  ))}
                  {newConstraint.type === 'course' && courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                  {newConstraint.type === 'programme' && programmes.map((programme) => (
                    <SelectItem key={programme.id} value={programme.id}>
                      {programme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="constraintRule">Constraint Rule</Label>
              <Select
                value={newConstraint.constraint}
                onValueChange={(value: 'unavailable_time' | 'preferred_time' | 'max_hours_per_day' | 'specific_venue') => 
                  setNewConstraint({ ...newConstraint, constraint: value })
                }
              >
                <SelectTrigger id="constraintRule">
                  <SelectValue placeholder="Select constraint rule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unavailable_time">Unavailable Time</SelectItem>
                  <SelectItem value="preferred_time">Preferred Time</SelectItem>
                  {(newConstraint.type === 'lecturer' || newConstraint.type === 'programme') && (
                    <SelectItem value="max_hours_per_day">Maximum Hours Per Day</SelectItem>
                  )}
                  {newConstraint.type === 'course' && (
                    <SelectItem value="specific_venue">Specific Venue Required</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="constraintValue">
                {newConstraint.constraint === 'unavailable_time' && 'Unavailable Time'}
                {newConstraint.constraint === 'preferred_time' && 'Preferred Time'}
                {newConstraint.constraint === 'max_hours_per_day' && 'Maximum Hours'}
                {newConstraint.constraint === 'specific_venue' && 'Required Venue'}
              </Label>
              
              {(newConstraint.constraint === 'unavailable_time' || newConstraint.constraint === 'preferred_time') && (
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={newConstraint.day || ''}
                    onValueChange={(value) => {
                      const currentTime = newConstraint.time || ''
                      setNewConstraint({ 
                        ...newConstraint, 
                        day: value,
                        value: `${value}, ${currentTime}`,
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newConstraint.time || ''}
                    onValueChange={(value) => {
                      const currentDay = newConstraint.day || ''
                      setNewConstraint({ 
                        ...newConstraint, 
                        time: value,
                        value: `${currentDay}, ${value}`,
                      })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {newConstraint.constraint === 'max_hours_per_day' && (
                <Input
                  id="constraintValue"
                  type="number"
                  min="1"
                  max="10"
                  value={newConstraint.value || ''}
                  onChange={(e) => setNewConstraint({ ...newConstraint, value: e.target.value })}
                />
              )}
              
              {newConstraint.constraint === 'specific_venue' && (
                <Select
                  value={newConstraint.value || ''}
                  onValueChange={(value) => setNewConstraint({ ...newConstraint, value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue" />
                  </SelectTrigger>
                  <SelectContent>
                    {venues.map((venue) => (
                      <SelectItem key={venue.id} value={venue.name}>
                        {venue.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newConstraint.priority}
                onValueChange={(value: 'low' | 'medium' | 'high') => 
                  setNewConstraint({ ...newConstraint, priority: value })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConstraintDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddConstraint}>
              Add Constraint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
