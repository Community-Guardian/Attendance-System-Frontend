import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Course A", students: 120, attendance: 90 },
  { name: "Course B", students: 98, attendance: 85 },
  { name: "Course C", students: 86, attendance: 95 },
  { name: "Course D", students: 99, attendance: 88 },
  { name: "Course E", students: 85, attendance: 92 },
]

export function DepartmentOverview() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="students" fill="#8884d8" name="Students" />
        <Bar yAxisId="right" dataKey="attendance" fill="#82ca9d" name="Attendance %" />
      </BarChart>
    </ResponsiveContainer>
  )
}

