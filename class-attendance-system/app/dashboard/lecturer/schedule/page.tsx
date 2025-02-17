"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

const localizer = momentLocalizer(moment)

const timeSlots = [
  { start: 7, end: 10 },
  { start: 10, end: 13 },
  { start: 13, end: 16 },
  { start: 16, end: 19 },
]

const generateFixedClasses = () => {
  const classes = []
  const weekStart = moment().startOf("week").add(1, "day")

  for (let i = 0; i < 5; i++) {
    const day = weekStart.clone().add(i, "days")
    const numClasses = 2 // 2 classes per day

    const availableSlots = [...timeSlots]
    for (let j = 0; j < numClasses; j++) {
      const slotIndex = Math.floor(Math.random() * availableSlots.length)
      const slot = availableSlots.splice(slotIndex, 1)[0]

      const startTime = day.clone().set({ hour: slot.start, minute: 0 })
      const endTime = day.clone().set({ hour: slot.end, minute: 0 })

      classes.push({
        title: `Class ${j + 1}`,
        start: startTime.toDate(),
        end: endTime.toDate(),
      })
    }
  }

  return classes
}

const holidays = [
  {
    title: "Spring Break",
    start: moment().startOf("week").add(2, "weeks").toDate(),
    end: moment().startOf("week").add(2, "weeks").add(4, "days").toDate(),
    allDay: true,
  },
  {
    title: "Faculty Meeting",
    start: moment().startOf("week").add(1, "week").day(3).set({ hour: 14, minute: 0 }).toDate(),
    end: moment().startOf("week").add(1, "week").day(3).set({ hour: 16, minute: 0 }).toDate(),
  },
  {
    title: "Graduation Ceremony",
    start: moment().startOf("week").add(3, "weeks").day(6).set({ hour: 10, minute: 0 }).toDate(),
    end: moment().startOf("week").add(3, "weeks").day(6).set({ hour: 13, minute: 0 }).toDate(),
  },
]

const LecturerSchedule = () => {
  const [events, setEvents] = useState([])
  const { theme } = useTheme()

  useEffect(() => {
    const fixedClasses = generateFixedClasses()
    setEvents([...fixedClasses, ...holidays])
  }, [])

  const eventStyleGetter = (event: any) => {
    let backgroundColor = "#3b82f6"
    const color = "white"

    if (event.title.includes("Class")) {
      backgroundColor = theme === "dark" ? "#3b82f6" : "#60a5fa"
    } else if (event.title === "Spring Break") {
      backgroundColor = theme === "dark" ? "#10b981" : "#34d399"
    } else if (event.title === "Faculty Meeting") {
      backgroundColor = theme === "dark" ? "#f59e0b" : "#fbbf24"
    } else if (event.title === "Graduation Ceremony") {
      backgroundColor = theme === "dark" ? "#6366f1" : "#818cf8"
    }

    return {
      style: {
        backgroundColor,
        color,
        borderRadius: "5px",
        border: "0px",
        display: "block",
        fontWeight: "bold",
      },
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Lecturer Schedule</CardTitle>
        <CardDescription>Your weekly classes, holidays, and school events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-blue-500 text-white">
            Classes
          </Badge>
          <Badge variant="secondary" className="bg-green-500 text-white">
            Holidays
          </Badge>
          <Badge variant="secondary" className="bg-yellow-500 text-white">
            Meetings
          </Badge>
          <Badge variant="secondary" className="bg-indigo-500 text-white">
            Special Events
          </Badge>
        </div>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          view={Views.WEEK}
          views={[Views.WEEK]}
          min={moment().hours(7).minutes(0).toDate()}
          max={moment().hours(19).minutes(0).toDate()}
          formats={{
            timeGutterFormat: (date, culture, localizer) => localizer.format(date, "h:mm A", culture),
            eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
              `${localizer.format(start, "h:mm A", culture)} - ${localizer.format(end, "h:mm A", culture)}`,
          }}
          dayLayoutAlgorithm="no-overlap"
        />
      </CardContent>
    </Card>
  )
}

export default LecturerSchedule

