"use client"

import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Loader2, MapPin, Plus, Search, Trash2 } from "lucide-react"
import { toast } from "sonner"

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
import type { Coordinate, GeolocationZone } from "@/types"
import { useApi } from "@/hooks/useApi"
import ApiService from "@/handler/ApiService"

// Fix Leaflet icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})

// Add this helper function at the top of the file, outside the component
function calculatePointsFromCenter(centerLat: number, centerLon: number, radiusInMeters: number): Coordinate[] {
  // Convert radius from meters to degrees (approximate)
  const radiusLat = (radiusInMeters / 111320); // 1 degree = 111.32 km
  const radiusLon = radiusInMeters / (111320 * Math.cos(centerLat * Math.PI / 180));

  return [
    { lat: centerLat + radiusLat, lon: centerLon + radiusLon }, // Northeast
    { lat: centerLat + radiusLat, lon: centerLon - radiusLon }, // Northwest
    { lat: centerLat - radiusLat, lon: centerLon - radiusLon }, // Southwest
    { lat: centerLat - radiusLat, lon: centerLon + radiusLon }  // Southeast
  ];
}

// Component to set map view
function SetMapView({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, 16)
  }, [center, map])
  return null
}

function MapEvents({ onClick }: { onClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click: (e) => {
      // Stop event propagation to prevent dialog from closing
      if (e.originalEvent) {
        e.originalEvent.stopPropagation();
        e.originalEvent.preventDefault();
      }
      onClick(e);
    },
  })
  return null
}

export default function GeolocationZonesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedZone, setSelectedZone] = useState<GeolocationZone | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [newZone, setNewZone] = useState<Partial<GeolocationZone>>({
    name: "",
    coordinates: [
      { lat: 0, lon: 0 },
      { lat: 0, lon: 0 },
      { lat: 0, lon: 0 },
      { lat: 0, lon: 0 }
    ],
    capacity: 50,
    radius: 50 // Add default radius
  })
  const [mapCenter, setMapCenter] = useState<[number, number]>([-1.2921, 36.8219])

  const { useAddItem, useFetchData, useUpdateItem, useDeleteItem } = useApi<GeolocationZone, GeolocationZone>(ApiService.GEOLOCATION_ZONE_URL)
  const { data: zones, isLoading, refetch } = useFetchData(1)
  const { mutate: addZone, isPending: isAddingZone } = useAddItem
  const { mutate: updateZone } = useUpdateItem
  const { mutateAsync: deleteZone } = useDeleteItem

  // Add this function to get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const centerLat = position.coords.latitude;
        const centerLon = position.coords.longitude;
        const radius = newZone.radius || 50; // Use radius from form or default
        
        const newCoordinates = calculatePointsFromCenter(centerLat, centerLon, radius);
        
        setNewZone(prev => ({
          ...prev,
          coordinates: newCoordinates
        }));
        setMapCenter([centerLat, centerLon]);
        setUserLocation([centerLat, centerLon]);
      },
      (error) => {
        console.error("Error getting location:", error)
        toast.error("Unable to get your current location. Please enable location services.")
      },
      { enableHighAccuracy: true }
    )
  }

  // Filter zones based on search query
  const filteredZones = zones?.results.filter((zone) => zone.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectZone = (zone: GeolocationZone) => {
    setSelectedZone(zone)
    setMapCenter([
      zone.coordinates[0].lat,
      zone.coordinates[0].lon
    ])
  }

  const handleAddZone = async () => {
    if (!newZone.name || !newZone.capacity || !newZone.coordinates?.length) {
      toast.error("Please fill in all required fields.")
      return
    }

    try {
      await addZone(newZone as GeolocationZone)
      setShowAddDialog(false)
      setNewZone({
        name: "",
        coordinates: [
          { lat: 0, lon: 0 },
          { lat: 0, lon: 0 },
          { lat: 0, lon: 0 },
          { lat: 0, lon: 0 }
        ],
        capacity: 50,
        radius: 50
      })
      await refetch()
      toast.success(`${newZone.name} has been added successfully.`)
    } catch (error) {
      console.error("Failed to add zone:", error)
      toast.error("Failed to add geolocation zone.")
    }
  }

  const handleDeleteZone = async (id: string) => {
    try {
      await deleteZone(id)
      
      if (selectedZone?.id === id) {
        setSelectedZone(null)
      }
      
      await refetch()
      toast.success("Geolocation zone has been deleted successfully.")
    } catch (error) {
      console.error("Failed to delete zone:", error)
      toast.error("Failed to delete geolocation zone.")
    }
  }

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (showAddDialog) {
      const centerLat = e.latlng.lat;
      const centerLon = e.latlng.lng;
      const radius = newZone.radius || 50; // Use radius from form or default
      
      const newCoordinates = calculatePointsFromCenter(centerLat, centerLon, radius);
      
      setNewZone(prev => ({
        ...prev,
        coordinates: newCoordinates
      }));
      
      // Update map center and user location to match clicked point
      setMapCenter([centerLat, centerLon]);
      setUserLocation([centerLat, centerLon]);
      
      // Show visual feedback
      toast.info("Location updated. Coordinates have been set based on your click.", {
        duration: 3000,
      });
    }
  }

  // Add this function to handle radius changes
  const handleRadiusChange = (radius: number) => {
    const centerPoint = newZone.coordinates?.[0];
    if (centerPoint && centerPoint.lat !== 0 && centerPoint.lon !== 0) {
      const newCoordinates = calculatePointsFromCenter(centerPoint.lat, centerPoint.lon, radius);
      setNewZone(prev => ({
        ...prev,
        radius,
        coordinates: newCoordinates
      }));
    } else {
      setNewZone(prev => ({
        ...prev,
        radius
      }));
    }
  };

  // Modify the existing click handler for "Add New Zone" button
  const handleAddNewZoneClick = () => {
    getUserLocation(); // Get location before showing dialog
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Geolocation Zones</h1>
          <p className="text-muted-foreground">Manage attendance tracking zones across campus</p>
        </div>
        <Button onClick={handleAddNewZoneClick}>
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
            ) : (filteredZones ?? []).length === 0 ? (
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(filteredZones ?? []).map((zone) => (
                      <TableRow key={zone.id} className={selectedZone?.id === zone.id ? "bg-muted/50" : undefined}>
                        <TableCell className="font-medium">{zone.name}</TableCell>
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
                : showAddDialog 
                  ? "Click anywhere on the map to set the center point of your zone" 
                  : "Select a zone to view details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] p-0 relative">
            {showAddDialog && (
              <div className="absolute top-2 right-2 z-[500] bg-background/90 p-2 rounded-md shadow-md">
                <p className="text-xs font-medium text-primary">Click on the map to set location</p>
              </div>
            )}
            <MapContainer
              center={mapCenter}
              zoom={16}
              style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
            >
              {showAddDialog && <MapEvents onClick={handleMapClick} />}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <SetMapView center={mapCenter} />

              {/* Add user location marker */}
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>Your current location</Popup>
                </Marker>
              )}

              {/* Display all zones */}
              {zones?.results.map((zone) => (
                <Polygon
                  key={zone.id}
                  positions={zone.coordinates.map(coord => [coord.lat, coord.lon])}
                  pathOptions={{
                    color: selectedZone?.id === zone.id ? "#3b82f6" : "#6b7280",
                    fillColor: selectedZone?.id === zone.id ? "#3b82f6" : "#6b7280",
                    fillOpacity: 0.2,
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-medium">{zone.name}</h3>
                      <p className="text-xs">
                        Center: {zone.coordinates[0].lat.toFixed(6)}, {zone.coordinates[0].lon.toFixed(6)}
                      </p>
                    </div>
                  </Popup>
                </Polygon>
              ))}

              {/* Display marker for new zone in add mode */}
              {showAddDialog && newZone?.coordinates?.length && (
                <>
                  <Marker position={[newZone.coordinates[0].lat, newZone.coordinates[0].lon]}>
                    <Popup>New Zone Location</Popup>
                  </Marker>
                  <Polygon
                    positions={newZone.coordinates.map(coord => [coord.lat, coord.lon])}
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
                  <Input value={selectedZone.coordinates[0].lat.toFixed(6)} readOnly />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input value={selectedZone.coordinates[0].lon.toFixed(6)} readOnly />
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>

      {/* Add Zone Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        // Only allow closing via the Cancel button or ESC key
        if (open === false) {
          // Optional: Add confirmation if location is set
          if (newZone.coordinates?.[0]?.lat !== 0 && newZone.name) {
            if (confirm("Are you sure you want to close? Your zone data will be lost.")) {
              setShowAddDialog(false);
            }
            return;
          }
          setShowAddDialog(false);
        } else {
          setShowAddDialog(true);
        }
      }}>
        <DialogContent 
          className="sm:max-w-[650px] md:max-w-[700px] max-h-[90vh] overflow-y-auto z-[1000]"
          onPointerDownOutside={(e) => {
            // Prevent closing when clicking outside if we're in map interaction mode
            if (showAddDialog) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Add New Geolocation Zone</DialogTitle>
            <DialogDescription>
              Create a new attendance tracking zone by setting four coordinate points and capacity.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Name Input */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="name" className="sm:text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newZone.name}
                onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                className="col-span-1 sm:col-span-3"
              />
            </div>

            {/* Capacity Input */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="capacity" className="sm:text-right">
                Capacity
              </Label>
              <Input
                id="capacity"
                type="number"
                value={newZone.capacity}
                onChange={(e) => setNewZone({ ...newZone, capacity: parseInt(e.target.value) || 0 })}
                className="col-span-1 sm:col-span-3"
              />
            </div>

            {/* Radius Input */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="radius" className="sm:text-right">
                Radius (meters)
              </Label>
              <Input
                id="radius"
                type="number"
                min="10"
                max="1000"
                value={newZone.radius || 50}
                onChange={(e) => handleRadiusChange(parseInt(e.target.value) || 50)}
                className="col-span-1 sm:col-span-3"
              />
            </div>
            
            {/* Coordinates */}
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Coordinates 
                  {newZone.coordinates?.[0]?.lat !== 0 && (
                    <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                      Location Set
                    </span>
                  )}
                </Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  type="button" 
                  onClick={getUserLocation}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Use My Location
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`lat-${index}`}>Point {index + 1} - Latitude</Label>
                      <Input
                        id={`lat-${index}`}
                        value={newZone.coordinates?.[index]?.lat || 0}
                        onChange={(e) => {
                          const newCoordinates = [...(newZone.coordinates || [])]
                          newCoordinates[index] = {
                            ...newCoordinates[index],
                            lat: parseFloat(e.target.value) || 0
                          }
                          setNewZone({ ...newZone, coordinates: newCoordinates })
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lon-${index}`}>Point {index + 1} - Longitude</Label>
                      <Input
                        id={`lon-${index}`}
                        value={newZone.coordinates?.[index]?.lon || 0}
                        onChange={(e) => {
                          const newCoordinates = [...(newZone.coordinates || [])]
                          newCoordinates[index] = {
                            ...newCoordinates[index],
                            lon: parseFloat(e.target.value) || 0
                          }
                          setNewZone({ ...newZone, coordinates: newCoordinates })
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-2 px-1 py-3 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                <strong>Tip:</strong> Click on the map to set the center point of your zone, or use the "Use My Location" button.
                Adjust the radius to control the size of the geofence area.
              </p>
            </div>
          </div>
          <CardContent className="p-0 border rounded-md overflow-hidden">
            <div className="h-[250px] relative">
              <MapContainer
                center={mapCenter}
                zoom={16}
                style={{ height: "100%", width: "100%" }}
                attributionControl={false}
              >
                {/* Use the MapEvents component to handle map clicks */}
                <MapEvents onClick={handleMapClick} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <SetMapView center={mapCenter} />
                
                {/* Display marker for new zone location */}
                {newZone.coordinates?.[0]?.lat !== 0 && (
                  <>
                    <Marker position={[newZone?.coordinates?.[0]?.lat || 0, newZone?.coordinates?.[0]?.lon || 0]}>
                      <Popup>New Zone Location</Popup>
                    </Marker>
                    <Polygon
                      positions={newZone?.coordinates?.map(coord => [coord.lat, coord.lon]) || []}
                      pathOptions={{
                        color: "#10b981",
                        fillColor: "#10b981",
                        fillOpacity: 0.2,
                      }}
                    />
                  </>
                )}
              </MapContainer>
              <div className="absolute top-2 right-2 z-[500] bg-background/90 p-2 rounded-md shadow-md">
                <p className="text-xs font-medium text-primary">Click on the map to set location</p>
              </div>
            </div>
          </CardContent>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)} 
              className="w-full sm:w-auto"
              type="button"
            >
              Cancel
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                handleAddZone();
              }} 
              disabled={isAddingZone}
              className="w-full sm:w-auto"
              type="button"
            >
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

