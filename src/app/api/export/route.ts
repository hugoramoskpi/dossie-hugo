import { NextRequest, NextResponse } from 'next/server'
import { getAllPublicAnswers, getAllSynthesis } from '@/lib/db'
import { generateExport } from '@/lib/export'
import { getCurrentUser } from '@/lib/auth'
import type { ExportType } from '@/lib/types'

const VALID_EXPORT_TYPES: ExportType[] = [
  'dossie-completo',
  'curriculo-base',
  'perfil-linkedin',
  'ideias-conteudo',
  'guia-editorial',
]

export async function GET(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') as ExportType | null

  if (!type || !VALID_EXPORT_TYPES.includes(type)) {
    return NextResponse.json(
      { error: `Tipo inválido. Use: ${VALID_EXPORT_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  try {
    const answers = getAllPublicAnswers(user.id)
    const synthesis = getAllSynthesis(user.id)
    const markdown = generateExport(type, answers, synthesis)

    const safeName = user.name.replace(/[^a-z0-9]/gi, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '')
    const filename = `${safeName}-${type}-${new Date().toISOString().split('T')[0]}.md`

    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('GET /api/export error:', err)
    return NextResponse.json({ error: 'Erro ao gerar exportação' }, { status: 500 })
  }
}
