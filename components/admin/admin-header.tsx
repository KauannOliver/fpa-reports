import { getCurrentUser } from "@/lib/auth"
import { UserNav } from "@/components/user-nav"
import { MobileAdminSidebar } from "@/components/admin/mobile-admin-sidebar"
import { BellIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export async function AdminHeader() {
  const user = await getCurrentUser()

  if (!user) return null

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shadow-sm">
      <MobileAdminSidebar />

      <div className="hidden md:block">
        <h1 className="text-xl font-semibold text-fpa-navy">Painel Administrativo</h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>
        <UserNav user={user} />
      </div>
    </header>
  )
}
