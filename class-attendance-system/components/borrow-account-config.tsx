"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function BorrowAccountConfig() {
  const [studentId, setStudentId] = useState("")
  const [enableBorrowAccount, setEnableBorrowAccount] = useState(false)

  const handleBorrowAccountConfig = async () => {
    if (!studentId) {
      toast({
        title: "Missing Information",
        description: "Please provide the student ID.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send a request to your backend
    // to configure the student's Borrow Account usage
    console.log("Configuring Borrow Account for student:", { studentId, enableBorrowAccount })

    toast({
      title: "Borrow Account Configured",
      description: `Borrow Account ${enableBorrowAccount ? "enabled" : "disabled"} for student ${studentId}.`,
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Configure Borrow Account</h3>
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
      <div className="flex items-center space-x-2">
        <Switch id="borrow-account" checked={enableBorrowAccount} onCheckedChange={setEnableBorrowAccount} />
        <Label htmlFor="borrow-account">Enable Borrow Account</Label>
      </div>
      <Button onClick={handleBorrowAccountConfig}>Update Configuration</Button>
    </div>
  )
}

