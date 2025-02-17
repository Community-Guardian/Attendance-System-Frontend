"use client"

import { useReports } from "@/context/ReportContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { CartesianGrid, Line, LineChart, Pie, PieChart, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface AnalyticsModalProps {
  open: boolean
  onClose: () => void
}

export function AnalyticsModal({ open, onClose }: AnalyticsModalProps) {
  const { studentAttendanceHistory } = useReports()

  // Prepare data for attendance over time
  const timelineData = studentAttendanceHistory.reduce(
    (acc, history) => {
      const date = new Date(history.timestamp).toLocaleDateString()
      const existing = acc.find((item) => item.date === date)
      if (existing) {
        existing.sessions++
        if (history.signed_by_lecturer) existing.verified++
      } else {
        acc.push({
          date,
          sessions: 1,
          verified: history.signed_by_lecturer ? 1 : 0,
        })
      }
      return acc
    },
    [] as { date: string; sessions: number; verified: number }[],
  )

  // Prepare data for verification status
  const verificationData = studentAttendanceHistory.reduce(
    (acc, history) => {
      const status = history.signed_by_lecturer ? "Verified" : "Pending"
      const existing = acc.find((item) => item.status === status)
      if (existing) {
        existing.value++
      } else {
        acc.push({ status, value: 1 })
      }
      return acc
    },
    [] as { status: string; value: number }[],
  )

  const chartConfig = {
    xAxis: {
      label: "Date",
    },
    yAxis: {
      label: "Sessions",
    },
    tooltip: {
      label: "Value",
    },
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Attendance Analytics</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-medium">Attendance Timeline</h3>
            <ChartContainer config={chartConfig} className="h-[200px]">
            <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" name="Total Sessions" />
                <Line type="monotone" dataKey="verified" stroke="hsl(var(--secondary))" name="Verified Sessions" />
              </LineChart>
            </ChartContainer>
          </Card>
          <Card className="p-4">
            <h3 className="mb-4 text-sm font-medium">Verification Status</h3>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <PieChart>
                <Pie
                  data={verificationData}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  label
                />
                <Tooltip />
              </PieChart>
            </ChartContainer>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

