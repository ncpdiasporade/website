(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const DATA_URL = 'archive-data.json?v=20260826-archive-v1';
  const YEARS = Array.from({ length: 16 }, (_, index) => 2009 + index);

  const COPY = {
    bn: {
      skip: 'মূল আর্কাইভে যান', navArchive: 'আর্কাইভ', navGuide: 'কীভাবে পড়বেন', navSources: 'তথ্যের উৎস', navHome: 'মূল ওয়েবসাইট',
      heroKicker: 'ইন্টারঅ্যাকটিভ আর্কাইভ', heroLineOne: 'একটি শাসনকাল', heroLineTwo: 'অসংখ্য অমীমাংসিত অধ্যায়',
      heroLead: '২০০৯ থেকে ২০২৪—রাষ্ট্রীয় ক্ষমতার বিস্তার, গুম ও গোপন আটক, সীমান্ত হত্যা, রাজনৈতিক সহিংসতা, মতপ্রকাশের দমন, প্রশ্নবিদ্ধ নির্বাচন এবং জুলাই গণঅভ্যুত্থানের দিকে পৌঁছানো ঘটনাগুলো এখানে উৎসসহ একসঙ্গে দেখা যাবে।',
      explore: 'ঘটনাগুলো অন্বেষণ করুন', incidentLabel: 'ঘটনা ও প্যাটার্ন', sourceLabel: 'যাচাইযোগ্য উৎস', yearSpanLabel: 'বছরের নথি', archiveLabel: 'জীবন্ত আর্কাইভ',
      explorerTitle: 'একটি বিষয়ে স্পর্শ করুন—তার সঙ্গে যুক্ত অধ্যায়গুলো খুলে যাবে।', explorerIntro: 'বৃত্তের আকার ঘটনার গুরুত্ব ও নেভিগেশন অগ্রাধিকার বোঝায়—নিহতের সংখ্যা নয়। প্রতিটি রেকর্ডের প্রমাণ-অবস্থা ও সতর্কতা অক্ষুণ্ণ রাখা হয়েছে।',
      modeAll: 'সব বিষয়', modeCategory: 'ঘটনাসমূহ', modeTime: 'সময়', searchLabel: 'আর্কাইভ খুঁজুন', searchPlaceholder: 'নাম, ঘটনা, বছর বা বিষয় খুঁজুন', reset: '← সব ঘটনা', networkAll: 'বিষয়ভিত্তিক মানচিত্র', noResults: 'এই অনুসন্ধানে কোনো রেকর্ড পাওয়া যায়নি।',
      previewEmptyTitle: 'প্রমাণের মানচিত্রে প্রবেশ করুন', previewEmptyBody: 'কোনো বৃত্তে hover, focus বা tap করলে তার তারিখ, সংক্ষিপ্ত প্রেক্ষাপট, প্রমাণের স্তর এবং উৎসের সংখ্যা এখানে দেখা যাবে।', levelA: 'শক্তিশালী প্রমাণ', levelB: 'বিশ্বাসযোগ্য নথি', levelC: 'সতর্কতার সঙ্গে দেখুন',
      guideLabel: 'পাঠপদ্ধতি', guideTitle: 'কীভাবে পড়বেন', guideOneTitle: 'ঘটনা ও দায় আলাদা', guideOneBody: 'কোনো ঘটনা ঘটেছে—এবং কার প্রত্যক্ষ দায়—দুটি আলাদা প্রশ্ন। archive প্রতিটি record-এ এই পার্থক্য ধরে রাখে।', guideTwoTitle: 'প্রমাণের স্তর দেখুন', guideTwoBody: 'A, B ও C চিহ্ন উৎসের শক্তি বোঝায়। এটি ঘটনার মানবিক গুরুত্বের র‍্যাঙ্কিং নয়।', guideThreeTitle: 'মূল উৎস খুলুন', guideThreeBody: 'সারাংশের পর মূল প্রতিবেদন, আদালতের নথি বা নির্ভরযোগ্য সংবাদসূত্র খুলে পূর্ণ প্রেক্ষাপট পড়ুন।',
      sourcesLabel: 'উৎসপঞ্জি', sourcesTitle: 'তথ্যের উৎস', sourcesIntro: 'প্রাথমিক ও সরকারি নথি, UN/OHCHR, আন্তর্জাতিক মানবাধিকার সংস্থা এবং নির্ভরযোগ্য সংবাদসূত্রকে অগ্রাধিকার দেওয়া হয়েছে।', sourceSearchLabel: 'উৎস খুঁজুন', sourceSearchPlaceholder: 'প্রকাশক বা প্রতিবেদনের নাম খুঁজুন', sourcesVisible: 'টি উৎস', showAllSources: 'সব উৎস দেখুন', showFewerSources: 'সংক্ষিপ্ত করুন',
      footerNote: 'স্মৃতি · প্রমাণ · জবাবদিহি', backTop: 'উপরে ফিরুন ↑', records: 'টি নথি', openCategory: 'এই বিষয়ের ঘটনাগুলো দেখুন', openRecord: 'পূর্ণ নথি খুলুন', sourceCount: 'উৎস', evidence: 'প্রমাণ', date: 'তারিখ', location: 'স্থান', attribution: 'নথিভুক্ত attribution', governmentRelation: 'সরকার/রাষ্ট্রের সম্পর্ক', status: 'নথির অবস্থা', caution: 'সম্পাদকীয় সতর্কতা', originalRecord: 'মূল বাংলা সারাংশ', recordSummary: 'ঘটনার সারাংশ', sourcesUsed: 'সংযুক্ত উৎস', externalSource: 'মূল উৎস খুলুন', allYears: 'সব বছর', searchResults: 'অনুসন্ধানের ফল', timeMap: 'সময়ভিত্তিক মানচিত্র', categoryMap: 'সব ঘটনার মানচিত্র', datasetError: 'আর্কাইভের তথ্য লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
    },
    en: {
      skip: 'Skip to the archive', navArchive: 'Archive', navGuide: 'How to read', navSources: 'Sources', navHome: 'Main website',
      heroKicker: 'Interactive archive', heroLineOne: 'One period of rule', heroLineTwo: 'Countless unresolved chapters',
      heroLead: 'From 2009 to 2024, this source-linked archive brings together the expansion of state power, enforced disappearances and secret detention, border killings, political violence, restrictions on expression, contested elections and the events leading to the July Uprising.',
      explore: 'Explore the events', incidentLabel: 'events and patterns', sourceLabel: 'verifiable sources', yearSpanLabel: 'years documented', archiveLabel: 'Living archive',
      explorerTitle: 'Touch a subject—its connected chapters will unfold.', explorerIntro: 'Circle size indicates editorial prominence and navigation priority—not the number of deaths. Evidence status and cautions are preserved for every record.',
      modeAll: 'Subjects', modeCategory: 'Events', modeTime: 'Time', searchLabel: 'Search the archive', searchPlaceholder: 'Search a name, event, year or subject', reset: '← All events', networkAll: 'Subject map', noResults: 'No archive record matches this search.',
      previewEmptyTitle: 'Enter the evidence map', previewEmptyBody: 'Hover, focus or tap a circle to see its date, context, evidence level and source count here.', levelA: 'Strong evidence', levelB: 'Credible documentation', levelC: 'Read with caution',
      guideLabel: 'Reading method', guideTitle: 'How to read', guideOneTitle: 'Event and responsibility are separate', guideOneBody: 'That an event occurred and who bears direct responsibility are different questions. Each archive record preserves that distinction.', guideTwoTitle: 'Read the evidence level', guideTwoBody: 'A, B and C describe the strength of the sources. They do not rank the human importance of an event.', guideThreeTitle: 'Open the original source', guideThreeBody: 'After the summary, read the linked report, court record or credible news source for the full context.',
      sourcesLabel: 'Bibliography', sourcesTitle: 'Sources', sourcesIntro: 'Priority is given to primary and official records, UN/OHCHR, international rights organisations and credible news reporting.', sourceSearchLabel: 'Search sources', sourceSearchPlaceholder: 'Search a publisher or report title', sourcesVisible: 'sources', showAllSources: 'Show all sources', showFewerSources: 'Show fewer',
      footerNote: 'Memory · Evidence · Accountability', backTop: 'Back to top ↑', records: 'records', openCategory: 'Explore this subject', openRecord: 'Open full record', sourceCount: 'Sources', evidence: 'Evidence', date: 'Date', location: 'Location', attribution: 'Documented attribution', governmentRelation: 'Government/state relation', status: 'Record status', caution: 'Editorial caution', originalRecord: 'Original Bengali summary', recordSummary: 'Event summary', sourcesUsed: 'Linked sources', externalSource: 'Open source', allYears: 'All years', searchResults: 'Search results', timeMap: 'Chronological map', categoryMap: 'All-event map', datasetError: 'The archive data could not be loaded. Please try again.'
    },
    de: {
      skip: 'Zum Archiv springen', navArchive: 'Archiv', navGuide: 'Lesehilfe', navSources: 'Quellen', navHome: 'Hauptseite',
      heroKicker: 'Interaktives Archiv', heroLineOne: 'Eine Regierungszeit', heroLineTwo: 'Zahlreiche ungeklärte Kapitel',
      heroLead: 'Dieses quellenverknüpfte Archiv führt Ereignisse von 2009 bis 2024 zusammen: Ausbau staatlicher Macht, Verschwindenlassen und geheime Haft, Grenztötungen, politische Gewalt, Einschränkungen der Meinungsfreiheit, umstrittene Wahlen und den Weg zum Juli-Aufstand.',
      explore: 'Ereignisse erkunden', incidentLabel: 'Ereignisse und Muster', sourceLabel: 'prüfbare Quellen', yearSpanLabel: 'Jahre dokumentiert', archiveLabel: 'Lebendiges Archiv',
      explorerTitle: 'Berühren Sie ein Thema—die verbundenen Kapitel öffnen sich.', explorerIntro: 'Die Kreisgröße zeigt redaktionelle Bedeutung und Navigationspriorität—nicht die Zahl der Todesopfer. Belegstatus und Hinweise jedes Eintrags bleiben erhalten.',
      modeAll: 'Themen', modeCategory: 'Ereignisse', modeTime: 'Zeit', searchLabel: 'Archiv durchsuchen', searchPlaceholder: 'Name, Ereignis, Jahr oder Thema suchen', reset: '← Alle Ereignisse', networkAll: 'Themenkarte', noResults: 'Für diese Suche wurde kein Archiveintrag gefunden.',
      previewEmptyTitle: 'Die Beweiskarte betreten', previewEmptyBody: 'Fahren Sie über einen Kreis, fokussieren oder berühren Sie ihn, um Datum, Kontext, Belegstufe und Quellenzahl zu sehen.', levelA: 'Starke Belege', levelB: 'Glaubwürdige Dokumentation', levelC: 'Mit Vorsicht lesen',
      guideLabel: 'Lesemethode', guideTitle: 'So lesen Sie das Archiv', guideOneTitle: 'Ereignis und Verantwortung trennen', guideOneBody: 'Ob ein Ereignis stattgefunden hat und wer unmittelbar verantwortlich ist, sind verschiedene Fragen. Jeder Eintrag wahrt diese Trennung.', guideTwoTitle: 'Belegstufe beachten', guideTwoBody: 'A, B und C beschreiben die Stärke der Quellen. Sie bewerten nicht die menschliche Bedeutung eines Ereignisses.', guideThreeTitle: 'Originalquelle öffnen', guideThreeBody: 'Lesen Sie nach der Zusammenfassung den verlinkten Bericht, Gerichtsakt oder die glaubwürdige Nachricht für den vollständigen Kontext.',
      sourcesLabel: 'Bibliografie', sourcesTitle: 'Quellen', sourcesIntro: 'Vorrang haben Primär- und amtliche Dokumente, UN/OHCHR, internationale Menschenrechtsorganisationen und glaubwürdige Medien.', sourceSearchLabel: 'Quellen suchen', sourceSearchPlaceholder: 'Herausgeber oder Berichtstitel suchen', sourcesVisible: 'Quellen', showAllSources: 'Alle Quellen zeigen', showFewerSources: 'Weniger zeigen',
      footerNote: 'Erinnerung · Belege · Rechenschaft', backTop: 'Nach oben ↑', records: 'Einträge', openCategory: 'Dieses Thema erkunden', openRecord: 'Vollständigen Eintrag öffnen', sourceCount: 'Quellen', evidence: 'Belege', date: 'Datum', location: 'Ort', attribution: 'Dokumentierte Zuordnung', governmentRelation: 'Bezug zu Regierung/Staat', status: 'Dokumentationsstatus', caution: 'Redaktioneller Hinweis', originalRecord: 'Bengalische Originalzusammenfassung', recordSummary: 'Ereigniszusammenfassung', sourcesUsed: 'Verknüpfte Quellen', externalSource: 'Quelle öffnen', allYears: 'Alle Jahre', searchResults: 'Suchergebnisse', timeMap: 'Chronologische Karte', categoryMap: 'Karte aller Ereignisse', datasetError: 'Die Archivdaten konnten nicht geladen werden. Bitte versuchen Sie es erneut.'
    }
  };

  const CATEGORY_TRANSLATIONS = {
    MAJOR_TRAGEDY: ['বড় ট্র্যাজেডি', 'Major tragedy', 'Große Tragödie'], STATE_VIOLENCE: ['রাষ্ট্রীয় সহিংসতা / নিরাপত্তা বাহিনী', 'State violence / security forces', 'Staatliche Gewalt / Sicherheitskräfte'], ENFORCED_DISAPPEARANCE: ['গুম ও গোপন আটক', 'Disappearances and secret detention', 'Verschwindenlassen und Geheimhaft'], BORDER_KILLING: ['সীমান্ত হত্যা', 'Border killings', 'Tötungen an der Grenze'], DEMOCRACY_ELECTIONS: ['গণতন্ত্র ও নির্বাচন', 'Democracy and elections', 'Demokratie und Wahlen'], LABOR_RIGHTS: ['শ্রম অধিকার', 'Labour rights', 'Arbeitsrechte'], LABOR_SAFETY: ['শ্রমিক নিরাপত্তা', 'Worker safety', 'Arbeitssicherheit'], POLITICAL_VIOLENCE: ['রাজনৈতিক সহিংসতা', 'Political violence', 'Politische Gewalt'], FREEDOM_EXPRESSION: ['মতপ্রকাশ ও গণমাধ্যম', 'Expression and media', 'Meinungsfreiheit und Medien'], EXTREMIST_ATTACK: ['উগ্রবাদী / নন-স্টেট হামলা', 'Extremist / non-state attacks', 'Extremistische / nichtstaatliche Angriffe'], STATE_REPRESSION: ['রাষ্ট্রীয় দমন', 'State repression', 'Staatliche Repression'], JUDICIAL_INDEPENDENCE: ['বিচার বিভাগের স্বাধীনতা', 'Judicial independence', 'Unabhängigkeit der Justiz'], STUDENT_PROTESTS: ['ছাত্র আন্দোলন', 'Student protests', 'Studierendenproteste'], INTERNATIONAL_ACCOUNTABILITY: ['আন্তর্জাতিক জবাবদিহি', 'International accountability', 'Internationale Rechenschaft'], POLITICAL_REPRESSION: ['রাজনৈতিক দমন', 'Political repression', 'Politische Repression'], JULY_2024: ['জুলাই ২০২৪', 'July 2024', 'Juli 2024']
  };
  const CATEGORY_COLORS = ['#c6535a','#8a725d','#4f9270','#668f9d','#96715d','#8e8455','#7e705e','#9c5961','#6c8499','#85708e','#b34a55','#657f88','#7c8e67','#7b6c9a','#9b6670','#c33b46'];
  const EVIDENCE_COLORS = { A: '#53ce83', B: '#d1aa60', C: '#dc6369' };

  const state = { data: null, lang: 'bn', mode: 'all', category: null, year: null, query: '', sourcesExpanded: false, sourceQuery: '', active: null, rendered: [], positions: new Map(), animationFrame: 0 };
  const elements = {
    canvas: $('#network-canvas'), lines: $('#network-lines'), shell: $('#network-shell'), preview: $('#record-preview'), rail: $('#mobile-node-rail'), axis: $('#time-axis'), years: $('#year-navigator'), search: $('#archive-search'), reset: $('#reset-view'), count: $('#network-count'), label: $('#network-label'), empty: $('#empty-state'), dialog: $('#record-dialog'), dialogContent: $('#dialog-content'), sourceList: $('#source-list'), sourceSearch: $('#source-search'), sourceCount: $('#visible-source-count'), sourceMore: $('#show-more-sources')
  };

  const copy = key => COPY[state.lang][key] || COPY.bn[key] || key;
  const locale = () => state.lang === 'bn' ? 'bn-BD' : state.lang === 'de' ? 'de-DE' : 'en-GB';
  const number = value => Number(value).toLocaleString(locale());
  const yearNumber = value => Number(value).toLocaleString(locale(), { useGrouping: false });
  const normalize = value => String(value || '').toLocaleLowerCase().normalize('NFKD');
  const hash = value => [...String(value)].reduce((sum, char) => ((sum << 5) - sum + char.charCodeAt(0)) | 0, 0);
  const rand = (value, salt = 0) => {
    const x = Math.sin(hash(value) * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  const categoryIndex = category => Object.keys(CATEGORY_TRANSLATIONS).indexOf(category);
  const categoryColor = category => CATEGORY_COLORS[Math.max(0, categoryIndex(category)) % CATEGORY_COLORS.length];
  const categoryLabel = category => {
    const entry = CATEGORY_TRANSLATIONS[category];
    if (!entry) return state.data?.category_labels_bn?.[category] || category.replaceAll('_', ' ');
    return entry[state.lang === 'bn' ? 0 : state.lang === 'en' ? 1 : 2];
  };
  const incidentTitle = incident => state.lang === 'bn' ? incident.title_bn : (incident.title_en || incident.title_bn);
  const evidenceLabel = level => copy(level === 'A' ? 'levelA' : level === 'B' ? 'levelB' : 'levelC');
  const formatDate = incident => {
    if (!incident.date_start) return yearNumber(incident.year);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    const start = new Date(`${incident.date_start}T00:00:00Z`).toLocaleDateString(locale(), options);
    if (!incident.date_end || incident.date_end === incident.date_start) return start;
    return `${start} — ${new Date(`${incident.date_end}T00:00:00Z`).toLocaleDateString(locale(), options)}`;
  };
  const sourceEntries = () => Object.entries(state.data.sources).map(([id, source]) => ({ id, ...source }));
  const incidentSources = incident => incident.source_ids.map(id => ({ id, ...state.data.sources[id] })).filter(source => source.url);

  function applyLanguage(lang, rerender = true) {
    state.lang = COPY[lang] ? lang : 'bn';
    document.documentElement.lang = state.lang;
    document.body.dataset.lang = state.lang;
    $$('[data-copy]').forEach(node => { node.textContent = copy(node.dataset.copy); });
    $$('[data-copy-placeholder]').forEach(node => { node.placeholder = copy(node.dataset.copyPlaceholder); });
    $$('.language-switcher button').forEach(button => { const active = button.dataset.lang === state.lang; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    $('#brand-logo').src = state.lang === 'bn' ? '../img/logo/logo-navbar-bn-clear.png' : '../img/logo/logo-navbar-en-clear.png';
    if (state.data) {
      $('#scope-note').textContent = state.lang === 'bn' ? state.data.meta.scope_note_bn : (state.lang === 'de' ? 'Dieses forschungsbasierte Kerndataset umfasst 70 wichtige Ereignisse, Fälle und Muster von 2009 bis 2024. Es ist keine vollständige Liste aller Gewalttaten, Fälle des Verschwindenlassens, Grenztötungen, politischen Ereignisse oder Menschenrechtsverletzungen in Bangladesch.' : 'This research-based core dataset covers 70 important events, cases and patterns from 2009 to 2024. It is not a complete list of every act of violence, disappearance, border killing, political event or human-rights violation in Bangladesh.');
      if (rerender) { buildYears(); renderNetwork(); renderSources(); if (state.active) showPreview(state.active); }
    }
  }

  function filteredIncidents() {
    const query = normalize(state.query);
    return state.data.incidents.filter(incident => {
      if (state.category && incident.category !== state.category) return false;
      if (state.year && incident.year !== state.year) return false;
      if (!query) return true;
      const haystack = normalize([incident.title_bn, incident.title_en, incident.year, incident.category, state.data.category_labels_bn[incident.category], incident.location, ...(incident.tags || [])].join(' '));
      return haystack.includes(query);
    });
  }

  function categoryRecords() {
    return Object.keys(state.data.category_labels_bn).map((category, index) => {
      const incidents = state.data.incidents.filter(incident => incident.category === category);
      const years = incidents.map(incident => incident.year);
      return { type: 'category', id: `category-${category}`, category, title: categoryLabel(category), count: incidents.length, minYear: Math.min(...years), maxYear: Math.max(...years), weight: Math.min(5, 2.5 + incidents.length / 5), accent: CATEGORY_COLORS[index % CATEGORY_COLORS.length] };
    });
  }

  function nodeRecords() {
    const hasIncidentFilter = Boolean(state.category || state.year || state.query);
    if (state.mode === 'all' && !hasIncidentFilter) return categoryRecords();
    return filteredIncidents().map(incident => ({ type: 'incident', id: incident.id, incident, category: incident.category, title: incidentTitle(incident), weight: incident.bubble_weight || 2, accent: categoryColor(incident.category) }));
  }

  function buildYears() {
    elements.years.replaceChildren();
    const all = document.createElement('button');
    all.type = 'button'; all.dataset.year = ''; all.textContent = copy('allYears'); all.classList.toggle('active', !state.year);
    elements.years.append(all);
    YEARS.forEach(year => {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.year = String(year); button.textContent = yearNumber(year); button.classList.toggle('active', state.year === year);
      elements.years.append(button);
    });
  }

  function dimensions() {
    const rect = elements.shell.getBoundingClientRect();
    return { width: Math.max(320, rect.width), height: Math.max(500, rect.height) };
  }

  function sizeFor(record, count) {
    if (record.type === 'category') return Math.round(76 + record.weight * 17);
    const dense = count > 35 ? .72 : count > 20 ? .84 : 1;
    return Math.round((48 + record.weight * 13) * dense);
  }

  function layout(records) {
    const { width, height } = dimensions();
    const positions = records.map((record, index) => {
      const size = sizeFor(record, records.length);
      let x; let y;
      if (record.type === 'category') {
        const inner = index < 6;
        const ringIndex = inner ? index : index - 6;
        const total = inner ? Math.min(6, records.length) : Math.max(1, records.length - 6);
        const angle = -Math.PI / 2 + (ringIndex / total) * Math.PI * 2 + (inner ? 0 : .17);
        const radiusX = inner ? width * .23 : width * .39;
        const radiusY = inner ? height * .23 : height * .39;
        x = width / 2 + Math.cos(angle) * radiusX;
        y = height / 2 + 15 + Math.sin(angle) * radiusY;
      } else if (state.mode === 'time' && !state.query && !state.category) {
        x = 55 + ((record.incident.year - 2009) / 15) * (width - 110) + (rand(record.id, 1) - .5) * 20;
        y = 95 + rand(record.id, 2) * (height - 190);
      } else if (state.category) {
        const angle = -Math.PI / 2 + (index / Math.max(1, records.length)) * Math.PI * 2;
        const ring = index % 3;
        x = width / 2 + Math.cos(angle) * (width * (.18 + ring * .09));
        y = height / 2 + Math.sin(angle) * (height * (.2 + ring * .105));
      } else {
        const categoryOrder = Object.keys(state.data.category_labels_bn);
        const category = categoryOrder.indexOf(record.category);
        const angle = -Math.PI / 2 + (category / categoryOrder.length) * Math.PI * 2;
        const centerX = width / 2 + Math.cos(angle) * width * .3;
        const centerY = height / 2 + Math.sin(angle) * height * .3;
        x = centerX + (rand(record.id, 3) - .5) * width * .16;
        y = centerY + (rand(record.id, 4) - .5) * height * .18;
      }
      return { record, size, x, y };
    });
    settle(positions, width, height, state.mode === 'time');
    return positions;
  }

  function settle(positions, width, height, preserveX) {
    const padding = positions.length > 35 ? 3 : 8;
    const iterations = positions.length > 45 ? 10 : 18;
    for (let pass = 0; pass < iterations; pass += 1) {
      for (let i = 0; i < positions.length; i += 1) {
        const a = positions[i];
        for (let j = i + 1; j < positions.length; j += 1) {
          const b = positions[j];
          let dx = b.x - a.x; let dy = b.y - a.y;
          const distance = Math.hypot(dx, dy) || .1;
          const minimum = (a.size + b.size) / 2 + padding;
          if (distance >= minimum) continue;
          const force = (minimum - distance) / 2;
          dx /= distance; dy /= distance;
          if (!preserveX) { a.x -= dx * force; b.x += dx * force; }
          a.y -= dy * force; b.y += dy * force;
        }
        const margin = a.size / 2 + 14;
        a.x = Math.max(margin, Math.min(width - margin, a.x));
        a.y = Math.max(margin + 30, Math.min(height - margin - 24, a.y));
      }
    }
  }

  function createNode(position, index) {
    const { record, size, x, y } = position;
    const button = document.createElement('button');
    button.type = 'button'; button.className = `archive-node ${record.type}-node`; button.dataset.id = record.id; button.dataset.category = record.category; button.dataset.index = String(index);
    button.style.setProperty('--size', `${size}px`); button.style.setProperty('--x', `${x}px`); button.style.setProperty('--y', `${y}px`); button.style.setProperty('--accent', record.accent);
    const content = document.createElement('span'); content.className = 'node-content';
    const title = document.createElement('strong'); title.textContent = record.title; content.append(title);
    const meta = document.createElement('small');
    if (record.type === 'category') meta.textContent = `${number(record.count)} ${copy('records')}`;
    else meta.textContent = `${yearNumber(record.incident.year)} · ${record.incident.location || categoryLabel(record.category)}`;
    content.append(meta);
    if (record.type === 'incident') { const evidence = document.createElement('em'); evidence.textContent = `${record.incident.evidence_level} · ${number(record.incident.source_ids.length)} ${copy('sourceCount')}`; content.append(evidence); }
    button.append(content);
    button.setAttribute('aria-label', `${record.title}. ${meta.textContent}`);
    return button;
  }

  function renderNetwork() {
    state.active = null;
    elements.canvas.classList.remove('has-focus');
    elements.canvas.replaceChildren(); elements.lines.replaceChildren(); elements.axis.replaceChildren(); elements.rail.replaceChildren();
    const records = nodeRecords();
    const positions = layout(records); state.rendered = records; state.positions = new Map(positions.map(position => [position.record.id, position]));
    positions.forEach((position, index) => elements.canvas.append(createNode(position, index)));
    records.forEach(record => elements.rail.append(createRailNode(record)));
    elements.empty.hidden = records.length > 0; elements.count.textContent = number(records.length);
    elements.label.textContent = state.query ? copy('searchResults') : state.category ? categoryLabel(state.category) : state.mode === 'time' ? copy('timeMap') : state.mode === 'category' ? copy('categoryMap') : copy('networkAll');
    elements.reset.hidden = !(state.category || state.year || state.query || state.mode !== 'all');
    $$('.mode-switch button').forEach(button => { const active = button.dataset.mode === state.mode; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    buildYears(); renderTimeAxis(); requestAnimationFrame(drawConnections); showEmptyPreview();
  }

  function createRailNode(record) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'rail-node'; button.dataset.id = record.id;
    const title = document.createElement('b'); title.textContent = record.title; const meta = document.createElement('span'); meta.textContent = record.type === 'category' ? `${number(record.count)} ${copy('records')}` : `${yearNumber(record.incident.year)} · ${evidenceLabel(record.incident.evidence_level)}`;
    button.append(title, meta); return button;
  }

  function renderTimeAxis() {
    if (state.mode !== 'time' || state.category || state.query) return;
    const { width } = dimensions();
    YEARS.forEach((year, index) => { const mark = document.createElement('span'); mark.className = 'time-mark'; mark.style.left = `${55 + (index / 15) * (width - 110)}px`; mark.textContent = yearNumber(year); elements.axis.append(mark); });
  }

  function drawConnections() {
    elements.lines.replaceChildren();
    const { width, height } = dimensions(); elements.lines.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const positions = [...state.positions.values()];
    if (!positions.length) return;
    const pairs = [];
    if (state.category) {
      const center = { x: width / 2, y: height / 2 };
      positions.forEach(position => pairs.push([center, position]));
    } else if (positions[0].record.type === 'category') {
      positions.forEach((position, index) => { pairs.push([position, positions[(index + 1) % positions.length]]); if (index % 3 === 0) pairs.push([position, positions[(index + 5) % positions.length]]); });
    } else {
      const grouped = Object.groupBy ? Object.groupBy(positions, item => item.record.category) : positions.reduce((groups, item) => ((groups[item.record.category] ||= []).push(item), groups), {});
      Object.values(grouped).forEach(group => group.forEach((position, index) => { if (index) pairs.push([group[index - 1], position]); }));
    }
    const fragment = document.createDocumentFragment();
    pairs.slice(0, 110).forEach(([a, b]) => { const line = document.createElementNS('http://www.w3.org/2000/svg', 'line'); line.setAttribute('x1', a.x); line.setAttribute('y1', a.y); line.setAttribute('x2', b.x); line.setAttribute('y2', b.y); fragment.append(line); });
    elements.lines.append(fragment);
  }

  function showEmptyPreview() {
    elements.preview.innerHTML = `<div class="preview-empty"><span class="preview-number">2009—2024</span><h3>${escapeHtml(copy('previewEmptyTitle'))}</h3><p>${escapeHtml(copy('previewEmptyBody'))}</p><div class="preview-key"><span><i class="level-a"></i><b>${escapeHtml(copy('levelA'))}</b></span><span><i class="level-b"></i><b>${escapeHtml(copy('levelB'))}</b></span><span><i class="level-c"></i><b>${escapeHtml(copy('levelC'))}</b></span></div></div>`;
  }

  function showPreview(record) {
    state.active = record;
    if (record.type === 'category') {
      elements.preview.style.setProperty('--preview-accent', record.accent);
      elements.preview.innerHTML = `<div class="preview-record"><div class="preview-meta"><b>${number(record.count)} ${escapeHtml(copy('records'))}</b><span>${yearNumber(record.minYear)}—${yearNumber(record.maxYear)}</span></div><span class="preview-category">${escapeHtml(copy('archiveLabel'))}</span><h3>${escapeHtml(categoryLabel(record.category))}</h3><p class="preview-summary">${escapeHtml(categoryDescription(record.category))}</p><div class="preview-stats"><span>${escapeHtml(copy('date'))}<strong>${yearNumber(record.minYear)}—${yearNumber(record.maxYear)}</strong></span><span>${escapeHtml(copy('sourceCount'))}<strong>${number(new Set(state.data.incidents.filter(item => item.category === record.category).flatMap(item => item.source_ids)).size)}</strong></span></div><button class="open-record" type="button" data-open-category="${record.category}">${escapeHtml(copy('openCategory'))}</button></div>`;
    } else {
      const incident = record.incident; const level = incident.evidence_level || 'C'; elements.preview.style.setProperty('--preview-accent', EVIDENCE_COLORS[level]);
      elements.preview.innerHTML = `<div class="preview-record"><div class="preview-meta"><b>${escapeHtml(evidenceLabel(level))}</b><span>${escapeHtml(formatDate(incident))}</span></div><span class="preview-category">${escapeHtml(categoryLabel(incident.category))}</span><h3>${escapeHtml(incidentTitle(incident))}</h3><p class="preview-summary">${escapeHtml(incident.summary_bn)}</p>${incident.display_caution_bn ? `<p class="preview-caution">${escapeHtml(incident.display_caution_bn)}</p>` : ''}<div class="preview-stats"><span>${escapeHtml(copy('evidence'))}<strong>${escapeHtml(level)}</strong></span><span>${escapeHtml(copy('sourceCount'))}<strong>${number(incident.source_ids.length)}</strong></span></div><button class="open-record" type="button" data-open-incident="${incident.id}">${escapeHtml(copy('openRecord'))}</button></div>`;
    }
  }

  function categoryDescription(category) {
    const incidents = state.data.incidents.filter(item => item.category === category);
    if (state.lang === 'bn') return `${categoryLabel(category)} বিষয়ে ${number(incidents.length)}টি উৎস-সংযুক্ত ঘটনা ও প্যাটার্ন। বৃত্তটি খুললে প্রতিটি নথির প্রমাণ-অবস্থা, সারাংশ ও মূল উৎস দেখা যাবে।`;
    if (state.lang === 'de') return `${number(incidents.length)} quellenverknüpfte Ereignisse und Muster zum Thema ${categoryLabel(category)}. Öffnen Sie den Kreis, um Belegstatus, Zusammenfassung und Originalquellen jedes Eintrags zu sehen.`;
    return `${number(incidents.length)} source-linked events and patterns concerning ${categoryLabel(category)}. Open the circle to inspect the evidence status, summary and original sources for each record.`;
  }

  function focusRelations(record) {
    elements.canvas.classList.add('has-focus');
    $$('.archive-node', elements.canvas).forEach(node => { const related = node.dataset.id === record.id || node.dataset.category === record.category; node.classList.toggle('is-active', node.dataset.id === record.id); node.classList.toggle('is-related', related); });
  }
  function clearRelations() { elements.canvas.classList.remove('has-focus'); $$('.archive-node', elements.canvas).forEach(node => node.classList.remove('is-active', 'is-related')); }

  function selectRecord(record) {
    if (record.type === 'category') { state.category = record.category; state.mode = 'all'; state.year = null; state.query = ''; elements.search.value = ''; renderNetwork(); return; }
    openDialog(record.incident);
  }

  function openDialog(incident, updateUrl = true) {
    if (!incident) return;
    const sources = incidentSources(incident); const level = incident.evidence_level || 'C';
    elements.dialog.style.setProperty('--dialog-accent', EVIDENCE_COLORS[level]);
    elements.dialogContent.innerHTML = `<article><header class="dialog-hero"><div class="dialog-meta"><b>${escapeHtml(evidenceLabel(level))}</b><span>${escapeHtml(formatDate(incident))}</span><span>${escapeHtml(categoryLabel(incident.category))}</span></div><h2 id="dialog-title">${escapeHtml(incidentTitle(incident))}</h2></header><div class="dialog-body"><p class="dialog-summary">${escapeHtml(incident.summary_bn)}</p><div class="dialog-facts"><section><small>${escapeHtml(copy('date'))}</small><p>${escapeHtml(formatDate(incident))}</p></section><section><small>${escapeHtml(copy('location'))}</small><p>${escapeHtml(incident.location || '—')}</p></section><section><small>${escapeHtml(copy('status'))}</small><p>${escapeHtml(incident.evidence_status || '—')} · ${escapeHtml(evidenceLabel(level))}</p></section><section><small>${escapeHtml(copy('attribution'))}</small><p>${escapeHtml(incident.attribution || '—')}</p></section><section><small>${escapeHtml(copy('governmentRelation'))}</small><p>${escapeHtml(incident.government_relation || '—')}</p></section><section><small>${escapeHtml(copy('sourceCount'))}</small><p>${number(sources.length)} ${escapeHtml(copy('sourcesVisible'))}</p></section></div>${incident.display_caution_bn ? `<p class="dialog-caution"><strong>${escapeHtml(copy('caution'))}:</strong> ${escapeHtml(incident.display_caution_bn)}</p>` : ''}<section class="dialog-sources"><h3>${escapeHtml(copy('sourcesUsed'))}</h3>${sources.map(source => `<a href="${escapeAttribute(source.url)}" target="_blank" rel="noopener noreferrer"><b>${escapeHtml(source.id)}</b><span>${escapeHtml(source.publisher)} · ${escapeHtml(source.title)}</span><i aria-hidden="true">↗</i></a>`).join('')}</section></div></article>`;
    if (!elements.dialog.open) elements.dialog.showModal(); document.body.classList.add('dialog-open');
    if (updateUrl) { const url = new URL(location.href); url.searchParams.set('incident', incident.slug); history.replaceState({}, '', url); }
  }

  function closeDialog() {
    if (elements.dialog.open) elements.dialog.close(); document.body.classList.remove('dialog-open');
    const url = new URL(location.href); url.searchParams.delete('incident'); history.replaceState({}, '', url);
  }

  function renderSources() {
    const query = normalize(state.sourceQuery);
    const matches = sourceEntries().filter(source => normalize(`${source.publisher} ${source.title} ${source.type}`).includes(query));
    const visible = state.sourcesExpanded || query ? matches : matches.slice(0, 12);
    elements.sourceList.replaceChildren();
    visible.forEach(source => {
      const link = document.createElement('a'); link.className = 'source-item'; link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const id = document.createElement('span'); id.className = 'source-id'; id.textContent = source.id;
      const publisher = document.createElement('b'); publisher.className = 'source-publisher'; publisher.textContent = source.publisher;
      const title = document.createElement('span'); title.className = 'source-title'; title.textContent = source.title;
      const type = document.createElement('small'); type.className = 'source-type'; type.textContent = source.type?.replaceAll('_', ' ') || 'source';
      link.append(id, publisher, title, type); elements.sourceList.append(link);
    });
    elements.sourceCount.textContent = number(matches.length); elements.sourceMore.hidden = Boolean(query) || matches.length <= 12; elements.sourceMore.textContent = copy(state.sourcesExpanded ? 'showFewerSources' : 'showAllSources');
  }

  function recordFromTarget(target) { const id = target.closest('[data-id]')?.dataset.id; return state.rendered.find(record => record.id === id); }
  function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
  function escapeAttribute(value) { return escapeHtml(value).replace(/`/g, '&#96;'); }

  function setupEvents() {
    $('.language-switcher').addEventListener('click', event => { const button = event.target.closest('[data-lang]'); if (!button) return; const url = new URL(location.href); if (button.dataset.lang === 'bn') url.searchParams.delete('lang'); else url.searchParams.set('lang', button.dataset.lang); history.replaceState({}, '', url); applyLanguage(button.dataset.lang); });
    $('.mode-switch').addEventListener('click', event => { const button = event.target.closest('[data-mode]'); if (!button) return; state.mode = button.dataset.mode; state.category = null; state.year = null; state.query = ''; elements.search.value = ''; renderNetwork(); });
    elements.years.addEventListener('click', event => { const button = event.target.closest('[data-year]'); if (!button) return; state.year = button.dataset.year ? Number(button.dataset.year) : null; state.category = null; if (state.year) state.mode = 'time'; renderNetwork(); });
    elements.search.addEventListener('input', event => { state.query = event.target.value.trim(); state.category = null; renderNetwork(); });
    elements.reset.addEventListener('click', () => { state.mode = 'all'; state.category = null; state.year = null; state.query = ''; elements.search.value = ''; renderNetwork(); });
    elements.canvas.addEventListener('pointerover', event => { const record = recordFromTarget(event.target); if (record) { showPreview(record); focusRelations(record); } });
    elements.canvas.addEventListener('focusin', event => { const record = recordFromTarget(event.target); if (record) { showPreview(record); focusRelations(record); } });
    elements.canvas.addEventListener('pointerleave', clearRelations);
    elements.canvas.addEventListener('focusout', event => { if (!elements.canvas.contains(event.relatedTarget)) clearRelations(); });
    elements.canvas.addEventListener('click', event => { const record = recordFromTarget(event.target); if (record) selectRecord(record); });
    elements.rail.addEventListener('click', event => { const record = recordFromTarget(event.target); if (record) { showPreview(record); selectRecord(record); } });
    elements.preview.addEventListener('click', event => { const category = event.target.closest('[data-open-category]')?.dataset.openCategory; const incidentId = event.target.closest('[data-open-incident]')?.dataset.openIncident; if (category) { state.category = category; state.mode = 'all'; state.year = null; renderNetwork(); } if (incidentId) openDialog(state.data.incidents.find(item => item.id === incidentId)); });
    elements.dialog.addEventListener('click', event => { if (event.target === elements.dialog || event.target.closest('[data-dialog-close]')) closeDialog(); });
    elements.dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
    elements.sourceSearch.addEventListener('input', event => { state.sourceQuery = event.target.value.trim(); renderSources(); });
    elements.sourceMore.addEventListener('click', () => { state.sourcesExpanded = !state.sourcesExpanded; renderSources(); });
    document.addEventListener('keydown', event => { if (event.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { event.preventDefault(); elements.search.focus(); } });
    let resizeTimer; window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(renderNetwork, 180); });
    setupMagnet();
  }

  function setupMagnet() {
    if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    elements.shell.addEventListener('pointermove', event => {
      if (state.animationFrame) return;
      state.animationFrame = requestAnimationFrame(() => {
        state.animationFrame = 0; const rect = elements.shell.getBoundingClientRect(); const px = event.clientX - rect.left; const py = event.clientY - rect.top;
        $$('.archive-node', elements.canvas).forEach(node => { const position = state.positions.get(node.dataset.id); if (!position) return; const dx = px - position.x; const dy = py - position.y; const distance = Math.hypot(dx, dy); const strength = Math.max(0, 1 - distance / 170); node.style.setProperty('--mx', `${dx * strength * .045}px`); node.style.setProperty('--my', `${dy * strength * .045}px`); });
      });
    });
    elements.shell.addEventListener('pointerleave', () => $$('.archive-node', elements.canvas).forEach(node => { node.style.removeProperty('--mx'); node.style.removeProperty('--my'); }));
  }

  async function init() {
    try {
      const response = await fetch(DATA_URL, { cache: 'no-cache' }); if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.data = await response.json();
      if (!Array.isArray(state.data.incidents) || !state.data.sources) throw new Error('Invalid archive dataset');
      $('#hero-incident-count').textContent = number(state.data.incidents.length); $('#hero-source-count').textContent = number(Object.keys(state.data.sources).length);
      setupEvents(); applyLanguage(new URL(location.href).searchParams.get('lang') || 'bn', false); buildYears(); renderNetwork(); renderSources();
      const slug = new URL(location.href).searchParams.get('incident'); if (slug) openDialog(state.data.incidents.find(item => item.slug === slug), false);
    } catch (error) {
      console.error('Archive initialization failed:', error); elements.empty.hidden = false; elements.empty.textContent = copy('datasetError');
    }
  }

  init();
})();
