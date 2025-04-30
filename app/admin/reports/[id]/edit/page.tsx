import { requireAdmin } from "@/lib/auth"
import { getReportById } from "@/lib/reports"
import { notFound } from "next/navigation"
import { ReportForm } from "@/components/report-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditReportPageProps {
  params: {
    id: string
  }
}

export default async function EditReportPage({ params }: EditReportPageProps) {
  await requireAdmin()
  const report = getReportById(params.id)

  if (!report) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/reports">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-fpa-navy mt-2">Editar Relatório</h1>
        <p className="text-muted-foreground">Edite as informações do relatório.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <ReportForm report={report} />
      </div>
    </div>
  )
}
