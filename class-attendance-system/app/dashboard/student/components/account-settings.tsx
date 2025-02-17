"use client"

import { useState } from "react"
import { useUser } from "@/context/userContext"
import { useAuth } from "@/context/AuthContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "./profile-form"
import { SecuritySettings } from "./security-settings"
import { DeviceManagement } from "./device-management"
import { ActivityLog } from "./activity-log"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, LogOut } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { LoadingSettings } from "./loading-settings"

export function AccountSettings() {
  const { user, loading: userLoading } = useUser()
  const { logout } = useAuth()
  const { toast } = useToast()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setLoggingOut(true)
      await logout()
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoggingOut(false)
    }
  }

  if (userLoading) {
    return <LoadingSettings />
  }

  if (!user) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Not Authenticated</h2>
          <p className="text-muted-foreground">Please log in to view your settings</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and set preferences</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
              <AlertDialogDescription>You will need to sign in again to access your account.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                disabled={loggingOut}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {loggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:max-w-[600px]">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileForm user={user} />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <DeviceManagement />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityLog />
        </TabsContent>
      </Tabs>
    </div>
  )
}

