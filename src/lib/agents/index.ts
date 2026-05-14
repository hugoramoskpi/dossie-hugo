import type { SpecialistAgent } from '../types'
import identidade from './identidade'
import valores from './valores'
import curriculo from './curriculo'
import qualificacoes from './qualificacoes'
import empreendimentos from './empreendimentos'
import familia from './familia'
import hobbies from './hobbies'
import posicionamento from './posicionamento'
import conteudo from './conteudo'
import metas from './metas'

export const VALID_MODULE_SLUGS = new Set([
  'identidade', 'valores', 'curriculo', 'qualificacoes', 'empreendimentos',
  'familia', 'hobbies', 'posicionamento', 'conteudo', 'metas',
])

const AGENTS: Record<string, SpecialistAgent> = {
  identidade,
  valores,
  curriculo,
  qualificacoes,
  empreendimentos,
  familia,
  hobbies,
  posicionamento,
  conteudo,
  metas,
}

export function getAgentBySlug(moduleSlug: string): SpecialistAgent {
  const agent = AGENTS[moduleSlug]
  if (!agent) {
    throw new Error(`Agente não encontrado para o módulo: ${moduleSlug}`)
  }
  return agent
}

export function getAllAgents(): SpecialistAgent[] {
  return Object.values(AGENTS)
}
