import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function ReportGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="bg-gray-100 p-4 pb-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="p-4">
            <Skeleton className="aspect-video rounded-md w-full" />
            <div className="flex items-center mt-3">
              <Skeleton className="h-4 w-1/3" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-gray-50 px-4 py-3">
            <Button variant="outline" size="sm" disabled>
              <Skeleton className="h-4 w-20" />
            </Button>
            <Button variant="default" size="sm" disabled>
              <Skeleton className="h-4 w-20" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
