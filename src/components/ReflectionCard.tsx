'use client'

import { AlertTriangle, HelpCircle, Lightbulb, MessageSquare, Sparkles, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PrivacyBadge } from '@/components/PrivacyBadge'
import type { Reflection } from '@/lib/types'

interface ReflectionCardProps {
  agentName: string
  agentTitle: string
  reflection: Reflection
  onUseAdaptedText?: (text: string) => void
}

export function ReflectionCard({ agentName, agentTitle, reflection, onUseAdaptedText }: ReflectionCardProps) {
  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold text-blue-900">{agentName}</CardTitle>
            <p className="text-xs text-blue-700 mt-0.5">{agentTitle}</p>
          </div>
          <PrivacyBadge privacy={reflection.suggestedPrivacy} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-sm text-gray-800 leading-relaxed">{reflection.feedback}</p>
        </div>

        {reflection.hasSensitiveContent && (
          <div className="flex gap-2 rounded-md bg-red-50 border border-red-200 p-3">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Alerta de Privacidade</p>
              <p className="text-xs text-red-700 mt-0.5">
                Esta resposta contém informações sensíveis sobre terceiros ou dados pessoais delicados.
                Ela foi marcada como <strong>sensível</strong> e não entrará em exportações públicas por padrão.
              </p>
            </div>
          </div>
        )}

        {reflection.isGeneric && reflection.followUpQuestion && (
          <div className="flex gap-2 rounded-md bg-amber-50 border border-amber-200 p-3">
            <HelpCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">Pergunta de Aprofundamento</p>
              <p className="text-sm text-amber-900 mt-1">{reflection.followUpQuestion}</p>
            </div>
          </div>
        )}

        {reflection.bulletSuggestion && (
          <div className="flex gap-2 rounded-md bg-green-50 border border-green-200 p-3">
            <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Sugestão de Bullet</p>
              <p className="text-sm text-green-900 mt-1 font-mono text-xs leading-relaxed">
                {reflection.bulletSuggestion}
              </p>
            </div>
          </div>
        )}

        {reflection.adaptedText && (
          <div className="rounded-md bg-emerald-50 border-2 border-emerald-300 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-700" />
              <p className="text-sm font-semibold text-emerald-900">Versão Aprimorada</p>
            </div>
            <p className="text-sm text-emerald-950 leading-relaxed whitespace-pre-wrap">
              {reflection.adaptedText}
            </p>
            {onUseAdaptedText && (
              <Button
                size="sm"
                onClick={() => onUseAdaptedText(reflection.adaptedText!)}
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                <Check className="h-3.5 w-3.5" />
                Usar esta versão
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
