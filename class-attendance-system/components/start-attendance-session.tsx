"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useAttendance } from "@/context/AttendanceContext";
import { useCourses } from "@/context/CoursesContext";
import { useUser } from "@/context/userContext";
import { useTimetable } from "@/context/TimetableContext";
import { useGeolocation } from "@/context/GeoLocationContext";

export function StartAttendanceSession() {
  const { createAttendanceSession } = useAttendance();
  const { courses, fetchCourses } = useCourses();
  const { user, loading: userLoading, fetchUser } = useUser();
  const { timetables, fetchTimetables } = useTimetable();
  const { geolocationZones, fetchGeolocationZones } = useGeolocation();

  const [courseId, setCourseId] = useState("");
  const [lecturerId, setLecturerId] = useState("");
  const [timetableId, setTimetableId] = useState("");
  const [geolocationZone, setGeolocationZone] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isMakeupClass, setIsMakeupClass] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Check if data is already fetched to avoid unnecessary requests
      if (!courses.length) await fetchCourses();
      if (!user) await fetchUser();
      if (!timetables.length) await fetchTimetables();
      if (!geolocationZones.length) await fetchGeolocationZones();

      setLoading(false);
    };
    loadData();
  }, [courses, user, timetables, geolocationZones, fetchCourses, fetchUser, fetchTimetables, fetchGeolocationZones]);

  useEffect(() => {
    if (user && user.role === "lecturer") {
      setLecturerId(user.id || "");
    }
  }, [user]);

  const handleStartSession = async () => {
    if (!courseId || !lecturerId || !timetableId || !geolocationZone || !endTime) {
      toast({
        title: "Missing Information",
        description: "All fields are required to start an attendance session.",
        variant: "destructive",
      });
      return;
    }

    const isWithinTimetable = checkTimetable(timetableId);
    if (!isWithinTimetable && !isMakeupClass) {
      toast({
        title: "Invalid Session Time",
        description: "This session is not within the scheduled timetable. Mark as a make-up class if needed.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSession = {
        timetable_id: timetableId,
        lecturer_id: lecturerId,
        course_id: courseId,
        start_time: new Date().toISOString(),
        end_time: new Date(endTime).toISOString(),
        is_makeup_class: isMakeupClass,
        geolocation_zone_id: geolocationZone,
      };

      console.log("🚀 Sending Payload:", newSession);

      await createAttendanceSession(newSession);

      setSessionActive(true);
      toast({
        title: "Attendance Session Started",
        description: `Session started for course ${courseId} until ${endTime}.`,
      });
    } catch (error: any) {
      console.error("❌ Error Response:", error.response?.data || error.message);
      toast({
        title: "Error Starting Session",
        description: error.response?.data?.detail || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  if (loading || userLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="courseId">Course</Label>
        <select
          id="courseId"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          disabled={sessionActive}
          className="border rounded-md p-2"
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="lecturerId">Lecturer ID</Label>
        <Input type="text" id="lecturerId" value={lecturerId} disabled />
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="timetableId">Timetable</Label>
        <select
          id="timetableId"
          value={timetableId}
          onChange={(e) => setTimetableId(e.target.value)}
          disabled={sessionActive}
          className="border rounded-md p-2"
        >
          <option value="">Select a timetable</option>
          {timetables.map((timetable) => (
            <option key={timetable.id} value={timetable.id}>
              {timetable.course.code} - {timetable.day_of_week} {timetable.start_time} - {timetable.end_time}
            </option>
          ))}
        </select>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="geolocationZone">Geolocation Zone</Label>
        <select
          id="geolocationZone"
          value={geolocationZone}
          onChange={(e) => setGeolocationZone(e.target.value)}
          disabled={sessionActive}
          className="border rounded-md p-2"
        >
          <option value="">Select a geolocation zone</option>
          {geolocationZones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name} (Lat: {zone.lat1}, Lon: {zone.lon1})
            </option>
          ))}
        </select>
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="endTime">End Time</Label>
        <Input
          type="datetime-local"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          disabled={sessionActive}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="makeup-class" checked={isMakeupClass} onCheckedChange={setIsMakeupClass} disabled={sessionActive} />
        <Label htmlFor="makeup-class">Mark as make-up class</Label>
      </div>

      <Button onClick={handleStartSession} disabled={sessionActive}>
        Start Attendance Session
      </Button>
    </div>
  );
}

function checkTimetable(timetableId: string): boolean {
  return true;
}
