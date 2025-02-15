"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

export function SystemDataUpdate() {
  const [dataType, setDataType] = useState("")
  const [dataContent, setDataContent] = useState("")

  const handleDataUpdate = async () => {
    if (!dataType || !dataContent) {
      toast({
        title: "Missing Information",
        description: "Please provide both data type and content.",
        variant: "destructive",
      })
      return
    }

    // Here you would typically send a request to your backend
    // to update the system data
    console.log("Updating system data:", { dataType, dataContent })

    toast({
      title: "System Data Updated",
      description: `${dataType} data has been updated successfully.`,
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Update System Data</h3>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="dataType">Data Type</Label>
        <Input
          type="text"
          id="dataType"
          value={dataType}
          onChange={(e) => setDataType(e.target.value)}
          placeholder="e.g., courses, students, lecturers"
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="dataContent">Data Content</Label>
        <Textarea
          id="dataContent"
          value={dataContent}
          onChange={(e) => setDataContent(e.target.value)}
          placeholder="Enter data in JSON format"
          rows={10}
        />
      </div>
      <Button onClick={handleDataUpdate}>Update Data</Button>
    </div>
  )
}

