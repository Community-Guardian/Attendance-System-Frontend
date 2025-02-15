"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

interface Coordinate {
  latitude: string
  longitude: string
}

export function GeolocationSetup() {
  const [zoneName, setZoneName] = useState("")
  const [coordinates, setCoordinates] = useState<Coordinate[]>([
    { latitude: "", longitude: "" },
    { latitude: "", longitude: "" },
    { latitude: "", longitude: "" },
    { latitude: "", longitude: "" },
  ])

  const handleCoordinateChange = (index: number, field: keyof Coordinate, value: string) => {
    const newCoordinates = [...coordinates]
    newCoordinates[index][field] = value
    setCoordinates(newCoordinates)
  }

  const handleSetupZone = async () => {
    if (!zoneName || coordinates.some((coord) => !coord.latitude || !coord.longitude)) {
      toast({
        title: "Missing Information",
        description: "Please provide zone name and all coordinates.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send a request to your backend
    // to set up the geolocation zone
    console.log("Setting up geolocation zone:", { zoneName, coordinates })

    toast({
      title: "Geolocation Zone Set Up",
      description: `Zone "${zoneName}" has been set up successfully.`,
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Set Up Geolocation Zone</h3>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="zoneName">Zone Name</Label>
        <Input
          type="text"
          id="zoneName"
          value={zoneName}
          onChange={(e) => setZoneName(e.target.value)}
          placeholder="Enter zone name"
        />
      </div>
      {coordinates.map((coord, index) => (
        <div key={index} className="grid grid-cols-2 gap-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor={`latitude-${index}`}>Latitude {index + 1}</Label>
            <Input
              type="text"
              id={`latitude-${index}`}
              value={coord.latitude}
              onChange={(e) => handleCoordinateChange(index, "latitude", e.target.value)}
              placeholder="Enter latitude"
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor={`longitude-${index}`}>Longitude {index + 1}</Label>
            <Input
              type="text"
              id={`longitude-${index}`}
              value={coord.longitude}
              onChange={(e) => handleCoordinateChange(index, "longitude", e.target.value)}
              placeholder="Enter longitude"
            />
          </div>
        </div>
      ))}
      <Button onClick={handleSetupZone}>Set Up Zone</Button>
    </div>
  )
}

