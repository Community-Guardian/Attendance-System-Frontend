"use client"

import { useEffect, useState, useMemo } from "react"
import { Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Timetable } from "@/types"

import ApiService from "@/handler/ApiService"
import { useApi } from "@/hooks/useApi"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)

export default function TimetablePage() {
  // State to track the selected day for daily view
  const [selectedDay, setSelectedDay] = useState<string>("")

  // Fetch all timetable data once
  const { useFetchData: useFetchTimetable } = useApi<Timetable, Timetable>(ApiService.TIMETABLE_URL)
  const { data: timetableData, isLoading: isTimetableLoading } = useFetchTimetable(1)

  // Organize timetable data by day using useMemo to prevent recomputation on every render
  const timetableByDay = useMemo(() => {
    const byDay: Record<string, any[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    }
    
    if (timetableData?.results) {
      timetableData.results.forEach((item) => {
        if (item.day_of_week && byDay[item.day_of_week]) {
          byDay[item.day_of_week].push(item)
        }
      })
    }
    
    return byDay
  }, [timetableData])

  // Set current day of week on component mount
  useEffect(() => {
    const today = new Date()
    const dayIndex = today.getDay() - 1 // 0 = Sunday, 1 = Monday, etc.
    
    // Default to Monday if it's weekend
    if (dayIndex >= 0 && dayIndex < 5) {
      setSelectedDay(daysOfWeek[dayIndex])
    } else {
      setSelectedDay("Monday")
    }
  }, [])

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  if (isTimetableLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading timetable...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
        <p className="text-muted-foreground">View your weekly class schedule</p>
      </div>
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="flex justify-center space-x-4">
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="daily">Daily View</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>Your classes for the entire week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="grid grid-cols-6 gap-4 min-w-[600px] md:min-w-full">
                  {/* Time Slots Column (Sticky on Scroll) */}
                  <div className="sticky left-0 bg-background z-10">
                    <div className="h-12"></div>
                    {timeSlots.map((time) => (
                      <div key={time} className="h-16 border-t pt-2 text-sm text-muted-foreground">
                        {time}
                      </div>
                    ))}
                  </div>

                  {/* Daily Columns */}
                  {daysOfWeek.map((day) => (
                    <div key={day} className="min-w-[100px] md:min-w-[150px]">
                      <div className="h-12 font-medium text-center">{day}</div>
                      <div className="relative">
                        {timeSlots.map((time) => (
                          <div key={`${day}-${time}`} className="h-16 border-t"></div>
                        ))}
                        {timetableByDay[day].map((item) => {
                          const startHour = Number.parseInt(item.start_time.split(":")[0], 10);
                          const endHour = Number.parseInt(item.end_time.split(":")[0], 10);
                          const startOffset = (startHour - 8) * 64; // 64px per hour
                          const duration = (endHour - startHour) * 64;

                          return (
                            <div
                              key={item.id}
                              className="absolute left-0 right-0 rounded-md bg-primary/10 p-2 text-xs md:text-sm"
                              style={{
                                top: `${startOffset}px`,
                                height: `${duration}px`,
                              }}
                            >
                              <div className="font-medium">{item.course.name}</div>
                              <div className="text-muted-foreground">
                                {formatTime(item.start_time)} - {formatTime(item.end_time)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  <span>{selectedDay}'s Schedule</span>
                  <select 
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </CardTitle>
              <CardDescription>Your classes for {selectedDay}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timetableByDay[selectedDay]?.length > 0 ? (
                  timetableByDay[selectedDay].map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 rounded-md border p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{item.course.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(item.start_time)} - {formatTime(item.end_time)}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.course.code}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No classes scheduled for {selectedDay}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

