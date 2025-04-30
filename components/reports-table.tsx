"use client"

import { useState } from "react"
import type { Report } from "@/lib/reports"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteReport } from "@/app/actions"
import { useRouter } from "next/navigation"
import { ReportModal } from "@/components/report-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

interface ReportsTableProps {
  reports: Report[]
  isLoading?: boolean
  onReportUpdated?: () => void
}

export function ReportsTable({
  reports,
  isLoading = false,
  onReportUpdated,
}: ReportsTableProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [isDeleting, setIsDeleting]         = useState(false)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)

  const [editingReport, setEditingReport]   = useState<Report | undefined>()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  /* modal preview */
  const [isPreviewOpen, setIsPreviewOpen]   = useState(false)
  const [previewReport, setPreviewReport]   = useState<Report | null>(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(true)

  /* paginação */
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage  = 10
  const totalPages    = Math.ceil(reports.length / itemsPerPage)
  const paginated     = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  /* ------------------------------------------------------------------ */
  /*  Handlers                                                          */
  /* ------------------------------------------------------------------ */
  async function handleDelete() {
    if (!selectedReportId) return
    setIsDeleting(true)

    try {
      await deleteReport(selectedReportId)
      toast({ title: "Relatório excluído" })
      onReportUpdated?.()
      router.refresh()
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir. Tente novamente.",
      })
    } finally {
      setIsDeleting(false)
      setSelectedReportId(null)
    }
  }

  const handleEdit = (r: Report) => {
    setEditingReport(r)
    setIsEditModalOpen(true)
  }

  const handlePreview = (r: Report) => {
    setPreviewReport(r)
    setIsPreviewLoading(true)
    setIsPreviewOpen(true)
  }

  /* ------------------------------------------------------------------ */
  /*  Skeleton                                                          */
  /* ------------------------------------------------------------------ */
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden animate-fade-in">
        <div className="p-4">
          <Skeleton className="h-8 w-full max-w-md mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-2" />
          ))}
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------------ */
  /*  Tabela                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Usuários com Acesso</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Nenhum relatório encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((r) => (
                <TableRow key={r.id}>
                  {/* título + descrição mobile */}
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium text-fpa-navy">{r.titulo}</div>
                      <div className="text-sm text-muted-foreground">{r.descricao}</div>
                      <div className="md:hidden mt-1">
                        {r.ativo ? (
                          <Badge className="bg-green-500">Ativo</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">Inativo</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* status desktop */}
                  <TableCell className="hidden md:table-cell">
                    {r.ativo ? (
                      <Badge className="bg-green-500">Ativo</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">Inativo</Badge>
                    )}
                  </TableCell>

                  {/* # usuários */}
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{r.allowedUsers?.length ?? 0} usuário(s)</Badge>
                  </TableCell>

                  {/* ações */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* desktop */}
                      <div className="hidden sm:flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handlePreview(r)}>
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button variant="outline" size="icon" onClick={() => handleEdit(r)}>
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500"
                              onClick={() => setSelectedReportId(r.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onInteractOutside={(e) => e.preventDefault()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover este relatório? Esta ação não poderá ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                {isDeleting ? "Excluindo..." : "Excluir"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      {/* mobile dropdown */}
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handlePreview(r)}>
                              <Eye className="h-4 w-4 mr-2" /> Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(r)}>
                              <Edit className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    setSelectedReportId(r.id)
                                  }}
                                  className="text-red-500 focus:text-red-500"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent onInteractOutside={(e) => e.preventDefault()}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza? Esta ação não poderá ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    {isDeleting ? "Excluindo..." : "Excluir"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* paginação */}
      {reports.length > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, reports.length)} a{" "}
            {Math.min(currentPage * itemsPerPage, reports.length)} de {reports.length} relatórios
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Anterior
            </Button>
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* modal preview */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl w-[90vw] max-h-[90vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>{previewReport?.titulo}</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[80vh]">
            {isPreviewLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fpa-blue mb-4" />
                  <p className="text-sm text-muted-foreground">Carregando relatório...</p>
                </div>
              </div>
            )}
            {previewReport && (
              <iframe
                src={previewReport.url_embed}
                title={previewReport.titulo}
                className="w-full h-full border-0"
                allowFullScreen
                onLoad={() => setIsPreviewLoading(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* modal edição/criação */}
      <ReportModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        report={editingReport}
        onSuccess={() => {
          onReportUpdated?.()
          toast({ title: "Relatório salvo", description: "Alterações aplicadas." })
        }}
      />
    </>
  )
}
