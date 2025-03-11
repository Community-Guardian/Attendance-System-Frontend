"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const cohortData = {
  "2023": [
    { name: "High Performers", value: 30 },
    { name: "Average Performers", value: 50 },
    { name: "Low Performers", value: 20 },
  ],
  "2022": [
    { name: "High Performers", value: 25 },
    { name: "Average Performers", value: 55 },
    { name: "Low Performers", value: 20 },
  ],
  "2021": [
    { name: "High Performers", value: 35 },
    { name: "Average Performers", value: 45 },
    { name: "Low Performers", value: 20 },
  ],
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export default function StudentCohortsPage() {
  const [selectedYear, setSelectedYear] = useState("2023")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Student Cohorts Analysis</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Distribution</CardTitle>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>Student performance categories for {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cohortData[selectedYear]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {cohortData[selectedYear].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Add more analysis components here, such as trend analysis or comparative views */}
    </div>
  )
}
