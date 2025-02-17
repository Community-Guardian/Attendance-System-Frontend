"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function SecuritySettings() {
  const { changePassword } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [passwords, setPasswords] = useState({
    newPassword1: "",
    newPassword2: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await changePassword(passwords.newPassword1, passwords.newPassword2)
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      })
      setPasswords({ newPassword1: "", newPassword2: "" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword1">New Password</Label>
            <Input
              id="newPassword1"
              type="password"
              value={passwords.newPassword1}
              onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword1: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword2">Confirm New Password</Label>
            <Input
              id="newPassword2"
              type="password"
              value={passwords.newPassword2}
              onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword2: e.target.value }))}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Change Password
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}

