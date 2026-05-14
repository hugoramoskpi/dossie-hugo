import { NextResponse } from 'next/server'
import { getPublicAnswersOnly, saveSynthesis } from '@/lib/db'
import { generateSynthesis } from '@/lib/synthesize'
import { getCurrentUser } from '@/lib/auth'
import type { SynthesisType } from '@/lib/types'

const SYNTHESIS_TYPES: SynthesisType[] = [
  'bio_curta',
  'bio_longa',
  'sobre_mim_site',
  'headline_linkedin',
  'bullets_curriculo',
  'ideias_linkedin',
  'ideias_instagram',
  'guia_privacidade',
]

export async function POST() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const answers = getPublicAnswersOnly(user.id)

    if (answers.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma resposta pública encontrada. Responda pelo menos algumas perguntas antes de gerar a síntese.' },
        { status: 422 }
      )
    }

    const results: Record<string, string> = {}
    const errors: Record<string, string> = {}

    for (const type of SYNTHESIS_TYPES) {
      try {
        const content = await generateSynthesis(type, answers)
        saveSynthesis(user.id, type, content)
        results[type] = content
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        console.error(`Erro ao gerar síntese "${type}":`, msg)
        errors[type] = msg
      }
    }

    return NextResponse.json({ results, errors, answersUsed: answers.length })
  } catch (err) {
    console.error('POST /api/synthesize error:', err)
    return NextResponse.json({ error: 'Erro ao gerar síntese' }, { status: 500 })
  }
}
