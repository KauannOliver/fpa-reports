"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { User } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { users } from "@/lib/auth"
import type { Report } from "@/lib/reports"
import { createReport, updateReport } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ReportFormProps {
  report?: Report
}

export function ReportForm({ report }: ReportFormProps) {

const [users, setUsers] = useState<User[]>([])
useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then((data: User[]) => setUsers(data))
    .catch(console.error)
}, [])
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)

    try {
      if (report) {
        // Atualizar relatório existente
        const result = await updateReport(report.id, formData)

        if (result.success) {
          router.push("/admin/reports")
          router.refresh()
        } else {
          setError(result.error || "Ocorreu um erro ao atualizar o relatório.")
        }
      } else {
        // Criar novo relatório
        const result = await createReport(formData)

        if (result.success) {
          router.push("/admin/reports")
          router.refresh()
        } else {
          setError(result.error || "Ocorreu um erro ao criar o relatório.")
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
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" defaultValue={report?.titulo} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" name="description" defaultValue={report?.description} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="embedUrl">URL de Incorporação</Label>
          <Input id="embedUrl" name="embedUrl" defaultValue={report?.embedUrl} required />
          <p className="text-sm text-muted-foreground">URL de incorporação do relatório do Power BI.</p>
        </div>

        {report && (
          <div className="flex items-center space-x-2">
            <Switch id="isActive" name="isActive" defaultChecked={report.ativo} value="true" />
            <Label htmlFor="isActive">Relatório ativo</Label>
          </div>
        )}

        <div className="space-y-2">
          <Label>Usuários com Acesso</Label>
          <div className="border rounded-md p-4 space-y-2">
            {users.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`user-${user.id}`}
                  name="allowedUsers"
                  value={user.id}
                  defaultChecked={report?.allowedUsers.includes(user.id)}
                />
                <Label htmlFor={`user-${user.id}`} className="font-normal">
                  {user.nome} ({user.email}) - {user.perfil === "admin" ? "Administrador" : "Gestor"}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/reports")}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-fpa-blue hover:bg-blue-600" disabled={isLoading}>
          {isLoading ? (report ? "Atualizando..." : "Criando...") : report ? "Atualizar Relatório" : "Criar Relatório"}
        </Button>
      </div>
    </form>
  )
}
