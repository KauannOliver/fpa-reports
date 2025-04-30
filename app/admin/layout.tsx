import type React from "react"
import { requireAdmin } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar se o usuário é administrador
  await requireAdmin()

  return (
    <div className="flex min-h-screen bg-background">
      {/* Menu lateral */}
      <Sidebar isAdmin={true} />

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
