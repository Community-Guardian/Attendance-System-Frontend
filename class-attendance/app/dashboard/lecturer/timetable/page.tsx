"use client"

import { useState } from "react"
import { Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)

export default function LecturerTimetablePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Dummy timetable data
  const timetableData = [
    {
      id: "1",
      course: { id: "101", name: "Database Systems", code: "CS301" },
      day_of_week: "Monday",
      start_time: "09:00:00",
      end_time: "11:00:00",
      location: "Computer Science Building, Room 101",
      class_group: "CS-Y3-A",
      is_makeup_class: false,
    },
    {
      id: "2",
      course: { id: "102", name: "Software Engineering", code: "CS302" },
      day_of_week: "Monday",
      start_time: "14:00:00",
      end_time: "16:00:00",
      location: "Engineering Block, Room 203",
      class_group: "CS-Y3-A",
      is_makeup_class: false,
    },
    {
      id: "3",
      course: { id: "103", name: "Computer Networks", code: "CS303" },
      day_of_week: "Tuesday",
      start_time: "11:00:00",
      end_time: "13:00:00",
      location: "Computer Science Building, Room 105",
      class_group: "CS-Y3-A",
      is_makeup_class: false,
    },
    {
      id: "4",
      course: { id: "104", name: "Artificial Intelligence", code: "CS304" },
      day_of_week: "Wednesday",
      start_time: "09:00:00",
      end_time: "11:00:00",
      location: "Engineering Block, Room 301",
      class_group: "CS-Y4-A",
      is_makeup_class: false,
    },
    {
      id: "5",
      course: { id: "105", name: "Web Development", code: "CS305" },
      day_of_week: "Thursday",
      start_time: "14:00:00",
      end_time: "16:00:00",
      location: "Computer Science Building, Room 102",
      class_group: "CS-Y3-B",
      is_makeup_class: false,
    },
  ]

  const getTimetableForDay = (day: string) => {
    return timetableData.filter((item) => item.day_of_week === day)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  // Get today's classes
  const today = new Date()
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const todayName = dayNames[today.getDay()]
  const todayClasses = getTimetableForDay(todayName)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
        <p className="text-muted-foreground">View your weekly teaching schedule</p>
      </div>

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
              <div className="grid grid-cols-8 gap-4 overflow-x-auto">
                <div className="sticky left-0 bg-background">
                  <div className="h-12"></div>
                  {timeSlots.map((time) => (
                    <div key={time} className="h-16 border-t pt-2 text-sm text-muted-foreground">
                      {time}
                    </div>
                  ))}
                </div>
                {daysOfWeek.map((day) => (
                  <div key={day} className="min-w-[150px]">
                    <div className="h-12 font-medium">{day}</div>
                    <div className="relative">
                      {timeSlots.map((time, index) => (
                        <div key={`${day}-${time}`} className="h-16 border-t"></div>
                      ))}
                      {getTimetableForDay(day).map((item) => {
                        const startHour = Number.parseInt(item.start_time.split(":")[0], 10)
                        const endHour = Number.parseInt(item.end_time.split(":")[0], 10)
                        const startOffset = (startHour - 8) * 64 // 64px per hour
                        const duration = (endHour - startHour) * 64

                        return (
                          <div
                            key={item.id}
                            className="absolute left-0 right-0 rounded-md bg-primary/10 p-2 text-xs"
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
                          {item.course.name} ({item.course.code})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(item.start_time)} - {formatTime(item.end_time)}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-4 w-4" />
                          {item.location}
                        </div>
                      </div>
                      <div className="text-sm font-medium">{item.class_group}</div>
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
                            {item.course.name} ({item.course.code})
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {formatTime(item.start_time)} - {formatTime(item.end_time)}
                          </div>
                          <div className="mt-1 flex items-center text-sm text-muted-foreground">
                            <MapPin className="mr-1 h-4 w-4" />
                            {item.location}
                          </div>
                          <div className="mt-1 text-sm font-medium">Class: {item.class_group}</div>
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
    </div>
  )
}

