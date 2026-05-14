'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function UserNav({ userName }: { userName: string }) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 pl-3 border-l">
      <div className="flex items-center gap-1.5 text-sm">
        <UserIcon className="h-4 w-4 text-muted-foreground" />
        <span className="text-gray-700">{userName}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="h-8 gap-1 text-muted-foreground hover:text-red-600"
      >
        <LogOut className="h-3.5 w-3.5" />
        Sair
      </Button>
    </div>
  )
}
