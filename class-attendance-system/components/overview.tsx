"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Mon", attendance: 95 },
  { name: "Tue", attendance: 85 },
  { name: "Wed", attendance: 92 },
  { name: "Thu", attendance: 88 },
  { name: "Fri", attendance: 90 },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip contentStyle={{ background: "#f3f4f6", border: "none" }} labelStyle={{ fontWeight: "bold" }} />
        <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

