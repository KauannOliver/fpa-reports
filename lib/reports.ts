// lib/reports.ts
/**
 * CRUD helpers + regras de visibilidade para a tabela `bireports`.
 * Todos os acessos usam o client service-role (RLS bypass).
 */
import { supabaseAdmin } from "./supabaseAdmin"
import type { UserRecord, AppRole } from "./auth"

/* -------------------------------------------------------------------------- */
/*  Tipos                                                                     */
/* -------------------------------------------------------------------------- */
export interface Report {
  id: string
  titulo: string
  descricao: string | null
  url_embed: string
  publico: boolean
  ativo: boolean
  criado_em: string          // ISO
  allowedUsers: string[]     // IDs de usuários com permissão explícita
}

/* -------------------------------------------------------------------------- */
/*  VISIBILIDADE POR PERFIL                                                   */
/* -------------------------------------------------------------------------- */
export async function listReports(user: UserRecord | null): Promise<Report[]> {
  const supa = supabaseAdmin()

  /* 1 ▸ relatórios públicos e ativos */
  const { data: pubRows, error: errPub } = await supa
    .from("bireports")
    .select("id, titulo, descricao, url_embed, publico, ativo, criado_em")
    .eq("ativo", true)
    .eq("publico", true)
  if (errPub) throw errPub

  /* anônimo → só públicos */
  if (!user) return pubRows!.map(r => ({ ...r, allowedUsers: [] })) as Report[]

  /* admin → tudo (+ allowedUsers) */
  if (user.perfil === "admin") {
    const { data, error } = await supa
      .from("bireports")
      .select(`
        id, titulo, descricao, url_embed, publico, ativo, criado_em,
        bireport_permissoes(usuario_id)
      `)
      .eq("ativo", true)
    if (error) throw error

    return data!.map((row: any) => ({
      id: row.id,
      titulo: row.titulo,
      descricao: row.descricao,
      url_embed: row.url_embed,
      publico: row.publico,
      ativo: row.ativo,
      criado_em: row.criado_em,
      allowedUsers: row.bireport_permissoes?.map((p: any) => p.usuario_id) ?? [],
    })) as Report[]
  }

  /* manager / director → públicos + os com permissão */
  const { data: permRows, error: errPerm } = await supa
    .from("bireport_permissoes")
    .select("bireport_id")
    .eq("usuario_id", user.id)
  if (errPerm) throw errPerm

  const ids = permRows.map(r => r.bireport_id)

  let explicit: any[] = []
  if (ids.length) {
    const { data, error } = await supa
      .from("bireports")
      .select("id, titulo, descricao, url_embed, publico, ativo, criado_em")
      .eq("ativo", true)
      .in("id", ids)
    if (error) throw error
    explicit = data as any[]
  }

  const merged = [...pubRows!, ...explicit]
  const unique = new Map(merged.map((r: any) => [r.id, r]))

  return Array.from(unique.values()).map(r => ({ ...r, allowedUsers: [] })) as Report[]
}

/* -------------------------------------------------------------------------- */
/*  LISTA COMPLETA (admin)                                                    */
/* -------------------------------------------------------------------------- */
export async function getAllReports(): Promise<Report[]> {
  const { data, error } = await supabaseAdmin()
    .from("bireports")
    .select(`
      id, titulo, descricao, url_embed, publico, ativo, criado_em,
      bireport_permissoes(usuario_id)
    `)
    .order("titulo")
  if (error) throw error

  return data!.map((row: any) => ({
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao,
    url_embed: row.url_embed,
    publico: row.publico,
    ativo: row.ativo,
    criado_em: row.criado_em,
    allowedUsers: row.bireport_permissoes?.map((p: any) => p.usuario_id) ?? [],
  })) as Report[]
}

/* -------------------------------------------------------------------------- */
/*  CRUD (admin)                                                              */
/* -------------------------------------------------------------------------- */
export async function createReport(values: {
  titulo: string
  descricao?: string | null
  url_embed: string
  publico?: boolean
  allowedUsers?: string[]
}): Promise<Report> {
  const supa = supabaseAdmin()

  /* 1 ▸ cria o registro principal */
  const { data: rpt, error } = await supa
    .from("bireports")
    .insert({
      titulo: values.titulo,
      descricao: values.descricao ?? null,
      url_embed: values.url_embed,
      publico: values.publico ?? false,
    })
    .select("id, titulo, descricao, url_embed, publico, ativo, criado_em")
    .single()
  if (error) throw error

  /* 2 ▸ permissões explicitadas */
  if (values.allowedUsers?.length) {
    const rows = values.allowedUsers.map(uid => ({ bireport_id: rpt.id, usuario_id: uid }))
    await supa.from("bireport_permissoes").insert(rows)
  }

  return { ...rpt, allowedUsers: values.allowedUsers ?? [] } as Report
}

export async function updateReport(
  id: string,
  values: Partial<{
    titulo: string
    descricao: string | null
    url_embed: string
    publico: boolean
    ativo: boolean
    allowedUsers: string[]
  }>,
): Promise<Report> {
  const supa = supabaseAdmin()

  /* 1 ▸ atualiza campos simples (campos undefined são ignorados)        */
  const { data: rpt, error } = await supa
    .from("bireports")
    .update({
      titulo:    values.titulo,
      descricao: values.descricao,
      url_embed: values.url_embed,
      publico:   values.publico,
      ativo:     values.ativo,
    })
    .eq("id", id)
    .select("id, titulo, descricao, url_embed, publico, ativo, criado_em")
    .single()
  if (error) throw error

  /* 2 ▸ sincroniza permissões se veio allowedUsers                       */
  if (values.allowedUsers) {
    await supa.from("bireport_permissoes").delete().eq("bireport_id", id)

    if (values.allowedUsers.length) {
      const rows = values.allowedUsers.map(uid => ({ bireport_id: id, usuario_id: uid }))
      await supa.from("bireport_permissoes").insert(rows)
    }
  }

  return { ...rpt, allowedUsers: values.allowedUsers ?? [] } as Report
}

export async function deleteReport(id: string) {
  const { error } = await supabaseAdmin()
    .from("bireports")
    .delete()
    .eq("id", id)
  if (error) throw error
}

/* -------------------------------------------------------------------------- */
/*  DASHBOARD: relatórios de um usuário                                       */
/* -------------------------------------------------------------------------- */
export async function getReportsForUser(userId: string): Promise<Report[]> {
  const { data: user, error } = await supabaseAdmin()
    .from("users")
    .select("id, nome, email, perfil, ativo")
    .eq("id", userId)
    .maybeSingle()
  if (error || !user) throw error ?? new Error("User not found")

  return listReports({
    id: user.id,
    nome: user.nome!,
    email: user.email!,
    perfil: user.perfil as AppRole,
    ativo: user.ativo!,
  })
}
