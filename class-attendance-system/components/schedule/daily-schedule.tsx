"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Clock, MapPin } from "lucide-react"
import { Course } from "@/types/courses"
import { GeolocationZone } from "@/types/geolocation"
import { Timetable } from "@/types/timetables"
import { User } from "@/types"

type Event = {
  type: "session" | "timetable";
  time: Date;
  id: string;
  timetable: Partial<Timetable>;
  lecturer: Partial<User>;
  course: Partial<Course>;
  start_time: string;
  end_time: string;
  is_makeup_class: boolean;
  geolocation_zone: Partial<GeolocationZone>;
};

interface DailyScheduleProps {
  events: Partial<Event[]>;
  onSessionClick: (sessionId: string) => void;
  loading?: boolean;
}

export function DailySchedule({ events, onSessionClick, loading }: DailyScheduleProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-20 w-[100px]" />
            <Skeleton className="h-20 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!events?.length) {
    return <div className="text-center py-8 text-muted-foreground">No events scheduled for this day</div>;
  }

  const formatDate = (date: string | Date) => {
    const parsedDate = new Date(date);
    return parsedDate.toString() === "Invalid Date" ? null : format(parsedDate, "HH:mm");
  };

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {events.map((event) => {
          const startTime = formatDate(event?.start_time as string);
          const endTime = formatDate(event?.end_time as string);
          
          if (!startTime || !endTime) {
            return null; // Skip rendering this event if time format is invalid
          }

          return (
            <div key={event?.id} className="flex gap-4 p-4 rounded-lg border bg-card text-card-foreground">
              <div className="w-[100px] text-center">
                <div className="text-2xl font-bold">{startTime}</div>
                <div className="text-sm text-muted-foreground">{endTime}</div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold">{event?.course?.name}</h3>
                  <p className="text-sm text-muted-foreground">{event?.course?.code}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{startTime} - {endTime}</span>
                  </div>
                  {event?.geolocation_zone && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event?.geolocation_zone?.name}</span>
                    </div>
                  )}
                </div>
                {event?.type === "session" && (
                  <Button variant="secondary" size="sm" onClick={() => onSessionClick(event?.id)}>
                    View Session
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
