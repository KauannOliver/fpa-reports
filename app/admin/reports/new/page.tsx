import { requireAdmin } from "@/lib/auth"
import { ReportForm } from "@/components/report-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewReportPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/reports">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-fpa-navy mt-2">Novo Relatório</h1>
        <p className="text-muted-foreground">Crie um novo relatório no sistema.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <ReportForm />
      </div>
    </div>
  )
}
