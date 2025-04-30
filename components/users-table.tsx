/* -------------------------------------------------------------------------- */
/*  components/users-table.tsx — versão revisada                              */
/* -------------------------------------------------------------------------- */

"use client"

import { useState } from "react"
import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Key, MoreHorizontal } from "lucide-react"
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
import { deleteUser } from "@/app/actions"
import { useRouter } from "next/navigation"
import { UserModal } from "@/components/user-modal"
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
import { ResetPasswordModal } from "@/components/reset-password-modal"

/* -------------------------------------------------------------------------- */
/*  Props                                                                     */
/* -------------------------------------------------------------------------- */
interface UsersTableProps {
  users: User[]
  isLoading?: boolean
  onUserUpdated?: () => void
}

/* -------------------------------------------------------------------------- */
/*  Componente                                                                */
/* -------------------------------------------------------------------------- */
export function UsersTable({
  users,
  isLoading = false,
  onUserUpdated,
}: UsersTableProps) {
  const router                       = useRouter()
  const { toast }                    = useToast()
  const [isDeleting, setIsDeleting]  = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false)
  const [userForPasswordReset, setUserForPasswordReset] = useState<User | null>(null)

  /* paginação --------------------------------------------------------- */
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages   = Math.ceil(users.length / itemsPerPage)
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const goNext     = () => currentPage < totalPages && setCurrentPage(currentPage + 1)
  const goPrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1)

  /* ------------------------------------------------------------------ */
  /*  Exclusão                                                          */
  /* ------------------------------------------------------------------ */
  async function handleDelete() {
    if (!selectedUserId) return
    setIsDeleting(true)

    try {
      const { success, error } = await deleteUser(selectedUserId) as { success: boolean; error?: string }

      if (success) {
        toast({ title: "Usuário excluído", description: "O usuário foi excluído com sucesso." })
        onUserUpdated?.()
        router.refresh()
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: error || "Não foi possível excluir o usuário.",
        })
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Falha inesperada. Tente novamente.",
      })
    } finally {
      setIsDeleting(false)
      setSelectedUserId(null)
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Edição & Redefinição de Senha                                     */
  /* ------------------------------------------------------------------ */
  const startEdit          = (u: User) => { setEditingUser(u); setIsEditModalOpen(true) }
  const startResetPassword = (u: User) => { setUserForPasswordReset(u); setIsResetPasswordModalOpen(true) }

  /* ------------------------------------------------------------------ */
  /*  Skeleton enquanto carrega                                         */
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
  /*  Tabela                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead className="hidden md:table-cell">Função</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  {/* Nome + badge mobile */}
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{user.nome}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                      <div className="md:hidden mt-1">
                        {user.perfil === "admin" ? (
                          <Badge className="bg-fpa-navy">Administrador</Badge>
                        ) : user.perfil === "director" ? (
                          <Badge className="bg-purple-600">Diretor</Badge>
                        ) : (
                          <Badge className="bg-fpa-blue">Gestor</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* E-mail & função desktop */}
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.perfil === "admin" ? (
                      <Badge className="bg-fpa-navy">Administrador</Badge>
                    ) : user.perfil === "director" ? (
                      <Badge className="bg-purple-600">Diretor</Badge>
                    ) : (
                      <Badge className="bg-fpa-blue">Gestor</Badge>
                    )}
                  </TableCell>

                  {/* Ações */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Botões desktop */}
                      <div className="hidden sm:flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => startResetPassword(user)}>
                          <Key className="h-4 w-4" />
                          <span className="sr-only">Redefinir Senha</span>
                        </Button>

                        <Button variant="outline" size="icon" onClick={() => startEdit(user)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-red-500"
                              onClick={() => setSelectedUserId(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent onInteractOutside={(e) => e.preventDefault()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover este usuário? Esta ação não poderá ser desfeita.
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

                      {/* Dropdown mobile */}
                      <div className="sm:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>

                            <DropdownMenuItem onClick={() => startResetPassword(user)}>
                              <Key className="h-4 w-4 mr-2" /> Redefinir Senha
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => startEdit(user)}>
                              <Edit className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => {
                                    e.preventDefault()
                                    setSelectedUserId(user.id)
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
                                    Tem certeza que deseja remover este usuário? Esta ação não poderá ser desfeita.
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

      {/* paginação ----------------------------------------------------- */}
      {users.length > 0 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, users.length)} a{" "}
            {Math.min(currentPage * itemsPerPage, users.length)} de {users.length} usuários
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goPrevious} disabled={currentPage === 1}>
              Anterior
            </Button>
            <div className="text-sm">
              Página {currentPage} de {totalPages}
            </div>
            <Button variant="outline" size="sm" onClick={goNext} disabled={currentPage === totalPages}>
              Próxima
            </Button>
          </div>
        </div>
      )}

      {/* Modais --------------------------------------------------------- */}
      <UserModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={editingUser}
        onSuccess={() => {
          onUserUpdated?.()
          toast({ title: "Usuário atualizado", description: "O usuário foi atualizado com sucesso." })
        }}
      />

      <ResetPasswordModal
        open={isResetPasswordModalOpen}
        onOpenChange={setIsResetPasswordModalOpen}
        user={userForPasswordReset}
        onSuccess={() => {
          toast({ title: "Senha redefinida", description: "Senha do usuário redefinida com sucesso." })
        }}
      />
    </>
  )
}
