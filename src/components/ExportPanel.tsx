'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EXPORT_LABELS } from '@/lib/types'
import type { ExportType } from '@/lib/types'

const EXPORT_TYPES: ExportType[] = [
  'dossie-completo',
  'curriculo-base',
  'perfil-linkedin',
  'ideias-conteudo',
  'guia-editorial',
]

const EXPORT_DESCRIPTIONS: Record<ExportType, string> = {
  'dossie-completo': 'Todas as respostas públicas e privadas (sensíveis omitidas)',
  'curriculo-base': 'Bullets de impacto, experiências e qualificações formatadas',
  'perfil-linkedin': 'Headline, bio longa e bullets adaptados para o LinkedIn',
  'ideias-conteudo': 'Pautas para LinkedIn e Instagram com linha editorial',
  'guia-editorial': 'O que pode e não pode ser publicado, por canal',
}

export function ExportPanel() {
  const [downloading, setDownloading] = useState<ExportType | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload(type: ExportType) {
    setDownloading(type)
    setError(null)

    try {
      const res = await fetch(`/api/export?type=${type}`)
      if (!res.ok) {
        const data = await res.json() as { error?: string }
        throw new Error(data.error ?? 'Erro ao gerar exportação')
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hugo-${type}-${new Date().toISOString().split('T')[0]}.md`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Exportações</h2>
      <p className="text-sm text-muted-foreground">
        Todos os arquivos são gerados em Markdown. Respostas sensíveis nunca entram nas exportações.
      </p>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXPORT_TYPES.map((type) => (
          <Card key={type} className="hover:shadow-sm transition-shadow">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-medium">{EXPORT_LABELS[type]}</CardTitle>
              <CardDescription className="text-xs">{EXPORT_DESCRIPTIONS[type]}</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => handleDownload(type)}
                disabled={downloading === type}
              >
                {downloading === type ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" />
                )}
                {downloading === type ? 'Gerando...' : 'Baixar .md'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
