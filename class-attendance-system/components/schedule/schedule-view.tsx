"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Clock, MapPin, AlertCircle } from "lucide-react";
import { Timetable } from "@/types/timetables";
import { Course } from "@/types/courses";
import { User } from "@/types";
import { GeolocationZone } from "@/types/geolocation";

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
  status: "scheduled" | "pending" | "approved" | "rejected";
};

interface Holiday {
  date: string;
  name: string;
}

interface ScheduleViewProps {
  role: "student" | "lecturer" | "hod" | "dp_academics";
  allEvents: Event[];
  holidays: Holiday[];
}

export function ScheduleView({ role, allEvents, holidays }: ScheduleViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const filteredEvents = allEvents.filter(
    (event) => event.time.toDateString() === selectedDate.toDateString()
  );

  const handleMakeupRequest = (event: Event) => {
    if (role !== "lecturer") return;
    toast({
      title: "Makeup Request Sent",
      description: `A makeup request for ${event.course.name} has been sent for approval.`,
    });
  };

  const handleMakeupAction = (event: Event, action: "approve" | "reject") => {
    if (role !== "hod" && role !== "dp_academics") return;
    toast({
      title: `Makeup Request ${action === "approve" ? "Approved" : "Rejected"}`,
      description: `The makeup request for ${event.course.name} has been ${action}d.`,
    });
  };

  const getStatusBadge = (status: Event["status"]) => {
    const variants = {
      scheduled: "outline",
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList className="flex gap-2 bg-gray-100 p-2 rounded-md">
          <TabsTrigger value="calendar">
            <CalendarDays className="h-5 w-5 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list">
            <Clock className="h-5 w-5 mr-2" />
            Schedule
          </TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <Calendar
                events={allEvents}
                holidays={holidays}
                selectedDate={selectedDate}
                onSelect={(date) => setSelectedDate(date)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule List View */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>
                Schedule for {selectedDate.toLocaleDateString()}
              </CardTitle>
              <CardDescription>
                {holidays.some(
                  (h) => h.date === selectedDate.toISOString().split("T")[0]
                )
                  ? "Holiday"
                  : "Regular Day"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <Card key={event.id} className="relative">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              {event.course.name} ({event.course.code})
                            </CardTitle>
                            {getStatusBadge(event.status)}
                          </div>
                          <CardDescription>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {event.start_time} - {event.end_time}
                            </div>
                            {event.geolocation_zone && (
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4" />
                                {event.geolocation_zone.name}
                              </div>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              Lecturer: {event.lecturer.username}
                            </div>
                            <div className="space-x-2">
                              {role === "lecturer" &&
                                event.type === "timetable" && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        Request Makeup
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Request Makeup Class</DialogTitle>
                                        <DialogDescription>
                                          Are you sure you want to request a
                                          makeup class for {event.course.name}?
                                        </DialogDescription>
                                      </DialogHeader>
                                      <DialogFooter>
                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            handleMakeupRequest(event)
                                          }
                                        >
                                          Request Makeup
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}

                              {(role === "hod" || role === "dp_academics") &&
                                event.is_makeup_class &&
                                event.status === "pending" && (
                                  <div className="space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleMakeupAction(event, "approve")
                                      }
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                        handleMakeupAction(event, "reject")
                                      }
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No scheduled events for this day.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
