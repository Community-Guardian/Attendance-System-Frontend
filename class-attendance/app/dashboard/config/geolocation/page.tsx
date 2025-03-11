"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Loader2, MapPin, Plus, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import type { GeolocationZone } from "@/types"

// Fix Leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Component to set map view
function SetMapView({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 16)
  }, [center, map])
  return null
}

export default function GeolocationZonesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [zones, setZones] = useState<GeolocationZone[]>([])
  const [selectedZone, setSelectedZone] = useState<GeolocationZone | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingZone, setIsAddingZone] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newZone, setNewZone] = useState<Partial<GeolocationZone>>({
    name: "",
    latitude: -1.2921,
    longitude: 36.8219,
    radius: 100,
  })
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.2921, 36.8219])
  const { toast } = useToast()

  // Mock data for geolocation zones
  const mockZones: GeolocationZone[] = [
    {
      id: "geo1",
      name: "Computer Science Building",
      latitude: -1.2921,
      longitude: 36.8219,
      radius: 100,
    },
    {
      id: "geo2",
      name: "Engineering Block",
      latitude: -1.2925,
      longitude: 36.8225,
      radius: 150,
    },
    {
      id: "geo3",
      name: "Business School",
      latitude: -1.293,
      longitude: 36.821,
      radius: 120,
    },
    {
      id: "geo4",
      name: "Main Library",
      latitude: -1.2915,
      longitude: 36.823,
      radius: 80,
    },
    {
      id: "geo5",
      name: "Science Complex",
      latitude: -1.294,
      longitude: 36.82,
      radius: 200,
    },
  ]

  useEffect(() => {
    // Simulate API call to fetch zones
    setTimeout(() => {
      setZones(mockZones)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter zones based on search query
  const filteredZones = zones.filter((zone) => zone.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectZone = (zone: GeolocationZone) => {
    setSelectedZone(zone)
    setMapCenter([zone.latitude, zone.longitude])
  }

  const handleAddZone = () => {
    setIsAddingZone(true)

    // Validate inputs
    if (!newZone.name || !newZone.radius) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      setIsAddingZone(false)
      return
    }

    // Simulate API call to add zone
    setTimeout(() => {
      const id = `geo${zones.length + 1}`
      const createdZone: GeolocationZone = {
        id,
        name: newZone.name,
        latitude: newZone.latitude || -1.2921,
        longitude: newZone.longitude || 36.8219,
        radius: newZone.radius || 100,
      }

      setZones([...zones, createdZone])
      setIsAddingZone(false)
      setShowAddDialog(false)
      setNewZone({
        name: "",
        latitude: -1.2921,
        longitude: 36.8219,
        radius: 100,
      })

      toast({
        title: "Zone Added",
        description: `${createdZone.name} has been added successfully.`,
      })
    }, 1000)
  }

  const handleDeleteZone = (id: string) => {
    // Simulate API call to delete zone
    setZones(zones.filter((zone) => zone.id !== id))

    if (selectedZone?.id === id) {
      setSelectedZone(null)
    }

    toast({
      title: "Zone Deleted",
      description: "Geolocation zone has been deleted successfully.",
    })
  }

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (showAddDialog) {
      setNewZone({
        ...newZone,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Geolocation Zones</h1>
          <p className="text-muted-foreground">Manage attendance tracking zones across campus</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Zone
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Zones List</CardTitle>
            <CardDescription>All configured geolocation zones</CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search zones..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredZones.length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center space-y-2 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <p className="text-lg font-medium">No zones found</p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "Add your first geolocation zone"}
                </p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Radius (m)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredZones.map((zone) => (
                      <TableRow key={zone.id} className={selectedZone?.id === zone.id ? "bg-muted/50" : undefined}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
                        <TableCell>{zone.radius}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleSelectZone(zone)}>
                              View
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteZone(zone.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Zone Map</CardTitle>
            <CardDescription>
              {selectedZone
                ? `Viewing: ${selectedZone.name}`
                : "Select a zone to view details or click on the map to set location for a new zone"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] p-0">
            <MapContainer
              center={mapCenter}
              zoom={16}
              style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
              onClick={handleMapClick as any}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <SetMapView center={mapCenter} />

              {/* Display all zones */}
              {zones.map((zone) => (
                <Circle
                  key={zone.id}
                  center={[zone.latitude, zone.longitude]}
                  radius={zone.radius}
                  pathOptions={{
                    color: selectedZone?.id === zone.id ? "#3b82f6" : "#6b7280",
                    fillColor: selectedZone?.id === zone.id ? "#3b82f6" : "#6b7280",
                    fillOpacity: 0.2,
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-medium">{zone.name}</h3>
                      <p className="text-xs">Radius: {zone.radius}m</p>
                      <p className="text-xs">
                        Lat: {zone.latitude.toFixed(6)}, Lng: {zone.longitude.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Circle>
              ))}

              {/* Display marker for new zone in add mode */}
              {showAddDialog && newZone.latitude && newZone.longitude && (
                <>
                  <Marker position={[newZone.latitude, newZone.longitude]}>
                    <Popup>New Zone Location</Popup>
                  </Marker>
                  <Circle
                    center={[newZone.latitude, newZone.longitude]}
                    radius={newZone.radius || 100}
                    pathOptions={{
                      color: "#10b981",
                      fillColor: "#10b981",
                      fillOpacity: 0.2,
                    }}
                  />
                </>
              )}
            </MapContainer>
          </CardContent>
          {selectedZone && (
            <CardFooter className="flex flex-col items-start space-y-2">
              <div className="grid w-full grid-cols-2 gap-4">
                <div>
                  <Label>Latitude</Label>
                  <Input value={selectedZone.latitude.toFixed(6)} readOnly />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input value={selectedZone.longitude.toFixed(6)} readOnly />
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Add Zone Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Geolocation Zone</DialogTitle>
            <DialogDescription>
              Create a new attendance tracking zone. Click on the map to set the location.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newZone.name}
                onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitude" className="text-right">
                Latitude
              </Label>
              <Input
                id="latitude"
                value={newZone.latitude?.toString() || ""}
                onChange={(e) => setNewZone({ ...newZone, latitude: Number.parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitude" className="text-right">
                Longitude
              </Label>
              <Input
                id="longitude"
                value={newZone.longitude?.toString() || ""}
                onChange={(e) => setNewZone({ ...newZone, longitude: Number.parseFloat(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="radius" className="text-right">
                Radius (m)
              </Label>
              <Input
                id="radius"
                type="number"
                value={newZone.radius?.toString() || ""}
                onChange={(e) => setNewZone({ ...newZone, radius: Number.parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddZone} disabled={isAddingZone}>
              {isAddingZone ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Zone"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

