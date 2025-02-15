"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function ManualAttendanceSign() {
  const [studentId, setStudentId] = useState("")
  const [courseId, setCourseId] = useState("")

  const handleManualSign = async () => {
    if (!studentId || !courseId) {
      toast({
        title: "Missing Information",
        description: "Please provide both student ID and course ID.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send a request to your backend
    // to manually sign attendance for a student
    // The backend should check:
    // 1. If it's within 3 hours of opening the session
    // 2. If the lecturer has signed for this student less than twice before
    console.log("Manually signing attendance for:", { studentId, courseId })

    toast({
      title: "Attendance Signed",
      description: `Attendance signed for student ${studentId} in course ${courseId}.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="studentId">Student ID</Label>
        <Input
          type="text"
          id="studentId"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter student ID"
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="courseId">Course ID</Label>
        <Input
          type="text"
          id="courseId"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          placeholder="Enter course ID"
        />
      </div>
      <Button onClick={handleManualSign}>Sign Attendance Manually</Button>
    </div>
  )
}

