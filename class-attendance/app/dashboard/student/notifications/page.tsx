import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Check, Clock, FileText, Info } from "lucide-react"

export default function NotificationsPage() {
  // Mock notifications data
  const notifications = [
    {
      id: "1",
      type: "attendance",
      title: "Attendance Recorded",
      message: "Your attendance for Database Systems (CS301) has been recorded.",
      time: "10 minutes ago",
      read: false,
    },
    {
      id: "2",
      type: "class",
      title: "Class Reminder",
      message: "Your Software Engineering (CS302) class starts in 30 minutes.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "announcement",
      title: "Course Announcement",
      message: "Dr. John Smith has posted a new announcement for Database Systems (CS301).",
      time: "1 day ago",
      read: true,
    },
    {
      id: "4",
      type: "attendance",
      title: "Attendance Warning",
      message: "Your attendance for Software Engineering (CS302) is below 80%. Please improve your attendance.",
      time: "2 days ago",
      read: true,
    },
    {
      id: "5",
      type: "class",
      title: "Class Cancelled",
      message: "Web Development (IT301) class scheduled for tomorrow has been cancelled.",
      time: "3 days ago",
      read: true,
    },
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "class":
        return <Clock className="h-5 w-5 text-green-500" />
      case "announcement":
        return <Info className="h-5 w-5 text-amber-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">View and manage your notifications</p>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              <Badge className="ml-2 bg-primary">{notifications.filter((n) => !n.read).length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Button variant="outline" size="sm">
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Your latest updates and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start space-x-4 rounded-lg border p-4 ${!notification.read ? "bg-muted/50" : ""}`}
              >
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
                {!notification.read && <div className="flex h-2 w-2 rounded-full bg-blue-500" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

