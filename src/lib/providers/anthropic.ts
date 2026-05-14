import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, ChatMessage } from '../types'

export function createAnthropicProvider(): AIProvider {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY não configurada')

  const client = new Anthropic({ apiKey })

  return {
    name: 'anthropic',
    async chat(messages: ChatMessage[], systemPrompt: string): Promise<string> {
      const anthropicMessages: Anthropic.MessageParam[] = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: systemPrompt,
        messages: anthropicMessages,
      })

      const block = response.content[0]
      if (!block || block.type !== 'text') throw new Error('Anthropic returned non-text response')
      return block.text
    },
  }
}
