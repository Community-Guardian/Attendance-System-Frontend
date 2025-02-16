"use client"
import { useEffect, useState } from "react"
import { Sidebar } from "@/components/ui/sidebar"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { UserProvider, useUser } from "@/context/userContext"

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("accessToken")

      if (!token) {
        toast({
          title: "Unauthorized",
          description: "You need to log in to access this page",
          variant: "destructive",
        })
        setTimeout(() => router.push("/login"), 2000)
        return
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, toast])

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>
  }

  return (
      <div className="flex flex-col h-screen lg:flex-row">
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
  )
}
