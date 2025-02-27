"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"

export function SystemConfiguration() {
  const [catWeeks, setCatWeeks] = useState("2,6,10")
  const [attendanceThreshold, setAttendanceThreshold] = useState(75)
  const [enableFacialRecognition, setEnableFacialRecognition] = useState(false)
  const [enableGeolocation, setEnableGeolocation] = useState(true)

  const handleSaveConfig = () => {
    // Here you would typically send a request to your backend to save the configuration
    console.log("Saving configuration:", { catWeeks, attendanceThreshold, enableFacialRecognition, enableGeolocation })
    toast({
      title: "Configuration Saved",
      description: "The system configuration has been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cat-weeks">CAT Weeks</Label>
        <Input
          id="cat-weeks"
          value={catWeeks}
          onChange={(e) => setCatWeeks(e.target.value)}
          placeholder="Enter CAT weeks (comma-separated)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendance-threshold">Attendance Threshold (%)</Label>
        <Input
          id="attendance-threshold"
          type="number"
          value={attendanceThreshold}
          onChange={(e) => setAttendanceThreshold(Number.parseInt(e.target.value))}
          min={0}
          max={100}
        />
      </div>

      <Separator />

      <div className="flex items-center space-x-2">
        <Switch
          id="facial-recognition"
          checked={enableFacialRecognition}
          onCheckedChange={setEnableFacialRecognition}
        />
        <Label htmlFor="facial-recognition">Enable Facial Recognition</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="geolocation" checked={enableGeolocation} onCheckedChange={setEnableGeolocation} />
        <Label htmlFor="geolocation">Enable Geolocation</Label>
      </div>

      <Separator />

      <Button onClick={handleSaveConfig}>Save Configuration</Button>
    </div>
  )
}

