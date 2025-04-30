import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Dados simulados de usuários
const usersData = [
  {
    id: 1,
    name: "Admin",
    email: "admin@fpa.com",
    role: "admin",
    reportsAccess: "Todos",
    lastActive: "Agora",
    status: "online",
  },
  {
    id: 2,
    name: "Gestor 1",
    email: "gestor1@fpa.com",
    role: "manager",
    reportsAccess: "3 relatórios",
    lastActive: "Há 1 hora",
    status: "offline",
  },
  {
    id: 3,
    name: "Gestor 2",
    email: "gestor2@fpa.com",
    role: "manager",
    reportsAccess: "2 relatórios",
    lastActive: "Há 3 dias",
    status: "offline",
  },
]

export function UsersOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral de Usuários</CardTitle>
        <CardDescription>Usuários cadastrados no sistema e seus acessos.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {usersData.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-r from-fpa-blue to-fpa-navy text-white">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <p className="text-sm">{user.reportsAccess}</p>
                  <p className="text-xs text-muted-foreground">Último acesso: {user.lastActive}</p>
                </div>
                <Badge
                  variant={user.perfil === "admin" ? "default" : "outline"}
                  className={user.perfil === "admin" ? "bg-fpa-navy" : ""}
                >
                  {user.perfil === "admin" ? "Admin" : "Gestor"}
                </Badge>
                <div className="flex items-center">
                  <div
                    className={`h-2 w-2 rounded-full mr-2 ${user.status === "online" ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span className="text-xs text-muted-foreground hidden md:inline">
                    {user.status === "online" ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
