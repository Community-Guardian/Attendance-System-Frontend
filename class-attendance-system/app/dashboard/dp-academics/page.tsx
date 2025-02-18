import type { Metadata } from "next"
import { Activity, Book, School, BarChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// import { InstitutionOverview } from "@/components/institution-overview"
// import { AttendanceReports } from "@/components/attendance-reports"
// import { CatConformanceReports } from "@/components/cat-conformance-reports"

export const metadata: Metadata = {
  title: "DP Academics Dashboard",
  description: "Deputy Principal Academics dashboard for the Class Attendance System.",
}

export default function DPAcademicsDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Welcome, [DP Academics Name]</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CAT Conformance</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <Button size="sm" className="mt-2">
              View Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Institution Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <InstitutionOverview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Attendance Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceReports />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CAT Conformance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <CatConformanceReports />
        </CardContent>
      </Card> */}
    </div> 
  )
}

