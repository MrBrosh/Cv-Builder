import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import type { RegisterInput } from './schemas.js'

const SALT_BYTES = 16
const TOKEN_BYTES = 32

/** Default admin user – can be shared with lecturer. Override via .env (ADMIN_EMAIL, ADMIN_PASSWORD) */
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? 'admin@cvbuilder.local').trim().toLowerCase()
export const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? 'Admin123!').trim()
const ADMIN_NAME = (process.env.ADMIN_NAME ?? 'Admin (lecturer)').trim()

type User = {
  email: string
  name: string
  salt: string
  passwordHash: string
}

const users = new Map<string, User>()
const sessions = new Map<string, string>() // token -> email

export function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(salt + password).digest('hex')
}

export function createUser({ email, password, name }: RegisterInput): User {
  const salt = crypto.randomBytes(SALT_BYTES).toString('hex')
  const passwordHash = hashPassword(password, salt)
  const user: User = { email: email.toLowerCase(), name, salt, passwordHash }
  users.set(user.email, user)
  return user
}

/** Creates admin user on server startup (for sharing with lecturer). */
export function ensureAdminUser(): void {
  createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    name: ADMIN_NAME || 'Admin',
  })
  const defaultPass = process.env.ADMIN_PASSWORD ? '(from .env)' : 'Admin123!'
  console.log(`Admin user ready – login: ${ADMIN_EMAIL} / ${defaultPass}`)
}

export function findUserByEmail(email: string): User | undefined {
  return users.get(email.toLowerCase())
}

export function verifyPassword(user: User, password: string): boolean {
  return hashPassword(password, user.salt) === user.passwordHash
}

export function createSession(email: string): string {
  const token = crypto.randomBytes(TOKEN_BYTES).toString('hex')
  sessions.set(token, email.toLowerCase())
  return token
}

export function getEmailByToken(token: string): string | undefined {
  return sessions.get(token)
}

export function destroySession(token: string): void {
  sessions.delete(token)
}

export interface AuthRequest extends Request {
  userEmail?: string
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required' })
    return
  }
  const email = getEmailByToken(token)
  if (!email) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' })
    return
  }
  req.userEmail = email
  next()
}
