'use client'

import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { SYNTHESIS_LABELS } from '@/lib/types'
import type { SynthesisOutput, SynthesisType } from '@/lib/types'

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

interface SynthesisPanelProps {
  initialOutputs?: SynthesisOutput[]
}

export function SynthesisPanel({ initialOutputs = [] }: SynthesisPanelProps) {
  const [outputs, setOutputs] = useState<SynthesisOutput[]>(initialOutputs)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [answersUsed, setAnswersUsed] = useState<number | null>(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/synthesize', { method: 'POST' })
      const data = await res.json() as {
        results?: Record<string, string>
        errors?: Record<string, string>
        answersUsed?: number
        error?: string
      }

      if (!res.ok) {
        setError(data.error ?? 'Erro ao gerar síntese')
        return
      }

      const newOutputs: SynthesisOutput[] = SYNTHESIS_TYPES
        .filter((t) => data.results?.[t])
        .map((t) => ({
          type: t,
          label: SYNTHESIS_LABELS[t],
          content: data.results![t],
        }))

      setOutputs(newOutputs)
      setAnswersUsed(data.answersUsed ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Síntese do Dossiê</h2>
          {answersUsed !== null && (
            <p className="text-sm text-muted-foreground mt-1">
              Gerado a partir de {answersUsed} respostas públicas
            </p>
          )}
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="gap-2">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? 'Gerando...' : 'Gerar Síntese'}
        </Button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {outputs.length > 0 && (
        <Tabs defaultValue={outputs[0]?.type}>
          <TabsList className="flex flex-wrap h-auto gap-1 p-1">
            {outputs.map((o) => (
              <TabsTrigger key={o.type} value={o.type} className="text-xs">
                {o.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {outputs.map((o) => (
            <TabsContent key={o.type} value={o.type}>
              <Card>
                <CardContent className="pt-6">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-gray-800">
                    {o.content}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {outputs.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Clique em <strong>Gerar Síntese</strong> para criar bio, headline, bullets de currículo e ideias de conteúdo a partir das suas respostas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
