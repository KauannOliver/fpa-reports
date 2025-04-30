'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import * as Auth    from '@/lib/auth'
import * as Reports from '@/lib/reports'
import * as Users   from '@/lib/users'

/* ------------------------------------------------------------------------ */
/*  Auth                                                                    */
/* ------------------------------------------------------------------------ */
export async function login(email: string, password: string) {
  try {
    await Auth.signIn(email, password)
    redirect('/dashboard')
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function logout() {
  await Auth.signOut()
}

/* ------------------------------------------------------------------------ */
/*  Reports (Admin)                                                         */
/* ------------------------------------------------------------------------ */

/** extrai checkboxes rep-<userId> do FormData */
function extractAllowedUsers(form: FormData): string[] {
  const list: string[] = []
  form.forEach((v, k) => k.startsWith('rep-') && list.push(k.replace('rep-', '')))
  return list
}

export async function createReport(form: FormData) {
  await Auth.requireAdmin()

  const titulo    = form.get('titulo')?.toString()      || ''
  const descricao = form.get('descricao')?.toString()   || null
  const url       = form.get('url')?.toString()         || ''
  const publico   = form.get('publico') === 'on'
  const allowed   = extractAllowedUsers(form)

  await Reports.createReport({ titulo, descricao, url_embed: url, publico, allowedUsers: allowed })
  revalidatePath('/admin/reports')
  return { success: true }
}

export async function updateReport(id: string, form: FormData) {
  await Auth.requireAdmin()

  const titulo    = form.get('titulo')?.toString()    ?? undefined
  const descricao = form.get('descricao')?.toString() ?? undefined
  const url       = form.get('url')?.toString()       ?? undefined
  const publico   = form.get('publico') === 'on'
  const allowed   = extractAllowedUsers(form)

  await Reports.updateReport(id, { titulo, descricao, url_embed: url, publico, allowedUsers: allowed })
  revalidatePath('/admin/reports')
  return { success: true }
}

export async function deleteReport(id: string) {
  await Auth.requireAdmin()
  await Reports.deleteReport(id)
  revalidatePath('/admin/reports')
  return { success: true }
}

/* ------------------------------------------------------------------------ */
/*  Users (Admin)                                                           */
/* ------------------------------------------------------------------------ */

export async function createUser(form: FormData) {
  await Auth.requireAdmin()

  const nome   = form.get('nome')?.toString()  || ''
  const email  = form.get('email')?.toString() || ''
  const senha  = form.get('senha')?.toString() || ''
  const perfil = form.get('perfil')?.toString() as Auth.AppRole
  const ativo  = form.get('ativo') === 'on'

  const reports: string[] = []
  form.forEach((v, k) => k.startsWith('rep-') && reports.push(k.replace('rep-', '')))

  await Users.createUser({ nome, email, senha, perfil, ativo, reports })
  revalidatePath('/admin/users')
  return { success: true }
}

export async function updateUser(id: string, form: FormData) {
  await Auth.requireAdmin()

  const nome     = form.get('nome')?.toString()  ?? undefined
  const email    = form.get('email')?.toString() ?? undefined
  const senhaRaw = form.get('senha')?.toString() ?? undefined
  const senha    = senhaRaw && senhaRaw.length ? senhaRaw : undefined
  const perfil   = form.get('perfil')?.toString() as Auth.AppRole

  /*  campo “ativo” só deve ser enviado se existir no formulário  */
  const ativoRaw = form.get('ativo')
  const ativo    = ativoRaw !== null ? (ativoRaw === 'on') : undefined

  const reports: string[] = []
  form.forEach((v, k) => k.startsWith('rep-') && reports.push(k.replace('rep-', '')))

  await Users.updateUser(id, { nome, email, senha: senha ?? null, perfil, ativo, reports })
  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(id: string) {
  await Auth.requireAdmin()
  await Users.deleteUser(id)
  revalidatePath('/admin/users')
  return { success: true }
}
