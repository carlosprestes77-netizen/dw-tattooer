const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const ARTIST = {
  name: "DW Tattooer",
  handle: "@dw.tattooer",
  instagram: "https://www.instagram.com/dw.tattooer",
  whatsapp: "5544991373995", // 55 (Brasil) + 44 (DDD) + número
  location: "Maringá — Paraná",
  city: "Maringá · PR",
  portrait: `${bp}/artist/portrait.jpg`,
  // TODO: ajustar horários reais do estúdio
  hours: [
    { day: "Ter — Sex", time: "10h — 19h" },
    { day: "Sábado", time: "10h — 16h" },
    { day: "Dom — Seg", time: "Fechado" },
  ],
};

// TODO: ajustar números reais
export const stats = [
  { value: "+500", label: "Tatuagens realizadas" },
  { value: "8", label: "Anos de carreira" },
  { value: "60d", label: "Retoque garantido" },
  { value: "100%", label: "Material descartável" },
];

export const processSteps = [
  {
    n: "01",
    title: "Conversa",
    desc: "Você manda sua ideia pelo WhatsApp ou pelo formulário. Conversamos sobre conceito, referências, local do corpo e tamanho. Briefing sem compromisso.",
  },
  {
    n: "02",
    title: "Projeto",
    desc: "Desenvolvo um desenho autoral exclusivo para você. Ajustamos juntos até cada linha fazer sentido. O projeto é só seu — nunca se repete em outra pele.",
  },
  {
    n: "03",
    title: "Sessão",
    desc: "Estúdio privativo, material 100% descartável e ambiente tranquilo. Trabalho com calma e precisão, no seu ritmo, do começo ao fim.",
  },
  {
    n: "04",
    title: "Cuidado",
    desc: "Você sai com um guia completo de cicatrização. Acompanho a cura de perto e os retoques estão inclusos nos primeiros 60 dias. A relação não acaba na agulha.",
  },
];

// TODO: substituir por depoimentos reais de clientes
export const testimonials = [
  {
    name: "Cliente 01",
    work: "Antebraço · Blackwork",
    quote: "Transformou uma ideia solta numa peça que conta a minha história. Cada linha tem propósito. Cuidado e profissionalismo do briefing à cicatrização.",
  },
  {
    name: "Cliente 02",
    work: "Braço · Fineline",
    quote: "Traço impecável, estúdio limpo, atendimento tranquilo e o resultado superou tudo que eu imaginava. Cicatrizou perfeito.",
  },
  {
    name: "Cliente 03",
    work: "Perna · Realismo",
    quote: "Cheguei pelo portfólio e saí com uma obra de arte na pele. Respeita o seu tempo, explica cada etapa e entrega um traço único. Recomendo de olhos fechados.",
  },
];

export const faqs = [
  {
    q: "Como funciona o orçamento?",
    a: "É gratuito e sem compromisso. Você descreve a ideia pelo formulário ou WhatsApp, e eu retorno com uma estimativa de valor e tempo de sessão. O preço varia conforme tamanho, complexidade e local do corpo.",
  },
  {
    q: "Preciso pagar sinal para agendar?",
    a: "Sim. Para reservar a data é necessário um sinal, que é descontado do valor final da tatuagem. Ele garante o horário e cobre o tempo dedicado ao desenvolvimento do seu projeto exclusivo.",
  },
  {
    q: "Dói muito? Como me preparo?",
    a: "A sensação varia por pessoa e região do corpo. Durma bem, hidrate-se, faça uma boa refeição antes e evite álcool nas 24h anteriores. No dia, vá com roupa confortável que dê acesso fácil ao local da tatuagem.",
  },
  {
    q: "Como é a cicatrização?",
    a: "Você sai com um guia completo de cuidados. Em geral a pele cicatriza entre 15 e 30 dias. Mantenha limpo, hidratado e longe de sol e mar nas primeiras semanas. Eu acompanho a cura de perto por mensagem.",
  },
  {
    q: "Os retoques são cobrados?",
    a: "Não nos primeiros 60 dias. Retoques de cicatrização dentro desse prazo estão inclusos. Depois disso, retoques são avaliados individualmente.",
  },
  {
    q: "Posso levar minha própria ideia ou referência?",
    a: "Com certeza — e é incentivado. Trabalho com projetos autorais, então uso suas referências como ponto de partida para criar algo único, nunca uma cópia.",
  },
  {
    q: "Qual a idade mínima?",
    a: "É necessário ter 18 anos completos e apresentar documento com foto no dia da sessão. Não realizo tatuagens em menores de idade, mesmo com autorização.",
  },
  {
    q: "O material é seguro?",
    a: "Sempre. Trabalho com material 100% descartável, agulhas lacradas abertas na sua frente e biossegurança rigorosa. Sua saúde é inegociável.",
  },
];

// Trabalhos reais do DW (fotos do Drive "Dw Tatto"). Labels/locais são uma
// sugestão — ajuste livremente.
export const portfolioItems = [
  {
    id: 1,
    src: `${bp}/portfolio/work-01.jpg`,
    alt: "Retrato feminino em realismo preto e cinza",
    style: "Realismo",
    placement: "Braço",
    size: "large" as const,
    label: "ETÉREA",
  },
  {
    id: 2,
    src: `${bp}/portfolio/work-02.jpg`,
    alt: "Anjo / querubim em realismo preto e cinza",
    style: "Religioso",
    placement: "Peito",
    size: "large" as const,
    label: "GUARDIÃO",
  },
  {
    id: 3,
    src: `${bp}/portfolio/work-03.jpg`,
    alt: "Fechamento de braço com figura religiosa e cruz",
    style: "Religioso",
    placement: "Braço fechado",
    size: "large" as const,
    label: "FÉ",
  },
  {
    id: 4,
    src: `${bp}/portfolio/work-04.jpg`,
    alt: "Cavaleiro com elmo em realismo na perna",
    style: "Realismo",
    placement: "Perna",
    size: "large" as const,
    label: "GUERREIRO",
  },
  {
    id: 5,
    src: `${bp}/portfolio/work-05.jpg`,
    alt: "Tigre com flores em realismo no antebraço",
    style: "Realismo",
    placement: "Antebraço",
    size: "medium" as const,
    label: "FERA",
  },
  {
    id: 6,
    src: `${bp}/portfolio/work-06.jpg`,
    alt: "Retrato feminino com coroa no antebraço",
    style: "Realismo",
    placement: "Antebraço",
    size: "large" as const,
    label: "RAINHA",
  },
  {
    id: 7,
    src: `${bp}/portfolio/work-07.jpg`,
    alt: "Composição floral em fineline no antebraço",
    style: "Fineline",
    placement: "Antebraço",
    size: "medium" as const,
    label: "FLORAL",
  },
];

// Desenhos autorais disponíveis (flashes). Cada um é tatuado uma única vez.
export const flashItems = [
  {
    id: "flash-01",
    name: "Máscara",
    style: "Realismo",
    description: "Personagem mascarado em traço preciso — força e mistério em preto e cinza.",
    src: `${bp}/flashes/flash-01.png`,
    simSrc: `${bp}/flashes/sim/flash-01.png`,
    placeholder: "🎭",
  },
  {
    id: "flash-02",
    name: "Dualidade",
    style: "Religioso",
    description: "Duas faces clássicas e latim — o diálogo entre o que está acima e o que está abaixo.",
    src: `${bp}/flashes/flash-02.png`,
    simSrc: `${bp}/flashes/sim/flash-02.png`,
    placeholder: "⚖️",
  },
  {
    id: "flash-03",
    name: "Instinto",
    style: "Realismo",
    description: "Retrato feminino com tigre — realismo preto e cinza unindo razão e instinto.",
    src: `${bp}/flashes/flash-03.png`,
    simSrc: `${bp}/flashes/sim/flash-03.png`,
    placeholder: "🐯",
  },
  {
    id: "flash-04",
    name: "Simetria",
    style: "Fineline",
    description: "Rosto feminino com geometria — equilíbrio entre realismo e linhas finas.",
    src: `${bp}/flashes/flash-04.png`,
    simSrc: `${bp}/flashes/sim/flash-04.png`,
    placeholder: "🔻",
  },
];
