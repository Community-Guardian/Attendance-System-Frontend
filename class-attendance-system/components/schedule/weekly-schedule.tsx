"use client"

import { useTimetable } from "@/context/TimetableContext"
import { useAttendance } from "@/context/AttendanceContext"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { addDays, format, startOfWeek } from "date-fns"

interface WeeklyScheduleProps {
  selectedDate: Date
  onSessionClick: (sessionId: string) => void
  loading?: boolean
}

export function WeeklySchedule({ selectedDate, onSessionClick, loading }: WeeklyScheduleProps) {
  const { timetables } = useTimetable()
  const { attendanceSessions } = useAttendance()

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    )
  }

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-4">
        {weekDays.map((day) => {
          const dayEvents = [
            ...attendanceSessions.filter(
              (session) => new Date(session.start_time).toDateString() === day.toDateString(),
            )          ]

          return (
            <Card key={day.toISOString()} className="p-4">
              <h3 className="font-semibold mb-2">{format(day, "EEEE, MMMM d")}</h3>
              {dayEvents.length > 0 ? (
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="text-sm p-2 rounded bg-muted"
                      onClick={() => "session_type" in event && onSessionClick(event.id)}
                      role={"session_type" in event ? "button" : "presentation"}
                    >
                      <div className="font-medium">
                        {format(new Date(event.start_time), "HH:mm")} - {format(new Date(event.end_time), "HH:mm")}
                      </div>
                      <div className="text-muted-foreground">{event.course?.name}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No events scheduled</div>
              )}
            </Card>
          )
        })}
      </div>
    </ScrollArea>
  )
}

