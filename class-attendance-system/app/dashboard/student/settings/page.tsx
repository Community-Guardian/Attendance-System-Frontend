import type { Metadata } from "next"
import { Suspense } from "react"
import { AccountSettings } from "../components/account-settings"
import { LoadingSettings } from "../components/loading-settings"

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your account settings and preferences",
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Suspense fallback={<LoadingSettings />}>
        <AccountSettings />
      </Suspense>
    </div>
  )
}

