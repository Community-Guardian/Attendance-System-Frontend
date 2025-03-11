'use client'

import { useState, useRef } from 'react'
import { AlertCircle, CheckCircle2, Download, FileUp, Loader2, UploadCloud, Users, X, BookOpen, Building, Calendar, FileSpreadsheet } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export default function BatchOperationsPage() {
  const [activeTab, setActiveTab] = useState('import')
  const [selectedOperation, setSelectedOperation] = useState('students')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingResults, setProcessingResults] = useState<{
    status: 'success' | 'error' | null;
    message: string;
    details: {
      total: number;
      processed: number;
      successful: number;
      failed: number;
      errors: Array<{ row: number; message: string }>;
    } | null;
  }>({
    status: null,
    message: '',
    details: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Template download links
  const templateLinks = {
    students: '/templates/student_import_template.xlsx',
    lecturers: '/templates/lecturer_import_template.xlsx',
    courses: '/templates/course_import_template.xlsx',
    departments: '/templates/department_import_template.xlsx',
    timetable: '/templates/timetable_import_template.xlsx',
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFile(e.target.files[0])
      setProcessingResults({
        status: null,
        message: '',
        details: null,
      })
    }
  }

  const handleProcessFile = () => {
    if (!uploadFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      })
      return
    }

    setIsProcessing(true)
    setProgress(0)
    
    // Simulate file processing with progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          
          // Simulate different outcomes based on the operation
          setTimeout(() => {
            if (selectedOperation === 'students') {
              setProcessingResults({
                status: 'success',
                message: 'Student data imported successfully',
                details: {
                  total: 150,
                  processed: 150,
                  successful: 145,
                  failed: 5,
                  errors: [
                    { row: 23, message: 'Invalid email format' },
                    { row: 45, message: 'Missing student ID' },
                    { row: 67, message: 'Duplicate student ID' },
                    { row: 89, message: 'Invalid programme' },
                    { row: 120, message: 'Missing required field' },
                  ],
                },
              })
            } else if (selectedOperation === 'timetable') {
              setProcessingResults({
                status: 'error',
                message: 'Timetable import failed due to validation errors',
                details: {
                  total: 75,
                  processed: 30,
                  successful: 25,
                  failed: 5,
                  errors: [
                    { row: 12, message: 'Course not found' },
                    { row: 15, message: 'Invalid time format' },
                    { row: 18, message: 'Lecturer not found' },
                    { row: 22, message: 'Time slot conflict' },
                    { row: 28, message: 'Invalid venue' },
                  ],
                },
              })
            } else {
              setProcessingResults({
                status: 'success',
                message: `${selectedOperation.charAt(0).toUpperCase() + selectedOperation.slice(1)} data imported successfully`,
                details: {
                  total: 50,
                  processed: 50,
                  successful: 48,
                  failed: 2,
                  errors: [
                    { row: 15, message: 'Missing required field' },
                    { row: 32, message: 'Duplicate entry' },
                  ],
                },
              })
            }
            
            setIsProcessing(false)
          }, 500)
        }
        return newProgress
      })
    }, 300)
  }

  const handleDownloadTemplate = () => {
    toast({
      title: 'Template Downloaded',
      description: `The ${selectedOperation} import template has been downloaded.`,
    })
  }

  const handleDownloadErrorReport = () => {
    if (processingResults.status === 'error' || (processingResults.details && processingResults.details.failed > 0)) {
      toast({
        title: 'Error Report Downloaded',
        description: 'The error report has been downloaded.',
      })
    }
  }

  const getOperationIcon = (operation: string) => {
    switch (operation) {
      case 'students':
        return <Users className="h-5 w-5" />
      case 'lecturers':
        return <Users className="h-5 w-5" />
      case 'courses':
        return <BookOpen className="h-5 w-5" />
      case 'departments':
        return <Building className="h-5 w-5" />
      case 'timetable':
        return <Calendar className="h-5 w-5" />
      default:
        return <FileSpreadsheet className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Batch Operations</h1>
        <p className="text-muted-foreground">
          Import and export data in bulk
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Upload spreadsheets to import data in bulk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Select Operation</Label>
                <RadioGroup
                  value={selectedOperation}
                  onValueChange={setSelectedOperation}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                >
                  {[
                    { value: 'students', label: 'Import Students' },
                    { value: 'lecturers', label: 'Import Lecturers' },
                    { value: 'courses', label: 'Import Courses' },
                    { value: 'departments', label: 'Import Departments' },
                    { value: 'timetable', label: 'Import Timetable' },
                  ].map((operation) => (
                    <div key={operation.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={operation.value} id={operation.value} />
                      <Label htmlFor={operation.value} className="flex items-center space-x-2 cursor-pointer">
                        {getOperationIcon(operation.value)}
                        <span>{operation.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Upload File</Label>
                  <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Template
                  </Button>
                </div>
                <div className="rounded-md border border-dashed p-8">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <UploadCloud className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Drag & drop your Excel or CSV file here
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: .xlsx, .xls, .csv
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Select File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>

              {uploadFile && (
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{uploadFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Processing File</Label>
                    <span className="text-sm">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {processingResults.status && (
                <div className={`rounded-md border p-4 ${
                  processingResults.status === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start">
                    <div className={`mr-3 flex-shrink-0 ${
                      processingResults.status === 'success' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {processingResults.status === 'success' ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <h3 className={`text-sm font-medium ${
                        processingResults.status === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {processingResults.message}
                      </h3>
                      
                      {processingResults.details && (
                        <div className="mt-2 text-sm">
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <div>
                              <p className="font-medium">Total</p>
                              <p>{processingResults.details.total}</p>
                            </div>
                            <div>
                              <p className="font-medium">Processed</p>
                              <p>{processingResults.details.processed}</p>
                            </div>
                            <div>
                              <p className="font-medium text-green-600">Successful</p>
                              <p className="text-green-600">{processingResults.details.successful}</p>
                            </div>
                            <div>
                              <p className="font-medium text-red-600">Failed</p>
                              <p className="text-red-600">{processingResults.details.failed}</p>
                            </div>
                          </div>
                          
                          {processingResults.details.failed > 0 && (
                            <div className="mt-3">
                              <p className="font-medium">Errors:</p>
                              <ul className="mt-1 list-inside list-disc space-y-1">
                                {processingResults.details.errors.map((error, index) => (
                                  <li key={index} className="text-xs text-red-600">
                                    Row {error.row}: {error.message}
                                  </li>
                                ))}
                              </ul>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={handleDownloadErrorReport}
                              >
                                <Download className="mr-2 h-3 w-3" />
                                Download Error Report
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setUploadFile(null)
                setProcessingResults({
                  status: null,
                  message: '',
                  details: null,
                })
              }}>
                Reset
              </Button>
              <Button onClick={handleProcessFile} disabled={!uploadFile || isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process File'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Export data in bulk for reporting or backup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Select Data to Export</Label>
                <RadioGroup
                  defaultValue="students"
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                >
                  {[
                    { value: 'students', label: 'Export Students' },
                    { value: 'lecturers', label: 'Export Lecturers' },
                    { value: 'courses', label: 'Export Courses' },
                    { value: 'attendance', label: 'Export Attendance' },
                    { value: 'timetable', label: 'Export Timetable' },
                  ].map((operation) => (
                    <div key={operation.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={operation.value} id={`export-${operation.value}`} />
                      <Label htmlFor={`export-${operation.value}`} className="flex items-center space-x-2 cursor-pointer">
                        {getOperationIcon(operation.value)}
                        <span>{operation.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Export Options</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="exportFormat">Format</Label>
                    <Select defaultValue="xlsx">
                      <SelectTrigger id="exportFormat">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="dateRange">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="current-semester">Current Semester</SelectItem>
                        <SelectItem value="current-year">Current Academic Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Include Fields</Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {[
                      'Basic Information',
                      'Contact Details',
                      'Academic Records',
                      'Attendance History',
                      'Department Data',
                      'Programme Data',
                    ].map((field) => (
                      <div key={field} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`field-${field.toLowerCase().replace(/\s+/g, '-')}`}
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <Label htmlFor={`field-${field.toLowerCase().replace(/\s+/g, '-')}`}>
                          {field}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
