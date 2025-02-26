"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAttendance } from "@/context/AttendanceContext";
import { useCourses } from "@/context/CoursesContext";
import { useUser } from "@/context/userContext";
import { useTimetable } from "@/context/TimetableContext";
import { useGeolocation } from "@/context/GeoLocationContext";
import { create } from "zustand";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// ✅ Define Zod Schema for validation
const attendanceSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  timetableId: z.string().min(1, "Timetable is required"),
  geolocationZone: z.string().min(1, "Geolocation zone is required"),
  endTime: z.string().min(1, "End time is required"),
  isMakeupClass: z.boolean(),
  lecturerId: z.string().optional(),
});

// ✅ Zustand Store for state management
interface AttendanceStore {
  sessionActive: boolean;
  setSessionActive: (status: boolean) => void;
}

const useAttendanceStore = create<AttendanceStore>((set) => ({
  sessionActive: false,
  setSessionActive: (status: boolean) => set({ sessionActive: status }),
}));

export function StartAttendanceSession() {
  const { createAttendanceSession } = useAttendance();
  const { courses, fetchCourses } = useCourses();
  const { user, fetchUser } = useUser();
  const { timetables, fetchTimetables } = useTimetable();
  const { geolocationZones, fetchGeolocationZones } = useGeolocation();
  const { sessionActive, setSessionActive } = useAttendanceStore();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      courseId: "",
      timetableId: "",
      geolocationZone: "",
      isMakeupClass: false,
      lecturerId: "",
      endTime: "",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchCourses(), fetchUser(), fetchTimetables(), fetchGeolocationZones()]);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (user?.role === "lecturer") {
      setValue("lecturerId", user.id);
    }
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    if (!user?.id) {
      toast({ title: "Error", description: "User not found", variant: "destructive" });
      return;
    }

    if (!checkTimetable(data.timetableId) && !data.isMakeupClass) {
      toast({
        title: "Invalid Session Time",
        description: "Session not within schedule. Mark as a make-up class if needed.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newSession = {
        timetable_id: data.timetableId,
        lecturer_id: user.id,
        course_id: data.courseId,
        start_time: new Date().toISOString(),
        end_time: new Date(data.endTime).toISOString(),
        is_makeup_class: data.isMakeupClass,
        geolocation_zone_id: data.geolocationZone,
      };

      console.log("🚀 Sending Payload:", newSession);
      await createAttendanceSession(newSession);
      setSessionActive(true);

      toast({
        title: "Attendance Session Started",
        description: `Session started for course ${data.courseId} until ${data.endTime}.`,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="courseId">Course</Label>
        <select {...register("courseId")} disabled={sessionActive} className="border rounded-md p-2">
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>
        {errors.courseId && <p className="text-red-500">{errors.courseId.message}</p>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="timetableId">Timetable</Label>
        <select {...register("timetableId")} disabled={sessionActive} className="border rounded-md p-2">
          <option value="">Select a timetable</option>
          {timetables.map((timetable) => (
            <option key={timetable.id} value={timetable.id}>
              {timetable.course.code} - {timetable.day_of_week} {timetable.start_time} - {timetable.end_time}
            </option>
          ))}
        </select>
        {errors.timetableId && <p className="text-red-500">{errors.timetableId.message}</p>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="geolocationZone">Geolocation Zone</Label>
        <select {...register("geolocationZone")} disabled={sessionActive} className="border rounded-md p-2">
          <option value="">Select a geolocation zone</option>
          {geolocationZones.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.name} (Lat: {zone.lat1}, Lon: {zone.lon1})
            </option>
          ))}
        </select>
        {errors.geolocationZone && <p className="text-red-500">{errors.geolocationZone.message}</p>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="endTime">End Time</Label>
        <Input type="datetime-local" {...register("endTime")} disabled={sessionActive} />
        {errors.endTime && <p className="text-red-500">{errors.endTime.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Switch {...register("isMakeupClass")} disabled={sessionActive} />
        <Label htmlFor="isMakeupClass">Mark as make-up class</Label>
      </div>

      <Button type="submit" disabled={sessionActive} >
        Start Attendance Session
      </Button>
    </form>
  );
}

function checkTimetable(timetableId: string): boolean {
  return true;
}
