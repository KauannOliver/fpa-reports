"use client"

import { useState } from "react"
import type { Report } from "@/lib/reports"
import { ReportCard } from "@/components/dashboard/report-card"
import { EmptyReports } from "@/components/dashboard/empty-reports"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LayoutGrid, List } from "lucide-react"

interface ReportGridProps {
  reports: Report[]
}

export function ReportGrid({ reports }: ReportGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<string[]>([])

  const toggleFavorite = (reportId: string) => {
    setFavorites((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]))
  }

  if (reports.length === 0) {
    return <EmptyReports />
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {reports.length} {reports.length === 1 ? "relatório encontrado" : "relatórios encontrados"}
        </p>

        <div className="flex items-center gap-2">
          <Tabs defaultValue="grid" className="w-[180px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid" onClick={() => setViewMode("grid")} className="flex items-center gap-1">
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Grid</span>
              </TabsTrigger>
              <TabsTrigger value="list" onClick={() => setViewMode("list")} className="flex items-center gap-1">
                <List className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Lista</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            viewMode={viewMode}
            isFavorite={favorites.includes(report.id)}
            onToggleFavorite={() => toggleFavorite(report.id)}
          />
        ))}
      </div>
    </div>
  )
}
