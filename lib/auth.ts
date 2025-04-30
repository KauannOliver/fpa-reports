// lib/auth.ts
/**
 * Helper central de autenticação — **NÃO** usamos Supabase Auth.
 * O cookie http-only `sb_fpa_uid` guarda o ID do usuário autenticado.
 */
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "./supabaseAdmin"

/* -------------------------------------------------------------------------- */
/*  Tipos                                                                     */
/* -------------------------------------------------------------------------- */
export type AppRole = "admin" | "manager" | "director"

export interface UserRecord {
  id: string
  nome: string
  email: string
  perfil: AppRole
  ativo: boolean
}

export type User = UserRecord

/* -------------------------------------------------------------------------- */
/*  Helpers internos                                                          */
/* -------------------------------------------------------------------------- */
const COOKIE_NAME = "sb_fpa_uid"
const ONE_WEEK    = 60 * 60 * 24 * 7 // seg

async function setSessionCookie(userId: string) {
  const store = await cookies()
  store.set(COOKIE_NAME, userId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ONE_WEEK,
    path: "/",
  })
}

async function clearSessionCookie() {
  /* Só use dentro de Server Actions ou Route Handlers */
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

async function readUserIdFromCookie(): Promise<string | null> {
  try {
    return (await cookies()).get(COOKIE_NAME)?.value ?? null
  } catch {
    return null
  }
}

/* -------------------------------------------------------------------------- */
/*  API pública                                                               */
/* -------------------------------------------------------------------------- */
export async function getCurrentUser(): Promise<UserRecord | null> {
  const id = await readUserIdFromCookie()
  if (!id) return null

  const { data, error } = await supabaseAdmin()
    .from("users")
    .select("id, nome, email, perfil, ativo")
    .eq("id", id)
    .maybeSingle()

  /* IMPORTANTÍSSIMO: não tentamos mais apagar cookie aqui (fora de action) */
  if (error || !data || !data.ativo) return null

  return {
    id: data.id,
    nome: data.nome!,
    email: data.email!,
    perfil: data.perfil as AppRole,
    ativo: data.ativo!,
  }
}

export async function requireAuth(): Promise<UserRecord> {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return user
}

export async function requireAdmin(): Promise<UserRecord> {
  const user = await requireAuth()
  if (user.perfil !== "admin") redirect("/dashboard")
  return user
}

/* -------------------------------------------------------------------------- */
/*  Ações                                                                     */
/* -------------------------------------------------------------------------- */
export async function signIn(email: string, password: string) {
  const { data: user, error } = await supabaseAdmin()
    .from("users")
    .select("id, senha, ativo")
    .eq("email", email)
    .maybeSingle()

  if (error || !user) throw new Error("E-mail ou senha inválidos")
  if (!user.ativo)    throw new Error("Usuário inativo")

  const ok = await bcrypt.compare(password, user.senha)
  if (!ok) throw new Error("E-mail ou senha inválidos")

  await setSessionCookie(user.id)
}

export async function signOut() {
  /* chamada dentro de Server Action logout() → seguro */
  await clearSessionCookie()
  redirect("/login")
}
