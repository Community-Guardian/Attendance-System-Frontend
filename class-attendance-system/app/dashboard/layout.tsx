import type React from "react"
import { Sidebar } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { role: "student" | "lecturer" | "hod" | "dp_academics" | "config" }
}) {
  return (
    <div className="flex flex-col h-screen lg:flex-row">
      <Sidebar role={params.role} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
    </div>
  )
}

