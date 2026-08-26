(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const DATA_URL = 'archive-data.json?v=20260826-archive-v2';
  const YEARS = Array.from({ length: 16 }, (_, index) => 2009 + index);

  const COPY = {
    bn: {
      skip: 'মূল আর্কাইভে যান', navArchive: 'আর্কাইভ', navGuide: 'কীভাবে পড়বেন', navSources: 'তথ্যের উৎস', navHome: 'মূল ওয়েবসাইট',
      heroKicker: 'দমন ও দায়মুক্তির বিরুদ্ধে প্রমাণ', heroLineOne: 'হাসিনার শাসনকাল', heroLineTwo: 'গুম, দমন ও রক্তের অমীমাংসিত অধ্যায়',
      heroLead: '২০০৯ থেকে ২০২৪—শেখ হাসিনার কর্তৃত্ববাদী শাসনে রাষ্ট্রীয় শক্তির অপব্যবহার, গুম ও গোপন আটক, বিচারবহির্ভূত হত্যা, ভোটাধিকার সংকোচন, মতপ্রকাশের দমন এবং জুলাইয়ে প্রাণঘাতী সহিংসতার নথি এখানে একসঙ্গে। কোথায় রাষ্ট্রের প্রত্যক্ষ দায় প্রমাণিত, কোথায় শক্ত অভিযোগ, আর কোথায় তদন্ত অসম্পূর্ণ—সব সীমা স্পষ্ট রেখেই এই আর্কাইভ শাসনটির জবাবদিহি দাবি করে।',
      explore: 'দমনের নথিগুলো অন্বেষণ করুন', incidentLabel: 'ঘটনা ও প্যাটার্ন', sourceLabel: 'যাচাইযোগ্য উৎস', yearSpanLabel: 'বছরের নথি', archiveLabel: 'জীবন্ত প্রমাণভান্ডার',
      explorerTitle: 'একটি ক্ষতচিহ্নে স্পর্শ করুন—হাসিনা আমলের দমন ও দায়মুক্তির সংযোগ খুলে যাবে।', explorerIntro: 'ভাসমান বৃত্তগুলো বিচ্ছিন্ন ঘটনা নয়—একটি দীর্ঘ শাসনে জমতে থাকা ভয়, সহিংসতা ও জবাবদিহিহীনতার স্মৃতিচিহ্ন। বৃত্তের আকার নেভিগেশন-গুরুত্ব বোঝায়, নিহতের সংখ্যা নয়; প্রতিটি নথির প্রমাণ ও সতর্কতা অক্ষুণ্ণ।',
      modeAll: 'সব বিষয়', modeCategory: 'ঘটনাসমূহ', modeTime: 'সময়', searchLabel: 'আর্কাইভ খুঁজুন', searchPlaceholder: 'নাম, ঘটনা, বছর বা বিষয় খুঁজুন', reset: '← সব ঘটনা', networkAll: 'বিষয়ভিত্তিক মানচিত্র', noResults: 'এই অনুসন্ধানে কোনো রেকর্ড পাওয়া যায়নি।',
      previewEmptyTitle: 'দমনযন্ত্রের নথি খুলুন', previewEmptyBody: 'একটি ভাসমান বৃত্তে hover, focus বা tap করুন। কী ঘটেছিল, কার বিরুদ্ধে দায় বা অভিযোগ নথিভুক্ত, প্রমাণ কত শক্ত এবং কোন প্রশ্নটি এখনো খোলা—এখানে দেখুন।', levelA: 'শক্তিশালী প্রমাণ', levelB: 'বিশ্বাসযোগ্য নথি', levelC: 'সতর্কতার সঙ্গে দেখুন',
      guideLabel: 'প্রমাণ থেকে জবাবদিহি', guideTitle: 'প্রমাণ দেখুন। দায় চিনুন। ভুলে যাবেন না।', guideOneTitle: 'ঘটনা থেকে শাসনের দায়', guideOneBody: 'কোথায় রাষ্ট্রীয় বাহিনীর প্রত্যক্ষ সম্পৃক্ততা প্রতিষ্ঠিত, কোথায় ক্ষমতাসীন দলের সহযোগী গোষ্ঠীর সহিংসতা, আর কোথায় সরকারের তদন্ত ও সুরক্ষার ব্যর্থতা—প্রতিটি নথি সেই পার্থক্য দেখায়।', guideTwoTitle: 'কোন প্রমাণ কত শক্ত', guideTwoBody: 'A, B ও C উৎসের শক্তি এবং দায় আরোপের সীমা বোঝায়। হাসিনা আমলের জবাবদিহি দাবি করতে হলে অভিযোগ ও প্রমাণের পার্থক্যও সৎভাবে দেখাতে হবে।', guideThreeTitle: 'সারাংশে থামবেন না', guideThreeBody: 'প্রতিটি প্রমাণপত্র থেকে জাতিসংঘ, মানবাধিকার প্রতিবেদন, আদালতের নথি বা নির্ভরযোগ্য সংবাদসূত্র খুলুন—তারপর নিজেই শাসনটির রেকর্ড বিচার করুন।',
      sourcesLabel: 'প্রমাণের ভিত্তি', sourcesTitle: 'প্রমাণের পেছনের নথি', sourcesIntro: 'এই আর্কাইভের প্রতিটি অভিযোগ ও সিদ্ধান্তের পেছনে থাকা ৬৩টি মূল নথি আলাদা করে রাখা হয়েছে। প্রয়োজন হলে খুলুন, অনুসন্ধান করুন এবং আমাদের সারাংশকে মূল উৎসের সঙ্গে মিলিয়ে দেখুন।', sourcePrompt: 'টি উৎস—আপনি দেখতে চাইলে এক ক্লিকে খুলবে', sourceOpen: 'উৎসপঞ্জি খুলুন', sourceClose: 'উৎসপঞ্জি বন্ধ করুন', sourceSearchLabel: 'উৎস খুঁজুন', sourceSearchPlaceholder: 'প্রকাশক বা প্রতিবেদনের নাম খুঁজুন', sourcesVisible: 'টি উৎস', showAllSources: 'সব উৎস দেখুন', showFewerSources: 'সংক্ষিপ্ত করুন',
      footerNote: 'স্মৃতি · প্রমাণ · জবাবদিহি', backTop: 'উপরে ফিরুন ↑', records: 'টি নথি', openCategory: 'এই বিষয়ের ঘটনাগুলো দেখুন', openRecord: 'পূর্ণ প্রমাণপত্র খুলুন', sourceCount: 'উৎস', evidence: 'প্রমাণ', date: 'তারিখ', location: 'স্থান', attribution: 'কার বিরুদ্ধে দায়/অভিযোগ নথিভুক্ত', governmentRelation: 'ক্ষমতা ও রাষ্ট্রের সঙ্গে সংযোগ', status: 'প্রমাণের বর্তমান অবস্থা', caution: 'যে সীমাটি মনে রাখতে হবে', originalRecord: 'মূল বাংলা সারাংশ', recordSummary: 'কী ঘটেছিল', sourcesUsed: 'যে নথির ওপর এই প্রমাণপত্র দাঁড়িয়ে', externalSource: 'মূল উৎস খুলুন', allYears: 'সব বছর', searchResults: 'অনুসন্ধানের ফল', timeMap: 'সময়ভিত্তিক মানচিত্র', categoryMap: 'সব ঘটনার মানচিত্র', datasetError: 'আর্কাইভের তথ্য লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।', evidenceReason: 'এই প্রমাণের স্তর কেন', tagsLabel: 'অনুসন্ধানের চাবিশব্দ', accountabilityTitle: 'ক্ষমতা, দায় ও জবাবদিহির পাঠ', stanceTitle: 'NCPDA Germany-এর অবস্থান', stanceBody: 'রাষ্ট্রীয় ক্ষমতার অপব্যবহার, গুম, নির্যাতন, রাজনৈতিক হত্যা, ভোটাধিকার হরণ ও নাগরিক কণ্ঠ দমনের প্রতিটি ঘটনায় আমরা স্বাধীন তদন্ত, প্রকাশ্য সত্য, দায়ীদের বিচার এবং ভুক্তভোগীকেন্দ্রিক প্রতিকার দাবি করি।', relatedTitle: 'একই দমন-প্যাটার্নের আরও নথি', relatedIntro: 'একটি ঘটনা বিচ্ছিন্ন নয়—একই সময় ও বিষয়ের নিকটবর্তী নথিগুলোও খুলে দেখুন।', verifyTitle: 'নিজে যাচাই করুন', verifyBody: 'নিচের প্রতিটি উৎস নতুন ট্যাবে খুলবে। সারাংশের সঙ্গে মূল প্রতিবেদন মিলিয়ে পড়ুন—কারণ প্রমাণভিত্তিক স্মৃতিই দায়মুক্তির সবচেয়ে শক্ত প্রতিরোধ।'
    },
    en: {
      skip: 'Skip to the archive', navArchive: 'Archive', navGuide: 'How to read', navSources: 'Sources', navHome: 'Main website',
      heroKicker: 'Evidence against repression and impunity', heroLineOne: 'Hasina’s years in power', heroLineTwo: 'Unresolved chapters of disappearance, repression and bloodshed',
      heroLead: 'From 2009 to 2024, this archive confronts the abuse of state power, enforced disappearance and secret detention, extrajudicial killing, the narrowing of voting rights, repression of expression and lethal violence during July under Sheikh Hasina’s authoritarian rule. It identifies where direct state responsibility is established, where allegations are strongly documented and where investigation remains incomplete—because accountability must stand on evidence.',
      explore: 'Explore the records of repression', incidentLabel: 'events and patterns', sourceLabel: 'verifiable sources', yearSpanLabel: 'years documented', archiveLabel: 'Living evidence archive',
      explorerTitle: 'Touch a scar—the connections between repression and impunity during the Hasina era will unfold.', explorerIntro: 'These drifting circles are not isolated events, but markers of fear, violence and missing accountability accumulated through a long rule. Size indicates navigation prominence—not the number killed; every record preserves its evidence and caution.',
      modeAll: 'Subjects', modeCategory: 'Events', modeTime: 'Time', searchLabel: 'Search the archive', searchPlaceholder: 'Search a name, event, year or subject', reset: '← All events', networkAll: 'Subject map', noResults: 'No archive record matches this search.',
      previewEmptyTitle: 'Open the machinery of repression', previewEmptyBody: 'Hover, focus or tap a drifting circle. See what happened, who is accused or held responsible, how strong the evidence is and which question remains unresolved.', levelA: 'Strong evidence', levelB: 'Credible documentation', levelC: 'Read with caution',
      guideLabel: 'From evidence to accountability', guideTitle: 'See the evidence. Identify responsibility. Do not forget.', guideOneTitle: 'From an event to the regime’s responsibility', guideOneBody: 'Each record distinguishes direct state-force involvement, violence by ruling-party affiliates, and government failures to investigate or protect.', guideTwoTitle: 'How strong is the evidence?', guideTwoBody: 'A, B and C describe source strength and the limits of attribution. A credible demand for accountability must preserve the line between allegation and proof.', guideThreeTitle: 'Do not stop at the summary', guideThreeBody: 'Open the UN findings, rights reports, court records and credible reporting from every dossier—then judge the record of the regime yourself.',
      sourcesLabel: 'Evidence base', sourcesTitle: 'The documents behind the evidence', sourcesIntro: 'The 63 underlying documents are kept here without occupying the page by default. Open them when you want to search and compare our summaries with the original record.', sourcePrompt: 'sources—open them only when you want to inspect the evidence', sourceOpen: 'Open source library', sourceClose: 'Close source library', sourceSearchLabel: 'Search sources', sourceSearchPlaceholder: 'Search a publisher or report title', sourcesVisible: 'sources', showAllSources: 'Show all sources', showFewerSources: 'Show fewer',
      footerNote: 'Memory · Evidence · Accountability', backTop: 'Back to top ↑', records: 'records', openCategory: 'Explore this subject', openRecord: 'Open full evidence dossier', sourceCount: 'Sources', evidence: 'Evidence', date: 'Date', location: 'Location', attribution: 'Who is implicated or accused', governmentRelation: 'Connection to power and the state', status: 'Current evidence status', caution: 'The limit that must be preserved', originalRecord: 'Original Bengali summary', recordSummary: 'What happened', sourcesUsed: 'Documents supporting this record', externalSource: 'Open source', allYears: 'All years', searchResults: 'Search results', timeMap: 'Chronological map', categoryMap: 'All-event map', datasetError: 'The archive data could not be loaded. Please try again.', evidenceReason: 'Why this evidence level', tagsLabel: 'Research keywords', accountabilityTitle: 'Power, responsibility and accountability', stanceTitle: 'NCPDA Germany’s position', stanceBody: 'We demand independent investigation, public truth, justice for those responsible and victim-centred remedy for every abuse of state power, disappearance, torture, political killing, denial of voting rights and repression of civic voice.', relatedTitle: 'More records from the same pattern', relatedIntro: 'No event stands alone—open nearby records from the same period and subject.', verifyTitle: 'Verify it yourself', verifyBody: 'Every source below opens in a new tab. Compare the summary with the original record—because evidence-based memory is the strongest resistance to impunity.'
    },
    de: {
      skip: 'Zum Archiv springen', navArchive: 'Archiv', navGuide: 'Lesehilfe', navSources: 'Quellen', navHome: 'Hauptseite',
      heroKicker: 'Belege gegen Repression und Straflosigkeit', heroLineOne: 'Hasinas Jahre an der Macht', heroLineTwo: 'Ungeklärte Kapitel von Verschwindenlassen, Repression und Blutvergießen',
      heroLead: 'Dieses Archiv konfrontiert den Missbrauch staatlicher Macht, Verschwindenlassen und Geheimhaft, außergerichtliche Tötungen, die Einschränkung des Wahlrechts, Unterdrückung der Meinungsfreiheit und tödliche Gewalt im Juli während Sheikh Hasinas autoritärer Herrschaft von 2009 bis 2024. Es zeigt, wo staatliche Verantwortung belegt, wo Vorwürfe stark dokumentiert und wo Ermittlungen unvollständig sind—denn Rechenschaft muss auf Beweisen beruhen.',
      explore: 'Dokumente der Repression erkunden', incidentLabel: 'Ereignisse und Muster', sourceLabel: 'prüfbare Quellen', yearSpanLabel: 'Jahre dokumentiert', archiveLabel: 'Lebendiges Beweisarchiv',
      explorerTitle: 'Berühren Sie eine Narbe—die Verbindungen von Repression und Straflosigkeit in der Hasina-Ära öffnen sich.', explorerIntro: 'Diese schwebenden Kreise sind keine isolierten Ereignisse, sondern Spuren von Angst, Gewalt und fehlender Rechenschaft. Die Größe zeigt Navigationspriorität, nicht die Zahl der Getöteten; Belegstatus und Hinweise bleiben erhalten.',
      modeAll: 'Themen', modeCategory: 'Ereignisse', modeTime: 'Zeit', searchLabel: 'Archiv durchsuchen', searchPlaceholder: 'Name, Ereignis, Jahr oder Thema suchen', reset: '← Alle Ereignisse', networkAll: 'Themenkarte', noResults: 'Für diese Suche wurde kein Archiveintrag gefunden.',
      previewEmptyTitle: 'Die Repressionsmaschinerie öffnen', previewEmptyBody: 'Bewegen Sie den Zeiger über einen schwebenden Kreis, fokussieren oder berühren Sie ihn. Sehen Sie, was geschah, wer beschuldigt wird, wie stark die Belege sind und welche Frage offen bleibt.', levelA: 'Starke Belege', levelB: 'Glaubwürdige Dokumentation', levelC: 'Mit Vorsicht lesen',
      guideLabel: 'Von Belegen zu Rechenschaft', guideTitle: 'Belege sehen. Verantwortung erkennen. Nicht vergessen.', guideOneTitle: 'Vom Ereignis zur Verantwortung des Regimes', guideOneBody: 'Jeder Eintrag unterscheidet direkte Beteiligung staatlicher Kräfte, Gewalt regierungsnaher Gruppen sowie Versäumnisse bei Untersuchung und Schutz.', guideTwoTitle: 'Wie stark sind die Belege?', guideTwoBody: 'A, B und C zeigen Quellenstärke und Grenzen der Zuordnung. Glaubwürdige Rechenschaft wahrt den Unterschied zwischen Vorwurf und Beweis.', guideThreeTitle: 'Nicht bei der Zusammenfassung aufhören', guideThreeBody: 'Öffnen Sie UN-Berichte, Menschenrechtsdokumente, Gerichtsakten und glaubwürdige Medien—und beurteilen Sie die Bilanz des Regimes selbst.',
      sourcesLabel: 'Beweisgrundlage', sourcesTitle: 'Dokumente hinter den Belegen', sourcesIntro: 'Die 63 zugrunde liegenden Dokumente bleiben zunächst geschlossen. Öffnen Sie sie bei Interesse und vergleichen Sie unsere Zusammenfassungen mit den Originalquellen.', sourcePrompt: 'Quellen—bei Interesse mit einem Klick öffnen', sourceOpen: 'Quellenarchiv öffnen', sourceClose: 'Quellenarchiv schließen', sourceSearchLabel: 'Quellen suchen', sourceSearchPlaceholder: 'Herausgeber oder Berichtstitel suchen', sourcesVisible: 'Quellen', showAllSources: 'Alle Quellen zeigen', showFewerSources: 'Weniger zeigen',
      footerNote: 'Erinnerung · Belege · Rechenschaft', backTop: 'Nach oben ↑', records: 'Einträge', openCategory: 'Dieses Thema erkunden', openRecord: 'Vollständiges Beweisdossier öffnen', sourceCount: 'Quellen', evidence: 'Belege', date: 'Datum', location: 'Ort', attribution: 'Wer belastet oder beschuldigt wird', governmentRelation: 'Verbindung zu Macht und Staat', status: 'Aktueller Belegstatus', caution: 'Zu wahrende Grenze', originalRecord: 'Bengalische Originalzusammenfassung', recordSummary: 'Was geschah', sourcesUsed: 'Dokumente hinter diesem Eintrag', externalSource: 'Quelle öffnen', allYears: 'Alle Jahre', searchResults: 'Suchergebnisse', timeMap: 'Chronologische Karte', categoryMap: 'Karte aller Ereignisse', datasetError: 'Die Archivdaten konnten nicht geladen werden. Bitte versuchen Sie es erneut.', evidenceReason: 'Warum diese Belegstufe', tagsLabel: 'Recherchebegriffe', accountabilityTitle: 'Macht, Verantwortung und Rechenschaft', stanceTitle: 'Position von NCPDA Germany', stanceBody: 'Wir fordern unabhängige Untersuchung, öffentliche Wahrheit, die Bestrafung Verantwortlicher und opferzentrierte Abhilfe bei Machtmissbrauch, Verschwindenlassen, Folter, politischen Tötungen, Entzug des Wahlrechts und Unterdrückung zivilgesellschaftlicher Stimmen.', relatedTitle: 'Weitere Einträge desselben Musters', relatedIntro: 'Kein Ereignis steht allein—öffnen Sie zeitlich und thematisch verwandte Einträge.', verifyTitle: 'Prüfen Sie selbst', verifyBody: 'Jede Quelle öffnet sich in einem neuen Tab. Vergleichen Sie die Zusammenfassung mit dem Original—denn beleggestützte Erinnerung ist der stärkste Widerstand gegen Straflosigkeit.'
    }
  };

  const CATEGORY_TRANSLATIONS = {
    MAJOR_TRAGEDY: ['বড় ট্র্যাজেডি', 'Major tragedy', 'Große Tragödie'], STATE_VIOLENCE: ['রাষ্ট্রীয় সহিংসতা / নিরাপত্তা বাহিনী', 'State violence / security forces', 'Staatliche Gewalt / Sicherheitskräfte'], ENFORCED_DISAPPEARANCE: ['গুম ও গোপন আটক', 'Disappearances and secret detention', 'Verschwindenlassen und Geheimhaft'], BORDER_KILLING: ['সীমান্ত হত্যা', 'Border killings', 'Tötungen an der Grenze'], DEMOCRACY_ELECTIONS: ['গণতন্ত্র ও নির্বাচন', 'Democracy and elections', 'Demokratie und Wahlen'], LABOR_RIGHTS: ['শ্রম অধিকার', 'Labour rights', 'Arbeitsrechte'], LABOR_SAFETY: ['শ্রমিক নিরাপত্তা', 'Worker safety', 'Arbeitssicherheit'], POLITICAL_VIOLENCE: ['রাজনৈতিক সহিংসতা', 'Political violence', 'Politische Gewalt'], FREEDOM_EXPRESSION: ['মতপ্রকাশ ও গণমাধ্যম', 'Expression and media', 'Meinungsfreiheit und Medien'], EXTREMIST_ATTACK: ['উগ্রবাদী / নন-স্টেট হামলা', 'Extremist / non-state attacks', 'Extremistische / nichtstaatliche Angriffe'], STATE_REPRESSION: ['রাষ্ট্রীয় দমন', 'State repression', 'Staatliche Repression'], JUDICIAL_INDEPENDENCE: ['বিচার বিভাগের স্বাধীনতা', 'Judicial independence', 'Unabhängigkeit der Justiz'], STUDENT_PROTESTS: ['ছাত্র আন্দোলন', 'Student protests', 'Studierendenproteste'], INTERNATIONAL_ACCOUNTABILITY: ['আন্তর্জাতিক জবাবদিহি', 'International accountability', 'Internationale Rechenschaft'], POLITICAL_REPRESSION: ['রাজনৈতিক দমন', 'Political repression', 'Politische Repression'], JULY_2024: ['জুলাই ২০২৪', 'July 2024', 'Juli 2024']
  };
  const CATEGORY_COLORS = ['#c6535a','#8a725d','#4f9270','#668f9d','#96715d','#8e8455','#7e705e','#9c5961','#6c8499','#85708e','#b34a55','#657f88','#7c8e67','#7b6c9a','#9b6670','#c33b46'];
  const EVIDENCE_COLORS = { A: '#53ce83', B: '#d1aa60', C: '#dc6369' };

  const state = { data: null, lang: 'bn', mode: 'all', category: null, year: null, query: '', sourcesExpanded: false, sourceQuery: '', active: null, rendered: [], positions: new Map(), animationFrame: 0 };
  const elements = {
    canvas: $('#network-canvas'), lines: $('#network-lines'), shell: $('#network-shell'), preview: $('#record-preview'), rail: $('#mobile-node-rail'), axis: $('#time-axis'), years: $('#year-navigator'), search: $('#archive-search'), reset: $('#reset-view'), count: $('#network-count'), label: $('#network-label'), empty: $('#empty-state'), dialog: $('#record-dialog'), dialogContent: $('#dialog-content'), sourceList: $('#source-list'), sourceSearch: $('#source-search'), sourceCount: $('#visible-source-count'), sourceTotal: $('#source-total-count'), sourceMore: $('#show-more-sources'), sourceDisclosure: $('#source-disclosure')
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
  const shortTitle = value => {
    const title = String(value || '').trim();
    if (title.length <= 31) return title;
    const firstPhrase = title.split(/[:—–|]/)[0].trim();
    if (firstPhrase.length >= 9 && firstPhrase.length <= 31) return firstPhrase;
    return `${title.slice(0, 28).trim()}…`;
  };
  const evidenceExplanation = level => {
    if (state.lang === 'de') return level === 'A' ? 'Primär- oder amtliche Unterlagen, UN-Befunde, eine detaillierte unabhängige Untersuchung oder mehrere übereinstimmende Quellen stützen diesen Eintrag.' : level === 'B' ? 'Glaubwürdige unabhängige Dokumentation liegt vor; Zuordnung oder einzelne Details sind jedoch noch nicht abschließend geklärt.' : 'Die Dokumentation ist umstritten, unvollständig oder überwiegend vorwurfsbasiert und muss entsprechend vorsichtig gelesen werden.';
    if (state.lang === 'en') return level === 'A' ? 'Primary or official records, UN findings, detailed independent investigation or multiple corroborating sources support this record.' : level === 'B' ? 'Credible independent documentation exists, although attribution or some details remain unresolved.' : 'The documentation is contested, incomplete or mainly allegation-based and must be read with corresponding caution.';
    return level === 'A' ? 'প্রাথমিক বা সরকারি নথি, জাতিসংঘের অনুসন্ধান, বিস্তারিত স্বাধীন তদন্ত অথবা একাধিক পরস্পর-সমর্থিত উৎস এই নথিকে শক্ত ভিত্তি দিয়েছে।' : level === 'B' ? 'বিশ্বাসযোগ্য স্বাধীন নথি আছে; তবে দায় নির্ধারণ বা কিছু গুরুত্বপূর্ণ বিস্তারিত এখনো চূড়ান্তভাবে মীমাংসিত নয়।' : 'তথ্য বিতর্কিত, অসম্পূর্ণ অথবা প্রধানত অভিযোগনির্ভর; তাই নির্দিষ্ট সতর্কতা মেনে পড়তে হবে।';
  };
  const evidenceStatusText = status => {
    const value = String(status || 'UNRESOLVED').toUpperCase();
    if (state.lang !== 'bn') return value.toLowerCase().replaceAll('_', ' ');
    if (value.includes('STRONGLY_CORROBORATED')) return 'একাধিক শক্ত উৎসে দৃঢ়ভাবে সমর্থিত';
    if (value.includes('LATER_CORROBORATED')) return 'আগের অভিযোগ পরে অতিরিক্ত প্রমাণে সমর্থিত';
    if (value.includes('UN_FACT_FINDING_STRONG')) return 'জাতিসংঘের তথ্যানুসন্ধানে শক্ত সিদ্ধান্ত';
    if (value.includes('CONTESTED')) return 'ঘটনা নথিভুক্ত; কিছু দাবি এখনো বিতর্কিত';
    if (value.includes('MIXED_RESPONSIBILITY')) return 'একাধিক পক্ষের নথিভুক্ত দায়';
    if (value.includes('UNRESOLVED')) return 'নথিভুক্ত কিন্তু চূড়ান্তভাবে অমীমাংসিত';
    if (value.includes('WELL_DOCUMENTED_ALLEGATION')) return 'শক্তভাবে নথিভুক্ত অভিযোগ';
    if (value.includes('DOCUMENTED_PATTERN')) return 'দীর্ঘমেয়াদি নথিভুক্ত প্যাটার্ন';
    if (value.includes('VERIFIED')) return 'ঘটনা বা পদক্ষেপ যাচাইকৃত';
    if (value.includes('DOCUMENTED')) return 'বিশ্বাসযোগ্য উৎসে নথিভুক্ত';
    return value.replaceAll('_', ' ');
  };
  const accountabilityInsight = incident => {
    const relation = normalize(incident.government_relation);
    if (state.lang === 'de') {
      if (relation.includes('not direct') || relation.includes('non-state')) return 'Der Eintrag beschreibt keine direkte Tötung durch die Regierung Bangladeschs. Er bleibt dennoch Teil der Bilanz der Hasina-Ära, weil staatlicher Schutz, Untersuchung und Rechenschaft eigenständige Pflichten waren.';
      if (relation.includes('ruling-party')) return 'Die dokumentierte Verbindung zu regierungsnahen Akteuren zeigt, wie parteipolitische Macht und Gewalt zusammenwirkten. Sie ist von einer formellen staatlichen Befehlskette zu unterscheiden.';
      if (relation.includes('direct state') || relation.includes('direct police') || relation.includes('state-force')) return 'Hier ist eine direkte Verbindung zu staatlicher Gewalt, Haft oder Sicherheitskräften dokumentiert. Deshalb stehen Befehlskette, institutionelle Verantwortung und wirksame Strafverfolgung im Zentrum.';
      return 'Der Fall gehört zur Rechenschaftsbilanz der Hasina-Ära. Entscheidend ist, ob der Staat selbst beteiligt war oder ob er bei Schutz, Untersuchung und Abhilfe versagte.';
    }
    if (state.lang === 'en') {
      if (relation.includes('not direct') || relation.includes('non-state')) return 'This record does not describe a direct killing by the Bangladesh government. It remains part of the Hasina-era accountability record because protection, investigation and remedy were separate state duties.';
      if (relation.includes('ruling-party')) return 'The documented link to ruling-party affiliates shows how partisan power and violence interacted, while remaining distinct from a formally proven state command.';
      if (relation.includes('direct state') || relation.includes('direct police') || relation.includes('state-force')) return 'A direct connection to state force, custody or security agencies is documented here. Command responsibility, institutional accountability and effective prosecution are therefore central.';
      return 'This case belongs in the accountability record of the Hasina era. The central question is whether the state was directly involved or failed in protection, investigation and remedy.';
    }
    if (relation.includes('not direct') || relation.includes('non-state')) return 'এটি বাংলাদেশ সরকারের প্রত্যক্ষ হত্যাকাণ্ড হিসেবে নথিভুক্ত নয়। তবু হাসিনা আমলের জবাবদিহির হিসাবে ঘটনাটি গুরুত্বপূর্ণ—কারণ নাগরিককে সুরক্ষা, নিরপেক্ষ তদন্ত এবং কার্যকর প্রতিকার দেওয়া রাষ্ট্রের পৃথক দায়িত্ব ছিল।';
    if (relation.includes('ruling-party')) return 'ক্ষমতাসীন দল-সংশ্লিষ্ট গোষ্ঠীর সঙ্গে নথিভুক্ত সংযোগ দেখায় কীভাবে দলীয় ক্ষমতা ও সহিংসতা একে অন্যকে শক্ত করেছে। তবে এটিকে প্রমাণিত আনুষ্ঠানিক রাষ্ট্রীয় নির্দেশের সঙ্গে এক করে দেখা হয়নি।';
    if (relation.includes('direct state') || relation.includes('direct police') || relation.includes('state-force')) return 'এই নথিতে রাষ্ট্রীয় বাহিনী, হেফাজত বা নিরাপত্তা সংস্থার প্রত্যক্ষ সংযোগ নথিভুক্ত। তাই নির্দেশদাতার দায়, প্রাতিষ্ঠানিক জবাবদিহি এবং কার্যকর বিচারই কেন্দ্রীয় প্রশ্ন।';
    return 'ঘটনাটি হাসিনা আমলের জবাবদিহির হিসাবের অংশ। এখানে মূল প্রশ্ন—রাষ্ট্র সরাসরি যুক্ত ছিল, নাকি নাগরিক সুরক্ষা, নিরপেক্ষ তদন্ত ও প্রতিকার নিশ্চিত করতে ব্যর্থ হয়েছিল।';
  };
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
    if (record.type === 'category') return Math.round(84 + record.weight * 18);
    const dense = count > 35 ? .76 : count > 20 ? .88 : 1;
    return Math.round((54 + record.weight * 14) * dense);
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
    const padding = positions.length > 35 ? -7 : 1;
    const iterations = positions.length > 45 ? 8 : 13;
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
    const driftX = Math.round((rand(record.id, 10) - .5) * (record.type === 'category' ? 28 : 22));
    const driftY = Math.round((rand(record.id, 11) - .5) * (record.type === 'category' ? 34 : 26));
    button.style.setProperty('--size', `${size}px`); button.style.setProperty('--x', `${x}px`); button.style.setProperty('--y', `${y}px`); button.style.setProperty('--accent', record.accent);
    button.style.setProperty('--drift-x-start', `${-driftX}px`); button.style.setProperty('--drift-y-start', `${-driftY}px`); button.style.setProperty('--drift-x-end', `${driftX}px`); button.style.setProperty('--drift-y-end', `${driftY}px`); button.style.setProperty('--float-duration', `${(7.5 + rand(record.id, 12) * 5).toFixed(2)}s`); button.style.setProperty('--float-delay', `${(-rand(record.id, 13) * 7).toFixed(2)}s`);
    const content = document.createElement('span'); content.className = 'node-content';
    const title = document.createElement('strong'); title.textContent = record.title; title.dataset.shortTitle = shortTitle(record.title); content.append(title);
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
    const tags = incident.tags || [];
    const related = state.data.incidents.filter(item => item.id !== incident.id && item.category === incident.category).sort((a, b) => Math.abs(a.year - incident.year) - Math.abs(b.year - incident.year) || a.year - b.year).slice(0, 3);
    const summaryLabel = state.lang === 'bn' ? copy('recordSummary') : copy('originalRecord');
    elements.dialog.style.setProperty('--dialog-accent', EVIDENCE_COLORS[level]);
    elements.dialogContent.innerHTML = `<article>
      <header class="dialog-hero"><div class="dialog-meta"><b>${escapeHtml(evidenceLabel(level))}</b><span>${escapeHtml(formatDate(incident))}</span><span>${escapeHtml(categoryLabel(incident.category))}</span></div><h2 id="dialog-title">${escapeHtml(incidentTitle(incident))}</h2><p class="dialog-record-id">${escapeHtml(incident.id)} · ${escapeHtml(evidenceStatusText(incident.evidence_status))}</p></header>
      <div class="dialog-body">
        <section class="dialog-narrative"><small>${escapeHtml(summaryLabel)}</small><p class="dialog-summary" lang="bn">${escapeHtml(incident.summary_bn)}</p></section>
        <section class="accountability-reading"><small>${escapeHtml(copy('accountabilityTitle'))}</small><p>${escapeHtml(accountabilityInsight(incident))}</p></section>
        <div class="dialog-facts">
          <section><small>${escapeHtml(copy('date'))}</small><p>${escapeHtml(formatDate(incident))}</p></section>
          <section><small>${escapeHtml(copy('location'))}</small><p>${escapeHtml(incident.location || '—')}</p></section>
          <section><small>${escapeHtml(copy('status'))}</small><p>${escapeHtml(evidenceStatusText(incident.evidence_status))}</p></section>
          <section><small>${escapeHtml(copy('evidenceReason'))}</small><p><b class="evidence-grade">${escapeHtml(level)}</b>${escapeHtml(evidenceExplanation(level))}</p></section>
          <section><small>${escapeHtml(copy('attribution'))}</small><p>${escapeHtml(incident.attribution || '—')}</p></section>
          <section><small>${escapeHtml(copy('governmentRelation'))}</small><p>${escapeHtml(incident.government_relation || '—')}</p></section>
          <section><small>${escapeHtml(copy('tagsLabel'))}</small><div class="dialog-tags">${tags.length ? tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('') : '<span>—</span>'}</div></section>
          <section><small>${escapeHtml(copy('sourceCount'))}</small><p>${number(sources.length)} ${escapeHtml(copy('sourcesVisible'))}</p></section>
        </div>
        ${incident.display_caution_bn ? `<p class="dialog-caution" lang="bn"><strong>${escapeHtml(copy('caution'))}:</strong> ${escapeHtml(incident.display_caution_bn)}</p>` : ''}
        <section class="dossier-stance"><span>OUR POSITION</span><div><h3>${escapeHtml(copy('stanceTitle'))}</h3><p>${escapeHtml(copy('stanceBody'))}</p></div></section>
        ${related.length ? `<section class="dialog-related"><header><h3>${escapeHtml(copy('relatedTitle'))}</h3><p>${escapeHtml(copy('relatedIntro'))}</p></header><div>${related.map(item => `<button type="button" data-related-incident="${escapeAttribute(item.id)}"><span>${yearNumber(item.year)} · ${escapeHtml(evidenceLabel(item.evidence_level))}</span><strong>${escapeHtml(incidentTitle(item))}</strong><i aria-hidden="true">→</i></button>`).join('')}</div></section>` : ''}
        <section class="dialog-sources"><header><div><span>${escapeHtml(copy('verifyTitle'))}</span><h3>${escapeHtml(copy('sourcesUsed'))}</h3></div><p>${escapeHtml(copy('verifyBody'))}</p></header>${sources.map(source => `<a href="${escapeAttribute(source.url)}" target="_blank" rel="noopener noreferrer"><b>${escapeHtml(source.id)}</b><span><strong>${escapeHtml(source.publisher)}</strong><small>${escapeHtml(source.title)}</small></span><i aria-hidden="true">↗</i></a>`).join('')}</section>
      </div>
    </article>`;
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
    elements.dialog.addEventListener('click', event => {
      const relatedId = event.target.closest('[data-related-incident]')?.dataset.relatedIncident;
      if (relatedId) { openDialog(state.data.incidents.find(item => item.id === relatedId)); return; }
      if (event.target === elements.dialog || event.target.closest('[data-dialog-close]')) closeDialog();
    });
    elements.dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
    elements.sourceSearch.addEventListener('input', event => { state.sourceQuery = event.target.value.trim(); renderSources(); });
    elements.sourceMore.addEventListener('click', () => { state.sourcesExpanded = !state.sourcesExpanded; renderSources(); });
    $$('a[href="#sources"]').forEach(link => link.addEventListener('click', () => { elements.sourceDisclosure.open = true; }));
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
      const totalSources = Object.keys(state.data.sources).length;
      $('#hero-incident-count').textContent = number(state.data.incidents.length); $('#hero-source-count').textContent = number(totalSources); elements.sourceTotal.textContent = number(totalSources);
      setupEvents(); applyLanguage(new URL(location.href).searchParams.get('lang') || 'bn', false); buildYears(); renderNetwork(); renderSources();
      if (location.hash === '#sources') elements.sourceDisclosure.open = true;
      const slug = new URL(location.href).searchParams.get('incident'); if (slug) openDialog(state.data.incidents.find(item => item.slug === slug), false);
    } catch (error) {
      console.error('Archive initialization failed:', error); elements.empty.hidden = false; elements.empty.textContent = copy('datasetError');
    }
  }

  init();
})();
