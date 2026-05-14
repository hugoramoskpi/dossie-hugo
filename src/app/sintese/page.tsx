import { redirect } from 'next/navigation'
import { SynthesisPanel } from '@/components/SynthesisPanel'
import { ExportPanel } from '@/components/ExportPanel'
import { getAllSynthesis } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { SYNTHESIS_LABELS } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function SintesePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const synthesis = getAllSynthesis(user.id)
  const initialOutputs = synthesis.map((s) => ({
    type: s.type,
    label: SYNTHESIS_LABELS[s.type],
    content: s.content,
  }))

  return (
    <div className="space-y-10">
      <SynthesisPanel initialOutputs={initialOutputs} />
      <div className="border-t pt-8">
        <ExportPanel />
      </div>
    </div>
  )
}
