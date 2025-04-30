import { requireAdmin } from "@/lib/auth"
import { getAllReports } from "@/lib/reports"
import { listUsers } from "@/lib/users"
import { users } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecentActivities } from "@/components/admin/recent-activities"
import { PopularReports } from "@/components/admin/popular-reports"
import { UsersOverview } from "@/components/admin/users-overview"
import { FileText, Users, BarChart3, TrendingUp } from "lucide-react"

export default async function AdminDashboardPage() {
  await requireAdmin()
  const reports = await getAllReports()
  const activeReports = reports.filter((report) => report.ativo)
  const usersList = await listUsers()
  const managers = usersList.filter((user) => user.perfil === "manager") => user.perfil === "manager")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-fpa-navy">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema de relatórios FP&A.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in" style={{ animationDelay: "0ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Relatórios</p>
                <p className="text-3xl font-bold">{reports.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">{activeReports.length} ativos</span>
              {" • "}
              <span className="text-gray-500">{reports.length - activeReports.length} inativos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Gestores</p>
                <p className="text-3xl font-bold">{managers.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">Todos ativos</span>
              {" • "}
              <span className="text-gray-500">0 inativos</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Acessos Hoje</p>
                <p className="text-3xl font-bold">24</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+12%</span>
              {" • "}
              <span className="text-gray-500">vs. semana passada</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Relatórios Visualizados</p>
                <p className="text-3xl font-bold">128</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-rose-600" />
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="text-green-500 font-medium">+18%</span>
              {" • "}
              <span className="text-gray-500">vs. mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activities">Atividades Recentes</TabsTrigger>
          <TabsTrigger value="popular">Relatórios Populares</TabsTrigger>
          <TabsTrigger value="users">Visão Geral de Usuários</TabsTrigger>
        </TabsList>
        <TabsContent value="activities" className="space-y-4">
          <RecentActivities />
        </TabsContent>
        <TabsContent value="popular" className="space-y-4">
          <PopularReports />
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <UsersOverview />
        </TabsContent>
      </Tabs>
    </div>
  )
}
