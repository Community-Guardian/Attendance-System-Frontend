import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, ArrowUpRight, ArrowDownRight, BarChart2, Trophy, Scale } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function BenchmarkingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Benchmarking</h2>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faculty Attendance Ranking
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#2</div>
            <p className="text-xs text-muted-foreground">
              Among 5 faculties in the university
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              National Ranking
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#8</div>
            <div className="flex items-center text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span className="text-xs">Up 3 positions from last year</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Regional Average Comparison
            </CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5.2%</div>
            <div className="flex items-center text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span className="text-xs">Above regional average</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList>
          <TabsTrigger value="comparison">Institutional Comparison</TabsTrigger>
          <TabsTrigger value="historical">Historical Performance</TabsTrigger>
          <TabsTrigger value="insights">Competitive Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rate Comparison</CardTitle>
              <CardDescription>
                How we compare to peer institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[
                  {
                    name: "National University",
                    attendance: 89.5,
                    difference: 2.2,
                    better: true,
                    rank: "#1 Nationally"
                  },
                  {
                    name: "Our Institution",
                    attendance: 87.3,
                    difference: 0,
                    better: true,
                    rank: "#8 Nationally",
                    current: true
                  },
                  {
                    name: "Central University",
                    attendance: 85.7,
                    difference: 1.6,
                    better: false,
                    rank: "#12 Nationally"
                  },
                  {
                    name: "Eastern College",
                    attendance: 83.9,
                    difference: 3.4,
                    better: false,
                    rank: "#15 Nationally"
                  },
                  {
                    name: "Western Institute",
                    attendance: 82.5,
                    difference: 4.8,
                    better: false,
                    rank: "#22 Nationally"
                  },
                  {
                    name: "Regional Average",
                    attendance: 82.1,
                    difference: 5.2,
                    better: false,
                    rank: "Benchmark"
                  }
                ].map((inst) => (
                  <div key={inst.name} className={`rounded-lg ${inst.current ? 'border-2 border-primary bg-primary/5' : 'border'} p-4`}>
                    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                      <div>
                        <h3 className={`text-lg font-semibold ${inst.current ? 'text-primary' : ''}`}>{inst.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {inst.rank}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{inst.attendance}%</div>
                        {inst.name !== "Our Institution" && (
                          <div className={`flex items-center justify-end ${inst.better ? 'text-red-500' : 'text-green-500'}`}>
                            {inst.better ? (
                              <>
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                <span className="text-xs">{inst.difference}% higher</span>
                              </>
                            ) : (
                              <>
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                                <span className="text-xs">{inst.difference}% lower</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Progress value={inst.attendance} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics Comparison</CardTitle>
              <CardDescription>
                How different attendance metrics compare to peers
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-sm text-muted-foreground">Metrics comparison chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance Tracking</CardTitle>
              <CardDescription>
                How our attendance benchmarks have changed over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                <p className="text-sm text-muted-foreground">Historical performance chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Insights</CardTitle>
              <CardDescription>
                Learning from top performing institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    institution: "National University",
                    insight: "Mandatory attendance tracking via mobile app",
                    impact: "Estimated +4.5% attendance boost"
                  },
                  {
                    institution: "Central University",
                    insight: "Integrated attendance with continuous assessment",
                    impact: "Estimated +3.2% attendance boost"
                  },
                  {
                    institution: "Western Institute",
                    insight: "Peer accountability system",
                    impact: "Estimated +2.8% attendance boost"
                  }
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex flex-col space-y-2 md:flex-row md:items-start md:justify-between md:space-y-0">
                      <div>
                        <span className="text-sm text-muted-foreground">From</span>
                        <h3 className="text-lg font-semibold">{item.institution}</h3>
                      </div>
                      <Badge className="bg-green-500">
                        {item.impact}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm font-medium">{item.insight}</p>
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
