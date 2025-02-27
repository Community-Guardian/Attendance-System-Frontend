"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Clock, MapPin, User } from "lucide-react"
import { Course } from "@/types/courses"
import { GeolocationZone } from "@/types/geolocation"
import { Timetable } from "@/types/timetables"
import { User as UserType } from "@/types"

type Event = {
  type: "session" | "timetable";
  time: Date;
  id: string;
  timetable: Partial<Timetable>;
  lecturer: Partial<UserType>;
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
            <Skeleton className="h-24 w-28 rounded-lg" />
            <Skeleton className="h-24 flex-1 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (!events?.length) {
    return <div className="text-center py-8 text-muted-foreground">No events scheduled for today</div>;
  }

  const formatDate = (date: string | Date) => {
    const parsedDate = new Date(date);
    return parsedDate.toString() === "Invalid Date" ? null : format(parsedDate, "hh:mm a");
  };

  return (
    <ScrollArea className="h-[550px] pr-4">
      <div className="space-y-6">
        {events.map((event) => {
          const startTime = formatDate(event?.start_time as string);
          const endTime = formatDate(event?.end_time as string);
          
          if (!startTime || !endTime) {
            return null;
          }

          return (
            <div key={event?.id} className="flex gap-6 p-5 rounded-lg border bg-card text-card-foreground shadow-md">
              <div className="w-[120px] text-center font-semibold">
                <div className="text-lg text-primary">{startTime}</div>
                <div className="text-sm text-muted-foreground"> - {endTime}</div>
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{event?.course?.name}</h3>
                  <p className="text-sm text-muted-foreground">{event?.course?.code}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                  {event?.lecturer && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{event?.lecturer?.email}</span>
                    </div>
                  )}
                </div>
                {event?.type === "session" && (
                  <Button variant="default" size="sm" className="mt-2" onClick={() => onSessionClick(event?.id)}>
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
