"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { useAttendance } from "@/context/AttendanceContext"
import { ATTENDANCE_RECORD_URL } from "@/handler/apiConfig"
import { api } from "@/utils/api"

interface SignAttendanceModalProps {
  open: boolean
  sessionId: string | null
  onClose: () => void
}

export function SignAttendanceModal({ open, sessionId, onClose }: SignAttendanceModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { createAttendanceRecord } = useAttendance()

  const handleSignAttendance = async () => {
    if (!sessionId) return

    setLoading(true)

    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })
      const response = await api.post(`${ATTENDANCE_RECORD_URL}sign_attendance/`, { session_id: sessionId, latitude:"12", longitude:"12" } ) 
      // await createAttendanceRecord({
      //   session_id: sessionId,
      //   latitude: position.coords.latitude,
      //   longitude: position.coords.longitude,
      // })

      toast({
        title: "Success",
        description: "Attendance signed successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Attendance</DialogTitle>
          <DialogDescription>
            Please enable location services to sign your attendance. Make sure you are within the designated area.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSignAttendance} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

