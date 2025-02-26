"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { ATTENDANCE_RECORD_URL } from "@/handler/customApiConfig"
import { useApi } from "@/hooks/customApi"

interface SignAttendanceModalProps {
  open: boolean
  sessionId: string | null
  onClose: () => void
}

export function SignAttendanceModal({ open, sessionId, onClose }: SignAttendanceModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const { useAddItem:signAttendance } = useApi<any>(`${ATTENDANCE_RECORD_URL}sign_attendance/`)

  useEffect(() => {
    if (open) {
      requestPermissions();
    } else {
      stopCamera();
    }
  }, [open]);
  
  useEffect(() => {
    if (videoStream && videoRef.current) {
      console.log("Attaching video stream...");
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
    }
  }, [videoStream]);
  
  

  const requestPermissions = async () => {
    try {
      // Request location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        () => {
          toast({
            title: "Location Access Denied",
            description: "Please enable location services to sign attendance.",
            variant: "destructive",
          })
        }
      )

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream)

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

  const captureImage = () => {
    return new Promise<string | null>((resolve) => {
      if (!videoRef.current) return resolve(null)

      const canvas = document.createElement("canvas")
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL("image/jpeg") // Convert to base64
        setCapturedImage(imageData)
        resolve(imageData)
      } else {
        resolve(null)
      }
    })
  }

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop())
      setVideoStream(null)
    }
  }

  const handleSignAttendance = async () => {
    await captureImage()
    if (!sessionId ) {
      toast({
        title: "Error",
        description: `session ID is missing.`,
        variant: "destructive",
      })
      return
    }
    else if(!location){
      toast({
        title: "Error",
        description: "Location is missing.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const image = await captureImage()
      if (!image) throw new Error("Face capture failed.")

      await signAttendance.mutate({
        session_id: sessionId,
        latitude: location.latitude,
        longitude: location.longitude,
        face_image: image,
      })

      toast({
        title: "Success",
        description: "Attendance signed successfully",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign attendance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      stopCamera()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign Attendance</DialogTitle>
          <DialogDescription>
            Please enable location services and allow camera access to verify your identity.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {videoStream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-lg w-48 h-48 border bg-black" // Ensure black background to confirm camera works
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-200 rounded-lg">
              <p className="text-gray-500">Camera not available</p>
            </div>
          )}

          {capturedImage && (
            <img src={capturedImage} alt="Captured Face" className="rounded-lg w-48 h-48 border" />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSignAttendance} disabled={loading || !location || !videoStream}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Attendance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
