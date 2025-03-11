"use client"

import { useState } from "react"
import { BarChart3, Download, Filter } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for policy impact analysis
const policyImpactData = [
  {
    name: "Attendance Policy",
    beforeImplementation: 72,
    afterImplementation: 85,
    percentageChange: 18.1,
  },
  {
    name: "Late Submission",
    beforeImplementation: 65,
    afterImplementation: 78,
    percentageChange: 20.0,
  },
  {
    name: "Exam Preparation",
    beforeImplementation: 68,
    afterImplementation: 74,
    percentageChange: 8.8,
  },
  {
    name: "Office Hours",
    beforeImplementation: 45,
    afterImplementation: 62,
    percentageChange: 37.8,
  },
  {
    name: "Feedback Turnaround",
    beforeImplementation: 58,
    afterImplementation: 70,
    percentageChange: 20.7,
  },
]

// Mock data for department comparison
const departmentComparisonData = [
  { name: "Computer Science", policyAdherence: 92, studentSatisfaction: 85, academicImprovement: 78 },
  { name: "Engineering", policyAdherence: 88, studentSatisfaction: 82, academicImprovement: 75 },
  { name: "Business", policyAdherence: 85, studentSatisfaction: 80, academicImprovement: 72 },
  { name: "Medicine", policyAdherence: 95, studentSatisfaction: 88, academicImprovement: 82 },
  { name: "Arts", policyAdherence: 80, studentSatisfaction: 78, academicImprovement: 70 },
]

export default function PolicyImpactPage() {
  const [selectedYear, setSelectedYear] = useState("2023")
  const [selectedSemester, setSelectedSemester] = useState("all")

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Impact Analysis</h1>
          <p className="text-muted-foreground">
            Analyze the impact of academic policies on student performance and engagement
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              <SelectItem value="1">Semester 1</SelectItem>
              <SelectItem value="2">Semester 2</SelectItem>
              <SelectItem value="3">Semester 3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Department Comparison</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Policy Effectiveness</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.5%</div>
                <p className="text-xs text-muted-foreground">+15.2% from previous year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Student Satisfaction</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82.3%</div>
                <p className="text-xs text-muted-foreground">+8.7% from previous year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Academic Performance</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76.8%</div>
                <p className="text-xs text-muted-foreground">+12.4% from previous year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty Adoption</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">+5.8% from previous year</p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Policy Impact Comparison</CardTitle>
              <CardDescription>
                Before and after implementation metrics for key academic policies
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer
                config={{
                  beforeImplementation: {
                    label: "Before Implementation",
                    color: "hsl(var(--chart-1))",
                  },
                  afterImplementation: {
                    label: "After Implementation",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={policyImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="beforeImplementation" fill="var(--color-beforeImplementation)" name="Before Implementation" />
                    <Bar dataKey="afterImplementation" fill="var(--color-afterImplementation)" name="After Implementation" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Department Policy Comparison</CardTitle>
              <CardDescription>
                Comparing policy effectiveness across different departments
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer
                config={{
                  policyAdherence: {
                    label: "Policy Adherence",
                    color: "hsl(var(--chart-1))",
                  },
                  studentSatisfaction: {
                    label: "Student Satisfaction",
                    color: "hsl(var(--chart-2))",
                  },
                  academicImprovement: {
                    label: "Academic Improvement",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="policyAdherence" fill="var(--color-policyAdherence)" name="Policy Adherence" />
                    <Bar dataKey="studentSatisfaction" fill="var(--color-studentSatisfaction)" name="Student Satisfaction" />
                    <Bar dataKey="academicImprovement" fill="var(--color-academicImprovement)" name="Academic Improvement" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Policy Impact Trends</CardTitle>
              <CardDescription>
                Analyzing policy impact trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Trend analysis data will be available in the next update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
