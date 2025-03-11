"use client"
import { Loader2 } from "lucide-react"

interface FullPageLoaderProps {
  message?: string
}

export default function FullPageLoader({ message = "Loading, please wait..." }: FullPageLoaderProps) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
