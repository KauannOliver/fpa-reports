"use client"

import { useState, useEffect } from "react"
import type { Report } from "@/lib/reports"
import type { User   } from "@/lib/auth"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Label }    from "@/components/ui/label"
import { Input }    from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button }   from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useToast }     from "@/components/ui/use-toast"
import { createReport, updateReport } from "@/app/actions"
import { useRouter }    from "next/navigation"

interface Props {
  open: boolean
  onOpenChange: (o: boolean) => void
  report?: Report
  onSuccess?: () => void
}

export function ReportModal({ open, onOpenChange, report, onSuccess }: Props) {
  const router        = useRouter()
  const { toast }     = useToast()
  const isEditing     = !!report

  /* --------------------------- form state --------------------------- */
  const [titulo,    setTitulo]    = useState("")
  const [descricao, setDescricao] = useState("")
  const [url,       setUrl]       = useState("")
  const [publico,   setPublico]   = useState(false)

  /* --------------------- usuários para permissões ------------------- */
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/users")
        if (!res.ok) throw new Error()
        setUsers(await res.json())
      } catch {
        console.error("Falha ao carregar usuários")
      }
    })()
  }, [])

  /* preenche quando abre para edição */
  useEffect(() => {
    if (isEditing && report) {
      setTitulo(report.titulo)
      setDescricao(report.descricao ?? "")
      setUrl(report.url_embed)
      setPublico(report.publico)
    } else {
      setTitulo(""); setDescricao(""); setUrl(""); setPublico(false)
    }
  }, [open, isEditing, report])

  const [saving, setSaving] = useState(false)
  const [error,  setError ] = useState<string | null>(null)

  /* ------------------------------ submit ---------------------------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true); setError(null)

    /* FormData já contém todos os campos, inclusive os rep-<id> */
    const fd = new FormData(e.currentTarget)

    try {
      if (isEditing) {
        await updateReport(report!.id, fd)
        toast({ title: "Relatório atualizado" })
      } else {
        await createReport(fd)
        toast({ title: "Relatório criado" })
      }
      onSuccess?.()
      onOpenChange(false)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "Erro ao salvar.")
    } finally {
      setSaving(false)
    }
  }

  /* ------------------------------ UI -------------------------------- */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Relatório" : "Novo Relatório"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize as informações necessárias."
              : "Preencha os campos para criar o relatório."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-1">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                name="titulo"                        /* ←  nome importante */
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"                     /* ←  nome importante */
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL de Incorporação</Label>
              <Input
                id="url"
                name="url"                           /* ←  nome importante */
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="publico"
                name="publico"                      /* ←  nome importante */
                checked={publico}
                onChange={(e) => setPublico(e.target.checked)}
              />
              <Label htmlFor="publico">Relatório público</Label>
            </div>

            {/* Permissões de acesso ------------------------------------ */}
            <div className="space-y-2">
              <Label>Permissões de Acesso</Label>
              <div className="border rounded-md p-4 space-y-2 max-h-[200px] overflow-y-auto">
                {users.map(u => (
                  <div key={u.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${u.id}`}
                      name={`rep-${u.id}`}            /* ←  ESSENCIAL      */
                      defaultChecked={report?.allowedUsers?.includes(u.id) ?? false}
                    />
                    <Label htmlFor={`user-${u.id}`}>
                      {u.nome} ({u.email})
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
