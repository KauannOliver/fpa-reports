"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/auth"
import type { Report } from "@/lib/reports"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input  } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { createUser, updateUser } from "@/app/actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  user?: User
  onSuccess?: () => void
}

export function UserModal({ open, onOpenChange, user, onSuccess }: Props) {
  const router        = useRouter()
  const { toast }     = useToast()
  const isEditing     = !!user

  const [reports, setReports] = useState<Report[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/reports")
        if (res.ok) setReports(await res.json())
      } catch { /* ignore */ }
    })()
  }, [])

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setError(null)

    const fd = new FormData(e.currentTarget)

    try {
      const result = isEditing
        ? await updateUser(user!.id, fd)
        : await createUser(fd)

      if (!result.success) throw new Error(result.error)
      toast({ title: "Usuário salvo" })
      onSuccess?.(); onOpenChange(false); router.refresh()
    } catch (err: any) {
      setError(err?.message || "Erro ao salvar.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Altere os dados necessários." : "Preencha para criar um usuário."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6">
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" name="nome" defaultValue={user?.nome} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" defaultValue={user?.email} required />
            </div>

            {!isEditing && (
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input id="senha" name="senha" type="password" required />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="perfil">Função</Label>
              <Select defaultValue={user?.perfil ?? "manager"} name="perfil" required>
                <SelectTrigger id="perfil"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* checkbox “Usuário ativo” no mesmo estilo pedido */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo"
                name="ativo"
                defaultChecked={user?.ativo ?? true}
                className="h-4 w-4 accent-fpa-blue"
              />
              <Label htmlFor="ativo">Usuário ativo</Label>
            </div>
          </div>

          {/* Relatórios */}
          <div>
            <Label>Relatórios com Acesso</Label>
            <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto space-y-2">
              {reports.map(r => (
                <div key={r.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`report-${r.id}`}
                    name={`rep-${r.id}`}
                    defaultChecked={r.allowedUsers?.includes(user?.id ?? "")}
                  />
                  <Label htmlFor={`report-${r.id}`}>{r.titulo}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...
                </>
              ) : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
