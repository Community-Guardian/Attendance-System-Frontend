"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Forbidden() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">403 - Forbidden</h1>
        <h2 className="text-2xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground">
          You don&apos;t have permission to access this page.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
