"use client"

import type React from "react"

import { DashboardSidebar } from "@/components/layout/sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import FullPageLoader from "@/components/custom/loading"
import { useRouter } from "next/navigation"

import Cookies from "js-cookie"
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import { User,DjangoPaginatedResponse, userRole } from "@/types"
import { toast } from "sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const accessToken = Cookies.get('accessToken')
  const router = useRouter()
  if (!accessToken){
    toast.error('Session is not valid.')
    router.replace('/login')
  }
  const { useFetchData } = useApi<DjangoPaginatedResponse<User>>(ApiService.USER_URL)
  const { data:user,isFetched,error } = useFetchData(1)
  if(!isFetched && !user?.results && !user?.results[0].role){
    return <FullPageLoader message="Loading ..." />
  }
  if(error){
    Cookies.remove('refreshToken')
    Cookies.remove('refreshToken')
    toast.error(error.message||'Session is not valid.')
  }

  return (
    <SidebarProvider>
      <DashboardSidebar userRole={user?.results[0].role as userRole} />
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

