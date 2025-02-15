"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const dummyData = [
  { department: "Computer Science", conformance: 95 },
  { department: "Electrical Engineering", conformance: 92 },
  { department: "Mechanical Engineering", conformance: 88 },
  { department: "Civil Engineering", conformance: 90 },
  { department: "Chemical Engineering", conformance: 93 },
]

export function CatConformanceReport({ role }: { role: "hod" | "dp_academics" }) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  const filteredData = selectedDepartment
    ? dummyData.filter((item) => item.department === selectedDepartment)
    : dummyData

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">CAT Conformance Report</h3>
      {role === "dp_academics" && (
        <div className="flex items-center space-x-2">
          <Select onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              {dummyData.map((item) => (
                <SelectItem key={item.department} value={item.department}>
                  {item.department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setSelectedDepartment(null)}>Show All</Button>
        </div>
      )}
      <Table>
        <TableCaption>CAT Conformance Report</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Department</TableHead>
            <TableHead>Conformance (%)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.department}>
              <TableCell>{item.department}</TableCell>
              <TableCell>{role === "hod" ? `${item.conformance}%` : "XX%"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

