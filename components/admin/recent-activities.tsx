import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Dados simulados de atividades recentes
const activities = [
  {
    id: 1,
    user: { name: "Gestor 1", email: "gestor1@fpa.com" },
    action: "visualizou o relatório",
    target: "Relatório Financeiro Mensal",
    time: "há 5 minutos",
  },
  {
    id: 2,
    user: { name: "Admin", email: "admin@fpa.com" },
    action: "atualizou o relatório",
    target: "Análise de Despesas",
    time: "há 1 hora",
  },
  {
    id: 3,
    user: { name: "Admin", email: "admin@fpa.com" },
    action: "adicionou um novo gestor",
    target: "Gestor 2",
    time: "há 3 horas",
  },
  {
    id: 4,
    user: { name: "Gestor 1", email: "gestor1@fpa.com" },
    action: "fez login no sistema",
    target: "",
    time: "há 4 horas",
  },
  {
    id: 5,
    user: { name: "Admin", email: "admin@fpa.com" },
    action: "criou um novo relatório",
    target: "Indicadores de Performance",
    time: "há 1 dia",
  },
]

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
        <CardDescription>Últimas ações realizadas no sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-r from-fpa-blue to-fpa-navy text-white">
                  {activity.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user.name}</span> {activity.action}{" "}
                  {activity.target && <span className="font-medium text-fpa-blue">{activity.target}</span>}
                </p>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
