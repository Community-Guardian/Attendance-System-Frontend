"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function AttendanceCalculator() {
  const [attendedClasses, setAttendedClasses] = useState("")
  const [totalClasses, setTotalClasses] = useState("")
  const [attendancePercentage, setAttendancePercentage] = useState<number | null>(null)

  const calculateAttendance = () => {
    if (!attendedClasses || !totalClasses) {
      toast({
        title: "Missing Information",
        description: "Please provide both attended and total classes.",
        variant: "destructive",
      })
      return
    }

    const attended = Number.parseInt(attendedClasses)
    const total = Number.parseInt(totalClasses)

    if (isNaN(attended) || isNaN(total) || total === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for attended and total classes.",
        variant: "destructive",
      })
      return
    }

    const percentage = (attended / total) * 100
    setAttendancePercentage(Math.round(percentage * 100) / 100)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Attendance Calculator</h3>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="attendedClasses">Attended Classes</Label>
        <Input
          type="number"
          id="attendedClasses"
          value={attendedClasses}
          onChange={(e) => setAttendedClasses(e.target.value)}
          placeholder="Enter number of attended classes"
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="totalClasses">Total Classes</Label>
        <Input
          type="number"
          id="totalClasses"
          value={totalClasses}
          onChange={(e) => setTotalClasses(e.target.value)}
          placeholder="Enter total number of classes"
        />
      </div>
      <Button onClick={calculateAttendance}>Calculate Attendance</Button>
      {attendancePercentage !== null && (
        <div className="mt-4">
          <p className="text-lg font-semibold">Attendance Percentage: {attendancePercentage}%</p>
        </div>
      )}
    </div>
  )
}

