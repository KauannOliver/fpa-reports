import type { Report } from "@/lib/reports"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

interface ReportCardProps {
  report: Report
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="bg-gradient-to-r from-fpa-navy to-fpa-blue text-white">
        <CardTitle>{report.titulo}</CardTitle>
        <CardDescription className="text-white/80">{report.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
          <img src="/placeholder.svg?height=200&width=400" alt="Prévia do relatório" className="rounded-md" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end bg-gray-50 px-6 py-4">
        <Link href={`/dashboard/reports/${report.id}`}>
          <Button variant="default" className="bg-fpa-blue hover:bg-blue-600">
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
