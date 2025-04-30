"use client"

import { useState } from "react"
import type { User } from "@/lib/auth"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Input }   from "@/components/ui/input"
import { Button }  from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 }    from "lucide-react"
import { updateUser } from "@/app/actions"
import { useToast } from "@/components/ui/use-toast"

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  user: User | null
  onSuccess?: () => void
}

export function ResetPasswordModal({
  open,
  onOpenChange,
  user,
  onSuccess,
}: Props) {
  const { toast }              = useToast()
  const [pwd, setPwd]          = useState("")
  const [confirm, setConfirm]  = useState("")
  const [error, setError]      = useState<string | null>(null)
  const [saving, setSaving]    = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (pwd.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }
    if (pwd !== confirm) {
      setError("As senhas não coincidem.")
      return
    }

    if (!user) return
    setSaving(true)

    const fd = new FormData()
    fd.set("senha", pwd)

    try {
      await updateUser(user.id, fd)
      toast({ title: "Senha redefinida com sucesso" })
      onSuccess?.()
      onOpenChange(false)
      setPwd("")
      setConfirm("")
    } catch {
      setError("Erro ao redefinir a senha.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Redefinir Senha</DialogTitle>
          <DialogDescription>
            {user ? `Defina uma nova senha para ${user.nome}.` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Input
            type="password"
            placeholder="Nova senha"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirmar senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Atualizar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
