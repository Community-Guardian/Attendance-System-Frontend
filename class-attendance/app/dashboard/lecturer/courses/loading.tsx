import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="mt-2 h-4 w-[350px]" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-[300px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="mt-1 h-4 w-[100px]" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-4 w-[40px]" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[40px]" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

