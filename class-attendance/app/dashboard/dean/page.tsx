import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Users, BookOpen, Calendar, Clock, Activity, FileText, Settings } from 'lucide-react'

export default function DeanDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dean Dashboard</h2>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Attendance Analytics</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Departments
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  All actively reporting
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Faculty Attendance
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground">
                  +2.5% from last semester
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
                  Across all departments
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  CAT Week Status
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Week 2</div>
                <p className="text-xs text-muted-foreground">
                  CAT compliance enforced
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Faculty Performance</CardTitle>
                <CardDescription>
                  Comparison of attendance metrics across departments
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <p className="text-sm text-muted-foreground">Faculty performance chart</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
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
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Policy Compliance</CardTitle>
                <CardDescription>
                  Key policy metrics across the faculty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { policy: "Attendance Recording", rate: 94 },
                    { policy: "CAT Week Adherence", rate: 88 },
                    { policy: "Timetable Compliance", rate: 92 },
                    { policy: "Make-up Classes", rate: 76 }
                  ].map((item) => (
                    <div key={item.policy} className="flex items-center justify-between">
                      <div className="text-sm">{item.policy}</div>
                      <div className="font-medium">{item.rate}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>
                  Requiring your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { text: "Review department reports", priority: "High", icon: FileText },
                    { text: "Sign off on policy updates", priority: "Medium", icon: Settings },
                    { text: "Address low attendance in Social Sciences", priority: "High", icon: Activity },
                    { text: "Faculty performance reviews pending", priority: "Medium", icon: Users }
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <div key={i} className="flex items-start">
                        <Icon className="h-5 w-5 mr-2 text-primary" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.text}</div>
                          <div className="text-xs text-muted-foreground">Priority: {item.priority}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Trends</CardTitle>
              <CardDescription>
                Semester-long attendance patterns across the faculty
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-sm text-muted-foreground">Attendance trends chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { dept: "Computer Science", action: "New attendance policy implemented", time: "2 hours ago" },
                  { dept: "Engineering", action: "CAT week schedule adjustment", time: "5 hours ago" },
                  { dept: "Business", action: "Attendance compliance improved by 4%", time: "Yesterday, 14:30" },
                  { dept: "Mathematics", action: "New course added to catalog", time: "Yesterday, 10:15" },
                  { dept: "Social Sciences", action: "Attendance intervention initiated", time: "2 days ago" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 mr-2" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.dept}: {item.action}</div>
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
