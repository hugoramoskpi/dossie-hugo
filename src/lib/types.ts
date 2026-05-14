export type PrivacyLevel = 'public' | 'private' | 'sensitive'

export type ModuleStatus = 'not_started' | 'in_progress' | 'complete'

export interface User {
  id: number
  email: string
  name: string
  createdAt: string
}

export interface Session {
  id: string
  userId: number
  expiresAt: string
}

export interface Question {
  id: string
  moduleSlug: string
  order: number
  text: string
  hint?: string
}

export interface Module {
  slug: string
  name: string
  description: string
  icon: string
  questions: Question[]
}

export interface Answer {
  id: number
  userId: number
  moduleSlug: string
  questionId: string
  content: string
  privacy: PrivacyLevel
  createdAt: string
  updatedAt: string
}

export interface ConversationMessage {
  id: number
  userId: number
  moduleSlug: string
  questionId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

export interface SynthesisRecord {
  id: number
  userId: number
  type: SynthesisType
  content: string
  generatedAt: string
}

export type SynthesisType =
  | 'bio_curta'
  | 'bio_longa'
  | 'sobre_mim_site'
  | 'headline_linkedin'
  | 'bullets_curriculo'
  | 'ideias_linkedin'
  | 'ideias_instagram'
  | 'guia_privacidade'

export type ExportType =
  | 'dossie-completo'
  | 'curriculo-base'
  | 'perfil-linkedin'
  | 'ideias-conteudo'
  | 'guia-editorial'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface Reflection {
  feedback: string
  isGeneric: boolean
  hasSensitiveContent: boolean
  suggestedPrivacy: PrivacyLevel
  followUpQuestion?: string
  bulletSuggestion?: string
  adaptedText?: string
}

export interface SpecialistAgent {
  id: string
  moduleSlug: string
  name: string
  title: string
  academicContext: string
  interviewStyle: string
  systemPrompt: string
}

export interface AIProvider {
  name: string
  chat(messages: ChatMessage[], systemPrompt: string): Promise<string>
}

export interface ModuleProgress {
  moduleSlug: string
  answered: number
  total: number
  status: ModuleStatus
}

export interface SynthesisOutput {
  type: SynthesisType
  label: string
  content: string
}

export const SYNTHESIS_LABELS: Record<SynthesisType, string> = {
  bio_curta: 'Bio Curta',
  bio_longa: 'Bio Longa',
  sobre_mim_site: 'Sobre Mim (Site)',
  headline_linkedin: 'Headline LinkedIn',
  bullets_curriculo: 'Bullets Currículo',
  ideias_linkedin: 'Ideias LinkedIn',
  ideias_instagram: 'Ideias Instagram',
  guia_privacidade: 'Guia de Privacidade',
}

export const EXPORT_LABELS: Record<ExportType, string> = {
  'dossie-completo': 'Dossiê Completo',
  'curriculo-base': 'Currículo Base',
  'perfil-linkedin': 'Perfil LinkedIn',
  'ideias-conteudo': 'Ideias de Conteúdo',
  'guia-editorial': 'Guia Editorial',
}
