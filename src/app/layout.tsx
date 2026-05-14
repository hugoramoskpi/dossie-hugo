import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { UserNav } from '@/components/UserNav'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dossiê Hugo',
  description: 'Dossiê pessoal e profissional',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <nav className="border-b bg-white sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-xl">📋</span>
              <span>Dossiê Hugo</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-gray-900 transition-colors"
                >
                  Módulos
                </Link>
                <Link
                  href="/sintese"
                  className="text-sm text-muted-foreground hover:text-gray-900 transition-colors"
                >
                  Síntese
                </Link>
                <UserNav userName={user.name} />
              </div>
            ) : null}
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
