import type { AIProvider, ChatMessage } from '../types'
import { createGoogleProvider } from './google'
import { createOpenAIProvider } from './openai'
import { createAnthropicProvider } from './anthropic'

type ProviderName = 'google' | 'openai' | 'anthropic'

const PROVIDER_ORDER: ProviderName[] = ['google', 'openai', 'anthropic']

function createProvider(name: ProviderName): AIProvider {
  switch (name) {
    case 'google':
      return createGoogleProvider()
    case 'openai':
      return createOpenAIProvider()
    case 'anthropic':
      return createAnthropicProvider()
  }
}

function getConfiguredProvider(): ProviderName {
  const env = process.env.AI_PROVIDER as ProviderName | undefined
  if (env && PROVIDER_ORDER.includes(env)) return env
  return 'google'
}

export async function chatWithFallback(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  const preferred = getConfiguredProvider()
  const order = [preferred, ...PROVIDER_ORDER.filter((p) => p !== preferred)]

  let lastError: Error | null = null

  for (const providerName of order) {
    const keyEnv = {
      google: 'GOOGLE_API_KEY',
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
    }[providerName]

    if (!process.env[keyEnv]) continue

    try {
      const provider = createProvider(providerName)
      return await provider.chat(messages, systemPrompt)
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.error(`Provider ${providerName} falhou:`, lastError.message)
    }
  }

  throw lastError ?? new Error('Nenhum provider de IA configurado. Configure GOOGLE_API_KEY, OPENAI_API_KEY ou ANTHROPIC_API_KEY no .env.local')
}

export function parseJsonResponse(raw: string): unknown {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()

  try {
    return JSON.parse(stripped)
  } catch {
    const jsonMatch = stripped.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0])
      } catch {
        // fallthrough
      }
    }
    throw new Error(`Resposta da IA não é JSON válido: ${raw.slice(0, 200)}`)
  }
}
