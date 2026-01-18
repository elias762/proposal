// Dummy AI logic for proposal generation - Italian construction context
// Base durations by project type and scale (in weeks)
const baseDurations = {
  Ristrutturazione: { Small: 6, Medium: 10, Large: 16 },
  Residenziale: { Small: 10, Medium: 16, Large: 24 },
  Commerciale: { Small: 12, Medium: 20, Large: 30 },
  Infrastrutture: { Small: 14, Medium: 22, Large: 32 },
};

// Base costs by project type and scale (in euros)
const baseCosts = {
  Ristrutturazione: { Small: 85000, Medium: 280000, Large: 650000 },
  Residenziale: { Small: 180000, Medium: 450000, Large: 950000 },
  Commerciale: { Small: 320000, Medium: 850000, Large: 2200000 },
  Infrastrutture: { Small: 450000, Medium: 1200000, Large: 3500000 },
};

// Constraint multipliers for duration and cost
const constraintMultipliers = {
  'Tempistiche strette': { duration: 0.85, cost: 1.15 },
  'Dipendente da permessi': { duration: 1.15, cost: 1.05 },
  'Lavori notturni': { duration: 1.1, cost: 1.25 },
  'Restrizioni rumore': { duration: 1.1, cost: 1.08 },
  'Accesso al sito limitato': { duration: 1.15, cost: 1.12 },
  'Limite budget': { duration: 1.05, cost: 0.95 },
  'Lavori weekend': { duration: 1.05, cost: 1.15 },
  'Sensibile al meteo': { duration: 1.1, cost: 1.05 },
  'Vincoli storici': { duration: 1.2, cost: 1.25 },
  'Conformità ambientale': { duration: 1.1, cost: 1.08 },
};

// Budget range adjustments
const budgetRangeFactors = {
  '< €100k': 0.6,
  '€100k–€300k': 0.85,
  '€300k–€800k': 1.0,
  '€800k+': 1.3,
};

// Scope templates by project type (Italian)
const scopeTemplates = {
  Ristrutturazione: [
    'Valutazione completa del sito e analisi strutturale',
    'Demolizione e rimozione elementi esistenti',
    'Modifiche strutturali secondo progetto approvato',
    'Adeguamento e rifacimento impianto elettrico',
    'Ammodernamento impianto idraulico e climatizzazione',
    'Finiture interne: pavimenti, pareti e controsoffitti',
    'Installazione nuovi infissi e serramenti',
    'Collaudo finale e controllo qualità',
    'Smaltimento macerie e pulizia cantiere',
    'Documentazione e consegna fascicolo tecnico',
  ],
  Residenziale: [
    'Preparazione sito e opere di fondazione',
    'Realizzazione struttura portante e copertura',
    'Involucro edilizio: serramenti e tamponature',
    'Impianto elettrico grezzo e quadro generale',
    'Impianto idraulico grezzo e allacciamenti',
    'Installazione e collaudo impianto climatizzazione',
    'Isolamento termoacustico e cartongesso',
    'Finiture interne e opere di finitura',
    'Sistemazione esterna e verde',
    'Sopralluogo finale e consegna al proprietario',
  ],
  Commerciale: [
    'Pianificazione pre-costruzione e pratiche edilizie',
    'Opere di scavo e preparazione fondazioni',
    'Realizzazione struttura in acciaio o c.a.',
    'Involucro edilizio e facciata',
    'Impianti MEP (Meccanici, Elettrici, Idraulici)',
    'Sistemi antincendio e sicurezza',
    'Allestimento interni secondo specifiche cliente',
    'Infrastruttura tecnologica e cablaggio',
    'Finiture aree comuni e segnaletica',
    'Commissioning e certificato di agibilità',
  ],
  Infrastrutture: [
    'Indagini geotecniche e rilievo topografico',
    'Piano gestione traffico e sicurezza cantiere',
    'Movimento terra e livellamento',
    'Rete fognaria e sottoservizi',
    'Opere in calcestruzzo armato o acciaio',
    'Pavimentazioni e trattamenti superficiali',
    'Installazione barriere di sicurezza e segnaletica',
    'Impianto illuminazione pubblica',
    'Misure di conformità ambientale',
    'Collaudo finale e apertura al pubblico',
  ],
};

// Phase templates (Italian)
const phaseTemplates = {
  'Fase 1: Progettazione e Permessi': {
    activities: [
      'Revisione e finalizzazione progetto esecutivo',
      'Pratiche edilizie e autorizzazioni',
      'Pianificazione approvvigionamento materiali',
      'Selezione e contrattualizzazione subappaltatori',
    ],
    durationFactor: 0.15,
  },
  'Fase 2: Preparazione Cantiere': {
    activities: [
      'Allestimento cantiere e strutture temporanee',
      'Demolizioni o sgombero secondo necessità',
      'Allacciamenti e protezione sottoservizi',
      'Preparazione fondazioni e scavi',
    ],
    durationFactor: 0.2,
  },
  'Fase 3: Costruzione Principale': {
    activities: [
      'Opere strutturali principali',
      'Installazione impianti grezzi',
      'Completamento involucro edilizio',
      'Opere interne grezze',
    ],
    durationFactor: 0.45,
  },
  'Fase 4: Finiture e Collaudo': {
    activities: [
      'Finiture interne e installazione arredi fissi',
      'Test impianti e messa in servizio',
      'Completamento lista riserve',
      'Collaudo finale e consegna',
    ],
    durationFactor: 0.2,
  },
};

// Executive summary templates (Italian)
const summaryTemplates = {
  Ristrutturazione: (client, location, scale) =>
    `La presente proposta illustra un progetto di ristrutturazione di scala ${scale.toLowerCase() === 'large' ? 'grande' : scale.toLowerCase() === 'medium' ? 'media' : 'piccola'} per ${client} situato a ${location}. Sulla base dell'analisi di progetti simili completati e dei requisiti indicati, abbiamo sviluppato un piano esecutivo dettagliato che bilancia qualità, tempistiche e budget. Il nostro approccio privilegia il minimo impatto operativo, garantendo spazi moderni e funzionali conformi alle normative vigenti. Il progetto si avvarrà delle nostre metodologie consolidate e di una rete di subappaltatori qualificati per assicurare il successo dell'intervento.`,
  Residenziale: (client, location, scale) =>
    `Siamo lieti di presentare questa proposta per un progetto di costruzione residenziale di scala ${scale.toLowerCase() === 'large' ? 'grande' : scale.toLowerCase() === 'medium' ? 'media' : 'piccola'} per ${client} a ${location}. Attingendo dal nostro portfolio di realizzazioni residenziali, questo piano risponde ai requisiti specifici incorporando le migliori pratiche per qualità ed efficienza. Il nostro team realizzerà un immobile costruito secondo i più alti standard, con particolare attenzione all'efficienza energetica, durabilità e vivibilità. Garantiamo una comunicazione trasparente durante tutto il ciclo di vita del progetto e un processo di consegna fluido.`,
  Commerciale: (client, location, scale) =>
    `Questa proposta dettaglia il nostro approccio per la realizzazione di un progetto commerciale di scala ${scale.toLowerCase() === 'large' ? 'grande' : scale.toLowerCase() === 'medium' ? 'media' : 'piccola'} per ${client} presso ${location}. La nostra esperienza nelle costruzioni commerciali, unita alle informazioni derivanti da progetti comparabili, ci permette di proporre un piano esecutivo realistico e realizzabile. Il progetto sarà gestito per soddisfare i requisiti del cliente nel rispetto di tutti i codici edilizi e standard di sicurezza applicabili. Priorità viene data alla minimizzazione dell'impatto sulle attività e alla consegna di spazi pronti per l'uso immediato.`,
  Infrastrutture: (client, location, scale) =>
    `BuildFlow Costruzioni è lieta di presentare questa proposta per un progetto infrastrutturale di scala ${scale.toLowerCase() === 'large' ? 'grande' : scale.toLowerCase() === 'medium' ? 'media' : 'piccola'} per ${client} a ${location}. I progetti infrastrutturali richiedono una pianificazione meticolosa, conformità normativa e coordinamento con gli stakeholder pubblici—aree in cui il nostro team eccelle. Questa proposta riflette la nostra comprensione della natura critica delle opere infrastrutturali e il nostro impegno per la sicurezza pubblica durante la costruzione. Collaboreremo strettamente con tutte le autorità competenti per garantire un'esecuzione fluida del progetto.`,
};

// Similar projects database (Italian context)
const similarProjectsDb = [
  {
    id: 101,
    name: 'Riqualificazione Appartamenti Zona Navigli',
    type: 'Ristrutturazione',
    scale: 'Medium',
    duration: 11,
    cost: 295000,
    constraints: ['Restrizioni rumore', 'Accesso al sito limitato'],
  },
  {
    id: 102,
    name: 'Villette a Schiera Lago di Garda',
    type: 'Residenziale',
    scale: 'Medium',
    duration: 18,
    cost: 520000,
    constraints: ['Dipendente da permessi'],
  },
  {
    id: 103,
    name: 'Fit-Out Uffici Polo Tecnologico Milano',
    type: 'Commerciale',
    scale: 'Large',
    duration: 28,
    cost: 1850000,
    constraints: ['Tempistiche strette', 'Lavori notturni'],
  },
  {
    id: 104,
    name: 'Rifacimento Stradale Via Roma',
    type: 'Infrastrutture',
    scale: 'Small',
    duration: 12,
    cost: 380000,
    constraints: ['Accesso al sito limitato', 'Lavori notturni'],
  },
  {
    id: 105,
    name: 'Restauro Palazzo Storico Firenze',
    type: 'Ristrutturazione',
    scale: 'Large',
    duration: 20,
    cost: 780000,
    constraints: ['Dipendente da permessi', 'Vincoli storici'],
  },
  {
    id: 106,
    name: 'Villa Unifamiliare Brianza',
    type: 'Residenziale',
    scale: 'Small',
    duration: 14,
    cost: 210000,
    constraints: [],
  },
  {
    id: 107,
    name: 'Ristrutturazione Centro Commerciale Bologna',
    type: 'Commerciale',
    scale: 'Medium',
    duration: 22,
    cost: 920000,
    constraints: ['Restrizioni rumore', 'Limite budget'],
  },
  {
    id: 108,
    name: 'Sostituzione Impalcato Ponte sul Po',
    type: 'Infrastrutture',
    scale: 'Medium',
    duration: 24,
    cost: 1350000,
    constraints: ['Tempistiche strette', 'Dipendente da permessi'],
  },
  {
    id: 109,
    name: 'Conversione Mansarda Centro Storico Torino',
    type: 'Ristrutturazione',
    scale: 'Small',
    duration: 7,
    cost: 95000,
    constraints: ['Limite budget'],
  },
  {
    id: 110,
    name: 'Villa di Lusso Costiera Amalfitana',
    type: 'Residenziale',
    scale: 'Large',
    duration: 26,
    cost: 1100000,
    constraints: ['Dipendente da permessi', 'Accesso al sito limitato'],
  },
  {
    id: 111,
    name: 'Ampliamento Centro Logistico Verona',
    type: 'Commerciale',
    scale: 'Large',
    duration: 32,
    cost: 2400000,
    constraints: ['Tempistiche strette'],
  },
  {
    id: 112,
    name: 'Sottopasso Pedonale Stazione Centrale',
    type: 'Infrastrutture',
    scale: 'Large',
    duration: 34,
    cost: 3200000,
    constraints: ['Lavori notturni', 'Accesso al sito limitato', 'Dipendente da permessi'],
  },
  {
    id: 113,
    name: 'Riqualificazione Energetica Condominio EUR',
    type: 'Ristrutturazione',
    scale: 'Medium',
    duration: 14,
    cost: 420000,
    constraints: ['Conformità ambientale', 'Restrizioni rumore'],
  },
  {
    id: 114,
    name: 'Residence Turistico Sardegna',
    type: 'Residenziale',
    scale: 'Large',
    duration: 28,
    cost: 1450000,
    constraints: ['Conformità ambientale', 'Sensibile al meteo'],
  },
  {
    id: 115,
    name: 'Parcheggio Multipiano Centro Città',
    type: 'Commerciale',
    scale: 'Large',
    duration: 30,
    cost: 2800000,
    constraints: ['Accesso al sito limitato', 'Restrizioni rumore'],
  },
];

// Find similar projects based on type, scale, and constraints
export function findSimilarProjects(type, scale, constraints = []) {
  const scored = similarProjectsDb.map((project) => {
    let score = 0;

    // Type match is most important
    if (project.type === type) score += 50;

    // Scale match
    if (project.scale === scale) score += 30;

    // Constraint matches
    const matchingConstraints = constraints.filter((c) =>
      project.constraints.includes(c)
    );
    score += matchingConstraints.length * 10;

    // Generate similarity reason (Italian)
    let reason = '';
    if (project.type === type && project.scale === scale) {
      reason = `Stessa tipologia (${type}) e scala`;
    } else if (project.type === type) {
      reason = `Stessa tipologia di progetto (${type})`;
    } else if (matchingConstraints.length > 0) {
      reason = `Vincoli simili: ${matchingConstraints.join(', ')}`;
    } else {
      reason = 'Livello di complessità comparabile';
    }

    if (matchingConstraints.length > 0 && project.type === type) {
      reason = `Ambito simile + ${matchingConstraints[0].toLowerCase()}`;
    }

    return { ...project, score, reason };
  });

  return scored
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

// Generate the full proposal
export function generateProposal(request, linkedReferences = []) {
  const {
    client,
    projectType,
    location,
    scale,
    targetStartDate,
    targetDeadline,
    requirements,
    constraints = [],
    budgetRange,
  } = request;

  // Calculate base duration and cost
  let duration = baseDurations[projectType]?.[scale] || 16;
  let totalCost = baseCosts[projectType]?.[scale] || 500000;

  // Apply constraint multipliers
  constraints.forEach((constraint) => {
    const mult = constraintMultipliers[constraint];
    if (mult) {
      duration = Math.round(duration * mult.duration);
      totalCost = Math.round(totalCost * mult.cost);
    }
  });

  // Apply budget range factor
  const budgetFactor = budgetRangeFactors[budgetRange] || 1.0;
  totalCost = Math.round(totalCost * budgetFactor);

  // Calculate phase durations
  const phases = Object.entries(phaseTemplates).map(([name, template]) => ({
    name,
    duration: Math.max(1, Math.round(duration * template.durationFactor)),
    activities: template.activities,
  }));

  // Generate scope bullets (6-10 based on requirements length)
  const baseScope = scopeTemplates[projectType] || scopeTemplates.Commerciale;
  const numBullets = Math.min(10, Math.max(6, Math.floor(requirements.length / 50) + 6));
  const scope = baseScope.slice(0, numBullets);

  // Add custom scope items based on requirements keywords (Italian)
  const reqLower = requirements.toLowerCase();
  if (reqLower.includes('sostenibil') || reqLower.includes('green') || reqLower.includes('energia') || reqLower.includes('fotovoltaico')) {
    scope.push('Integrazione materiali sostenibili e sistemi ad alta efficienza energetica');
  }
  if (reqLower.includes('domotica') || reqLower.includes('smart') || reqLower.includes('automazione') || reqLower.includes('tecnolog')) {
    scope.push('Sistemi di building automation e domotica');
  }
  if (reqLower.includes('parcheggio') || reqLower.includes('garage') || reqLower.includes('box auto')) {
    scope.push('Realizzazione o ristrutturazione area parcheggio');
  }
  if (reqLower.includes('giardino') || reqLower.includes('verde') || reqLower.includes('esterno')) {
    scope.push('Sistemazione aree verdi e spazi esterni');
  }
  if (reqLower.includes('antisismic') || reqLower.includes('sism')) {
    scope.push('Adeguamento sismico secondo normativa vigente');
  }
  if (reqLower.includes('superbonus') || reqLower.includes('ecobonus') || reqLower.includes('incentiv')) {
    scope.push('Predisposizione documentazione per accesso agli incentivi fiscali');
  }

  // Generate executive summary
  const summaryGenerator = summaryTemplates[projectType] || summaryTemplates.Commerciale;
  const executiveSummary = summaryGenerator(client, location || 'la località indicata', scale);

  // Cost breakdown
  const laborCost = Math.round(totalCost * 0.35);
  const materialsCost = Math.round(totalCost * 0.40);
  const subcontractorsCost = Math.round(totalCost * 0.15);
  const contingency = Math.round(totalCost * 0.10);

  // Timeline assumptions based on constraints (Italian)
  const assumptions = [
    'Tutti i permessi necessari saranno ottenuti entro i tempi standard',
    'L\'accesso al cantiere sarà disponibile secondo programma',
    'Le condizioni meteo consentiranno un normale avanzamento lavori',
  ];

  if (constraints.includes('Dipendente da permessi')) {
    assumptions[0] = 'I tempi per i permessi potrebbero estendersi in base alla revisione degli enti';
  }
  if (constraints.includes('Vincoli storici')) {
    assumptions.push('L\'approvazione della Soprintendenza potrebbe richiedere tempi aggiuntivi');
  }

  // Risk factors (Italian)
  const risks = [
    'Fluttuazioni dei prezzi dei materiali potrebbero impattare i costi finali',
    'Condizioni impreviste del sito potrebbero richiedere varianti',
    'Disponibilità subappaltatori durante l\'alta stagione',
  ];

  if (constraints.includes('Tempistiche strette')) {
    risks.push('Tempistiche compresse aumentano la complessità di coordinamento');
  }
  if (constraints.includes('Lavori notturni') || constraints.includes('Lavori weekend')) {
    risks.push('I lavori fuori orario potrebbero richiedere autorizzazioni aggiuntive');
  }
  if (constraints.includes('Vincoli storici')) {
    risks.push('Interventi su edifici vincolati richiedono procedure specifiche');
  }

  // Recommended next actions (Italian)
  const nextActions = [
    'Programmare sopralluogo per validare le assunzioni di progetto',
    'Finalizzare requisiti dettagliati e specifiche tecniche',
    'Confermare requisiti autorizzativi con gli enti competenti',
    'Revisionare e approvare allocazione budget preliminare',
    'Definire protocolli di comunicazione del progetto',
  ];

  if (projectType === 'Ristrutturazione') {
    nextActions.splice(1, 0, 'Effettuare valutazione strutturale dettagliata');
  }
  if (projectType === 'Infrastrutture') {
    nextActions.splice(2, 0, 'Coordinare con gestori sottoservizi per eventuali spostamenti');
  }
  if (constraints.includes('Vincoli storici')) {
    nextActions.splice(2, 0, 'Avviare interlocuzione preliminare con la Soprintendenza');
  }

  return {
    executiveSummary,
    scope: scope.slice(0, 10),
    phases,
    timeline: {
      totalDuration: duration,
      assumptions: assumptions.slice(0, 4),
      risks: risks.slice(0, 4),
    },
    costEstimate: {
      total: totalCost,
      breakdown: {
        labor: laborCost,
        materials: materialsCost,
        subcontractors: subcontractorsCost,
        contingency,
      },
      note: 'Stima basata su progetti storici simili e vincoli indicati.',
    },
    nextActions: nextActions.slice(0, 6),
    references: linkedReferences,
    generatedAt: new Date().toISOString(),
  };
}

// Format currency (Italian style)
export function formatCurrency(amount) {
  return `€${amount.toLocaleString('it-IT')}`;
}
