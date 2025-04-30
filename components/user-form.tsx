"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/auth"
import { createUser, updateUser } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserFormProps {
  user?: User
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    try {
      if (user) {
        // Atualizar usuário existente
        const result = await updateUser(user.id, formData)

        if (result.success) {
          router.push("/admin/users")
          router.refresh()
        } else {
          setError(result.error || "Ocorreu um erro ao atualizar o usuário.")
        }
      } else {
        // Criar novo usuário
        const result = await createUser(formData)

        if (result.success) {
          router.push("/admin/users")
          router.refresh()
        } else {
          setError(result.error || "Ocorreu um erro ao criar o usuário.")
        }
      }
    } catch (err) {
      setError("Ocorreu um erro ao processar a solicitação.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" name="name" defaultValue={user?.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" name="email" type="email" defaultValue={user?.email} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Função</Label>
          <Select name="role" defaultValue={user?.role || "manager"}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="manager">Gestor</SelectItem>
              <SelectItem value="director">Diretor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!user && (
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required />
            <p className="text-sm text-muted-foreground">A senha deve ter pelo menos 6 caracteres.</p>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-fpa-blue hover:bg-blue-600" disabled={isLoading}>
          {isLoading ? (user ? "Atualizando..." : "Criando...") : user ? "Atualizar Usuário" : "Criar Usuário"}
        </Button>
      </div>
    </form>
  )
}
