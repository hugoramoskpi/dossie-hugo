import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProvider, ChatMessage } from '../types'

const MODEL_PRIORITY = [
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
  'gemini-pro-latest',
]

let cachedModel: string | null = null

async function resolveBestModel(apiKey: string): Promise<string> {
  if (process.env.GOOGLE_MODEL) return process.env.GOOGLE_MODEL
  if (cachedModel) return cachedModel

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=50`
    )
    const data = await res.json() as { models?: { name: string; supportedGenerationMethods?: string[] }[] }
    const available = (data.models ?? [])
      .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m) => m.name.replace('models/', ''))

    for (const preferred of MODEL_PRIORITY) {
      if (available.includes(preferred)) {
        cachedModel = preferred
        console.log(`[Google] Modelo selecionado: ${preferred}`)
        return preferred
      }
    }

    if (available.length > 0) {
      cachedModel = available[0]
      console.log(`[Google] Fallback para: ${available[0]}`)
      return available[0]
    }
  } catch (err) {
    console.error('[Google] Erro ao listar modelos:', err)
  }

  cachedModel = 'gemini-2.5-flash'
  return cachedModel
}

export function createGoogleProvider(): AIProvider {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY não configurada')

  const client = new GoogleGenerativeAI(apiKey)

  return {
    name: 'google',
    async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
      const modelName = await resolveBestModel(apiKey)

      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      })

      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }))

      const lastMessage = messages[messages.length - 1]
      const chat = model.startChat({ history })
      const result = await chat.sendMessage(lastMessage.content)
      return result.response.text()
    },
  }
}
