import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/db'
import { createSession, verifyPassword } from '@/lib/auth'

// Brute-force guard: max 10 attempts per email per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 10
const WINDOW_MS = 15 * 60 * 1000

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const record = loginAttempts.get(email)
  if (!record || now > record.resetAt) {
    loginAttempts.set(email, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (record.count >= MAX_ATTEMPTS) return false
  record.count++
  return true
}

// Constant-time dummy hash — always run bcrypt even for unknown emails
const DUMMY_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email?: string; password?: string }
    const email = body.email?.trim().toLowerCase()
    const password = body.password

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }

    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde 15 minutos.' },
        { status: 429 }
      )
    }

    const user = getUserByEmail(email)
    // Always run bcrypt to prevent timing-based email enumeration
    const hash = user?.passwordHash ?? DUMMY_HASH
    const valid = await verifyPassword(password, hash)

    if (!user || !valid) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 })
    }

    await createSession(user.id)

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    })
  } catch (err) {
    console.error('POST /api/auth/login error:', err)
    return NextResponse.json({ error: 'Erro ao fazer login' }, { status: 500 })
  }
}
