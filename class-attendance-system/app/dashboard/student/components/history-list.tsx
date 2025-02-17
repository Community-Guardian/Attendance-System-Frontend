"use client"

import { useReports } from "@/context/ReportContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface HistoryListProps {
  searchTerm: string
  dateFilter: string
  statusFilter: string
}

export function HistoryList({ searchTerm, dateFilter, statusFilter }: HistoryListProps) {
  const { studentAttendanceHistory } = useReports()

  const filteredHistory = studentAttendanceHistory.filter((history) => {
    const matchesSearch = !searchTerm || history.session.course?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      !statusFilter ||
      statusFilter === "all" ||
      (statusFilter === "signed" && history.signed_by_lecturer) ||
      (statusFilter === "unsigned" && !history.signed_by_lecturer)

    const matchesDate = () => {
      if (!dateFilter) return true
      const date = new Date(history.timestamp)
      const now = new Date()
      switch (dateFilter) {
        case "today":
          return date.toDateString() === now.toDateString()
        case "week":
          const weekAgo = new Date(now.setDate(now.getDate() - 7))
          return date >= weekAgo
        case "month":
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
          return date >= monthAgo
        case "semester":
          const semesterAgo = new Date(now.setMonth(now.getMonth() - 4))
          return date >= semesterAgo
        default:
          return true
      }
    }

    return matchesSearch && matchesStatus && matchesDate()
  })

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Verification</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredHistory.map((history) => (
            <TableRow key={history.id}>
              <TableCell>{new Date(history.timestamp).toLocaleString()}</TableCell>
              <TableCell>{history.session.course?.name}</TableCell>
              <TableCell>
                {new Date(history.session?.start_time || "").toLocaleTimeString()} -{" "}
                {new Date(history.session?.end_time || "").toLocaleTimeString()}
              </TableCell>
              <TableCell>
                {history.signed_by_lecturer ? (
                  <div className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    <span className="text-sm">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <XCircle className="mr-2 h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Pending</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={history.signed_by_lecturer ? "default" : "secondary"}>
                  {history.signed_by_lecturer ? "Signed" : "Unsigned"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

