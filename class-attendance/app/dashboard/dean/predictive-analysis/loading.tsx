import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PredictiveAnalysisLoading() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-56" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecast" disabled>Attendance Forecast</TabsTrigger>
          <TabsTrigger value="risk" disabled>Risk Analysis</TabsTrigger>
          <TabsTrigger value="interventions" disabled>Recommended Interventions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-4">
                    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                      <div>
                        <Skeleton className="h-5 w-36 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-6 w-16 mb-1 ml-auto" />
                        <Skeleton className="h-3 w-24 ml-auto" />
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center">
                      <Skeleton className="h-4 w-16" />
                      <div className="flex-1 mx-2">
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <Skeleton className="h-4 w-12" />
                    </div>
                    
                    <div className="mt-2 flex items-center">
                      <Skeleton className="h-4 w-16" />
                      <div className="flex-1 mx-2">
                        <Skeleton className="h-2 w-full" />
                      </div>
                      <Skeleton className="h-4 w-12" />
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
