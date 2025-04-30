import { NextResponse } from 'next/server'
import { listUsers } from '@/lib/users'

export async function GET() {
  const users = await listUsers()
  return NextResponse.json(users)
}