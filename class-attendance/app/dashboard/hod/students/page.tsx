"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Download, FileUp, Loader2, RefreshCw, Search, UploadCloud, UserPlus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Student registration form schema
const studentFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  studentId: z.string().min(6, {
    message: "Student ID must be at least 6 characters.",
  }),
  programme: z.string({
    required_error: "Please select a programme.",
  }),
  year: z.string({
    required_error: "Please select a year of study.",
  }),
})

export default function StudentManagementPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)

  // Dummy data
  const students = [
    {
      id: "1",
      studentId: "CS/001/20",
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice.j@example.com",
      programme: "BSc Computer Science",
      year: "3",
      hasFacial: true,
      isVerified: true,
    },
    {
      id: "2",
      studentId: "CS/002/20",
      firstName: "Bob",
      lastName: "Smith",
      email: "bob.s@example.com",
      programme: "BSc Computer Science",
      year: "3",
      hasFacial: true,
      isVerified: true,
    },
    {
      id: "3",
      studentId: "CS/003/20",
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie.b@example.com",
      programme: "BSc Computer Science",
      year: "3",
      hasFacial: false,
      isVerified: true,
    },
    {
      id: "4",
      studentId: "IT/001/20",
      firstName: "Diana",
      lastName: "Prince",
      email: "diana.p@example.com",
      programme: "BSc Information Technology",
      year: "3",
      hasFacial: true,
      isVerified: true,
    },
    {
      id: "5",
      studentId: "IT/002/20",
      firstName: "Edward",
      lastName: "Stark",
      email: "edward.s@example.com",
      programme: "BSc Information Technology",
      year: "3",
      hasFacial: false,
      isVerified: false,
    },
    {
      id: "6",
      studentId: "CS/004/21",
      firstName: "Fiona",
      lastName: "Gallagher",
      email: "fiona.g@example.com",
      programme: "BSc Computer Science",
      year: "2",
      hasFacial: true,
      isVerified: true,
    },
    {
      id: "7",
      studentId: "CS/005/21",
      firstName: "George",
      lastName: "Wilson",
      email: "george.w@example.com",
      programme: "BSc Computer Science",
      year: "2",
      hasFacial: true,
      isVerified: true,
    },
    {
      id: "8",
      studentId: "IT/003/21",
      firstName: "Hannah",
      lastName: "Baker",
      email: "hannah.b@example.com",
      programme: "BSc Information Technology",
      year: "2",
      hasFacial: false,
      isVerified: true,
    },
    {
      id: "9",
      studentId: "CS/006/22",
      firstName: "Ian",
      lastName: "Malcolm",
      email: "ian.m@example.com",
      programme: "BSc Computer Science",
      year: "1",
      hasFacial: true,
      isVerified: true,
    },
    {
      id: "10",
      studentId: "IT/004/22",
      firstName: "Jane",
      lastName: "Foster",
      email: "jane.f@example.com",
      programme: "BSc Information Technology",
      year: "1",
      hasFacial: true,
      isVerified: false,
    },
  ]

  const programmes = [
    { value: "bsc-cs", label: "BSc Computer Science" },
    { value: "bsc-it", label: "BSc Information Technology" },
    { value: "bsc-ict", label: "BSc ICT" },
  ]

  const years = [
    { value: "1", label: "Year 1" },
    { value: "2", label: "Year 2" },
    { value: "3", label: "Year 3" },
    { value: "4", label: "Year 4" },
  ]

  // Filter students based on search query and filters
  const filteredStudents = students.filter((student) => {
    let matchesQuery = true
    let matchesProgramme = true
    let matchesYear = true

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      matchesQuery =
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    }

    if (selectedProgramme) {
      matchesProgramme = student.programme.includes(
        selectedProgramme === "bsc-cs"
          ? "Computer Science"
          : selectedProgramme === "bsc-it"
            ? "Information Technology"
            : "ICT",
      )
    }

    if (selectedYear) {
      matchesYear = student.year === selectedYear
    }

    return matchesQuery && matchesProgramme && matchesYear
  })

  // Register student form
  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      studentId: "",
      programme: "",
      year: "",
    },
  })

  function onSubmit(values: z.infer<typeof studentFormSchema>) {
    setIsRegistering(true)

    // Simulate API call
    setTimeout(() => {
      setIsRegistering(false)
      setShowRegisterDialog(false)
      toast({
        title: "Student Registered",
        description: `${values.firstName} ${values.lastName} has been registered successfully.`,
      })
      form.reset()
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0])
    }
  }

  const handleUploadCSV = () => {
    if (!uploadFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Simulate API call
    setTimeout(() => {
      setIsUploading(false)
      setShowUploadDialog(false)
      setUploadFile(null)
      toast({
        title: "Students Imported",
        description: "Students have been imported successfully from the CSV file.",
      })
    }, 2000)
  }

  const handleExportCSV = () => {
    toast({
      title: "Exporting CSV",
      description: "Student data is being exported to CSV.",
    })
  }

  const handleResetFacial = (studentId: string) => {
    toast({
      title: "Facial Data Reset",
      description: `Facial recognition data has been reset for Student ID: ${studentId}`,
    })
  }

  const handleViewStudent = (studentId: string) => {
    router.push(`/dashboard/hod/students/${studentId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">Register, manage and monitor student accounts</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
          <Button onClick={() => setShowRegisterDialog(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Register Student
          </Button>
          <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Bulk Import
          </Button>
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedProgramme || ""} onValueChange={setSelectedProgramme}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All programmes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">All programmes</SelectItem>
              {programmes.map((prog) => (
                <SelectItem key={prog.value} value={prog.value}>
                  {prog.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear || ""} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">All years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Programme</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Facial Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.programme}</TableCell>
                  <TableCell>Year {student.year}</TableCell>
                  <TableCell>
                    {student.hasFacial ? (
                      <span className="flex items-center text-green-500">
                        <Check className="mr-1 h-4 w-4" /> Registered
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        <X className="mr-1 h-4 w-4" /> Not Registered
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.isVerified ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewStudent(student.id)}>
                        View
                      </Button>
                      {student.hasFacial && (
                        <Button variant="outline" size="sm" onClick={() => handleResetFacial(student.studentId)}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset Facial
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Register Student Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Register New Student</DialogTitle>
            <DialogDescription>Enter student details to create a new account.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="CS/001/23" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="programme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Programme</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a programme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {programmes.map((prog) => (
                            <SelectItem key={prog.value} value={prog.value}>
                              {prog.label}
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
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Study</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isRegistering}>
                  {isRegistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>Register Student</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Bulk Import Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Bulk Import Students</DialogTitle>
            <DialogDescription>Upload a CSV file with student data for bulk registration.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md border border-dashed p-10">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Drag & drop your CSV file here</p>
                  <p className="text-xs text-muted-foreground">or click to browse files (max 10MB)</p>
                </div>
                <Input type="file" accept=".csv" className="max-w-xs" onChange={handleFileChange} />
              </div>
            </div>
            {uploadFile && (
              <div className="flex items-center justify-between rounded-md border p-3">
                <div className="flex items-center space-x-2">
                  <FileUp className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{uploadFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setUploadFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div>
              <h4 className="mb-2 text-sm font-medium">CSV Format Requirements:</h4>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                <li>Include headers: firstName, lastName, email, studentId, programme, year</li>
                <li>Email addresses must be unique</li>
                <li>Student IDs must be unique</li>
                <li>All fields are required</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadCSV} disabled={!uploadFile || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>Upload and Import</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

