import { NextRequest, NextResponse } from 'next/server'
import { reflect } from '@/lib/reflect'
import { saveConversationMessage } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import type { ChatMessage } from '@/lib/types'

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const body = await request.json() as {
      moduleSlug: string
      questionId: string
      questionText: string
      answer: string
      history?: ChatMessage[]
    }

    const { moduleSlug, questionId, questionText, answer, history = [] } = body

    if (!moduleSlug || !questionId || !questionText || !answer?.trim()) {
      return NextResponse.json(
        { error: 'moduleSlug, questionId, questionText e answer são obrigatórios' },
        { status: 400 }
      )
    }

    saveConversationMessage(user.id, moduleSlug, questionId, 'user', answer.trim())

    const reflection = await reflect(moduleSlug, questionText, answer.trim(), history)

    saveConversationMessage(user.id, moduleSlug, questionId, 'assistant', reflection.feedback)

    return NextResponse.json({ reflection })
  } catch (err) {
    console.error('POST /api/reflect error:', err)
    return NextResponse.json({ error: 'Erro ao gerar reflexão' }, { status: 500 })
  }
}
