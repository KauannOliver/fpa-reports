// lib/users.ts

import { supabaseAdmin } from './supabaseAdmin'
import bcrypt from 'bcryptjs'
import type { AppRole, UserRecord } from './auth'

/** Returns every user sorted by `nome`. */
export type User = UserRecord

export async function listUsers(): Promise<UserRecord[]> {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase
    .from('users')
    .select('id, nome, email, perfil, ativo')
    .order('nome')

  if (error) throw error
  return data as UserRecord[]
}

/** Creates a user and returns the inserted row (excluding password). */
export async function createUser(values: {
  nome: string
  email: string
  senha: string
  perfil: AppRole
  ativo?: boolean
  reports?: string[] // optional list of report ids to grant
}): Promise<UserRecord> {
  const supabase = supabaseAdmin()

  // hash password
  const hashed = await bcrypt.hash(values.senha, 10)

  const { data: user, error } = await supabase
    .from('users')
    .insert({
      nome: values.nome,
      email: values.email,
      senha: hashed,
      perfil: values.perfil,
      ativo: values.ativo ?? true,
    })
    .select('id, nome, email, perfil, ativo')
    .single()

  if (error || !user) throw (error ?? new Error('Failed to create user'))

  // if reports list provided → insert permissions
  if (values.reports && values.reports.length) {
    const permRows = values.reports.map((repId) => ({
      usuario_id: user.id,
      bireport_id: repId,
    }))

    await supabase.from('bireport_permissoes').insert(permRows)
  }

  return user as UserRecord
}

/** Updates the user.  `senha` is optional (hashing is automatic). */
export async function updateUser(
  id: string,
  values: Partial<{
    nome: string
    email: string
    senha: string | null
    perfil: AppRole
    ativo: boolean
    reports: string[]
  }>
): Promise<UserRecord> {
  const supabase = supabaseAdmin()

  const updatePayload: any = { ...values }
  if (values.senha) {
    updatePayload.senha = await bcrypt.hash(values.senha, 10)
  } else {
    delete updatePayload.senha
  }
  delete updatePayload.reports // handled separately

  const { data: user, error } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', id)
    .select('id, nome, email, perfil, ativo')
    .single()

  if (error || !user) throw (error ?? new Error('Failed to update user'))

  // sync permissions if provided
  if (values.reports) {
    await supabase.from('bireport_permissoes').delete().eq('usuario_id', id)
    if (values.reports.length) {
      const rows = values.reports.map((repId) => ({
        usuario_id: id,
        bireport_id: repId,
      }))
      await supabase.from('bireport_permissoes').insert(rows)
    }
  }

  return user as UserRecord
}

export async function deleteUser(id: string) {
  const supabase = supabaseAdmin()
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
}