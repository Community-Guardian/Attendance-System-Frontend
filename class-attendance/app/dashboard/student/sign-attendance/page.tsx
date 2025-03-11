"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Check, Loader2, MapPin, X } from "lucide-react"
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { AttendanceSession } from "@/types"

// Fix Leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

export default function SignAttendancePage() {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null)
  const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([])
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null)
  const [isWithinGeofence, setIsWithinGeofence] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enable location services.",
            variant: "destructive",
          })
        },
      )
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      })
    }

    // Fetch active sessions
    const fetchActiveSessions = async () => {
      try {
        // Replace with actual API call
        const response = await fetch("/api/student/active-sessions")
        const data = await response.json()
        setActiveSessions(data)
      } catch (error) {
        console.error("Failed to fetch active sessions:", error)
      }
    }

    fetchActiveSessions()
  }, [toast])

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isCameraActive]);
  useEffect(() => {
    return () => stopCamera();
  }, []);
  
  useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
    }
  }, [videoStream]);


  // Mock active sessions
  const mockSessions: AttendanceSession[] = [
    {
      id: "1",
      timetable: { id: "101" },
      lecturer: { id: "user123", first_name: "John", last_name: "Doe" },
      course: { id: "101", name: "Database Systems", code: "CS301" },
      start_time: "09:00:00",
      end_time: "11:00:00",
      is_makeup_class: false,
      geolocation_zone: {
        id: "geo1",
        name: "Computer Science Building",
        coordinates:[{
          latitude: -1.2921,
          longitude: 36.8219,
        }],
      },
      class_group: "CS-Y3-A",
      is_active: true,
    },
    {
      id: "2",
      timetable: { id: "102" },
      lecturer: { id: "user124", first_name: "Jane", last_name: "Smith" },
      course: { id: "102", name: "Software Engineering", code: "CS302" },
      start_time: "14:00:00",
      end_time: "16:00:00",
      is_makeup_class: false,
      geolocation_zone: {
        id: "geo2",
        name: "Engineering Block",
        coordinates:[{
          latitude: -1.2921,
          longitude: 36.8219,
        }],
      },
      class_group: "CS-Y3-A",
      is_active: true,
    },
  ]

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream)
      setIsCameraActive(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      toast({
        title: "Camera Access Denied",
        description: "Please enable camera access to verify your identity.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataUrl = canvas.toDataURL("image/png")
        setCapturedImage(imageDataUrl)
        stopCamera()
      }
    }
  }

  const retakeImage = () => {
    setCapturedImage(null)
    startCamera()
  }

  const submitAttendance = async () => {
    if (!selectedSession || !currentPosition || !capturedImage || !isWithinGeofence) {
      toast({
        title: "Cannot Submit Attendance",
        description: "Please ensure you are within the geofence and have taken a photo.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Convert base64 image to file
      const response = await fetch(capturedImage)
      const blob = await response.blob()
      const file = new File([blob], "facial-image.png", { type: "image/png" })

      // Create form data
      const formData = new FormData()
      formData.append("session_id", selectedSession.id)
      formData.append("latitude", currentPosition[0].toString())
      formData.append("longitude", currentPosition[1].toString())
      formData.append("facial_image", file)

      // Replace with actual API call
      const apiResponse = await fetch("/api/student/sign-attendance", {
        method: "POST",
        body: formData,
      })

      const data = await apiResponse.json()

      if (!apiResponse.ok) {
        throw new Error(data.message || "Failed to submit attendance")
      }

      toast({
        title: "Attendance Submitted",
        description: "Your attendance has been successfully recorded.",
      })

      // Reset state
      setSelectedSession(null)
      setCapturedImage(null)
    } catch (error) {
      console.error("Failed to submit attendance:", error)
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sign Attendance</h1>
        <p className="text-muted-foreground">Record your attendance for active classes</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Select a session to sign attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSessions.length > 0 ? (
                mockSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex cursor-pointer items-center space-x-4 rounded-md border p-4 transition-colors ${
                      selectedSession?.id === session.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">
                        {session.course.name} ({session.course.code})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Lecturer: {session.lecturer.first_name} {session.lecturer.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">Location: {session.geolocation_zone.name}</p>
                    </div>
                    {selectedSession?.id === session.id && <Check className="h-5 w-5 text-primary" />}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No active sessions available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Verification</CardTitle>
            <CardDescription>You must be within the class geofence to sign attendance</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {currentPosition && selectedSession?.geolocation_zone ? (
              <MapContainer center={currentPosition} zoom={17} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={currentPosition}>
                  <Popup>Your current location</Popup>
                </Marker>
                {selectedSession.geolocation_zone.coordinates &&
                <Circle
                 center={[
                   selectedSession.geolocation_zone?.coordinates[0].latitude as number,
                   selectedSession.geolocation_zone?.coordinates[0].longitude as number,
                 ]}
                 radius={50}
                 pathOptions={{
                   color: isWithinGeofence ? "green" : "red",
                   fillColor: isWithinGeofence ? "green" : "red",
                   fillOpacity: 0.2,
                 }}
               >
                 <Popup>{selectedSession.geolocation_zone.name}</Popup>
               </Circle>
                }
               
              </MapContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  {!currentPosition ? "Getting your location..." : "Select a session to view the geofence"}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {isWithinGeofence ? "You are within the geofence" : "You are outside the geofence"}
                </span>
              </div>
              <div className={`h-3 w-3 rounded-full ${isWithinGeofence ? "bg-green-500" : "bg-red-500"}`}></div>
            </div>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Facial Verification</CardTitle>
            <CardDescription>Take a photo to verify your identity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {capturedImage ? (
                <div className="relative overflow-hidden rounded-md border">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured"
                    className="h-[300px] w-auto object-cover"
                  />
                </div>
              ) : isCameraActive ? (
                <div className="relative overflow-hidden rounded-md border">
                  <video ref={videoRef} autoPlay playsInline className="h-[300px] w-auto"></video>
                </div>
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center rounded-md border bg-muted/30">
                  <p className="text-muted-foreground">Camera inactive</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {capturedImage ? (
              <>
                <Button variant="outline" onClick={retakeImage}>
                  <X className="mr-2 h-4 w-4" />
                  Retake
                </Button>
                <Button onClick={submitAttendance} disabled={!isWithinGeofence || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Submit Attendance
                    </>
                  )}
                </Button>
              </>
            ) : isCameraActive ? (
              <Button onClick={captureImage}>
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
            ) : (
              <Button onClick={startCamera} disabled={!selectedSession}>
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

