"use client"

import { useState, useEffect } from "react"
import type { Report } from "@/lib/reports"

import { Button } from "@/components/ui/button"
import { Plus, Search, RefreshCw } from "lucide-react"
import { ReportsTable } from "@/components/reports-table"
import { ReportModal } from "@/components/report-modal"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function AdminReportsPage() {
  /* ------------------------------------------------------------------ */
  /*  STATE                                                             */
  /* ------------------------------------------------------------------ */
  const [reports, setReports]         = useState<Report[]>([])
  const [isLoading, setIsLoading]     = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm]   = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "inactive">("all")
  const { toast } = useToast()

  /* ------------------------------------------------------------------ */
  /*  LOAD FROM API                                                     */
  /* ------------------------------------------------------------------ */
  async function loadReports() {
    setIsLoading(true)
    try {
      const res  = await fetch("/api/reports")
      const data = (await res.json()) as Report[]
      setReports(data)
    } catch (error) {
      console.error("Erro ao carregar relatórios:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar relatórios",
        description: "Não foi possível obter a lista. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  /* ------------------------------------------------------------------ */
  /*  FILTERS                                                           */
  /* ------------------------------------------------------------------ */
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.descricao ?? "").toLowerCase().includes(searchTerm.toLowerCase())

    if (activeFilter === "all")      return matchesSearch
    if (activeFilter === "active")   return matchesSearch && report.ativo
    if (activeFilter === "inactive") return matchesSearch && !report.ativo
    return matchesSearch
  })

  /* ------------------------------------------------------------------ */
  /*  REFRESH BUTTON                                                    */
  /* ------------------------------------------------------------------ */
  const handleRefresh = () => {
    loadReports()
    toast({
      title: "Lista atualizada",
      description: "A lista de relatórios foi atualizada com sucesso.",
    })
  }

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fpa-navy">Gerenciar Relatórios</h1>
          <p className="text-muted-foreground">Gerencie os relatórios disponíveis no sistema.</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-10 w-10"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            className="bg-fpa-blue hover:bg-blue-600 button-hover-effect"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Relatório
          </Button>
        </div>
      </div>

      {/* Barra de busca + filtros */}
      <Card className="border shadow-sm mb-4 animate-slide-up">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar relatórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs
              defaultValue="all"
              value={activeFilter}
              onValueChange={(v) => setActiveFilter(v as any)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="active">Ativos</TabsTrigger>
                <TabsTrigger value="inactive">Inativos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Grid / Tabela */}
      <ReportsTable
        reports={filteredReports}
        isLoading={isLoading}
        onReportUpdated={loadReports}
      />

      {/* Modal de Criação / Edição */}
      <ReportModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => {
          loadReports()
          toast({
            title: "Relatório salvo",
            description: "O relatório foi salvo com sucesso.",
          })
        }}
      />
    </div>
  )
}
