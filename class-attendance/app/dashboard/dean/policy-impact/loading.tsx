import { Skeleton } from "@/components/ui/skeleton"

export default function PolicyImpactLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="mt-2 h-4 w-[350px]" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      <div className="mt-6">
        <Skeleton className="h-10 w-[300px]" />
      </div>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="mt-3 h-6 w-[60px]" />
              <Skeleton className="mt-1 h-3 w-[100px]" />
            </div>
          ))}
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="mt-1 h-4 w-[300px]" />
          </div>
          <Skeleton className="mx-6 h-[400px]" />
        </div>
      </div>
    </div>
  )
}
