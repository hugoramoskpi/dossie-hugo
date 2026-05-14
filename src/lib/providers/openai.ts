import OpenAI from 'openai'
import type { AIProvider, ChatMessage } from '../types'

export function createOpenAIProvider(): AIProvider {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY não configurada')

  const client = new OpenAI({ apiKey })

  return {
    name: 'openai',
    async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
      const allMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
      ]

      const response = await client.chat.completions.create({
        model: 'gpt-4o',
        messages: allMessages,
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content
      if (!content) throw new Error('OpenAI returned empty response')
      return content
    },
  }
}
