import { getAgentBySlug } from './agents'
import { chatWithFallback, parseJsonResponse } from './providers'
import type { ChatMessage, Reflection } from './types'

function buildReflectionMessages(
  questionText: string,
  answer: string,
  history: ChatMessage[]
): ChatMessage[] {
  const contextHistory = history.slice(-6)

  const userPrompt = `
Pergunta: "${questionText}"

Resposta de Hugo: "${answer}"

Analise esta resposta e retorne o JSON de reflexão conforme instruído.
  `.trim()

  return [...contextHistory, { role: 'user', content: userPrompt }]
}

function parseReflection(raw: string): Reflection {
  const parsed = parseJsonResponse(raw) as Partial<Reflection>

  return {
    feedback: parsed.feedback ?? 'Não foi possível gerar feedback.',
    isGeneric: parsed.isGeneric ?? false,
    hasSensitiveContent: parsed.hasSensitiveContent ?? false,
    suggestedPrivacy: parsed.suggestedPrivacy ?? 'public',
    followUpQuestion: parsed.followUpQuestion,
    bulletSuggestion: parsed.bulletSuggestion,
    adaptedText: parsed.adaptedText,
  }
}

export async function reflect(
  moduleSlug: string,
  questionText: string,
  answer: string,
  history: ChatMessage[] = []
): Promise<Reflection> {
  const agent = getAgentBySlug(moduleSlug)
  const messages = buildReflectionMessages(questionText, answer, history)

  try {
    const raw = await chatWithFallback(messages, agent.systemPrompt)
    return parseReflection(raw)
  } catch (err) {
    console.error('Erro ao gerar reflexão:', err)
    return {
      feedback: 'Não foi possível processar a reflexão neste momento. Tente novamente.',
      isGeneric: false,
      hasSensitiveContent: false,
      suggestedPrivacy: 'public',
    }
  }
}
