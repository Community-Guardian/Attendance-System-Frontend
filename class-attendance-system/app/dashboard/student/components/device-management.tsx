"use client"

import type React from "react"

import { useState } from "react"
import { useUser } from "@/context/userContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Smartphone, Laptop, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DeviceManagement() {
  const { user, updateUser } = useUser()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [newMacAddress, setNewMacAddress] = useState("")

  // Mock data - replace with actual device data from your API
  const devices = [
    {
      id: "1",
      name: "iPhone 13",
      type: "mobile",
      macAddress: "00:11:22:33:44:55",
      lastUsed: "2024-02-17T10:30:00",
    },
    {
      id: "2",
      name: "MacBook Pro",
      type: "laptop",
      macAddress: "66:77:88:99:AA:BB",
      lastUsed: "2024-02-17T09:15:00",
    },
  ]

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateUser(user?.id || "", {
        mac_address: newMacAddress,
      })
      toast({
        title: "Device added",
        description: "New device has been registered successfully",
      })
      setNewMacAddress("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add device. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveDevice = async (deviceId: string) => {
    try {
      // Implement device removal logic
      toast({
        title: "Device removed",
        description: "Device has been removed successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove device. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Device</CardTitle>
          <CardDescription>Register a new device using its MAC address</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddDevice} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="macAddress">MAC Address</Label>
              <Input
                id="macAddress"
                placeholder="00:11:22:33:44:55"
                value={newMacAddress}
                onChange={(e) => setNewMacAddress(e.target.value)}
                pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Device
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Devices</CardTitle>
          <CardDescription>Manage your registered devices and MAC addresses</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>MAC Address</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {device.type === "mobile" ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                      {device.name}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{device.macAddress}</TableCell>
                  <TableCell>{new Date(device.lastUsed).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveDevice(device.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove device</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

