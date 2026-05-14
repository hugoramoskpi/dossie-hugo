import { NextRequest, NextResponse } from 'next/server'
import { getAnswersByModule, saveAnswer, updateAnswerPrivacy } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { VALID_MODULE_SLUGS } from '@/lib/agents'
import type { PrivacyLevel } from '@/lib/types'

const VALID_PRIVACY: Set<PrivacyLevel> = new Set(['public', 'private', 'sensitive'])

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const moduleSlug = searchParams.get('module')

  if (!moduleSlug) {
    return NextResponse.json({ error: 'Parâmetro "module" obrigatório' }, { status: 400 })
  }

  if (!VALID_MODULE_SLUGS.has(moduleSlug)) {
    return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })
  }

  try {
    const answers = getAnswersByModule(user.id, moduleSlug)
    return NextResponse.json({ answers })
  } catch (err) {
    console.error('GET /api/answers error:', err)
    return NextResponse.json({ error: 'Erro ao buscar respostas' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const body = await request.json() as {
      moduleSlug: string
      questionId: string
      content: string
      privacy?: PrivacyLevel
    }

    const { moduleSlug, questionId, content, privacy = 'public' } = body

    if (!moduleSlug || !questionId || !content?.trim()) {
      return NextResponse.json(
        { error: 'moduleSlug, questionId e content são obrigatórios' },
        { status: 400 }
      )
    }

    if (!VALID_MODULE_SLUGS.has(moduleSlug)) {
      return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })
    }

    if (!VALID_PRIVACY.has(privacy)) {
      return NextResponse.json({ error: 'Privacidade inválida' }, { status: 400 })
    }

    const answer = saveAnswer(user.id, moduleSlug, questionId, content.trim(), privacy)
    return NextResponse.json({ answer }, { status: 201 })
  } catch (err) {
    console.error('POST /api/answers error:', err)
    return NextResponse.json({ error: 'Erro ao salvar resposta' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const body = await request.json() as {
      moduleSlug: string
      questionId: string
      privacy: PrivacyLevel
    }

    const { moduleSlug, questionId, privacy } = body

    if (!moduleSlug || !questionId || !privacy) {
      return NextResponse.json(
        { error: 'moduleSlug, questionId e privacy são obrigatórios' },
        { status: 400 }
      )
    }

    if (!VALID_MODULE_SLUGS.has(moduleSlug)) {
      return NextResponse.json({ error: 'Módulo inválido' }, { status: 400 })
    }

    if (!VALID_PRIVACY.has(privacy)) {
      return NextResponse.json({ error: 'Privacidade inválida' }, { status: 400 })
    }

    updateAnswerPrivacy(user.id, moduleSlug, questionId, privacy)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('PATCH /api/answers error:', err)
    return NextResponse.json({ error: 'Erro ao atualizar privacidade' }, { status: 500 })
  }
}
