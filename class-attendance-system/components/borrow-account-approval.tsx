"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function BorrowAccountApproval() {
  const [studentId, setStudentId] = useState("")

  const handleApproval = async () => {
    if (!studentId) {
      toast({
        title: "Missing Information",
        description: "Please provide the student ID.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send a request to your backend
    // to approve the Borrow Account request
    console.log("Approving Borrow Account for student:", studentId)

    toast({
      title: "Borrow Account Approved",
      description: `Borrow Account approved for student ${studentId}.`,
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Approve Borrow Account Request</h3>
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
      <Button onClick={handleApproval}>Approve Request</Button>
    </div>
  )
}

