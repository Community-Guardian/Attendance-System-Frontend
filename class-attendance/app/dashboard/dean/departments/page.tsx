import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, User, BookOpen, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function DepartmentsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Departments</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Departments
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Faculty of Science & Technology
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Faculty Members
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              +3 from last semester
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground">
              -12 from last semester
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Attendance Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.3%</div>
            <p className="text-xs text-muted-foreground">
              +2.5% from last semester
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>
            Comprehensive view of all departments and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[
              {
                name: "Computer Science",
                hod: "Dr. Sarah Johnson",
                faculty: 32,
                students: 450,
                courses: 78,
                attendance: 92.7,
                trend: 1.2,
                increasing: true,
                status: "Excellent"
              },
              {
                name: "Engineering",
                hod: "Prof. Michael Chen",
                faculty: 37,
                students: 520,
                courses: 92,
                attendance: 89.4,
                trend: 0.8,
                increasing: true,
                status: "Good"
              },
              {
                name: "Business",
                hod: "Dr. Robert Wilson",
                faculty: 24,
                students: 410,
                courses: 65,
                attendance: 87.2,
                trend: -0.5,
                increasing: false,
                status: "Good"
              },
              {
                name: "Mathematics",
                hod: "Prof. Elizabeth Taylor",
                faculty: 18,
                students: 280,
                courses: 42,
                attendance: 86.1,
                trend: 1.7,
                increasing: true,
                status: "Good"
              },
              {
                name: "Social Sciences",
                hod: "Dr. James Peterson",
                faculty: 16,
                students: 320,
                courses: 47,
                attendance: 83.5,
                trend: -1.2,
                increasing: false,
                status: "Needs Improvement"
              }
            ].map((dept) => (
              <div key={dept.name} className="rounded-lg border p-4">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold">{dept.name}</h3>
                    <p className="text-sm text-muted-foreground">HOD: {dept.hod}</p>
                  </div>
                  <div>
                    <Badge className={
                      dept.status === "Excellent" ? "bg-green-500" :
                      dept.status === "Good" ? "bg-blue-500" :
                      "bg-yellow-500"
                    }>
                      {dept.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Faculty</p>
                      <p className="text-sm text-muted-foreground">{dept.faculty} members</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Students</p>
                      <p className="text-sm text-muted-foreground">{dept.students} enrolled</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Courses</p>
                      <p className="text-sm text-muted-foreground">{dept.courses} active</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Attendance</p>
                      <div className="flex items-center">
                        <span className="text-sm mr-1">{dept.attendance}%</span>
                        <div className={`flex items-center ${dept.increasing ? 'text-green-500' : 'text-red-500'}`}>
                          {dept.increasing ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          <span className="text-xs">{dept.trend}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Attendance Compliance</p>
                    <p className="text-sm font-medium">{dept.attendance}%</p>
                  </div>
                  <Progress value={dept.attendance} className="mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
