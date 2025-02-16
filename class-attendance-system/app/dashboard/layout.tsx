"use client"
import type React from "react"
import { Sidebar } from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { role: "student" | "lecturer" | "hod" | "dp_academics" | "config" }
}) {
  const router = useRouter()
  const {toast} = useToast()
  useEffect(() => {
    try {
      if (!Cookies.get("accessToken")) {
        toast({
          title: "Unauthorized",
          description: "You need to login to access this page",
          variant: "destructive",
        })
        setTimeout(() => router.push("/login"), 3000)
      }
    } catch (error) {
      console.error("Toast error:", error)
    }
  }, [])
  
  return (
    <div className="flex flex-col h-screen lg:flex-row">
      <Sidebar role={params.role} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
    </div>
  )
}

