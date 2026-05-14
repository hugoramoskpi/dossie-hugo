'use client'

import { useState, useCallback } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReflectionCard } from '@/components/ReflectionCard'
import { PrivacyBadge } from '@/components/PrivacyBadge'
import type { Answer, Question, Reflection, PrivacyLevel, ChatMessage } from '@/lib/types'
import type { SpecialistAgent } from '@/lib/types'

interface ChatInterfaceProps {
  question: Question
  agent: SpecialistAgent
  existingAnswer?: Answer
  onAnswerSaved: (answer: Answer) => void
}

export function ChatInterface({ question, agent, existingAnswer, onAnswerSaved }: ChatInterfaceProps) {
  const [text, setText] = useState('')
  const [privacy, setPrivacy] = useState<PrivacyLevel>(existingAnswer?.privacy ?? 'public')
  const [reflection, setReflection] = useState<Reflection | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<ChatMessage[]>([])
  const [savedAnswer, setSavedAnswer] = useState<Answer | null>(existingAnswer ?? null)

  const handleSubmit = useCallback(async (overrideText?: string) => {
    const submission = (overrideText ?? text).trim()
    if (!submission || loading) return

    setLoading(true)
    setError(null)
    setReflection(null)

    try {
      const saveRes = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleSlug: question.moduleSlug,
          questionId: question.id,
          content: submission,
          privacy,
        }),
      })

      if (!saveRes.ok) throw new Error('Erro ao salvar resposta')
      const { answer } = await saveRes.json() as { answer: Answer }
      setSavedAnswer(answer)
      onAnswerSaved(answer)

      const reflectRes = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleSlug: question.moduleSlug,
          questionId: question.id,
          questionText: question.text,
          answer: submission,
          history,
        }),
      })

      if (!reflectRes.ok) throw new Error('Erro ao gerar reflexão')
      const { reflection: ref } = await reflectRes.json() as { reflection: Reflection }
      setReflection(ref)

      setHistory((prev) => [
        ...prev,
        { role: 'user', content: submission },
        { role: 'assistant', content: ref.feedback },
      ])

      if (ref.suggestedPrivacy !== privacy) {
        setPrivacy(ref.suggestedPrivacy)
        await fetch('/api/answers', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleSlug: question.moduleSlug,
            questionId: question.id,
            privacy: ref.suggestedPrivacy,
          }),
        })
      }

      setText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [text, privacy, loading, question, history, onAnswerSaved])

  const handleUseAdaptedText = useCallback(async (adapted: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleSlug: question.moduleSlug,
          questionId: question.id,
          content: adapted,
          privacy,
        }),
      })
      if (!res.ok) throw new Error('Erro ao substituir resposta')
      const { answer } = await res.json() as { answer: Answer }
      setSavedAnswer(answer)
      onAnswerSaved(answer)
      setReflection((prev) => (prev ? { ...prev, adaptedText: undefined } : prev))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [question, privacy, onAnswerSaved])

  const handlePrivacyChange = useCallback(async (value: PrivacyLevel) => {
    setPrivacy(value)
    if (savedAnswer) {
      try {
        const res = await fetch('/api/answers', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            moduleSlug: question.moduleSlug,
            questionId: question.id,
            privacy: value,
          }),
        })
        if (!res.ok) throw new Error(`PATCH privacy failed: ${res.status}`)
      } catch (err) {
        console.error('Erro ao atualizar privacidade:', err)
        setPrivacy(savedAnswer.privacy)
        setError('Erro ao salvar privacidade. Tente novamente.')
      }
    }
  }, [savedAnswer, question])

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-blue-700">{agent.name}</span>
          <span>·</span>
          <span>{agent.title}</span>
        </div>
        <p className="text-base font-medium text-gray-900 leading-relaxed">{question.text}</p>
        {question.hint && (
          <p className="text-xs text-muted-foreground italic">💡 {question.hint}</p>
        )}
      </div>

      {savedAnswer && (
        <div className="rounded-lg border bg-gray-50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">Resposta atual</span>
            <PrivacyBadge privacy={savedAnswer.privacy} />
          </div>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{savedAnswer.content}</p>
        </div>
      )}

      {reflection && (
        <ReflectionCard
          agentName={agent.name}
          agentTitle={agent.title}
          reflection={reflection}
          onUseAdaptedText={handleUseAdaptedText}
        />
      )}

      <div className="space-y-3">
        <Textarea
          placeholder={savedAnswer ? 'Quer complementar ou reescrever sua resposta?' : 'Escreva sua resposta aqui...'}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) handleSubmit()
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Privacidade:</span>
            <Select value={privacy} onValueChange={(v) => handlePrivacyChange(v as PrivacyLevel)}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">🌐 Público</SelectItem>
                <SelectItem value="private">🔒 Privado</SelectItem>
                <SelectItem value="sensitive">🛡️ Sensível</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Ctrl+Enter para enviar</span>
            <Button
              onClick={() => handleSubmit()}
              disabled={!text.trim() || loading}
              size="sm"
              className="gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {loading ? 'Analisando...' : 'Enviar'}
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
        )}
      </div>
    </div>
  )
}
