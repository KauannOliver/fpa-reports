"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isAdmin: boolean
}

export function DashboardSidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setCollapsed(true)
      }
    }

    // Verificar tamanho inicial
    checkScreenSize()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkScreenSize)

    // Limpar listener
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

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
    <aside
      className={cn(
        "sidebar fixed inset-y-0 left-0 z-20 flex flex-col bg-fpa-navy text-white transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        isMobile && collapsed ? "-translate-x-full" : "translate-x-0",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className={cn("transition-opacity duration-300", collapsed ? "opacity-0" : "opacity-100")}>
          <Logo simple className="h-8 w-auto" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/10 absolute right-2"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            if (item.admin && !isAdmin) return null

            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "sidebar-item flex items-center px-4 py-3 rounded-md text-sm transition-all duration-200",
                    isActive
                      ? "bg-fpa-blue/20 text-white border-l-4 border-fpa-blue"
                      : "hover:bg-fpa-blue/10 text-gray-300 hover:text-white",
                    collapsed ? "justify-center" : "justify-start",
                  )}
                >
                  <item.icon className={cn("flex-shrink-0", collapsed ? "w-5 h-5" : "w-5 h-5 mr-3")} />
                  <span
                    className={cn(
                      "transition-all duration-300",
                      collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10 flex items-center justify-center">
        {!collapsed && <div className="text-xs text-gray-400">© {new Date().getFullYear()} FP&A</div>}
      </div>
    </aside>
  )
}
