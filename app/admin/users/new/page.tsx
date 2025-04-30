import { requireAdmin } from "@/lib/auth"
import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewUserPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-fpa-navy mt-2">Novo Usuário</h1>
        <p className="text-muted-foreground">Crie um novo usuário no sistema.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <UserForm />
      </div>
    </div>
  )
}
