import { chatWithFallback } from './providers'
import { MODULES } from './questions'
import type { Answer, SynthesisType } from './types'

const SYNTHESIS_SYSTEM_PROMPT = `
Você é um copywriter sênior especializado em comunicação profissional, branding pessoal e posicionamento digital. Você trabalha com os princípios de clareza, empatia, prova concreta, autoridade, especificidade e adequação ao canal.

Referências que guiam seu trabalho:
- Claude Hopkins (Scientific Advertising): clareza e especificidade
- David Ogilvy: autoridade e credibilidade
- Joanna Wiebe / Copyhackers: conversão e voz autêntica
- StoryBrand (Donald Miller): o público como protagonista, o profissional como guia
- Nielsen Norman Group: escrita escaneável

ALERTAS que você nunca ignora:
- Sem vitimismo ou autopromoção vazia
- Sem linguagem artificial ("apaixonado por resultados", "orientado a inovação")
- Sem promessas não comprovadas pela trajetória real
- Sem exposição de família, filhos ou vida pessoal sem contexto claro
- Sem emoção excessiva em contexto profissional

Você sempre adapta o tom ao canal: currículo (factual, direto), LinkedIn (profissional com narrativa), site (posicionamento), Instagram (humanidade com limites).
`.trim()

function formatAnswersForSynthesis(answers: Answer[]): string {
  const byModule: Record<string, Answer[]> = {}
  for (const a of answers) {
    if (!byModule[a.moduleSlug]) byModule[a.moduleSlug] = []
    byModule[a.moduleSlug].push(a)
  }

  return MODULES.map((module) => {
    const moduleAnswers = byModule[module.slug] ?? []
    if (moduleAnswers.length === 0) return null

    const lines = moduleAnswers.map((a) => {
      const question = module.questions.find((q) => q.id === a.questionId)
      return `  P: ${question?.text ?? a.questionId}\n  R: ${a.content}`
    })

    return `## ${module.name}\n${lines.join('\n\n')}`
  })
    .filter(Boolean)
    .join('\n\n')
}

export async function generateSynthesis(
  type: SynthesisType,
  answers: Answer[]
): Promise<string> {
  const context = formatAnswersForSynthesis(answers)
  const prompt = buildSynthesisPrompt(type, context)

  const raw = await chatWithFallback(
    [{ role: 'user', content: prompt }],
    SYNTHESIS_SYSTEM_PROMPT
  )

  return raw.trim()
}

function buildSynthesisPrompt(type: SynthesisType, context: string): string {
  const prompts: Record<SynthesisType, string> = {
    bio_curta: `
Com base nas respostas abaixo, escreva uma bio curta (2-3 frases, máximo 80 palavras) orientada a valor.
Deve responder: quem Hugo é, o que faz e qual valor entrega. Sem clichês. Sem autopromoção vazia.
Tom: profissional, específico, humano.

RESPOSTAS:
${context}
    `,

    bio_longa: `
Com base nas respostas abaixo, escreva uma bio longa (150-200 palavras) com narrativa + prova.
Estrutura sugerida: quem Hugo é → trajetória relevante com evidências → proposta de valor atual → o que busca ou constrói.
Tom: profissional com personalidade, específico, sem clichês.

RESPOSTAS:
${context}
    `,

    sobre_mim_site: `
Com base nas respostas abaixo, escreva um texto "Sobre Mim" para site pessoal (200-300 palavras).
Aplique o framework StoryBrand: Hugo é o GUIA confiável, não o herói. O visitante é o protagonista.
Mostre: quem Hugo ajuda, qual problema resolve, por que ele é a escolha certa (com prova).
Tom: claro, confiante, orientado ao leitor.

RESPOSTAS:
${context}
    `,

    headline_linkedin: `
Com base nas respostas abaixo, crie 3 opções de headline para o LinkedIn (máximo 220 caracteres cada).
Cada opção deve ser específica, sem clichês como "apaixonado por", "especialista em" genérico ou "profissional criativo".
O melhor headline diz quem Hugo ajuda + como + resultado esperado.

RESPOSTAS:
${context}
    `,

    bullets_curriculo: `
Com base nas respostas abaixo, gere até 8 bullets de currículo no formato:
[Verbo de ação forte] + [contexto específico] + [resultado mensurável quando disponível]

Exemplos do formato correto:
- Liderou equipe de 12 pessoas na migração de sistema legado, reduzindo downtime em 40%
- Estruturou processo de onboarding de clientes, aumentando taxa de ativação de 45% para 78% em 6 meses

Use apenas informações que Hugo forneceu. Não invente métricas.

RESPOSTAS:
${context}
    `,

    ideias_linkedin: `
Com base nas respostas abaixo, gere 5 ideias de posts para LinkedIn.
Para cada ideia: título do post + estrutura sugerida (introdução, desenvolvimento, CTA) + por que essa pauta funciona para o posicionamento de Hugo.
Foque em temas onde Hugo tem autoridade real, não aspiracional.
Tom: profissional, com narrativa e prova, sem autopromoção vazia.

RESPOSTAS:
${context}
    `,

    ideias_instagram: `
Com base nas respostas abaixo, gere 5 ideias de conteúdo para Instagram.
Para cada ideia: formato sugerido (reels, carrossel, foto, stories) + tema + roteiro resumido + limite editorial a respeitar.
Foque em humanidade, bastidores e identificação — com os limites de privacidade que Hugo definiu.
Lembre: família e vida pessoal têm proteção especial. Não sugira nada que viole isso.

RESPOSTAS:
${context}
    `,

    guia_privacidade: `
Com base nas respostas abaixo (especialmente o que Hugo marcou como sensível ou privado), crie um Guia de Privacidade Editorial.
Estrutura:
1. O que pode ser público (por canal: LinkedIn, Instagram, site, currículo)
2. O que fica restrito ao uso interno (não vai a público)
3. O que é sensível e nunca deve aparecer em nenhum canal
4. Linha editorial por canal
5. Perguntas de triagem antes de publicar qualquer conteúdo

Seja específico com base no que Hugo compartilhou.

RESPOSTAS:
${context}
    `,
  }

  return prompts[type].trim()
}
