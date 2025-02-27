"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type LogEntry = {
  id: number
  timestamp: string
  level: "info" | "warning" | "error"
  message: string
}

const initialLogs: LogEntry[] = [
  { id: 1, timestamp: "2023-06-15 10:30:00", level: "info", message: "User login successful" },
  { id: 2, timestamp: "2023-06-15 11:45:00", level: "warning", message: "Failed login attempt" },
  { id: 3, timestamp: "2023-06-15 14:20:00", level: "error", message: "Database connection failed" },
]

export function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs)
  const [filterLevel, setFilterLevel] = useState<"info" | "warning" | "error" | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLogs = logs.filter((log) => {
    const levelMatch = filterLevel === "all" || log.level === filterLevel
    const searchMatch = log.message.toLowerCase().includes(searchTerm.toLowerCase())
    return levelMatch && searchMatch
  })

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="search">Search Logs</Label>
          <Input
            id="search"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="level-filter">Filter by Level</Label>
          <Select onValueChange={(value: "info" | "warning" | "error" | "all") => setFilterLevel(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Message</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.timestamp}</TableCell>
              <TableCell>{log.level}</TableCell>
              <TableCell>{log.message}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

