"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AttendanceSignModal } from "./AttendanceSignModal"
export function AttendanceSign() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Sign Attendance</Button>
      {selectedSession && <AttendanceSignModal sessionId={selectedSession} isOpen={!!selectedSession} onClose={() => setSelectedSession(null)} />}
    </>
  )
}
