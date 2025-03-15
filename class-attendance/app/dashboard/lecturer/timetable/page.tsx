"use client"

import { useState, useEffect, useMemo } from "react"
import { Clock, MapPin, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

// API integration
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import type { Timetable } from "@/types"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)

export default function LecturerTimetablePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<string>("")

  // Fetch timetable data using API
  const { useFetchData: useFetchTimetable } = useApi<Timetable, Timetable>(ApiService.TIMETABLE_URL)
  const { data: timetableApiData, isLoading: isTimetableLoading, error: timetableError } = useFetchTimetable(1)

  // Organize timetable data by day using useMemo to prevent recomputation on every render
  const timetableByDay = useMemo(() => {
    const byDay: Record<string, any[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    }
    
    if (timetableApiData?.results) {
      timetableApiData.results.forEach((item) => {
        if (item.day_of_week && byDay[item.day_of_week]) {
          byDay[item.day_of_week].push(item)
        }
      })
    }
    
    return byDay
  }, [timetableApiData])

  // Handle errors and loading state
  useEffect(() => {
    if (timetableError) {
      toast.error(`Failed to load timetable: ${timetableError.message || 'Unknown error'}`)
    }
    
    if (!isTimetableLoading) {
      setIsLoading(false)
    }
  }, [timetableError, isTimetableLoading])

  const getTimetableForDay = (day: string) => {
    return timetableByDay[day] || []
  }

  const formatTime = (time: string) => {
    if (!time) return 'N/A'
    
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  // Get today's classes
  const today = new Date()
  const dayNames = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  const todayName = dayNames[today.getDay()]
  const todayClasses = getTimetableForDay(todayName)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
        <p className="text-muted-foreground">View your weekly teaching schedule</p>
      </div>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading timetable...</span>
        </div>
      ) : (
        <Tabs defaultValue="weekly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Your teaching schedule for the entire week</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="grid grid-cols-6 gap-4 min-w-[600px] md:min-w-full">
              <div className="sticky left-0 bg-background">
                    <div className="h-12"></div>
                    {timeSlots.map((time) => (
                      <div key={time} className="h-16 border-t pt-2 text-sm text-muted-foreground">
                        {time}
                      </div>
                    ))}
                  </div>
                  {daysOfWeek.map((day) => (
                    <div key={day} className="min-w-[100px] md:min-w-[150px]">
                      <div className="h-12 font-medium">{day}</div>
                      <div className="relative">
                        {timeSlots.map((time, index) => (
                          <div key={`${day}-${time}`} className="h-16 border-t"></div>
                        ))}
                        {getTimetableForDay(day).map((item) => {
                          const startHour = Number.parseInt(item.start_time?.split(":")[0] || "8", 10)
                          const endHour = Number.parseInt(item.end_time?.split(":")[0] || "9", 10)
                          const startOffset = (startHour - 8) * 64 // 64px per hour
                          const duration = (endHour - startHour) * 64

                          return (
                            <div
                              key={item.id}
                              className="absolute left-0 right-0 rounded-md bg-primary/10 p-2 text-xs md:text-sm"
                              style={{
                                top: `${startOffset}px`,
                                height: `${duration}px`,
                              }}
                            >
                              <div className="font-medium">{item.course?.name || 'Unknown Course'}</div>
                              <div className="text-muted-foreground">
                                {formatTime(item.start_time)} - {formatTime(item.end_time)}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="daily" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your teaching schedule for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayClasses.length > 0 ? (
                    todayClasses.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 rounded-md border p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="font-medium">
                            {item.course?.name || 'Unknown Course'} ({item.course?.code || 'N/A'})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(item.start_time)} - {formatTime(item.end_time)}
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            {item.location || 'Location not specified'}
                          </div>
                        </div>
                        <div className="text-sm font-medium">{item.class_group?.name || 'N/A'}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No classes scheduled for today</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>Select a date to view your schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                  <div className="md:w-1/2">
                    <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                  </div>
                  <div className="md:w-1/2">
                    <h3 className="font-medium mb-4">{date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}</h3>
                    <div className="space-y-4">
                      {date && getTimetableForDay(format(date, "EEEE")).length > 0 ? (
                        getTimetableForDay(format(date, "EEEE")).map((item) => (
                          <div key={item.id} className="rounded-md border p-4">
                            <div className="font-medium">
                              {item.course?.name || 'Unknown Course'} ({item.course?.code || 'N/A'})
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {formatTime(item.start_time)} - {formatTime(item.end_time)}
                            </div>
                            <div className="mt-1 flex items-center text-sm text-muted-foreground">
                              <MapPin className="mr-1 h-4 w-4" />
                              {item.location || 'Location not specified'}
                            </div>
                            <div className="mt-1 text-sm font-medium">
                              Class: {item.class_group?.name || 'N/A'}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-muted-foreground py-8">No classes scheduled for this day</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

