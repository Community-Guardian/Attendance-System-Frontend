import type { Metadata } from "next"
import { DepartmentManagement } from "@/components/department-management"

export const metadata: Metadata = {
  title: "Department Management",
  description: "Manage departments in the Class Attendance System.",
}

export default function DepartmentManagementPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Department Management</h2>
      <DepartmentManagement />
    </div>
  )
}

