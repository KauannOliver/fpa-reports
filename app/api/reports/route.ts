import { NextResponse } from 'next/server'
import { getAllReports } from '@/lib/reports'

export async function GET() {
  const reports = await getAllReports()
  return NextResponse.json(reports)
}