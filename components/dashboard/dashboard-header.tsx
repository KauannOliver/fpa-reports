import type { User } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  // Formatar a data atual
  const currentDate = new Date()
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentDate)

  // Capitalizar a primeira letra
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)

  return (
    <Card className="border-none shadow-sm bg-gradient-to-r from-fpa-blue/10 to-fpa-navy/5 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-fpa-navy">Bem-vindo(a), {user.name}</h2>
            <div className="flex items-center text-muted-foreground mt-1">
              <Clock className="h-4 w-4 mr-2" />
              <span>{capitalizedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
