import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Dados simulados de relatórios populares
const popularReports = [
  {
    id: 1,
    title: "Relatório Financeiro Mensal",
    views: 128,
    percentage: 100,
  },
  {
    id: 2,
    title: "Análise de Despesas",
    views: 95,
    percentage: 74,
  },
  {
    id: 3,
    title: "Indicadores de Performance",
    views: 82,
    percentage: 64,
  },
  {
    id: 4,
    title: "Orçamento Anual 2025",
    views: 65,
    percentage: 51,
  },
  {
    id: 5,
    title: "Análise de Desvios",
    views: 43,
    percentage: 34,
  },
]

export function PopularReports() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatórios Mais Acessados</CardTitle>
        <CardDescription>Relatórios com maior número de visualizações.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {popularReports.map((report) => (
            <div key={report.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{report.titulo}</p>
                  <p className="text-sm text-muted-foreground">{report.views} visualizações</p>
                </div>
                <div className="text-sm font-medium">{report.percentage}%</div>
              </div>
              <Progress value={report.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
