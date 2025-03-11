import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Filter, Printer, Calendar, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DeanReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="default" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select defaultValue="current">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Semester</SelectItem>
            <SelectItem value="previous">Previous Semester</SelectItem>
            <SelectItem value="yearly">Yearly Report</SelectItem>
          </SelectContent>
        </Select>
        
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="cs">Computer Science</SelectItem>
            <SelectItem value="eng">Engineering</SelectItem>
            <SelectItem value="bus">Business</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
            <SelectItem value="ss">Social Sciences</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>
                Overall faculty performance for current semester
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">Key Findings</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Overall attendance rate across all departments is 87.3%</li>
                  <li>Computer Science department shows highest attendance compliance at 92.7%</li>
                  <li>Social Sciences department requires attention with 83.5% attendance</li>
                  <li>Morning classes show highest attendance rates</li>
                  <li>CAT week compliance is high across all departments at 91.5%</li>
                </ul>
              </div>
              
              <div className="rounded-lg bg-muted p-4">
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Implement attendance improvement plan for Social Sciences department</li>
                  <li>Recognize Computer Science department for exemplary attendance policy enforcement</li>
                  <li>Consider schedule optimization for afternoon classes</li>
                  <li>Continue current CAT week enforcement policies</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Report generated on March 10, 2025
              </p>
            </CardFooter>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Rankings</CardTitle>
                <CardDescription>
                  Based on attendance compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Computer Science", score: 92.7 },
                    { name: "Engineering", score: 89.4 },
                    { name: "Business", score: 87.2 },
                    { name: "Mathematics", score: 86.1 },
                    { name: "Social Sciences", score: 83.5 }
                  ].map((dept, i) => (
                    <div key={dept.name} className="flex items-center">
                      <div className="font-medium w-8 text-center">{i + 1}</div>
                      <div className="ml-2 flex-1">{dept.name}</div>
                      <div className="font-semibold">{dept.score}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>
                  Download detailed reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Semester Attendance Summary", date: "Mar 10, 2025", type: "PDF" },
                    { title: "Department Performance", date: "Mar 8, 2025", type: "XLSX" },
                    { title: "CAT Week Compliance", date: "Mar 5, 2025", type: "PDF" },
                    { title: "Lecturer Performance", date: "Mar 1, 2025", type: "PDF" },
                    { title: "Attendance Trends", date: "Feb 25, 2025", type: "XLSX" }
                  ].map((report, i) => (
                    <div key={i} className="flex items-start">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{report.title}</div>
                        <div className="text-xs text-muted-foreground">Generated: {report.date} | {report.type}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Attendance Report</CardTitle>
              <CardDescription>
                Comprehensive analysis across all departments
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-sm text-muted-foreground">Detailed attendance report chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Compliance Report</CardTitle>
              <CardDescription>
                Analysis of adherence to attendance policies
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-sm text-muted-foreground">Policy compliance report chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends Report</CardTitle>
              <CardDescription>
                Historical analysis and pattern identification
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[500px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-sm text-muted-foreground">Attendance trends report chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
