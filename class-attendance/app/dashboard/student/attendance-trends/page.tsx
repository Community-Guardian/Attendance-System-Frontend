import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AttendanceTrendsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Trends</h1>
        <p className="text-muted-foreground">Analyze your attendance patterns over time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-green-500" style={{ width: "87%" }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Target: 90%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42/48</div>
            <p className="text-xs text-muted-foreground">6 classes missed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <div className="mt-4 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: "92%" }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lowest Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Software Engineering (CS302)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Attendance by Course</CardTitle>
                <CardDescription>Your attendance rate for each course</CardDescription>
              </div>
              <Select defaultValue="semester">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Current Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semester">Current Semester</SelectItem>
                  <SelectItem value="year">Academic Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Database Systems (CS301)</p>
                    <p className="text-xs text-muted-foreground">12/12 classes attended</p>
                  </div>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "100%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Software Engineering (CS302)</p>
                    <p className="text-xs text-muted-foreground">9/12 classes attended</p>
                  </div>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: "75%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Web Development (IT301)</p>
                    <p className="text-xs text-muted-foreground">11/12 classes attended</p>
                  </div>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "92%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Mobile App Development (IT302)</p>
                    <p className="text-xs text-muted-foreground">10/12 classes attended</p>
                  </div>
                  <span className="text-sm font-medium">83%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: "83%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance</CardTitle>
            <CardDescription>Your attendance pattern by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end gap-2">
              <div className="relative flex h-full w-full flex-col justify-end">
                <div className="absolute -left-4 bottom-0 top-0 flex w-6 flex-col justify-between text-xs text-muted-foreground">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                <div className="flex h-full items-end gap-2 pl-6">
                  <div className="w-full">
                    <div className="bg-blue-500 h-[90%] w-8 rounded-t-md" />
                    <p className="mt-2 text-center text-xs">Mon</p>
                  </div>
                  <div className="w-full">
                    <div className="bg-blue-500 h-[100%] w-8 rounded-t-md" />
                    <p className="mt-2 text-center text-xs">Tue</p>
                  </div>
                  <div className="w-full">
                    <div className="bg-blue-500 h-[80%] w-8 rounded-t-md" />
                    <p className="mt-2 text-center text-xs">Wed</p>
                  </div>
                  <div className="w-full">
                    <div className="bg-blue-500 h-[95%] w-8 rounded-t-md" />
                    <p className="mt-2 text-center text-xs">Thu</p>
                  </div>
                  <div className="w-full">
                    <div className="bg-blue-500 h-[70%] w-8 rounded-t-md" />
                    <p className="mt-2 text-center text-xs">Fri</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance by Time</CardTitle>
            <CardDescription>Your attendance rate by class time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Morning (8:00 - 12:00)</p>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-green-500" style={{ width: "95%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Afternoon (12:00 - 16:00)</p>
                  <span className="text-sm font-medium">80%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: "80%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Evening (16:00 - 20:00)</p>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

