"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function StudentDeviceManagement() {
  const [studentId, setStudentId] = useState("")
  const [newDeviceId, setNewDeviceId] = useState("")

  const handleDeviceChange = async () => {
    if (!studentId || !newDeviceId) {
      toast({
        title: "Missing Information",
        description: "Please provide both student ID and new device ID.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send a request to your backend
    // to update the student's registered device
    console.log("Changing device for student:", { studentId, newDeviceId })

    toast({
      title: "Device Updated",
      description: `Device updated for student ${studentId}.`,
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Change Student's Registered Device</h3>
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
        <Label htmlFor="newDeviceId">New Device ID</Label>
        <Input
          type="text"
          id="newDeviceId"
          value={newDeviceId}
          onChange={(e) => setNewDeviceId(e.target.value)}
          placeholder="Enter new device ID"
        />
      </div>
      <Button onClick={handleDeviceChange}>Update Device</Button>
    </div>
  )
}

