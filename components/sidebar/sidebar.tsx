"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "@/app/actions"

interface SidebarProps {
  isAdmin?: boolean
}

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar tamanho da tela para responsividade
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)

      // Auto-colapsar em telas médias
      if (window.innerWidth < 1280 && window.innerWidth >= 1024) {
        setCollapsed(true)
      } else if (window.innerWidth >= 1280) {
        setCollapsed(false)
      }
    }

    // Verificar tamanho inicial
    checkScreenSize()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkScreenSize)

    // Limpar listener
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Modificar a lista de itens do menu para remover "Relatórios" e "Configurações"
  // e adicionar o botão "Sair" ao final

  // Alterar a lista de menuItems para:
  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      admin: false,
    },
    {
      title: "Gerenciar Relatórios",
      href: "/admin/reports",
      admin: true,
    },
    {
      title: "Gerenciar Usuários",
      href: "/admin/users",
      admin: true,
    },
  ]

  // Adicionar a função de logout
  const handleLogout = async () => {
    // Implementar a lógica de logout
    try {
      await logout()
      // O redirecionamento será feito pela função logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  // Componente de menu para desktop
  const DesktopSidebar = (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Cabeçalho do menu */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h1
          className={cn(
            "font-semibold text-xl transition-all duration-300",
            collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100",
          )}
        >
          FP&A
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Itens do menu */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => {
            // Pular itens de admin se o usuário não for admin
            if (item.admin && !isAdmin) return null

            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed ? "justify-center" : "justify-start",
                  )}
                >
                  <span className={cn("transition-all duration-300", collapsed ? "w-0 overflow-hidden" : "w-auto")}>
                    {item.title}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Botão de logout */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
            collapsed && "justify-center px-0",
          )}
          onClick={handleLogout}
        >
          {collapsed ? <span>Sair</span> : <span className="w-full text-left">Sair</span>}
        </Button>
      </div>
    </aside>
  )

  // Componente de menu para mobile
  const MobileSidebar = (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 left-4 z-40">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="font-semibold text-xl">FP&A</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-6">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              if (item.admin && !isAdmin) return null

              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            onClick={handleLogout}
          >
            <span className="w-full text-left">Sair</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      {/* Renderizar o menu apropriado baseado no tamanho da tela */}
      {isMobile ? MobileSidebar : DesktopSidebar}

      {/* Espaçador para empurrar o conteúdo para a direita em desktop */}
      <div className={cn("hidden lg:block transition-all duration-300", collapsed ? "w-16" : "w-60")} />
    </>
  )
}
