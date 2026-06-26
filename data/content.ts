export const qa = [
  {
    q: '¿Por qué publicidad?',
    a: 'Siempre me gustó vender. Desde chico entendí que convencer a alguien de algo tiene una lógica detrás, no es suerte. La publicidad fue la forma de convertir eso en una carrera — y los datos, la forma de hacerlo bien.',
  },
  {
    q: '¿Qué te diferencia?',
    a: 'Que pienso en negocios antes que en creatividad. No busco hacer la pieza más bonita, busco la que mueve el número que importa. Y no espero el título para demostrarlo — ya llevo proyectos reales encima.',
  },
  {
    q: '¿Cómo tomás decisiones?',
    a: 'Con datos primero, intuición después. Nunca al revés. Antes de proponer cualquier cosa, entiendo qué está pasando con los números: alcance, apertura, conversión. La creatividad entra cuando ya sé qué tiene que resolver.',
  },
  {
    q: '¿Dónde estás?',
    a: 'Santiago, Chile. Estudiando publicidad en la UDP, trabajando con marcas reales y buscando la primera empresa que me deje operar desde adentro. Si llegaste hasta acá, probablemente seas tú.',
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
    'Community Management',
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
  { name: 'Meta Blueprint',           issuer: 'Meta',               abbr: 'META', ongoing: false },
  { name: 'Kantar Ibope Media',       issuer: 'Kantar',             abbr: 'KNTR', ongoing: false },
  { name: 'Megatime',                 issuer: 'Megatime',           abbr: 'MGT',  ongoing: false },
  { name: 'Excel Avanzado',           issuer: 'Microsoft',          abbr: 'MSFT', ongoing: false },
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
    nombre: 'Community Management',
    desc: 'Gestión y crecimiento de cuentas con contenido pensado para la audiencia correcta. Más alcance real, no vanidad.',
  },
  {
    nombre: 'Email Marketing',
    desc: 'Campañas y automatizaciones que convierten. Diseño de embudos, segmentación y optimización de tasas de apertura.',
  },
  {
    nombre: 'Analytics & Data',
    desc: 'Medición e interpretación de datos para tomar decisiones. Convierto métricas en acciones que mueven la aguja.',
  },
];
