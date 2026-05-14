# Dossiê Hugo

App local para construir e manter seu dossiê pessoal e profissional com auxílio de IA.

## O que é

Um sistema de entrevista inteligente com 10 agentes especializados — cada um com contexto acadêmico específico — que ajudam você a articular quem você é, o que fez, o que vale e para onde vai. As respostas viram bio, headline, bullets de currículo, ideias de conteúdo e guia editorial.

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas chaves de API:
- `GOOGLE_API_KEY` — [Google AI Studio](https://aistudio.google.com/)
- `OPENAI_API_KEY` — [OpenAI Platform](https://platform.openai.com/)
- `ANTHROPIC_API_KEY` — [Anthropic Console](https://console.anthropic.com/)

Você precisa de pelo menos **uma** chave configurada. O app usa Google por padrão e faz fallback automático para OpenAI e depois Anthropic.

### 3. Rodar

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

## Módulos

| Módulo | Agente Especialista |
|--------|-------------------|
| Identidade e História | Dr. Rafael Mendes — Psicólogo Clínico |
| Valores e Prioridades | Profa. Ana Luz — Filósofa e Eticista |
| Currículo e Mercado | Carlos Duarte — Especialista em Carreira |
| Qualificações | Dra. Mariana Ferro — Cientista da Educação |
| Empreendimentos | Paulo Nascimento — Consultor de Inovação |
| Família e Contexto | Dra. Lucia Faria — Psicóloga Familiar |
| Hobbies e Personalidade | Prof. André Soto — Psicólogo Positivo |
| Posicionamento Público | Helena Voss — Estrategista de Marca |
| Conteúdo para Canais | Bruno Leal — Estrategista de Conteúdo |
| Metas e Automação | Dra. Carla Pinto — Coach Executiva |

## Privacidade

Cada resposta tem nível de privacidade:
- **Público** 🌐 — entra em todas as exportações
- **Privado** 🔒 — entra apenas no dossiê completo, nunca em perfis públicos
- **Sensível** 🛡️ — não entra em nenhuma exportação

## Exportações

Em `/sintese`, após gerar a síntese:
- `dossie-completo.md` — todas as respostas não-sensíveis
- `curriculo-base.md` — bullets + qualificações + experiências
- `perfil-linkedin.md` — headline + bio + bullets adaptados
- `ideias-conteudo.md` — pautas para LinkedIn e Instagram
- `guia-editorial.md` — o que pode e não pode ir a público

## Storage

Os dados ficam em `data/dossie.db` (SQLite). Este arquivo é ignorado pelo git e nunca deve ser compartilhado.

## Scripts

```bash
npm run dev       # Desenvolvimento
npm run build     # Build de produção
npm run typecheck # Verificação de tipos
npm run lint      # Linting
```
