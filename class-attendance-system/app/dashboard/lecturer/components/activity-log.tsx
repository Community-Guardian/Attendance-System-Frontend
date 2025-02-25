"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogIn, LogOut, Settings, Shield } from "lucide-react"

export function ActivityLog() {
  // Mock data - replace with actual activity data from your API
  const activities = [
    {
      id: "1",
      type: "login",
      description: "Logged in from iPhone",
      timestamp: "2024-02-17T10:30:00",
    },
    {
      id: "2",
      type: "security",
      description: "Password changed",
      timestamp: "2024-02-16T15:45:00",
    },
    {
      id: "3",
      type: "settings",
      description: "Updated profile information",
      timestamp: "2024-02-15T09:20:00",
    },
    {
      id: "4",
      type: "logout",
      description: "Logged out from MacBook",
      timestamp: "2024-02-14T18:10:00",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "login":
        return <LogIn className="h-4 w-4" />
      case "logout":
        return <LogOut className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "settings":
        return <Settings className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Recent activity on your account</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-4">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

