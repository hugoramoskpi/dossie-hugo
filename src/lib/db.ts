import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import type {
  Answer,
  ConversationMessage,
  SynthesisRecord,
  SynthesisType,
  PrivacyLevel,
  ModuleProgress,
  User,
  Session,
} from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'dossie.db')

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (_db) return _db
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  _db = new Database(DB_PATH)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  initSchema(_db)
  return _db
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      module_slug TEXT NOT NULL,
      question_id TEXT NOT NULL,
      content TEXT NOT NULL,
      privacy TEXT NOT NULL DEFAULT 'public',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, module_slug, question_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      module_slug TEXT NOT NULL,
      question_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS synthesis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      generated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, type),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `)
}

// ============ USERS ============

export function createUser(email: string, passwordHash: string, name: string): User {
  const db = getDb()
  const result = db.prepare(
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)'
  ).run(email, passwordHash, name)

  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as DbUser
  return mapUser(row)
}

export function getUserByEmail(email: string): (User & { passwordHash: string }) | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as DbUser | undefined
  if (!row) return null
  return { ...mapUser(row), passwordHash: row.password_hash }
}

export function getUserById(id: number): User | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as DbUser | undefined
  return row ? mapUser(row) : null
}

// ============ SESSIONS ============

export function createSessionRecord(id: string, userId: number, expiresAt: string): void {
  const db = getDb()
  db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).run(id, userId, expiresAt)
}

export function getSession(id: string): Session | null {
  const db = getDb()
  const row = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as DbSession | undefined
  if (!row) return null
  if (new Date(row.expires_at) < new Date()) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(id)
    return null
  }
  return { id: row.id, userId: row.user_id, expiresAt: row.expires_at }
}

export function deleteSession(id: string): void {
  const db = getDb()
  db.prepare('DELETE FROM sessions WHERE id = ?').run(id)
}

// ============ ANSWERS ============

export function saveAnswer(
  userId: number,
  moduleSlug: string,
  questionId: string,
  content: string,
  privacy: PrivacyLevel = 'public'
): Answer {
  const db = getDb()
  db.prepare(`
    INSERT INTO answers (user_id, module_slug, question_id, content, privacy)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, module_slug, question_id)
    DO UPDATE SET content = excluded.content, privacy = excluded.privacy, updated_at = datetime('now')
  `).run(userId, moduleSlug, questionId, content, privacy)

  const row = db.prepare(
    'SELECT * FROM answers WHERE user_id = ? AND module_slug = ? AND question_id = ?'
  ).get(userId, moduleSlug, questionId) as DbAnswer
  return mapAnswer(row)
}

export function updateAnswerPrivacy(
  userId: number,
  moduleSlug: string,
  questionId: string,
  privacy: PrivacyLevel
): void {
  const db = getDb()
  db.prepare(
    "UPDATE answers SET privacy = ?, updated_at = datetime('now') WHERE user_id = ? AND module_slug = ? AND question_id = ?"
  ).run(privacy, userId, moduleSlug, questionId)
}

export function getAnswersByModule(userId: number, moduleSlug: string): Answer[] {
  const db = getDb()
  const rows = db.prepare(
    'SELECT * FROM answers WHERE user_id = ? AND module_slug = ? ORDER BY created_at ASC'
  ).all(userId, moduleSlug) as DbAnswer[]
  return rows.map(mapAnswer)
}

export function getAllPublicAnswers(userId: number): Answer[] {
  const db = getDb()
  const rows = db.prepare(
    "SELECT * FROM answers WHERE user_id = ? AND privacy != 'sensitive' ORDER BY module_slug, created_at ASC"
  ).all(userId) as DbAnswer[]
  return rows.map(mapAnswer)
}

export function getPublicAnswersOnly(userId: number): Answer[] {
  const db = getDb()
  const rows = db.prepare(
    "SELECT * FROM answers WHERE user_id = ? AND privacy = 'public' ORDER BY module_slug, created_at ASC"
  ).all(userId) as DbAnswer[]
  return rows.map(mapAnswer)
}

// ============ CONVERSATIONS ============

export function saveConversationMessage(
  userId: number,
  moduleSlug: string,
  questionId: string,
  role: 'user' | 'assistant',
  content: string
): void {
  const db = getDb()
  db.prepare(
    'INSERT INTO conversations (user_id, module_slug, question_id, role, content) VALUES (?, ?, ?, ?, ?)'
  ).run(userId, moduleSlug, questionId, role, content)
}

export function getConversationHistory(
  userId: number,
  moduleSlug: string,
  questionId: string
): ConversationMessage[] {
  const db = getDb()
  const rows = db.prepare(
    'SELECT * FROM conversations WHERE user_id = ? AND module_slug = ? AND question_id = ? ORDER BY created_at ASC'
  ).all(userId, moduleSlug, questionId) as DbConversation[]
  return rows.map(mapConversation)
}

// ============ SYNTHESIS ============

export function saveSynthesis(userId: number, type: SynthesisType, content: string): void {
  const db = getDb()
  db.prepare(`
    INSERT INTO synthesis (user_id, type, content)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, type) DO UPDATE SET content = excluded.content, generated_at = datetime('now')
  `).run(userId, type, content)
}

export function getSynthesis(userId: number, type: SynthesisType): SynthesisRecord | null {
  const db = getDb()
  const row = db.prepare(
    'SELECT * FROM synthesis WHERE user_id = ? AND type = ?'
  ).get(userId, type) as DbSynthesis | undefined
  return row ? mapSynthesis(row) : null
}

export function getAllSynthesis(userId: number): SynthesisRecord[] {
  const db = getDb()
  const rows = db.prepare(
    'SELECT * FROM synthesis WHERE user_id = ? ORDER BY type ASC'
  ).all(userId) as DbSynthesis[]
  return rows.map(mapSynthesis)
}

export function getModuleProgress(userId: number, moduleSlug: string, totalQuestions: number): ModuleProgress {
  const db = getDb()
  const result = db.prepare(
    'SELECT COUNT(*) as count FROM answers WHERE user_id = ? AND module_slug = ?'
  ).get(userId, moduleSlug) as { count: number }
  const answered = result.count
  return {
    moduleSlug,
    answered,
    total: totalQuestions,
    status: answered === 0 ? 'not_started' : answered >= totalQuestions ? 'complete' : 'in_progress',
  }
}

// ============ DB row mappers ============

interface DbUser {
  id: number
  email: string
  password_hash: string
  name: string
  created_at: string
}

interface DbSession {
  id: string
  user_id: number
  expires_at: string
  created_at: string
}

interface DbAnswer {
  id: number
  user_id: number
  module_slug: string
  question_id: string
  content: string
  privacy: string
  created_at: string
  updated_at: string
}

interface DbConversation {
  id: number
  user_id: number
  module_slug: string
  question_id: string
  role: string
  content: string
  created_at: string
}

interface DbSynthesis {
  id: number
  user_id: number
  type: string
  content: string
  generated_at: string
}

function mapUser(row: DbUser): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
  }
}

function mapAnswer(row: DbAnswer): Answer {
  return {
    id: row.id,
    userId: row.user_id,
    moduleSlug: row.module_slug,
    questionId: row.question_id,
    content: row.content,
    privacy: row.privacy as PrivacyLevel,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function mapConversation(row: DbConversation): ConversationMessage {
  return {
    id: row.id,
    userId: row.user_id,
    moduleSlug: row.module_slug,
    questionId: row.question_id,
    role: row.role as 'user' | 'assistant',
    content: row.content,
    createdAt: row.created_at,
  }
}

function mapSynthesis(row: DbSynthesis): SynthesisRecord {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as SynthesisType,
    content: row.content,
    generatedAt: row.generated_at,
  }
}
