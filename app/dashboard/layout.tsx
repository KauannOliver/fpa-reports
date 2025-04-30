import type React from "react"
import { requireAuth } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()
  const isAdmin = user.perfil === "admin"

  return (
    <div className="flex min-h-screen bg-background">
      {/* Menu lateral */}
      <Sidebar isAdmin={isAdmin} />

      {/* Conteúdo principal */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
