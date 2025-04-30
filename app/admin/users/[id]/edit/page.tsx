import { requireAdmin, users } from "@/lib/auth"
import { notFound } from "next/navigation"
import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  await requireAdmin()
  const user = users.find((u) => u.id === params.id)

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-fpa-navy mt-2">Editar Usuário</h1>
        <p className="text-muted-foreground">Edite as informações do usuário.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <UserForm user={user} />
      </div>
    </div>
  )
}
