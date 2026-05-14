import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModuleGrid } from '@/components/ModuleGrid'
import { MODULES } from '@/lib/questions'
import { getModuleProgress } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import type { ModuleProgress } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const progressMap: Record<string, ModuleProgress> = {}
  for (const module of MODULES) {
    progressMap[module.slug] = getModuleProgress(user.id, module.slug, module.questions.length)
  }

  const totalQuestions = MODULES.reduce((sum, m) => sum + m.questions.length, 0)
  const totalAnswered = Object.values(progressMap).reduce((sum, p) => sum + p.answered, 0)
  const overallPercent = Math.round((totalAnswered / totalQuestions) * 100)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Olá, {user.name}</h1>
          <p className="text-muted-foreground mt-1">
            {totalAnswered} de {totalQuestions} perguntas respondidas · {overallPercent}% completo
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/sintese">
            <Sparkles className="h-4 w-4" />
            Gerar Síntese
          </Link>
        </Button>
      </div>

      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-500 transition-all"
          style={{ width: `${overallPercent}%` }}
        />
      </div>

      <ModuleGrid modules={MODULES} progressMap={progressMap} />
    </div>
  )
}
