import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CoursesLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-[200px]" /> {/* Title */}
          <Skeleton className="h-4 w-[150px] mt-1" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-[120px]" /> {/* Add Course button */}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 flex-1" /> {/* Search input */}
            <Skeleton className="h-10 w-[200px]" /> {/* Department select */}
          </div>

          <div className="border rounded-lg">
            <div className="border-b px-4 py-3">
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-4 w-20" /> {/* Code header */}
                <Skeleton className="h-4 w-24" /> {/* Name header */}
                <Skeleton className="h-4 w-28" /> {/* Department header */}
                <Skeleton className="h-4 w-16" /> {/* Actions header */}
              </div>
            </div>

            <div className="divide-y">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-4 py-4">
                  <div className="grid grid-cols-4 gap-4 items-center">
                    <Skeleton className="h-4 w-24" /> {/* Code */}
                    <Skeleton className="h-4 w-40" /> {/* Name */}
                    <Skeleton className="h-4 w-32" /> {/* Department */}
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8" /> {/* Edit button */}
                      <Skeleton className="h-8 w-8" /> {/* Users button */}
                      <Skeleton className="h-8 w-8" /> {/* Delete button */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

