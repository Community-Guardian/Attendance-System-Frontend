"use client"

import { useEffect, useState } from "react"
import { useAttendance } from "@/context/AttendanceContext"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AttendanceStats } from "./attendance-stats"
import { AttendanceSessionList } from "./attendance-session-list"
import { AttendanceCalculator } from "@/components/attendance-calculator"
import { SignAttendanceModal } from "./sign-attendance-modal"
import { Button } from "@/components/ui/button"
import { Calendar, Calculator, History } from "lucide-react"

export function StudentDashboard() {
  const [showSignModal, setShowSignModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const { fetchAttendanceSessions, fetchAttendanceRecords } = useAttendance()

  useEffect(() => {
    fetchAttendanceSessions()
    fetchAttendanceRecords()
  }, [fetchAttendanceSessions, fetchAttendanceRecords])

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Dashboard</h1>
          <p className="text-muted-foreground">Manage and track your class attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSignModal(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Sign Attendance
          </Button>
          <Button variant="outline" size="sm">
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <Calculator className="mr-2 h-4 w-4" />
            Calculator
          </Button>
        </div>
      </div>

      <AttendanceStats />

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Sessions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past Sessions</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <AttendanceSessionList
            type="active"
            onSignClick={(sessionId) => {
              setSelectedSession(sessionId)
              setShowSignModal(true)
            }}
          />
        </TabsContent>
        <TabsContent value="upcoming">
          <AttendanceSessionList type="upcoming" />
        </TabsContent>
        <TabsContent value="past">
          <AttendanceSessionList type="past" />
        </TabsContent>
        <TabsContent value="calculator">
          <Card className="p-6">
            <AttendanceCalculator />
          </Card>
        </TabsContent>
      </Tabs>

      <SignAttendanceModal
        open={showSignModal}
        sessionId={selectedSession}
        onClose={() => {
          setShowSignModal(false)
          setSelectedSession(null)
        }}
      />
    </div>
  )
}

