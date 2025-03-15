"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Check, Loader2, MapPin, X } from "lucide-react"
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap, useMapEvents, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"
import type { AttendanceSession, GeolocationZone } from "@/types"

// Fix Leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Component to update the map view when user position changes
function SetMapView({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
    }
  }, [center, map])
  return null
}

export default function SignAttendancePage() {
  const [currentPosition, setCurrentPosition] = useState<[number, number] | null>(null)
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null)
  const [isWithinGeofence, setIsWithinGeofence] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocationLoading, setIsLocationLoading] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)

  // API hooks
  const { useFetchData: useFetchActiveSessions } = useApi<AttendanceSession, AttendanceSession>(ApiService.ATTENDANCE_SESSION_URL)
  const { useAddItem: useSignAttendance } = useApi<any, any>(ApiService.SIGN_ATTENDANCE_URL)
  const { useAddItem: useCheckGeofence } = useApi<any, any>(ApiService.GEOLOCATION_CHECK_URL)

  // Fetch active attendance sessions
  const { data: sessionsData, isLoading: isLoadingSessions, error: sessionsError } = useFetchActiveSessions(1, {
    is_active: true
  })
  
  // API mutation hooks
  const { mutate: signAttendance, isPending } = useSignAttendance
  const { mutate: checkGeofence } = useCheckGeofence

  const activeSessions = sessionsData?.results || []

  useEffect(() => {
    // Get user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude]
          setCurrentPosition(coords)
          setIsLocationLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          toast.error("Unable to get your current location. Please enable location services.")
          setIsLocationLoading(false)
        },
      )
    } else {
      toast.error("Geolocation is not supported by your browser.")
      setIsLocationLoading(false)
    }
  }, [])

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

  // Check if user is within geofence when session or position changes
  useEffect(() => {
    const verifyGeofence = async () => {
      if (selectedSession && currentPosition) {
        try {
          checkGeofence({
            session_id: selectedSession.id,
            latitude: currentPosition[0],
            longitude: currentPosition[1]
          }, {
            onSuccess: (data) => {
              setIsWithinGeofence(data.is_within_geofence)
            },
            onError: (error) => {
              console.error("Failed to check geofence:", error)
              setIsWithinGeofence(false)
              toast.error("Failed to verify your location")
            }
          })
        } catch (error) {
          console.error("Error checking geofence:", error)
          setIsWithinGeofence(false)
        }
      } else {
        setIsWithinGeofence(false)
      }
    }

    verifyGeofence()
  }, [selectedSession, currentPosition, checkGeofence])

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
      toast.error("Please enable camera access to verify your identity.")
    }
  }

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop())
      setVideoStream(null)
    }
    setIsCameraActive(false)
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
      toast.error("Please ensure you are within the geofence and have taken a photo.")
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

      signAttendance(formData, {
        onSuccess: () => {
          toast.success("Your attendance has been successfully recorded.")
          setSelectedSession(null)
          setCapturedImage(null)
        },
        onError: (error) => {
          console.error("Failed to submit attendance:", error)
          toast.error(error.message || "Failed to submit attendance")
        },
        onSettled: () => {
          setIsSubmitting(false)
        }
      })
    } catch (error) {
      console.error("Failed to submit attendance:", error)
      toast.error("Something went wrong while submitting attendance")
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
              {isLoadingSessions ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : sessionsError ? (
                <p className="text-center text-red-500">Failed to load active sessions</p>
              ) : activeSessions.length > 0 ? (
                activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`flex cursor-pointer items-center space-x-4 rounded-md border p-4 transition-colors ${
                      selectedSession?.id === session.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="font-medium">
                        {session.timetable.course.name} ({session.timetable.course.code})
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Lecturer: {session.lecturer.first_name} {session.lecturer.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">Location: {session.geolocation_zone?.name || 'Unknown Location'}</p>
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
            {isLocationLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Getting your location...</span>
              </div>
            ) : currentPosition ? (
              <MapContainer center={currentPosition} zoom={17} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <SetMapView center={currentPosition} />
                <Marker position={currentPosition}>
                  <Popup>Your current location</Popup>
                </Marker>
                {selectedSession?.geolocation_zone?.coordinates && selectedSession.geolocation_zone.coordinates.length > 0 && (
                  <Polygon
                    positions={selectedSession.geolocation_zone.coordinates.map(coord => [coord.lat, coord.lon])}
                    pathOptions={{
                      color: isWithinGeofence ? "green" : "red",
                      fillColor: isWithinGeofence ? "green" : "red",
                      fillOpacity: 0.2,
                    }}
                  >
                    <Popup>{selectedSession.geolocation_zone.name}</Popup>
                  </Polygon>
                )}
              </MapContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Failed to get your location</p>
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
                <Button onClick={submitAttendance} disabled={!isWithinGeofence || isSubmitting || isPending}>
                  {isSubmitting || isPending ? (
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

