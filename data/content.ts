export const qa = [
  {
    q: '¿Por qué publicidad?',
    a: 'Siempre me interesó el proceso de persuasión: entender por qué las personas deciden. La publicidad fue el camino para convertir eso en una carrera — y los datos, la herramienta para hacerlo con precisión.',
  },
  {
    q: '¿Qué me diferencia?',
    a: 'Que pienso en términos de negocio antes que de creatividad. No busco la pieza más llamativa, sino la que mueve el indicador que importa. Y no espero el título para demostrarlo — los proyectos reales ya lo hacen.',
  },
  {
    q: '¿Cómo tomo decisiones?',
    a: 'Con datos primero, intuición después. Nunca al revés. Antes de proponer cualquier cosa, analizo los indicadores clave: alcance, apertura, conversión. La creatividad entra cuando ya sé qué tiene que resolver.',
  },
  {
    q: '¿Dónde me ubico?',
    a: 'Santiago, Chile. Curso publicidad en la UDP, desarrollo proyectos con marcas reales y busco la primera organización en la que pueda generar impacto desde el primer día. Si llegaste hasta aquí, probablemente seas tú.',
  },
];

export const skillGroups: Record<string, string[]> = {
  'Estrategia & Planificación': [
    'Estrategia Digital',
    'Planificación de Medios',
    'Investigación de Mercado',
    'Liderazgo y Administración de Proyectos',
  ],
  'Performance & Contenido': [
    'Meta Ads',
    'Google Ads',
    'Social Media Management',
    'Email Marketing',
    'Adobe Suite',
    'Canva',
  ],
  'Data & Herramientas': ['Google Analytics', 'Excel', 'Power BI'],
  'Inteligencia Artificial': ['IA', 'IA Aplicada a Negocios', 'Agentic IA', 'Claude Code'],
};

export const skillsExtra = ['Inglés B2'];

export const certs = [
  { name: 'Google Analytics',         issuer: 'Google',             abbr: 'GOOG', ongoing: false },
  { name: 'Google Ads',               issuer: 'Google',             abbr: 'GOOG', ongoing: false },
  { name: 'Kantar Ibope Media',       issuer: 'Kantar',             abbr: 'KNTR', ongoing: false },
  { name: 'Megatime',                 issuer: 'Megatime',           abbr: 'MGT',  ongoing: false },
  { name: 'Excel Intermedio',         issuer: 'Microsoft',          abbr: 'MSFT', ongoing: false },
  { name: 'Power BI',                 issuer: 'Microsoft',          abbr: 'MSFT', ongoing: true  },
  { name: 'McKinsey Forward Program', issuer: 'McKinsey & Company', abbr: 'MCK',  ongoing: true  },
  { name: 'Próximamente',             issuer: '—',                  abbr: '···',  ongoing: false, soon: true },
];

export const servicios = [
  {
    nombre: 'Estrategia Digital',
    desc: 'Diseño planes de contenido y embudos orientados a objetivos concretos: captación, posicionamiento o conversión.',
  },
  {
    nombre: 'Social Media Management',
    desc: 'Gestión y crecimiento de cuentas con contenido pensado para la audiencia correcta. Más alcance real, no vanidad.',
  },
  {
    nombre: 'Email Marketing',
    desc: 'Campañas y automatizaciones que convierten. Diseño de embudos, segmentación y optimización de tasas de apertura.',
  },
  {
    nombre: 'Analytics & Data',
    desc: 'Medición e interpretación de datos para tomar decisiones. Convierto métricas en acciones concretas con impacto real.',
  },
];
