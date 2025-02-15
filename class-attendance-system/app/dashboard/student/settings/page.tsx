import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const metadata: Metadata = {
  title: "Student Settings",
  description: "Manage your account settings.",
}

export default function StudentSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="your.email@example.com" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Notification Preferences</h2>
          <div className="flex items-center space-x-2">
            <Switch id="email-notifications" />
            <Label htmlFor="email-notifications">Receive email notifications</Label>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Device Management</h2>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="device-id">Current Device ID</Label>
            <Input type="text" id="device-id" placeholder="XXXX-XXXX-XXXX" disabled />
          </div>
        </div>
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}

