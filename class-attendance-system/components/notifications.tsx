import { Bell } from "lucide-react";
import { StudentAttendanceResponse } from "@/types";
import dayjs from "dayjs";

interface NotificationsProps {
  attendanceData: StudentAttendanceResponse;
}

export function Notifications({ attendanceData }: NotificationsProps) {
  const { courses, overall_attendance } = attendanceData;

  const notifications = [];

  // Generate notifications per course
  courses.forEach((course) => {
    if (course.attendance_percentage < 75) {
      notifications.push({
        id: `low-attendance-${course.course_id}`,
        message: `Warning: Attendance below 75% in ${course.course_name}.`,
        date: dayjs().format("YYYY-MM-DD"),
      });
    }

    if (course.attendance_percentage === 100) {
      notifications.push({
        id: `perfect-attendance-${course.course_id}`,
        message: `Great job! You have 100% attendance in ${course.course_name}.`,
        date: dayjs().format("YYYY-MM-DD"),
      });
    }
  });

  // Add overall attendance notification
  if (overall_attendance.attendance_percentage < 70) {
    notifications.push({
      id: "overall-attendance-warning",
      message: "Your overall attendance is below 70%. Please attend more sessions.",
      date: dayjs().format("YYYY-MM-DD"),
    });
  }

  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <div key={notification.id} className="flex items-start space-x-2 p-2 border rounded">
            <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p>{notification.message}</p>
              <p className="text-sm text-muted-foreground">{notification.date}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No new notifications.</p>
      )}
    </div>
  );
}
