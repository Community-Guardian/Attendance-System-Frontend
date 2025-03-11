import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, TrendingUp, TrendingDown, Zap, Goal, Calendar, AlertCircle } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function PredictiveAnalysisPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Predictive Analysis</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Predicted End of Term Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2%</div>
            <div className="flex items-center text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs">+1.9% from current</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Predicted At-Risk Courses
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <div className="flex items-center text-red-500">
              <TrendingDown className="h-4 w-4 mr-1" />
              <span className="text-xs">Below 75% attendance</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Forecasted Improvement
            </CardTitle>
            <Goal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.5%</div>
            <div className="flex items-center text-blue-500">
              <Zap className="h-4 w-4 mr-1" />
              <span className="text-xs">With recommended interventions</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecast">Attendance Forecast</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="interventions">Recommended Interventions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Forecast by Department</CardTitle>
              <CardDescription>
                Projected end-of-term attendance rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  {
                    name: "Computer Science",
                    current: 92.7,
                    projected: 94.3,
                    change: 1.6,
                    increasing: true,
                    confidence: "High"
                  },
                  {
                    name: "Engineering",
                    current: 89.4,
                    projected: 91.8,
                    change: 2.4,
                    increasing: true,
                    confidence: "High"
                  },
                  {
                    name: "Business",
                    current: 87.2,
                    projected: 88.5,
                    change: 1.3,
                    increasing: true,
                    confidence: "Medium"
                  },
                  {
                    name: "Mathematics",
                    current: 86.1,
                    projected: 87.9,
                    change: 1.8,
                    increasing: true,
                    confidence: "Medium"
                  },
                  {
                    name: "Social Sciences",
                    current: 83.5,
                    projected: 85.2,
                    change: 1.7,
                    increasing: true,
                    confidence: "Low"
                  }
                ].map((dept) => (
                  <div key={dept.name} className="rounded-lg border p-4">
                    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                      <div>
                        <h3 className="text-lg font-semibold">{dept.name}</h3>
                        <Badge variant="outline" className={
                          dept.confidence === "High" ? "border-green-500 text-green-500" :
                          dept.confidence === "Medium" ? "border-blue-500 text-blue-500" :
                          "border-yellow-500 text-yellow-500"
                        }>
                          {dept.confidence} Confidence
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{dept.projected}%</div>
                        <div className="flex items-center justify-end text-green-500">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">+{dept.change}% from current</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-muted-foreground w-16">Current</span>
                      <div className="flex-1 mx-2">
                        <Progress value={dept.current} className="h-2" />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{dept.current}%</span>
                    </div>
                    
                    <div className="mt-2 flex items-center">
                      <span className="text-sm text-muted-foreground w-16">Projected</span>
                      <div className="flex-1 mx-2">
                        <Progress value={dept.projected} className="h-2 bg-muted/50" />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{dept.projected}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Term-End Projection Model</CardTitle>
              <CardDescription>
                Visualization of predictive model and confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-sm text-muted-foreground">Projection model visualization</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>At-Risk Courses</CardTitle>
              <CardDescription>
                Courses predicted to have attendance issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    code: "MATH301", 
                    name: "Advanced Calculus", 
                    department: "Mathematics",
                    current: 74.2, 
                    projected: 72.1, 
                    risk: "High" 
                  },
                  { 
                    code: "BUS220", 
                    name: "Organizational Behavior", 
                    department: "Business",
                    current: 76.3, 
                    projected: 73.8, 
                    risk: "High" 
                  },
                  { 
                    code: "SOC105", 
                    name: "Introduction to Sociology", 
                    department: "Social Sciences",
                    current: 75.1, 
                    projected: 73.5, 
                    risk: "High" 
                  },
                  { 
                    code: "CS450", 
                    name: "Advanced Algorithms", 
                    department: "Computer Science",
                    current: 78.4, 
                    projected: 75.3, 
                    risk: "Medium" 
                  },
                  { 
                    code: "ENG340", 
                    name: "Fluid Mechanics", 
                    department: "Engineering",
                    current: 79.2, 
                    projected: 76.8, 
                    risk: "Medium" 
                  }
                ].map((course) => (
                  <div key={course.code} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-sm font-semibold">{course.code}: {course.name}</h3>
                          <Badge className={
                            course.risk === "High" ? "ml-2 bg-red-500" : 
                            course.risk === "Medium" ? "ml-2 bg-yellow-500" : 
                            "ml-2 bg-blue-500"
                          }>
                            {course.risk} Risk
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{course.department}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{course.projected}%</div>
                        <div className="flex items-center justify-end text-red-500">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          <span className="text-xs">-{(course.current - course.projected).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Progress value={course.projected} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Risk Factors</CardTitle>
              <CardDescription>
                Common factors in low attendance courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { factor: "Early Morning Schedule (Before 9AM)", impact: "High", occurrence: 68 },
                  { factor: "Friday Afternoon Classes", impact: "High", occurrence: 72 },
                  { factor: "Large Class Size (100+ Students)", impact: "Medium", occurrence: 55 },
                  { factor: "Required Non-Major Courses", impact: "Medium", occurrence: 63 },
                  { factor: "Back-to-Back 3-Hour Sessions", impact: "High", occurrence: 81 }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{item.factor}</div>
                      <Badge variant="outline" className={
                        item.impact === "High" ? "mt-1 border-red-500 text-red-500" :
                        item.impact === "Medium" ? "mt-1 border-yellow-500 text-yellow-500" :
                        "mt-1 border-blue-500 text-blue-500"
                      }>
                        {item.impact} Impact
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.occurrence}%</div>
                      <div className="text-xs text-muted-foreground">of at-risk courses</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interventions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Interventions</CardTitle>
              <CardDescription>
                Actions to improve attendance based on predictive analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    title: "Schedule Optimization",
                    description: "Reduce early morning and Friday afternoon classes for high-risk courses. Prioritize mid-morning slots for at-risk courses.",
                    impact: "High",
                    timeframe: "Next Semester",
                    departments: ["Social Sciences", "Mathematics"]
                  },
                  {
                    title: "Attendance Incentive Program",
                    description: "Implement a rewards system for consistent attendance in at-risk courses. Consider small grade bonuses or priority registration.",
                    impact: "Medium",
                    timeframe: "Immediate",
                    departments: ["Business", "Social Sciences"]
                  },
                  {
                    title: "Mid-week Check-ins",
                    description: "Add brief required check-in sessions or online activities between classes to maintain engagement.",
                    impact: "Medium",
                    timeframe: "2 Weeks",
                    departments: ["All Departments"]
                  },
                  {
                    title: "Course Format Revision",
                    description: "Break up 3-hour sessions into shorter blocks with interactive components. Consider hybrid formats for certain courses.",
                    impact: "High",
                    timeframe: "Next Semester",
                    departments: ["Engineering", "Mathematics"]
                  }
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex flex-col space-y-2 md:flex-row md:items-start md:justify-between md:space-y-0">
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <div className="flex items-center flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className={
                            item.impact === "High" ? "border-green-500 text-green-500" :
                            "border-blue-500 text-blue-500"
                          }>
                            {item.impact} Impact
                          </Badge>
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {item.timeframe}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="mt-3 text-sm">{item.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground">Target departments:</span>
                      {item.departments.map((dept) => (
                        <Badge key={dept} variant="secondary" className="text-xs">
                          {dept}
                        </Badge>
                      ))}
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
