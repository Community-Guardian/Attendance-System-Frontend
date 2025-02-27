import type { Metadata } from "next"
import { UserManagement } from "@/components/user-management"

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users in the Class Attendance System.",
}

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      <UserManagement />
    </div>
  )
}

