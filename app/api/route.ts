import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Smart Film Production API is running' })
}
