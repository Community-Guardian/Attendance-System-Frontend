"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, Day } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import moment from "moment"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Dummy data representing classes in time slots
const timeSlots = [
  { start: "7:00 AM", end: "10:00 AM", title: "Class 1" },
  { start: "10:00 AM", end: "1:00 PM", title: "Class 2" },
  { start: "1:00 PM", end: "4:00 PM", title: "Class 3" },
  { start: "4:00 PM", end: "7:00 PM", title: "Class 4" },
]

const generateDummyClasses = () => {
  const classes = []
  const weekStart = moment().startOf("week").add(1, "day") // Start from Monday

  // Generate classes for Monday to Friday
  for (let i = 0; i < 5; i++) {
    const day = weekStart.clone().add(i, "days")
    timeSlots.forEach((slot) => {
      classes.push({
        date: day.format("YYYY-MM-DD"),
        title: slot.title,
        time: `${slot.start} - ${slot.end}`,
      })
    })
  }
  return classes
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [classes, setClasses] = React.useState<any[]>([])

  React.useEffect(() => {
    const dummyClasses = generateDummyClasses()
    setClasses(dummyClasses)
  }, [])

  const renderClassesForDay = (date: Date) => {
    const dateString = moment(date).format("YYYY-MM-DD")
    const classesForDay = classes.filter((c) => c.date === dateString)
    return classesForDay.map((c, index) => (
      <div key={index} className="text-xs text-gray-700 bg-blue-100 p-1 rounded-md mt-1">
        {c.title} ({c.time})
      </div>
    ))
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
      components={{
        day: (props: any) => {
          const { date } = props
          return (
            <div className="relative">
              <div {...props} />
              <div className="absolute top-full left-0 w-full">
                {renderClassesForDay(date)}
              </div>
            </div>
          )
        },
      }}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
