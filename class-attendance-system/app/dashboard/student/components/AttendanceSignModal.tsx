"use client"
import { useState } from "react"
import { useAttendance } from "@/context/AttendanceContext"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useGeolocation } from "@/context/GeoLocationContext"
import { Loader2, MapPin, CheckCircle } from "lucide-react"

interface AttendanceSignModalProps {
  sessionId: string
  isOpen: boolean
  onClose: () => void
}

export function AttendanceSignModal({ sessionId, isOpen, onClose }: AttendanceSignModalProps) {
  const { createAttendanceRecord } = useAttendance()
  const { location, error, loading } = useGeolocation()
  const [submitting, setSubmitting] = useState(false)

  const handleSignAttendance = async () => {
    if (!location) return
    setSubmitting(true)
    await createAttendanceRecord({
      session: sessionId,
      latitude: location.latitude,
      longitude: location.longitude,
      signed_by_lecturer: false,
    })
    setSubmitting(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Attendance</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          {loading ? (
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="text-center">
              <MapPin className="h-8 w-8 text-green-500" />
              <p className="text-gray-700">Location Verified</p>
              <p className="text-sm text-gray-500">
                Latitude: {location?.latitude}, Longitude: {location?.longitude}
              </p>
            </div>
          )}
          <Button onClick={handleSignAttendance} disabled={submitting || loading || !!error}>
            {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckCircle className="h-5 w-5" />}
            Sign Attendance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
