"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/auth"
import { users } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Plus, Search, RefreshCw } from "lucide-react"
import { UsersTable } from "@/components/users-table"
import { UserModal } from "@/components/user-modal"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function AdminUsersPage() {
  const [usersData, setUsersData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      // Em um ambiente real, isso seria uma chamada de API
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('erro');
      const data: User[] = await res.json();
      setUsersData(data)
    } catch (error) {
      console.error("Erro ao carregar usuários:", error)
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = usersData.filter(
    (user) =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRefresh = () => {
    loadUsers()
    toast({
      title: "Lista atualizada",
      description: "A lista de usuários foi atualizada com sucesso.",
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fpa-navy">Gerenciar Gestores</h1>
          <p className="text-muted-foreground">Gerencie os usuários do sistema.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading} className="h-10 w-10">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button className="bg-fpa-blue hover:bg-blue-600 button-hover-effect" onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Gestor
          </Button>
        </div>
      </div>

      <Card className="border shadow-sm mb-4 animate-slide-up">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar gestores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <UsersTable users={filteredUsers} isLoading={isLoading} onUserUpdated={loadUsers} />

      <UserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={() => {
          loadUsers()
          toast({
            title: "Gestor criado",
            description: "O gestor foi criado com sucesso.",
          })
        }}
      />
    </div>
  )
}
