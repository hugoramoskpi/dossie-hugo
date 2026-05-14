'use client'

import Link from 'next/link'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Module, ModuleProgress } from '@/lib/types'

interface ModuleGridProps {
  modules: Module[]
  progressMap: Record<string, ModuleProgress>
}

const STATUS_CONFIG = {
  not_started: { label: 'Não iniciado', icon: Circle, color: 'text-gray-400', badgeVariant: 'outline' as const },
  in_progress: { label: 'Em andamento', icon: Clock, color: 'text-amber-500', badgeVariant: 'warning' as const },
  complete: { label: 'Completo', icon: CheckCircle2, color: 'text-green-500', badgeVariant: 'success' as const },
}

export function ModuleGrid({ modules, progressMap }: ModuleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {modules.map((module) => {
        const progress = progressMap[module.slug]
        const status = progress?.status ?? 'not_started'
        const statusConfig = STATUS_CONFIG[status]
        const StatusIcon = statusConfig.icon

        return (
          <Link key={module.slug} href={`/modulo/${module.slug}`}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border hover:border-blue-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{module.icon}</span>
                  <Badge variant={statusConfig.badgeVariant} className="gap-1 text-xs">
                    <StatusIcon className={`h-3 w-3 ${statusConfig.color}`} />
                    {statusConfig.label}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-2">{module.name}</CardTitle>
                <CardDescription className="text-xs">{module.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{progress?.answered ?? 0} de {module.questions.length} perguntas</span>
                    <span>{progress ? Math.round((progress.answered / progress.total) * 100) : 0}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{
                        width: `${progress ? (progress.answered / progress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
