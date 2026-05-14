'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'
import { ChatInterface } from '@/components/ChatInterface'
import { PrivacyBadge } from '@/components/PrivacyBadge'
import { Button } from '@/components/ui/button'
import { MODULES, getModuleBySlug } from '@/lib/questions'
import { getAgentBySlug } from '@/lib/agents'
import type { Answer, Question } from '@/lib/types'

export default function ModuloPage() {
  const params = useParams()
  const slug = params.slug as string

  const module = getModuleBySlug(slug)
  if (!module) notFound()

  const agent = getAgentBySlug(slug)

  const [selectedQuestion, setSelectedQuestion] = useState<Question>(module.questions[0])
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/answers?module=${slug}`)
      .then((r) => r.json())
      .then((data: { answers: Answer[] }) => {
        const map: Record<string, Answer> = {}
        for (const a of data.answers) {
          map[a.questionId] = a
        }
        setAnswers(map)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  function handleAnswerSaved(answer: Answer) {
    setAnswers((prev) => ({ ...prev, [answer.questionId]: answer }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span>{module.icon}</span>
            {module.name}
          </h1>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg border bg-blue-50 p-3">
        <span className="text-2xl">🎓</span>
        <div>
          <p className="text-sm font-medium text-blue-900">{agent.name} · {agent.title}</p>
          <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">{agent.academicContext.split('\n')[0]}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 px-2">
            Perguntas
          </p>
          {module.questions.map((q) => {
            const isAnswered = !!answers[q.id]
            const isSelected = selectedQuestion.id === q.id
            return (
              <button
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors flex items-start gap-2 ${
                  isSelected
                    ? 'bg-blue-100 text-blue-900 font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {isAnswered ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-300 mt-0.5 shrink-0" />
                )}
                <span className="leading-snug line-clamp-2">{q.text}</span>
              </button>
            )
          })}

          <div className="pt-4 px-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso</span>
              <span>{Object.keys(answers).length}/{module.questions.length}</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{
                  width: `${(Object.keys(answers).length / module.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {Object.keys(answers).length > 0 && (
            <div className="pt-3 px-2 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground">Privacidade</p>
              {Object.values(answers).map((a) => {
                const q = module.questions.find((q) => q.id === a.questionId)
                return (
                  <div key={a.id} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground truncate max-w-[160px]">{q?.text.slice(0, 30)}...</span>
                    <PrivacyBadge privacy={a.privacy} />
                  </div>
                )
              })}
            </div>
          )}
        </aside>

        <div>
          <ChatInterface
            key={selectedQuestion.id}
            question={selectedQuestion}
            agent={agent}
            existingAnswer={answers[selectedQuestion.id]}
            onAnswerSaved={handleAnswerSaved}
          />
        </div>
      </div>
    </div>
  )
}
