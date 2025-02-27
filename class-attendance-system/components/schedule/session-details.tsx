"use client"

import { useAttendance } from "@/context/AttendanceContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Calendar, Clock, MapPin } from "lucide-react"

interface SessionDetailsProps {
  sessionId: string | null
  onClose: () => void
}

export function SessionDetails({ sessionId, onClose }: SessionDetailsProps) {
  const { attendanceSessions } = useAttendance()

  const session = sessionId ? attendanceSessions.find((s) => s.id === sessionId) : null

  if (!session) return null

  return (
    <Dialog open={!!sessionId} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{session.course.name}</h3>
            <p className="text-sm text-muted-foreground">{session.course.code}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(session.start_time), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {format(new Date(session.start_time), "HH:mm")} - {format(new Date(session.end_time), "HH:mm")}
              </span>
            </div>
            {session.geolocation_zone && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{session.geolocation_zone.name}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="default" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

