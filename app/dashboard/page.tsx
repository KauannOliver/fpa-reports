import { requireAuth } from "@/lib/auth"
import { getReportsForUser } from "@/lib/reports"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ReportGrid } from "@/components/dashboard/report-grid"
import { ReportFilters } from "@/components/dashboard/report-filters"
import { SupportButton } from "@/components/dashboard/support-button"
import { Suspense } from "react"
import { ReportGridSkeleton } from "@/components/dashboard/report-grid-skeleton"

export default async function DashboardPage() {
  const user = await requireAuth()
  const reports = await getReportsForUser(user.id)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <DashboardHeader user={user} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="animate-slide-up">
          <h1 className="text-3xl font-bold tracking-tight text-fpa-navy">Meus Relatórios</h1>
          <p className="text-muted-foreground">Abaixo estão os relatórios disponíveis para sua visualização.</p>
        </div>
        <div className="flex items-center gap-2">
          <SupportButton />
        </div>
      </div>

      <ReportFilters />

      <Suspense fallback={<ReportGridSkeleton />}>
        <ReportGrid reports={reports} />
      </Suspense>
    </div>
  )
}
