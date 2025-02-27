"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type GeolocationZone = {
  id: number
  name: string
  lat1: number
  lon1: number
  lat2: number
  lon2: number
  lat3: number
  lon3: number
  lat4: number
  lon4: number
}

const initialZones: GeolocationZone[] = [
  { id: 1, name: "Main Campus", lat1: 40.7128, lon1: -74.006, lat2: 40.7130, lon2: -74.005, lat3: 40.7140, lon3: -74.004, lat4: 40.7150, lon4: -74.003 },
  { id: 2, name: "Science Building", lat1: 40.7138, lon1: -74.007, lat2: 40.7145, lon2: -74.006, lat3: 40.7152, lon3: -74.005, lat4: 40.7160, lon4: -74.004 },
]

export function GeolocationSettings() {
  const [zones, setZones] = useState<GeolocationZone[]>(initialZones)
  const [newZone, setNewZone] = useState<Omit<GeolocationZone, "id">>({
    name: "",
    lat1: 0,
    lon1: 0,
    lat2: 0,
    lon2: 0,
    lat3: 0,
    lon3: 0,
    lat4: 0,
    lon4: 0,
  })

  const handleAddZone = () => {
    if (newZone.name) {
      setZones([...zones, { ...newZone, id: zones.length + 1 }])
      setNewZone({ name: "", lat1: 0, lon1: 0, lat2: 0, lon2: 0, lat3: 0, lon3: 0, lat4: 0, lon4: 0 })
    }
  }

  const handleDeleteZone = (id: number) => {
    setZones(zones.filter((zone) => zone.id !== id))
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Lat1</TableHead>
            <TableHead>Lon1</TableHead>
            <TableHead>Lat2</TableHead>
            <TableHead>Lon2</TableHead>
            <TableHead>Lat3</TableHead>
            <TableHead>Lon3</TableHead>
            <TableHead>Lat4</TableHead>
            <TableHead>Lon4</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {zones.map((zone) => (
            <TableRow key={zone.id}>
              <TableCell>{zone.name}</TableCell>
              <TableCell>{zone.lat1}</TableCell>
              <TableCell>{zone.lon1}</TableCell>
              <TableCell>{zone.lat2}</TableCell>
              <TableCell>{zone.lon2}</TableCell>
              <TableCell>{zone.lat3}</TableCell>
              <TableCell>{zone.lon3}</TableCell>
              <TableCell>{zone.lat4}</TableCell>
              <TableCell>{zone.lon4}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDeleteZone(zone.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Add New Zone</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Geolocation Zone</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>Name</Label>
            <Input value={newZone.name} onChange={(e) => setNewZone({ ...newZone, name: e.target.value })} />

            {["lat1", "lon1", "lat2", "lon2", "lat3", "lon3", "lat4", "lon4"].map((field) => (
              <div key={field} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={field} className="text-right">
                  {field.toUpperCase()}
                </Label>
                <Input
                  id={field}
                  type="number"
                  value={newZone[field as keyof GeolocationZone] as number}
                  onChange={(e) => setNewZone({ ...newZone, [field]: Number.parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
            ))}
          </div>
          <Button onClick={handleAddZone}>Add Zone</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
