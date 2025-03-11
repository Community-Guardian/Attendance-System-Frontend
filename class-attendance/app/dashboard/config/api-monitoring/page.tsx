'use client'

import { useState, useEffect } from 'react'
import { Activity, AlertTriangle, CheckCircle2, Clock, Database, Download, RefreshCw, Server, Zap } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

// Define types for API monitoring data
interface ApiEndpoint {
  id: string
  name: string
  path: string
  method: string
  status: 'healthy' | 'degraded' | 'down'
  responseTime: number
  successRate: number
  errorRate: number
  requestCount: number
}

interface SystemMetric {
  id: string
  name: string
  value: number
  unit: string
  status: 'healthy' | 'warning' | 'critical'
}

interface TimeSeriesData {
  timestamp: string
  value: number
}

export default function ApiMonitoringPage() {
  const [timeRange, setTimeRange] = useState('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()

  // Mock data for API endpoints
  const apiEndpoints: ApiEndpoint[] = [
    {
      id: '1',
      name: 'Authentication',
      path: '/api/auth',
      method: 'POST',
      status: 'healthy',
      responseTime: 120,
      successRate: 99.8,
      errorRate: 0.2,
      requestCount: 15243,
    },
    {
      id: '2',
      name: 'User Management',
      path: '/api/users',
      method: 'GET',
      status: 'healthy',
      responseTime: 85,
      successRate: 99.9,
      errorRate: 0.1,
      requestCount: 8765,
    },
    {
      id: '3',
      name: 'Attendance Records',
      path: '/api/attendance',
      method: 'GET',
      status: 'degraded',
      responseTime: 350,
      successRate: 97.5,
      errorRate: 2.5,
      requestCount: 25678,
    },
    {
      id: '4',
      name: 'Course Management',
      path: '/api/courses',
      method: 'GET',
      status: 'healthy',
      responseTime: 110,
      successRate: 99.7,
      errorRate: 0.3,
      requestCount: 5432,
    },
    {
      id: '5',
      name: 'Timetable Management',
      path: '/api/timetable',
      method: 'GET',
      status: 'healthy',
      responseTime: 130,
      successRate: 99.5,
      errorRate: 0.5,
      requestCount: 7890,
    },
  ]

  // Mock data for system metrics
  const systemMetrics: SystemMetric[] = [
    {
      id: '1',
      name: 'CPU Usage',
      value: 35,
      unit: '%',
      status: 'healthy',
    },
    {
      id: '2',
      name: 'Memory Usage',
      value: 68,
      unit: '%',
      status: 'warning',
    },
    {
      id: '3',
      name: 'Disk Space',
      value: 42,
      unit: '%',
      status: 'healthy',
    },
    {
      id: '4',
      name: 'Database Connections',
      value: 120,
      unit: 'connections',
      status: 'healthy',
    },
    {
      id: '5',
      name: 'Active Users',
      value: 245,
      unit: 'users',
      status: 'healthy',
    },
  ]

  // Mock time series data for response time
  const responseTimeData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    value: 100 + Math.random() * 100 * (i % 3 === 0 ? 2 : 1),
  }))

  // Mock time series data for request count
  const requestCountData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    value: 500 + Math.random() * 1000 * (i % 4 === 0 ? 1.5 : 1),
  }))

  // Mock time series data for error rate
  const errorRateData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: `${i}:00`,
    value: 0.1 + Math.random() * 0.5 * (i % 5 === 0 ? 3 : 1),
  }))

  const handleRefresh = () => {
    setIsRefreshing(true)
    
    // Simulate API call to refresh data
    setTimeout(() => {
      setIsRefreshing(false)
      
      toast({
        title: 'Data Refreshed',
        description: 'API monitoring data has been updated.',
      })
    }, 1500)
  }

  const getStatusColor = (status: 'healthy' | 'degraded' | 'down' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return 'text-green-500'
      case 'degraded':
      case 'warning':
        return 'text-yellow-500'
      case 'down':
      case 'critical':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor API performance and system health
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Health</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground">Overall API health score</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142ms</div>
            <p className="text-xs text-muted-foreground">Across all endpoints</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0.8%</div>
            <p className="text-xs text-muted-foreground">Across all endpoints</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">63,008</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="metrics">System Metrics</TabsTrigger>
          <TabsTrigger value="charts">Performance Charts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
              <CardDescription>
                Performance metrics for all API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-7 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-2">Endpoint</div>
                  <div className="text-center">Status</div>
                  <div className="text-center">Response Time</div>
                  <div className="text-center">Success Rate</div>
                  <div className="text-center">Error Rate</div>
                  <div className="text-center">Requests</div>
                </div>
                <div className="divide-y">
                  {apiEndpoints.map((endpoint) => (
                    <div key={endpoint.id} className="grid grid-cols-7 p-3 text-sm">
                      <div className="col-span-2">
                        <div className="font-medium">{endpoint.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {endpoint.method} {endpoint.path}
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <span className={`flex items-center ${getStatusColor(endpoint.status)}`}>
                          {endpoint.status === 'healthy' && <CheckCircle2 className="mr-1 h-4 w-4" />}
                          {endpoint.status === 'degraded' && <AlertTriangle className="mr-1 h-4 w-4" />}
                          {endpoint.status === 'down' && <AlertTriangle className="mr-1 h-4 w-4" />}
                          <span className="capitalize">{endpoint.status}</span>
                        </span>
                      </div>
                      <div className="text-center">{endpoint.responseTime}ms</div>
                      <div className="text-center">{endpoint.successRate}%</div>
                      <div className="text-center">{endpoint.errorRate}%</div>
                      <div className="text-center">{endpoint.requestCount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Metrics</CardTitle>
              <CardDescription>
                Current system resource utilization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {systemMetrics.map((metric) => (
                  <Card key={metric.id}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                      <div className={getStatusColor(metric.status)}>
                        {metric.status === 'healthy' && <CheckCircle2 className="h-4 w-4" />}
                        {metric.status === 'warning' && <AlertTriangle className="h-4 w-4" />}
                        {metric.status === 'critical' && <AlertTriangle className="h-4 w-4" />}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metric.value} {metric.unit}
                      </div>
                      <div className="mt-4 h-2 w-full rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${
                            metric.status === 'healthy'
                              ? 'bg-green-500'
                              : metric.status === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${metric.unit === '%' ? metric.value : Math.min(100, (metric.value / 200) * 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Server Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Server className="h-5 w-5 text-muted-foreground" />
                          <span>API Server</span>
                        </div>
                        <span className="flex items-center text-green-500">
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Database className="h-5 w-5 text-muted-foreground" />
                          <span>Database</span>
                        </div>
                        <span className="flex items-center text-green-500">
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="h-5 w-5 text-muted-foreground" />
                          <span>Background Jobs</span>
                        </div>
                        <span className="flex items-center text-green-500">
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Operational
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Incidents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">API Slowdown</div>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="mt-1 text-sm">
                          Temporary slowdown in API response times due to database maintenance.
                        </p>
                        <div className="mt-2 text-xs text-green-500">Resolved</div>
                      </div>
                      <div className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Authentication Issues</div>
                          <span className="text-xs text-muted-foreground">5 days ago</span>
                        </div>
                        <p className="mt-1 text-sm">
                          Some users experienced authentication failures during system updates.
                        </p>
                        <div className="mt-2 text-xs text-green-500">Resolved</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Time (ms)</CardTitle>
              <CardDescription>
                Average response time across all endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Volume</CardTitle>
                <CardDescription>
                  Number of API requests over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={requestCountData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate (%)</CardTitle>
                <CardDescription>
                  Percentage of failed requests over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={errorRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
