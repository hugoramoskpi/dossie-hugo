import { MODULES } from './questions'
import { SYNTHESIS_LABELS } from './types'
import type { Answer, ExportType, SynthesisRecord } from './types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function groupAnswersByModule(answers: Answer[]): Record<string, Answer[]> {
  const grouped: Record<string, Answer[]> = {}
  for (const a of answers) {
    if (!grouped[a.moduleSlug]) grouped[a.moduleSlug] = []
    grouped[a.moduleSlug].push(a)
  }
  return grouped
}

export function generateExport(
  type: ExportType,
  answers: Answer[],
  synthesis: SynthesisRecord[]
): string {
  const now = formatDate(new Date().toISOString())

  switch (type) {
    case 'dossie-completo':
      return buildDossieCompleto(answers, now)
    case 'curriculo-base':
      return buildCurriculoBase(answers, synthesis, now)
    case 'perfil-linkedin':
      return buildPerfilLinkedIn(answers, synthesis, now)
    case 'ideias-conteudo':
      return buildIdeiasConteudo(synthesis, now)
    case 'guia-editorial':
      return buildGuiaEditorial(synthesis, now)
  }
}

function buildDossieCompleto(answers: Answer[], date: string): string {
  // Filtra sensitive — nunca entra em exports
  const filtered = answers.filter((a) => a.privacy !== 'sensitive')
  const grouped = groupAnswersByModule(filtered)

  const sections = MODULES.map((module) => {
    const moduleAnswers = grouped[module.slug] ?? []
    if (moduleAnswers.length === 0) return null

    const lines = moduleAnswers.map((a) => {
      const question = module.questions.find((q) => q.id === a.questionId)
      const privacyTag = a.privacy === 'private' ? ' _(privado)_' : ''
      return `**${question?.text ?? a.questionId}**${privacyTag}\n\n${a.content}`
    })

    return `## ${module.icon} ${module.name}\n\n${lines.join('\n\n---\n\n')}`
  }).filter(Boolean)

  return `# Dossiê Completo — Hugo\n_Gerado em ${date}_\n\n> Este documento contém respostas públicas e privadas. Respostas sensíveis foram omitidas.\n\n${sections.join('\n\n---\n\n')}`
}

function buildCurriculoBase(answers: Answer[], synthesis: SynthesisRecord[], date: string): string {
  const publicAnswers = answers.filter((a) => a.privacy === 'public')
  const grouped = groupAnswersByModule(publicAnswers)

  const bulletsSynthesis = synthesis.find((s) => s.type === 'bullets_curriculo')
  const bioSynthesis = synthesis.find((s) => s.type === 'bio_curta')

  const curriculoModule = grouped['curriculo'] ?? []
  const qualificacoesModule = grouped['qualificacoes'] ?? []
  const empreendimentosModule = grouped['empreendimentos'] ?? []

  const modules = MODULES.reduce((acc, m) => ({ ...acc, [m.slug]: m }), {} as Record<string, typeof MODULES[0]>)

  function formatSection(slug: string, sectionAnswers: Answer[]): string {
    if (sectionAnswers.length === 0) return ''
    const m = modules[slug]
    return sectionAnswers.map((a) => {
      const q = m?.questions.find((q) => q.id === a.questionId)
      return `**${q?.text ?? a.questionId}**\n${a.content}`
    }).join('\n\n')
  }

  const parts: string[] = [
    `# Currículo Base — Hugo\n_Gerado em ${date}_\n`,
    bioSynthesis ? `## Bio Profissional\n\n${bioSynthesis.content}` : '',
    bulletsSynthesis ? `## Realizações e Impacto\n\n${bulletsSynthesis.content}` : '',
    curriculoModule.length > 0 ? `## Experiência Profissional\n\n${formatSection('curriculo', curriculoModule)}` : '',
    qualificacoesModule.length > 0 ? `## Formação e Qualificações\n\n${formatSection('qualificacoes', qualificacoesModule)}` : '',
    empreendimentosModule.length > 0 ? `## Empreendimentos\n\n${formatSection('empreendimentos', empreendimentosModule)}` : '',
  ]

  return parts.filter(Boolean).join('\n\n---\n\n')
}

function buildPerfilLinkedIn(answers: Answer[], synthesis: SynthesisRecord[], date: string): string {
  const headlineSynthesis = synthesis.find((s) => s.type === 'headline_linkedin')
  const bioLongaSynthesis = synthesis.find((s) => s.type === 'bio_longa')
  const bulletsSynthesis = synthesis.find((s) => s.type === 'bullets_curriculo')
  const ideiasLinkedIn = synthesis.find((s) => s.type === 'ideias_linkedin')

  const parts: string[] = [
    `# Perfil LinkedIn — Hugo\n_Gerado em ${date}_\n`,
    headlineSynthesis ? `## Headline\n\n${headlineSynthesis.content}` : '',
    bioLongaSynthesis ? `## Seção "Sobre"\n\n${bioLongaSynthesis.content}` : '',
    bulletsSynthesis ? `## Experiências — Bullets de Impacto\n\n${bulletsSynthesis.content}` : '',
    ideiasLinkedIn ? `## Primeiras Pautas Recomendadas\n\n${ideiasLinkedIn.content}` : '',
  ]

  return parts.filter(Boolean).join('\n\n---\n\n')
}

function buildIdeiasConteudo(synthesis: SynthesisRecord[], date: string): string {
  const linkedin = synthesis.find((s) => s.type === 'ideias_linkedin')
  const instagram = synthesis.find((s) => s.type === 'ideias_instagram')

  const parts: string[] = [
    `# Ideias de Conteúdo — Hugo\n_Gerado em ${date}_\n`,
    linkedin ? `## LinkedIn\n\n${linkedin.content}` : '',
    instagram ? `## Instagram\n\n${instagram.content}` : '',
  ]

  return parts.filter(Boolean).join('\n\n---\n\n')
}

function buildGuiaEditorial(synthesis: SynthesisRecord[], date: string): string {
  const guia = synthesis.find((s) => s.type === 'guia_privacidade')

  const parts: string[] = [
    `# Guia Editorial e de Privacidade — Hugo\n_Gerado em ${date}_\n`,
    guia ? guia.content : '_Síntese ainda não gerada. Acesse /sintese e clique em "Gerar Síntese" primeiro._',
  ]

  return parts.join('\n\n')
}

export { SYNTHESIS_LABELS }
