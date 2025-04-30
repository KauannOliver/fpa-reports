"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FileText, Users, Settings } from "lucide-react"

interface MobileSidebarProps {
  isAdmin: boolean
}

export function MobileSidebar({ isAdmin }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      admin: false,
    },
    {
      title: "Gerenciar Relatórios",
      icon: FileText,
      href: "/admin/reports",
      admin: true,
    },
    {
      title: "Gerenciar Usuários",
      icon: Users,
      href: "/admin/users",
      admin: true,
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/admin/settings",
      admin: true,
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-fpa-navy text-white w-[280px]">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-white/10">
            <Logo simple className="h-8 w-auto" />
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                if (item.admin && !isAdmin) return null

                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-md text-sm transition-all duration-200",
                        isActive
                          ? "bg-fpa-blue/20 text-white border-l-4 border-fpa-blue"
                          : "hover:bg-fpa-blue/10 text-gray-300 hover:text-white",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} FP&A Expresso Nepomuceno
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
