"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
interface AttendanceSignProps {
  sessionId: string
}

export function  AttendanceSign({ sessionId }: AttendanceSignProps) {
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null)
  const [sessionOpen, setSessionOpen] = useState(false)
  const [geolocationAvailable, setGeolocationAvailable] = useState(true)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position.coords),
        (error) => {
          console.error("Error getting location:", error.message)
          setGeolocationAvailable(false)
          toast({
            title: "Location Services Unavailable",
            description: "Please enable location services in your browser settings to sign attendance.",
            variant: "destructive",
          })
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      )
    } else {
      setGeolocationAvailable(false)
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation. Please use a different browser or device.",
        variant: "destructive",
      })
    }

    // Check if session is open (this would be fetched from the server in a real application)
    setSessionOpen(true)
  }, [])

  const handleSignAttendance = async () => {
    if (!geolocationAvailable) {
      toast({
        title: "Location Required",
        description: "Please enable location services to sign attendance.",
        variant: "destructive",
      })
      return
    }

    if (!location) {
      toast({
        title: "Waiting for Location",
        description: "Please wait while we get your location.",
      })
      return
    }

    if (!sessionOpen) {
      toast({
        title: "Session Closed",
        description: "The attendance session is not currently open.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send a request to your backend
    // including the location and any other required data
    console.log("Signing attendance with:", { location })

    toast({
      title: "Attendance Signed",
      description: "Your attendance has been successfully recorded.",
    })
  }

  return (
    <div>
      <Button onClick={handleSignAttendance} disabled={!location || !sessionOpen || !geolocationAvailable}>
        Sign Attendance
      </Button>
      {!geolocationAvailable && (
        <p className="text-sm text-red-500 mt-2">
          Location services are not available. Please enable them in your browser settings to sign attendance.
        </p>
      )}
    </div>
  )
}

