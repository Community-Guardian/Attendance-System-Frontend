import { Bell } from "lucide-react"

const notifications = [
  { id: 1, message: "New make-up class scheduled for Mathematics 101", date: "2023-06-15" },
  { id: 2, message: "Attendance below 75% in Physics 202", date: "2023-06-14" },
  { id: 3, message: "Reminder: Complete course feedback", date: "2023-06-13" },
]

export function Notifications() {
  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-start space-x-2 p-2 border rounded">
          <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <p>{notification.message}</p>
            <p className="text-sm text-muted-foreground">{notification.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

