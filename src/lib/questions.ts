import type { Module } from './types'

export const MODULES: Module[] = [
  {
    slug: 'identidade',
    name: 'Identidade e História',
    description: 'Quem você é, de onde vem e o que te formou',
    icon: '🧭',
    questions: [
      {
        id: 'identidade-01',
        moduleSlug: 'identidade',
        order: 1,
        text: 'Como você se apresentaria para alguém que nunca te viu antes — em termos de quem você é, não do que você faz?',
        hint: 'Evite cargos e títulos. Fale de valores, origem, perspectiva.',
      },
      {
        id: 'identidade-02',
        moduleSlug: 'identidade',
        order: 2,
        text: 'Quais experiências da sua história pessoal mais influenciaram a forma como você enxerga o mundo e toma decisões?',
        hint: 'Pode ser infância, desafio superado, virada de carreira, perda.',
      },
      {
        id: 'identidade-03',
        moduleSlug: 'identidade',
        order: 3,
        text: 'Se pessoas próximas fossem descrever você com três palavras, quais seriam? Essas palavras refletem como você quer ser reconhecido?',
      },
      {
        id: 'identidade-04',
        moduleSlug: 'identidade',
        order: 4,
        text: 'Qual foi o momento mais transformador da sua vida até hoje — e o que ele revelou sobre você?',
      },
      {
        id: 'identidade-05',
        moduleSlug: 'identidade',
        order: 5,
        text: 'O que você defende de forma consistente, independente do contexto ou da pressão do ambiente?',
        hint: 'Isso ajuda a identificar sua identidade real versus a identidade social.',
      },
      {
        id: 'identidade-06',
        moduleSlug: 'identidade',
        order: 6,
        text: 'Que parte da sua história você considera subestimada pelos outros, mas que você sabe que foi fundamental para chegar onde chegou?',
      },
    ],
  },
  {
    slug: 'valores',
    name: 'Valores e Prioridades',
    description: 'O que você não negocia e como você decide',
    icon: '⚖️',
    questions: [
      {
        id: 'valores-01',
        moduleSlug: 'valores',
        order: 1,
        text: 'Quais são os três valores que, se violados, fariam você abrir mão de uma oportunidade profissional importante?',
        hint: 'Valores reais são aqueles que custam algo quando você os defende.',
      },
      {
        id: 'valores-02',
        moduleSlug: 'valores',
        order: 2,
        text: 'Dê um exemplo concreto de quando você colocou um valor acima de um benefício financeiro ou de status. O que aconteceu?',
      },
      {
        id: 'valores-03',
        moduleSlug: 'valores',
        order: 3,
        text: 'Como você hierarquiza as prioridades na sua vida hoje: carreira, família, saúde, projetos pessoais, finanças? Isso é intencional ou emergiu?',
      },
      {
        id: 'valores-04',
        moduleSlug: 'valores',
        order: 4,
        text: 'O que você considera inaceitável no ambiente de trabalho — comportamentos, práticas ou culturas que nunca toleraria?',
      },
      {
        id: 'valores-05',
        moduleSlug: 'valores',
        order: 5,
        text: 'Qual princípio guia suas decisões mais difíceis? Como você faz para não racionalizar uma exceção quando a pressão é alta?',
      },
      {
        id: 'valores-06',
        moduleSlug: 'valores',
        order: 6,
        text: 'Se você pudesse deixar um legado em uma frase — não uma conquista, mas um jeito de ser — o que seria?',
      },
    ],
  },
  {
    slug: 'curriculo',
    name: 'Currículo e Mercado',
    description: 'Experiências, resultados e posicionamento profissional',
    icon: '💼',
    questions: [
      {
        id: 'curriculo-01',
        moduleSlug: 'curriculo',
        order: 1,
        text: 'Descreva sua trajetória profissional mais recente em ordem cronológica. Para cada posição, inclua: empresa, cargo, período e o principal resultado que você gerou.',
        hint: 'Formato ideal: fiz [ação] em [contexto] e obtive [resultado mensurável].',
      },
      {
        id: 'curriculo-02',
        moduleSlug: 'curriculo',
        order: 2,
        text: 'Qual foi a entrega profissional da qual você mais se orgulha? Seja específico sobre o problema, sua contribuição e o impacto gerado.',
      },
      {
        id: 'curriculo-03',
        moduleSlug: 'curriculo',
        order: 3,
        text: 'Quais são as competências técnicas (hard skills) em que você é mais forte? Em qual nível de senioridade você se posiciona em cada uma?',
      },
      {
        id: 'curriculo-04',
        moduleSlug: 'curriculo',
        order: 4,
        text: 'Quais competências comportamentais (soft skills) você considera seus maiores diferenciais? Cite exemplos que comprovem cada uma.',
      },
      {
        id: 'curriculo-05',
        moduleSlug: 'curriculo',
        order: 5,
        text: 'Em que tipo de empresa, setor ou modelo de trabalho você performou melhor? O que esses ambientes tinham em comum?',
      },
      {
        id: 'curriculo-06',
        moduleSlug: 'curriculo',
        order: 6,
        text: 'Qual foi um erro profissional significativo que você cometeu, o que aprendeu e como isso mudou sua forma de trabalhar?',
        hint: 'Respostas honestas aqui constroem mais credibilidade do que respostas perfeitas.',
      },
      {
        id: 'curriculo-07',
        moduleSlug: 'curriculo',
        order: 7,
        text: 'Quais palavras-chave do seu setor descrevem melhor o que você faz e para quem você quer ser encontrado no mercado?',
      },
    ],
  },
  {
    slug: 'qualificacoes',
    name: 'Qualificações',
    description: 'Formação, certificações, idiomas e educação continuada',
    icon: '🎓',
    questions: [
      {
        id: 'qualificacoes-01',
        moduleSlug: 'qualificacoes',
        order: 1,
        text: 'Qual é sua formação acadêmica formal? Inclua instituição, curso e ano de conclusão.',
      },
      {
        id: 'qualificacoes-02',
        moduleSlug: 'qualificacoes',
        order: 2,
        text: 'Quais certificações ou cursos de alta relevância você concluiu? Para cada um: nome, instituição, ano e o que te levou a buscar aquela qualificação.',
      },
      {
        id: 'qualificacoes-03',
        moduleSlug: 'qualificacoes',
        order: 3,
        text: 'Qual é seu nível real em cada idioma que você fala? (Básico, intermediário, avançado, fluente, nativo) — e em quais contextos você já usou profissionalmente?',
      },
      {
        id: 'qualificacoes-04',
        moduleSlug: 'qualificacoes',
        order: 4,
        text: 'Como você mantém seu aprendizado atualizado? Cite fontes, comunidades, publicações ou práticas de educação continuada que fazem parte da sua rotina.',
      },
      {
        id: 'qualificacoes-05',
        moduleSlug: 'qualificacoes',
        order: 5,
        text: 'Há alguma qualificação ou área de conhecimento que você está desenvolvendo atualmente? Qual é o objetivo por trás dela?',
      },
    ],
  },
  {
    slug: 'empreendimentos',
    name: 'Empreendimentos',
    description: 'Projetos, negócios e iniciativas que você construiu',
    icon: '🚀',
    questions: [
      {
        id: 'empreendimentos-01',
        moduleSlug: 'empreendimentos',
        order: 1,
        text: 'Liste os empreendimentos ou projetos independentes que você já iniciou. Para cada um: o que era, quando começou, qual era o problema que resolvia.',
      },
      {
        id: 'empreendimentos-02',
        moduleSlug: 'empreendimentos',
        order: 2,
        text: 'Qual desses projetos gerou mais resultado — financeiro, de aprendizado ou de impacto? Seja específico sobre os números ou evidências.',
      },
      {
        id: 'empreendimentos-03',
        moduleSlug: 'empreendimentos',
        order: 3,
        text: 'O que não funcionou em algum desses projetos? Qual foi o principal aprendizado e o que você faria diferente?',
      },
      {
        id: 'empreendimentos-04',
        moduleSlug: 'empreendimentos',
        order: 4,
        text: 'Qual é o status atual dos seus empreendimentos? Algum está ativo, em pausa ou em fase de planejamento?',
      },
      {
        id: 'empreendimentos-05',
        moduleSlug: 'empreendimentos',
        order: 5,
        text: 'O que você aprendeu sobre si mesmo como empreendedor? Quais são suas fortalezas e limitações nesse papel?',
      },
      {
        id: 'empreendimentos-06',
        moduleSlug: 'empreendimentos',
        order: 6,
        text: 'Há algum problema de mercado que você enxerga claramente e que ninguém está resolvendo bem? Você tem planos para isso?',
      },
    ],
  },
  {
    slug: 'familia',
    name: 'Família e Contexto',
    description: 'Contexto pessoal, papel familiar e limites de exposição',
    icon: '🏡',
    questions: [
      {
        id: 'familia-01',
        moduleSlug: 'familia',
        order: 1,
        text: 'Como você descreveria sua estrutura familiar atual? Quem são as pessoas mais próximas na sua vida?',
        hint: 'Esta resposta é privada por padrão. Você decide o que tornar público.',
      },
      {
        id: 'familia-02',
        moduleSlug: 'familia',
        order: 2,
        text: 'Qual é o seu papel na família — como provedor, como presença emocional, como organizador? Como esse papel te influencia profissionalmente?',
      },
      {
        id: 'familia-03',
        moduleSlug: 'familia',
        order: 3,
        text: 'O que você considera privado e nunca deve aparecer em conteúdo público relacionado a você?',
        hint: 'Fundamental para definir os limites editoriais do seu posicionamento.',
      },
      {
        id: 'familia-04',
        moduleSlug: 'familia',
        order: 4,
        text: 'De que forma sua história familiar contribuiu para quem você é profissionalmente? Há algo dessa história que você considera relevante compartilhar publicamente?',
      },
      {
        id: 'familia-05',
        moduleSlug: 'familia',
        order: 5,
        text: 'Como você equilibra as demandas profissionais com as responsabilidades pessoais? O que funciona e o que ainda é um desafio?',
      },
    ],
  },
  {
    slug: 'hobbies',
    name: 'Hobbies e Personalidade',
    description: 'Interesses, estilo de vida e o que revela quem você é',
    icon: '🎯',
    questions: [
      {
        id: 'hobbies-01',
        moduleSlug: 'hobbies',
        order: 1,
        text: 'O que você faz quando tem tempo livre escolhido — não obrigações? Quais atividades te dão energia em vez de consumir?',
      },
      {
        id: 'hobbies-02',
        moduleSlug: 'hobbies',
        order: 2,
        text: 'Há algum interesse ou hobby que parece desconexo da sua carreira, mas que na verdade te torna melhor profissionalmente? Como?',
      },
      {
        id: 'hobbies-03',
        moduleSlug: 'hobbies',
        order: 3,
        text: 'O que você lê, assiste, ouve ou consome de forma consistente? O que isso diz sobre como você pensa?',
      },
      {
        id: 'hobbies-04',
        moduleSlug: 'hobbies',
        order: 4,
        text: 'Você tem algum projeto pessoal ou criativo fora do trabalho? O que te motiva a mantê-lo?',
      },
      {
        id: 'hobbies-05',
        moduleSlug: 'hobbies',
        order: 5,
        text: 'O que você nunca se cansa de falar, pesquisar ou pensar — mesmo sem nenhuma recompensa externa?',
        hint: 'Geralmente é aqui que está o seu posicionamento mais autêntico.',
      },
      {
        id: 'hobbies-06',
        moduleSlug: 'hobbies',
        order: 6,
        text: 'Como você descreveria seu estilo de vida atual? É o estilo que você escolheu conscientemente ou emergiu por pressão externa?',
      },
    ],
  },
  {
    slug: 'posicionamento',
    name: 'Posicionamento Público',
    description: 'Nicho, proposta de valor e diferenciais como profissional',
    icon: '📡',
    questions: [
      {
        id: 'posicionamento-01',
        moduleSlug: 'posicionamento',
        order: 1,
        text: 'Para quem você quer ser referência? Descreva seu público ideal com o máximo de especificidade possível.',
        hint: 'Evite respostas como "todos os profissionais". Quanto mais específico, mais relevante.',
      },
      {
        id: 'posicionamento-02',
        moduleSlug: 'posicionamento',
        order: 2,
        text: 'Qual problema específico você resolve para esse público — e que outros profissionais não resolvem da mesma forma?',
      },
      {
        id: 'posicionamento-03',
        moduleSlug: 'posicionamento',
        order: 3,
        text: 'O que te diferencia genuinamente dos outros profissionais da sua área? Não o que você quer que seja seu diferencial, mas o que as evidências mostram.',
      },
      {
        id: 'posicionamento-04',
        moduleSlug: 'posicionamento',
        order: 4,
        text: 'Você já recebeu feedbacks recorrentes de clientes, colegas ou gestores? O que eles disseram que você faz de forma excelente?',
      },
      {
        id: 'posicionamento-05',
        moduleSlug: 'posicionamento',
        order: 5,
        text: 'Se você fosse criar uma categoria própria para o que faz — como um nicho único — como a descreveria em uma frase?',
      },
      {
        id: 'posicionamento-06',
        moduleSlug: 'posicionamento',
        order: 6,
        text: 'Em que nível de autoridade você quer ser percebido nos próximos 2 anos? O que precisaria ser verdade para que isso acontecesse?',
      },
    ],
  },
  {
    slug: 'conteudo',
    name: 'Conteúdo para Canais',
    description: 'Linha editorial, formatos e temas para LinkedIn, Instagram e site',
    icon: '✍️',
    questions: [
      {
        id: 'conteudo-01',
        moduleSlug: 'conteudo',
        order: 1,
        text: 'Quais temas você consegue falar com autoridade real — não porque estudou superficialmente, mas porque viveu e tem provas?',
      },
      {
        id: 'conteudo-02',
        moduleSlug: 'conteudo',
        order: 2,
        text: 'Que tipo de conteúdo profissional você consome e genuinamente admira? O que esses criadores fazem que você gostaria de replicar?',
      },
      {
        id: 'conteudo-03',
        moduleSlug: 'conteudo',
        order: 3,
        text: 'Qual é a sua linha editorial ideal para o LinkedIn? Que tipo de post você conseguiria criar com consistência e sem forçar?',
        hint: 'Exemplos: análises de mercado, bastidores, aprendizados práticos, cases reais, opinião fundamentada.',
      },
      {
        id: 'conteudo-04',
        moduleSlug: 'conteudo',
        order: 4,
        text: 'O que você estaria disposto a mostrar no Instagram de forma autêntica — considerando os limites de privacidade que você já definiu?',
      },
      {
        id: 'conteudo-05',
        moduleSlug: 'conteudo',
        order: 5,
        text: 'Com que frequência você conseguiria criar conteúdo de forma sustentável — sem comprometer a qualidade ou sua saúde mental?',
      },
      {
        id: 'conteudo-06',
        moduleSlug: 'conteudo',
        order: 6,
        text: 'Há temas que você definitivamente não quer abordar publicamente — por questão de privacidade, posicionamento ou coerência?',
      },
    ],
  },
  {
    slug: 'metas',
    name: 'Metas e Automação',
    description: 'Objetivos, rotina e o que você quer automatizar',
    icon: '🎯',
    questions: [
      {
        id: 'metas-01',
        moduleSlug: 'metas',
        order: 1,
        text: 'Quais são seus objetivos profissionais para os próximos 12 meses? Seja específico: o que você quer ter alcançado, com quais métricas?',
      },
      {
        id: 'metas-02',
        moduleSlug: 'metas',
        order: 2,
        text: 'Quais são seus objetivos de 3 anos? Onde você quer estar — financeiramente, profissionalmente, pessoalmente?',
      },
      {
        id: 'metas-03',
        moduleSlug: 'metas',
        order: 3,
        text: 'Como é sua rotina atual em um dia típico? O que funciona, o que drena energia e o que você mudaria se pudesse?',
      },
      {
        id: 'metas-04',
        moduleSlug: 'metas',
        order: 4,
        text: 'Quais tarefas repetitivas na sua vida profissional ou pessoal você mais quer automatizar ou delegar? Por quê?',
      },
      {
        id: 'metas-05',
        moduleSlug: 'metas',
        order: 5,
        text: 'Quais são os maiores obstáculos que te impedem de avançar mais rápido em direção às suas metas? São externos ou internos?',
      },
      {
        id: 'metas-06',
        moduleSlug: 'metas',
        order: 6,
        text: 'Se você tivesse todo o apoio técnico e financeiro necessário, o que você construiria nos próximos 5 anos?',
      },
    ],
  },
]

export function getModuleBySlug(slug: string): Module | undefined {
  return MODULES.find((m) => m.slug === slug)
}

export function getAllModuleSlugs(): string[] {
  return MODULES.map((m) => m.slug)
}
