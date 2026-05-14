import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GOOGLE_API_KEY não configurada' }, { status: 400 })

  try {
    // REST direto — mais confiável que o SDK para listModels
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=50`
    )
    const data = await res.json() as { models?: { name: string; supportedGenerationMethods?: string[] }[]; error?: unknown }

    if (!res.ok) return NextResponse.json({ error: data.error }, { status: res.status })

    const generateContent = (data.models ?? [])
      .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m) => m.name.replace('models/', ''))

    return NextResponse.json({ available: generateContent })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
