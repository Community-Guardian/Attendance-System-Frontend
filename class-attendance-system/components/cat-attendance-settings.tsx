"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"

export function CatAttendanceSettings() {
  const [catWeeks, setCatWeeks] = useState("")
  const [enableCatAttendance, setEnableCatAttendance] = useState(false)

  const handleSaveSettings = async () => {
    if (!catWeeks) {
      toast({
        title: "Missing Information",
        description: "Please provide CAT weeks.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send a request to your backend
    // to save the CAT attendance settings
    console.log("Saving CAT attendance settings:", { catWeeks, enableCatAttendance })

    toast({
      title: "CAT Attendance Settings Saved",
      description: "The CAT attendance settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">CAT Attendance Settings</h3>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="catWeeks">CAT Weeks</Label>
        <Input
          type="text"
          id="catWeeks"
          value={catWeeks}
          onChange={(e) => setCatWeeks(e.target.value)}
          placeholder="e.g., 2, 6"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="enable-cat-attendance" checked={enableCatAttendance} onCheckedChange={setEnableCatAttendance} />
        <Label htmlFor="enable-cat-attendance">Enable CAT Attendance</Label>
      </div>
      <Button onClick={handleSaveSettings}>Save Settings</Button>
    </div>
  )
}

