"use client"

import { useEffect } from "react"
import { useReports } from "@/context/ReportContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HistoryList } from "./history-list"
import { CourseBreakdown } from "./course-breakdown"
import { TimetableReport } from "./timetable-report"
import {
  Calendar,
  Download,
  FileSpreadsheet,
  Filter,
  PieChart,
  RefreshCcw,
  Search,
  Share2,
  SlidersHorizontal,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { AnalyticsModal } from "./analytics-modal"
import { useToast } from "@/hooks/use-toast"

export function ReportsDashboard() {
  const {
    studentAttendanceHistory,
    fetchStudentAttendanceHistory,
    fetchAttendanceReports,
    fetchTimetableAdherence,
    loading,
  } = useReports()

  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showAnalytics, setShowAnalytics] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchStudentAttendanceHistory()
    fetchAttendanceReports()
    fetchTimetableAdherence()
  }, [])

  // Calculate statistics
  const totalSessions = studentAttendanceHistory.length
  const signedByLecturer = studentAttendanceHistory.filter((history) => history.signed_by_lecturer).length
  const recentSessions = studentAttendanceHistory.filter((history) => {
    const date = new Date(history.timestamp)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
    return date >= thirtyDaysAgo
  }).length

  const handleExportExcel = async () => {
    try {
      const response = await fetch("/api/reports/excel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: studentAttendanceHistory }),
      })

      if (!response.ok) throw new Error("Failed to generate Excel file")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "attendance_history.xlsx"
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "Excel file downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate Excel file",
        variant: "destructive",
      })
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/reports/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: studentAttendanceHistory }),
      })

      if (!response.ok) throw new Error("Failed to generate PDF file")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "attendance_history.pdf"
      a.click()
      window.URL.revokeObjectURL(url)

      toast({
        title: "Success",
        description: "PDF file downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF file",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Attendance History",
          text: "Check out my attendance history",
          url: window.location.href,
        })
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied",
          description: "The link has been copied to your clipboard",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    try {
      await Promise.all([fetchStudentAttendanceHistory(), fetchAttendanceReports(), fetchTimetableAdherence()])
      toast({
        title: "Success",
        description: "Data refreshed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance History</h1>
          <p className="text-muted-foreground">View and analyze your attendance records</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Attendance</SheetTitle>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search by course or session..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date Range</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger id="date">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="semester">This Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="signed">Signed by Lecturer</SelectItem>
                      <SelectItem value="unsigned">Not Signed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Button variant="outline" size="sm" onClick={() => setShowAnalytics(true)}>
            <PieChart className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">All recorded sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lecturer Signed</CardTitle>
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{signedByLecturer}</div>
            <p className="text-xs text-muted-foreground">Sessions verified by lecturer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentSessions}</div>
            <p className="text-xs text-muted-foreground">Sessions in last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSessions ? ((signedByLecturer / totalSessions) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Of sessions verified by lecturer</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:max-w-[400px]">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="courses">Course Breakdown</TabsTrigger>
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <HistoryList searchTerm={searchTerm} dateFilter={dateFilter} statusFilter={statusFilter} />
        </TabsContent>
        <TabsContent value="courses">
          <CourseBreakdown />
        </TabsContent>
        <TabsContent value="timetable">
          <TimetableReport />
        </TabsContent>
      </Tabs>
      <AnalyticsModal open={showAnalytics} onClose={() => setShowAnalytics(false)} />
    </div>
  )
}

