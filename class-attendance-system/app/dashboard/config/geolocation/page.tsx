import type { Metadata } from "next"
import { GeolocationSettings } from "@/components/geolocation-settings"

export const metadata: Metadata = {
  title: "Geolocation Settings",
  description: "Manage geolocation settings in the Class Attendance System.",
}

export default function GeolocationSettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Geolocation Settings</h2>
      <GeolocationSettings />
    </div>
  )
}

