"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

const dummySchedule = [
  { id: 1, course: "MATH101", date: new Date(2023, 5, 15, 9, 0), duration: 60 },
  { id: 2, course: "PHYS202", date: new Date(2023, 5, 15, 11, 0), duration: 90 },
  { id: 3, course: "CHEM301", date: new Date(2023, 5, 16, 14, 0), duration: 120 },
]

export function ScheduleView({ role }: { role: "student" | "lecturer" | "hod" | "dp_academics" }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [makeupRequests, setMakeupRequests] = useState<number[]>([])

  const filteredSchedule = dummySchedule.filter(
    (item) => selectedDate && item.date.toDateString() === selectedDate.toDateString(),
  )

  const handleMakeupRequest = (courseId: number) => {
    if (role !== "lecturer") return
    setMakeupRequests([...makeupRequests, courseId])
    toast({
      title: "Makeup Request Sent",
      description: `A makeup request for course ${courseId} has been sent for approval.`,
    })
  }

  const handleApproveMakeup = (courseId: number) => {
    if (role !== "hod") return
    setMakeupRequests(makeupRequests.filter((id) => id !== courseId))
    toast({
      title: "Makeup Request Approved",
      description: `The makeup request for course ${courseId} has been approved.`,
    })
  }

  return (
    <div className="space-y-4">
      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
      <div className="space-y-2">
        {filteredSchedule.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.course}</CardTitle>
              <CardDescription>
                {item.date.toLocaleTimeString()} - Duration: {item.duration} minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {role === "lecturer" && <Button onClick={() => handleMakeupRequest(item.id)}>Request Makeup</Button>}
              {role === "hod" && makeupRequests.includes(item.id) && (
                <Button onClick={() => handleApproveMakeup(item.id)}>Approve Makeup</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

