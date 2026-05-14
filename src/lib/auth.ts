import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { cookies } from 'next/headers'
import {
  createSessionRecord,
  deleteSession,
  getSession,
  getUserById,
} from './db'
import type { User } from './types'
import { SESSION_COOKIE_NAME } from './auth-constants'

const SESSION_DURATION_DAYS = 30

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: number): Promise<string> {
  const id = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000)
  createSessionRecord(id, userId, expiresAt.toISOString())

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  })

  return id
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (!sessionId) return null

  const session = getSession(sessionId)
  if (!session) {
    // Session expired or invalid — clear stale cookie
    cookieStore.delete(SESSION_COOKIE_NAME)
    return null
  }

  return getUserById(session.userId)
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) throw new AuthError('Não autenticado')
  return user
}

export async function destroyCurrentSession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (sessionId) {
    deleteSession(sessionId)
    cookieStore.delete(SESSION_COOKIE_NAME)
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

export { SESSION_COOKIE_NAME as COOKIE_NAME }
