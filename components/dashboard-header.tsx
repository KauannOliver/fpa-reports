import { getCurrentUser } from "@/lib/auth"
import { UserNav } from "@/components/user-nav"
import { Logo } from "@/components/logo"
import { MobileSidebar } from "@/components/mobile-sidebar"

export async function DashboardHeader() {
  const user = await getCurrentUser()

  if (!user) return null

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
      <MobileSidebar isAdmin={user.perfil === "admin"} />
      <div className="hidden md:block">
        <Logo simple className="h-8 w-auto" />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <UserNav user={user} />
      </div>
    </header>
  )
}
