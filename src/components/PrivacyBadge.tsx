'use client'

import { Badge } from '@/components/ui/badge'
import type { PrivacyLevel } from '@/lib/types'

interface PrivacyBadgeProps {
  privacy: PrivacyLevel
  size?: 'sm' | 'default'
}

const PRIVACY_CONFIG: Record<PrivacyLevel, { label: string; variant: 'success' | 'warning' | 'danger'; icon: string }> = {
  public: { label: 'Público', variant: 'success', icon: '🌐' },
  private: { label: 'Privado', variant: 'warning', icon: '🔒' },
  sensitive: { label: 'Sensível', variant: 'danger', icon: '🛡️' },
}

export function PrivacyBadge({ privacy }: PrivacyBadgeProps) {
  const config = PRIVACY_CONFIG[privacy]
  return (
    <Badge variant={config.variant} className="gap-1">
      <span>{config.icon}</span>
      {config.label}
    </Badge>
  )
}
