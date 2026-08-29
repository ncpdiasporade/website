(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const DATA_URL = 'archive-data.json?v=20260829-archive-v4';
  const YEARS = Array.from({ length: 16 }, (_, index) => 2009 + index);

  const COPY = {
    bn: {
      skip: 'মূল আর্কাইভে যান', navPatterns: 'প্রমাণচিত্র', navArchive: 'আর্কাইভ', navGuide: 'কীভাবে পড়বেন', navSources: 'তথ্যের উৎস', navHome: 'মূল ওয়েবসাইট',
      heroKicker: 'যে ইতিহাস মুছে ফেলা যাবে না', heroLineOne: 'তোমরা হয়তো যাইবা ভুলে, খুনি হাসিনার ইতিহাস।', heroLineTwo: 'সেই মায়ে রাখবো মনে, যে ছুঁইছে পোলার লাশ।',
      heroLead: '২০০৯ থেকে ২০২৪—হাসিনা সরকার নির্বাচনকে প্রতিযোগিতাহীন করেছে, আইন ও নিরাপত্তা বাহিনীকে বিরোধী কণ্ঠ দমনে ব্যবহার করেছে, গুম ও গোপন আটকের সংস্কৃতি বিস্তার করেছে এবং জুলাই ২০২৪-এ প্রাণঘাতী দমন চালিয়েছে। ৭০টি নথি বিচ্ছিন্ন দুর্ঘটনার তালিকা নয়; এগুলো দেখায় কীভাবে ক্ষমতা রক্ষার জন্য রাষ্ট্র, দলীয় সহিংসতা ও দায়মুক্তি একসঙ্গে কাজ করেছে।',
      explore: 'দমনের নথিগুলো অন্বেষণ করুন', incidentLabel: 'ঘটনা ও প্যাটার্ন', sourceLabel: 'যাচাইযোগ্য উৎস', yearSpanLabel: 'বছরের নথি', archiveLabel: 'জীবন্ত প্রমাণভান্ডার',
      explorerTitle: 'একটি ক্ষতচিহ্নে স্পর্শ করুন—হাসিনা আমলের দমন ও দায়মুক্তির সংযোগ খুলে যাবে।', explorerIntro: 'ভাসমান বৃত্তগুলো বিচ্ছিন্ন ঘটনা নয়—একটি দীর্ঘ শাসনে জমতে থাকা ভয়, সহিংসতা ও জবাবদিহিহীনতার স্মৃতিচিহ্ন। বৃত্তের আকার নেভিগেশন-গুরুত্ব বোঝায়, নিহতের সংখ্যা নয়; প্রতিটি নথির প্রমাণ ও সতর্কতা অক্ষুণ্ণ।',
      modeAll: 'সব বিষয়', modeCategory: 'ঘটনাসমূহ', modeTime: 'সময়', searchLabel: 'আর্কাইভ খুঁজুন', searchPlaceholder: 'নাম, ঘটনা, বছর বা বিষয় খুঁজুন', reset: '← সব ঘটনা', networkAll: 'বিষয়ভিত্তিক মানচিত্র', noResults: 'এই অনুসন্ধানে কোনো রেকর্ড পাওয়া যায়নি।',
      previewEmptyTitle: 'একটি ঘটনা বেছে নিন', previewEmptyBody: 'যে বৃত্তটি জানতে চান, সেটিতে মাউস রাখুন বা চাপ দিন। ঘটনার সংক্ষিপ্ত বিবরণ দেখার পর সেখান থেকেই পুরো ঘটনাটি পড়তে পারবেন।', levelA: 'শক্তিশালী প্রমাণ', levelB: 'বিশ্বাসযোগ্য নথি', levelC: 'সতর্কতার সঙ্গে দেখুন',
      guideLabel: 'প্রমাণ থেকে জবাবদিহি', guideTitle: 'প্রমাণ দেখুন। দায় চিনুন। ভুলে যাবেন না।', guideOneTitle: 'ঘটনা থেকে শাসনের দায়', guideOneBody: 'কোথায় রাষ্ট্রীয় বাহিনীর প্রত্যক্ষ সম্পৃক্ততা প্রতিষ্ঠিত, কোথায় ক্ষমতাসীন দলের সহযোগী গোষ্ঠীর সহিংসতা, আর কোথায় সরকারের তদন্ত ও সুরক্ষার ব্যর্থতা—প্রতিটি নথি সেই পার্থক্য দেখায়।', guideTwoTitle: 'কোন প্রমাণ কত শক্ত', guideTwoBody: 'A, B ও C উৎসের শক্তি এবং দায় আরোপের সীমা বোঝায়। হাসিনা আমলের জবাবদিহি দাবি করতে হলে অভিযোগ ও প্রমাণের পার্থক্যও সৎভাবে দেখাতে হবে।', guideThreeTitle: 'সারাংশে থামবেন না', guideThreeBody: 'প্রতিটি প্রমাণপত্র থেকে জাতিসংঘ, মানবাধিকার প্রতিবেদন, আদালতের নথি বা নির্ভরযোগ্য সংবাদসূত্র খুলুন—তারপর নিজেই শাসনটির রেকর্ড বিচার করুন।',
      sourcesLabel: 'প্রমাণের ভিত্তি', sourcesTitle: 'প্রমাণের পেছনের নথি', sourcesIntro: 'এই আর্কাইভের প্রতিটি অভিযোগ ও সিদ্ধান্তের পেছনে থাকা ৬৩টি মূল নথি আলাদা করে রাখা হয়েছে। প্রয়োজন হলে খুলুন, অনুসন্ধান করুন এবং আমাদের সারাংশকে মূল উৎসের সঙ্গে মিলিয়ে দেখুন।', sourcePrompt: 'টি উৎস—আপনি দেখতে চাইলে এক ক্লিকে খুলবে', sourceOpen: 'উৎসপঞ্জি খুলুন', sourceClose: 'উৎসপঞ্জি বন্ধ করুন', sourceSearchLabel: 'উৎস খুঁজুন', sourceSearchPlaceholder: 'প্রকাশক বা প্রতিবেদনের নাম খুঁজুন', sourcesVisible: 'টি উৎস', showAllSources: 'সব উৎস দেখুন', showFewerSources: 'সংক্ষিপ্ত করুন',
      patternsLabel: '১৬ বছরের হিসাব', patternsTitle: 'একটি ঘটনা নয়—১৬ বছর ধরে জমে ওঠা দমনের কাঠামো', patternsIntro: 'বছর, বিষয় ও প্রমাণের শক্তি একসঙ্গে দেখলে ছবিটি পরিষ্কার: গুম, পুলিশি সহিংসতা, মতপ্রকাশ দমন এবং নির্বাচন সংকোচন ক্ষমতা ধরে রাখার পুনরাবৃত্ত পদ্ধতি হয়ে উঠেছিল। কোনো বার বা বিভাগে ক্লিক করলে সংশ্লিষ্ট ঘটনাগুলো দেখা যাবে।', fallCaption: '৫ আগস্ট ২০২৪—গণআন্দোলনের মুখে হাসিনার ক্ষমতার পতন', verdictLabel: 'শেষ পর্যন্ত যা স্পষ্ট', verdictTitle: 'জুলাই ছিল বিস্ফোরণ; তার পেছনে ছিল ১৬ বছরের জমে থাকা দমন', verdictBody: 'OHCHR জুলাই–আগস্টের সহিংসতায় সাবেক সরকার, নিরাপত্তা ও গোয়েন্দা সংস্থা এবং আওয়ামী লীগ-সংশ্লিষ্ট সহিংস উপাদানের পদ্ধতিগত গুরুতর মানবাধিকার লঙ্ঘনের সম্পৃক্ততা নথিভুক্ত করেছে। এই আর্কাইভ দেখায়, সেই চূড়ান্ত দমন হঠাৎ তৈরি হয়নি—গুম, বিচারবহির্ভূত হত্যা, বিরোধী দমন ও ভোটাধিকার হরণের দীর্ঘ ধারাই জুলাইয়ে বিস্ফোরিত হয়েছিল।', timelineLabel: 'বছর ধরে জমা হওয়া ঘটনা', timelineTitle: 'কোন বছরে কত ঘটনা নথিভুক্ত', categoryChartLabel: 'কীভাবে দমন চলেছে', categoryChartTitle: 'বারবার ফিরে এসেছে যেসব কৌশল', evidenceChartLabel: 'তথ্য কতটা নির্ভরযোগ্য', evidenceChartTitle: 'প্রমাণের ভিত্তি', evidenceChartNote: 'A = শক্ত প্রাথমিক, জাতিসংঘ বা একাধিক উৎসের প্রমাণ; B = বিশ্বাসযোগ্য নথি, তবে দায়ের কিছু অংশ অমীমাংসিত; C = অসম্পূর্ণ বা অভিযোগনির্ভর তথ্য, যা সতর্কতার সঙ্গে পড়তে হবে।', chartRecords: 'ঘটনা', visualEvidence: 'ঘটনার সঙ্গে সম্পর্কিত ছবি', storyTitle: 'কেন এই ঘটনা মনে রাখা জরুরি', patternCount: 'একই ধরনের ঘটনা', yearCount: 'সেই বছরের নথি', imageContext: 'ছবিটি এই ঘটনা বা বিষয়ের সঙ্গে সম্পর্কিত; সব ক্ষেত্রে এটি ঘটনার নির্দিষ্ট মুহূর্তের ছবি নয়।',
      footerNote: 'স্মৃতি · প্রমাণ · জবাবদিহি', backTop: 'উপরে ফিরুন ↑', records: 'টি ঘটনা', openCategory: 'এই ধরনের ঘটনাগুলো দেখুন', openRecord: 'ঘটনাটি বিস্তারিত জানুন', sourceCount: 'উৎস', evidence: 'প্রমাণ', date: 'কখন', location: 'কোথায়', attribution: 'যাদের বিরুদ্ধে দায় বা অভিযোগ', governmentRelation: 'সরকার ও ক্ষমতাসীনদের সঙ্গে যোগসূত্র', status: 'তথ্যের বর্তমান অবস্থা', caution: 'পড়ার সময় যা মনে রাখা জরুরি', originalRecord: 'মূল বাংলা বিবরণ', recordSummary: 'ঘটনাটি যেভাবে ঘটেছিল', sourcesUsed: 'তথ্য ও প্রমাণের মূল উৎস', externalSource: 'মূল উৎস খুলুন', allYears: 'সব বছর', searchResults: 'অনুসন্ধানের ফল', timeMap: 'বছর অনুযায়ী ঘটনাগুলো', categoryMap: 'সব ঘটনার মানচিত্র', datasetError: 'আর্কাইভের তথ্য লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।', evidenceReason: 'কেন এই তথ্য বিশ্বাসযোগ্য', tagsLabel: 'ঘটনাটি খুঁজতে যে শব্দগুলো কাজে লাগবে', accountabilityTitle: 'দায় কোথায়', stanceLabel: 'জবাবদিহি', stanceTitle: 'আমাদের দাবি', stanceBody: 'প্রতিটি গুম, নির্যাতন, রাজনৈতিক হত্যা, ভোটাধিকার হরণ এবং নাগরিক কণ্ঠ দমনের সত্য প্রকাশ করতে হবে। স্বাধীন তদন্ত, দায়ীদের বিচার এবং ভুক্তভোগী পরিবারগুলোর ন্যায়বিচার ও প্রতিকার নিশ্চিত করাই আমাদের দাবি।', relatedTitle: 'একই সময় ও একই ধরনের আরও ঘটনা', relatedIntro: 'এই ঘটনাটি একা নয়। কাছাকাছি সময়ের এবং একই কৌশলে সংঘটিত আরও ঘটনাগুলোও পড়ুন।', verifyTitle: 'আরও জানতে', verifyBody: 'ঘটনাটি সম্পর্কে বিস্তারিত জানতে নিচের মূল প্রতিবেদন ও নথিগুলো পড়তে পারেন। প্রতিটি উৎস নতুন ট্যাবে খুলবে।'
    },
    en: {
      skip: 'Skip to the archive', navPatterns: 'Evidence map', navArchive: 'Archive', navGuide: 'How to read', navSources: 'Sources', navHome: 'Main website',
      heroKicker: 'A history that cannot be erased', heroLineOne: 'You may forget the history of killer Hasina.', heroLineTwo: 'But the mother who touched her son’s body will remember.',
      heroLead: 'From 2009 to 2024, the Hasina government hollowed out competitive elections, used law and security forces against dissent, entrenched enforced disappearance and secret detention, and unleashed lethal repression in July 2024. These 70 records are not isolated accidents: together they expose a recurring system in which state power, partisan violence and impunity protected the regime.',
      explore: 'Explore the records of repression', incidentLabel: 'events and patterns', sourceLabel: 'verifiable sources', yearSpanLabel: 'years documented', archiveLabel: 'Living evidence archive',
      explorerTitle: 'Touch a scar—the connections between repression and impunity during the Hasina era will unfold.', explorerIntro: 'These drifting circles are not isolated events, but markers of fear, violence and missing accountability accumulated through a long rule. Size indicates navigation prominence—not the number killed; every record preserves its evidence and caution.',
      modeAll: 'Subjects', modeCategory: 'Events', modeTime: 'Time', searchLabel: 'Search the archive', searchPlaceholder: 'Search a name, event, year or subject', reset: '← All events', networkAll: 'Subject map', noResults: 'No archive record matches this search.',
      previewEmptyTitle: 'Choose an event', previewEmptyBody: 'Hover over or tap any circle to read a short account. From there, you can open the full story, evidence and original sources.', levelA: 'Strong evidence', levelB: 'Credible documentation', levelC: 'Read with caution',
      guideLabel: 'From evidence to accountability', guideTitle: 'See the evidence. Identify responsibility. Do not forget.', guideOneTitle: 'From an event to the regime’s responsibility', guideOneBody: 'Each record distinguishes direct state-force involvement, violence by ruling-party affiliates, and government failures to investigate or protect.', guideTwoTitle: 'How strong is the evidence?', guideTwoBody: 'A, B and C describe source strength and the limits of attribution. A credible demand for accountability must preserve the line between allegation and proof.', guideThreeTitle: 'Do not stop at the summary', guideThreeBody: 'Open the UN findings, rights reports, court records and credible reporting from every dossier—then judge the record of the regime yourself.',
      sourcesLabel: 'Evidence base', sourcesTitle: 'The documents behind the evidence', sourcesIntro: 'The 63 underlying documents are kept here without occupying the page by default. Open them when you want to search and compare our summaries with the original record.', sourcePrompt: 'sources—open them only when you want to inspect the evidence', sourceOpen: 'Open source library', sourceClose: 'Close source library', sourceSearchLabel: 'Search sources', sourceSearchPlaceholder: 'Search a publisher or report title', sourcesVisible: 'sources', showAllSources: 'Show all sources', showFewerSources: 'Show fewer',
      patternsLabel: 'The record of 16 years', patternsTitle: 'Not one incident—a structure of repression built over 16 years', patternsIntro: 'Viewed by year, subject and strength of evidence, the picture is clear: disappearance, police violence, silencing of expression and hollowed-out elections became recurring methods of holding power. Select any bar or category to see the related events.', fallCaption: '5 August 2024—Hasina’s rule falls before a mass uprising', verdictLabel: 'What the record makes clear', verdictTitle: 'July was the eruption; behind it lay 16 years of accumulated repression', verdictBody: 'OHCHR documented systematic serious human-rights violations involving the former government, security and intelligence agencies, and violent elements associated with the Awami League during July–August. This archive shows that the final crackdown did not appear from nowhere: a long record of disappearance, extrajudicial killing, opposition repression and stolen voting rights culminated in July.', timelineLabel: 'Events accumulated over time', timelineTitle: 'Recorded events by year', categoryChartLabel: 'How repression was carried out', categoryChartTitle: 'Methods that returned again and again', evidenceChartLabel: 'How reliable is the record?', evidenceChartTitle: 'The evidence base', evidenceChartNote: 'A = strong primary, UN or multiple-source evidence; B = credible documentation with some responsibility unresolved; C = incomplete or allegation-based information that requires caution.', chartRecords: 'events', visualEvidence: 'Image connected to the event', storyTitle: 'Why this event must be remembered', patternCount: 'Similar events', yearCount: 'Records that year', imageContext: 'This image is connected to the event or subject; it may not show the exact moment described in every case.',
      footerNote: 'Memory · Evidence · Accountability', backTop: 'Back to top ↑', records: 'events', openCategory: 'See events of this kind', openRecord: 'Read the full account', sourceCount: 'Sources', evidence: 'Evidence', date: 'When', location: 'Where', attribution: 'Who is accused or held responsible', governmentRelation: 'Links to the government and those in power', status: 'What the evidence currently shows', caution: 'What to keep in mind while reading', originalRecord: 'Original Bengali account', recordSummary: 'How the event unfolded', sourcesUsed: 'Original reporting and evidence', externalSource: 'Open source', allYears: 'All years', searchResults: 'Search results', timeMap: 'Events by year', categoryMap: 'Map of all events', datasetError: 'The archive data could not be loaded. Please try again.', evidenceReason: 'Why this information is credible', tagsLabel: 'Useful search terms', accountabilityTitle: 'Where responsibility lies', stanceLabel: 'Accountability', stanceTitle: 'What must happen now', stanceBody: 'The truth behind every disappearance, act of torture, political killing, denial of voting rights and silencing of citizens must be made public. We call for independent investigation, justice for those responsible, and meaningful remedy for victims and their families.', relatedTitle: 'More events from the same period and pattern', relatedIntro: 'This event did not stand alone. Read the other cases from the same period and those carried out through similar methods.', verifyTitle: 'Read further', verifyBody: 'The original reports and documents below provide more detail. Each source opens in a new tab.'
    },
    de: {
      skip: 'Zum Archiv springen', navPatterns: 'Beweiskarte', navArchive: 'Archiv', navGuide: 'Lesehilfe', navSources: 'Quellen', navHome: 'Hauptseite',
      heroKicker: 'Eine Geschichte, die sich nicht auslöschen lässt', heroLineOne: 'Ihr mögt die Geschichte der mörderischen Hasina vergessen.', heroLineTwo: 'Doch die Mutter, die den Leichnam ihres Sohnes berührte, wird sich erinnern.',
      heroLead: 'Von 2009 bis 2024 höhlte die Hasina-Regierung freie Wahlen aus, setzte Gesetze und Sicherheitskräfte gegen Widerspruch ein, etablierte Verschwindenlassen und Geheimhaft und ließ im Juli 2024 tödliche Repression zu. Diese 70 Einträge sind keine isolierten Unfälle: Gemeinsam zeigen sie ein wiederkehrendes System aus Staatsmacht, parteinaher Gewalt und Straflosigkeit zum Schutz des Regimes.',
      explore: 'Dokumente der Repression erkunden', incidentLabel: 'Ereignisse und Muster', sourceLabel: 'prüfbare Quellen', yearSpanLabel: 'Jahre dokumentiert', archiveLabel: 'Lebendiges Beweisarchiv',
      explorerTitle: 'Berühren Sie eine Narbe—die Verbindungen von Repression und Straflosigkeit in der Hasina-Ära öffnen sich.', explorerIntro: 'Diese schwebenden Kreise sind keine isolierten Ereignisse, sondern Spuren von Angst, Gewalt und fehlender Rechenschaft. Die Größe zeigt Navigationspriorität, nicht die Zahl der Getöteten; Belegstatus und Hinweise bleiben erhalten.',
      modeAll: 'Themen', modeCategory: 'Ereignisse', modeTime: 'Zeit', searchLabel: 'Archiv durchsuchen', searchPlaceholder: 'Name, Ereignis, Jahr oder Thema suchen', reset: '← Alle Ereignisse', networkAll: 'Themenkarte', noResults: 'Für diese Suche wurde kein Archiveintrag gefunden.',
      previewEmptyTitle: 'Wählen Sie ein Ereignis', previewEmptyBody: 'Bewegen Sie den Zeiger über einen Kreis oder tippen Sie darauf, um eine kurze Darstellung zu lesen. Von dort aus können Sie die ganze Geschichte, die Belege und die Originalquellen öffnen.', levelA: 'Starke Belege', levelB: 'Glaubwürdige Dokumentation', levelC: 'Mit Vorsicht lesen',
      guideLabel: 'Von Belegen zu Rechenschaft', guideTitle: 'Belege sehen. Verantwortung erkennen. Nicht vergessen.', guideOneTitle: 'Vom Ereignis zur Verantwortung des Regimes', guideOneBody: 'Jeder Eintrag unterscheidet direkte Beteiligung staatlicher Kräfte, Gewalt regierungsnaher Gruppen sowie Versäumnisse bei Untersuchung und Schutz.', guideTwoTitle: 'Wie stark sind die Belege?', guideTwoBody: 'A, B und C zeigen Quellenstärke und Grenzen der Zuordnung. Glaubwürdige Rechenschaft wahrt den Unterschied zwischen Vorwurf und Beweis.', guideThreeTitle: 'Nicht bei der Zusammenfassung aufhören', guideThreeBody: 'Öffnen Sie UN-Berichte, Menschenrechtsdokumente, Gerichtsakten und glaubwürdige Medien—und beurteilen Sie die Bilanz des Regimes selbst.',
      sourcesLabel: 'Beweisgrundlage', sourcesTitle: 'Dokumente hinter den Belegen', sourcesIntro: 'Die 63 zugrunde liegenden Dokumente bleiben zunächst geschlossen. Öffnen Sie sie bei Interesse und vergleichen Sie unsere Zusammenfassungen mit den Originalquellen.', sourcePrompt: 'Quellen—bei Interesse mit einem Klick öffnen', sourceOpen: 'Quellenarchiv öffnen', sourceClose: 'Quellenarchiv schließen', sourceSearchLabel: 'Quellen suchen', sourceSearchPlaceholder: 'Herausgeber oder Berichtstitel suchen', sourcesVisible: 'Quellen', showAllSources: 'Alle Quellen zeigen', showFewerSources: 'Weniger zeigen',
      patternsLabel: 'Die Bilanz von 16 Jahren', patternsTitle: 'Kein Einzelfall—eine über 16 Jahre aufgebaute Struktur der Repression', patternsIntro: 'Nach Jahr, Thema und Belegstärke betrachtet ist das Bild klar: Verschwindenlassen, Polizeigewalt, Unterdrückung der Meinungsfreiheit und ausgehöhlte Wahlen wurden zu wiederkehrenden Methoden des Machterhalts. Wählen Sie einen Balken oder eine Kategorie, um die betreffenden Ereignisse zu sehen.', fallCaption: '5. August 2024—Hasinas Herrschaft fällt vor einem Massenaufstand', verdictLabel: 'Was die Bilanz deutlich macht', verdictTitle: 'Der Juli war die Eruption; dahinter standen 16 Jahre aufgestauter Repression', verdictBody: 'Das OHCHR dokumentierte für Juli und August systematische schwere Menschenrechtsverletzungen unter Beteiligung der ehemaligen Regierung, von Sicherheits- und Geheimdiensten sowie gewalttätigen, mit der Awami League verbundenen Akteuren. Dieses Archiv zeigt: Die letzte Niederschlagung entstand nicht plötzlich; Verschwindenlassen, außergerichtliche Tötungen, Oppositionsunterdrückung und geraubte Wahlrechte mündeten im Juli.', timelineLabel: 'Ereignisse im Lauf der Jahre', timelineTitle: 'Dokumentierte Ereignisse nach Jahr', categoryChartLabel: 'Wie die Repression ausgeübt wurde', categoryChartTitle: 'Methoden, die immer wiederkehrten', evidenceChartLabel: 'Wie verlässlich ist die Dokumentation?', evidenceChartTitle: 'Die Beweisgrundlage', evidenceChartNote: 'A = starke Primär-, UN- oder Mehrquellenbelege; B = glaubwürdige Dokumentation mit teils offener Verantwortung; C = unvollständige oder vorwurfsbasierte Angaben, die Vorsicht erfordern.', chartRecords: 'Ereignisse', visualEvidence: 'Bild mit Bezug zum Ereignis', storyTitle: 'Warum dieses Ereignis in Erinnerung bleiben muss', patternCount: 'Ähnliche Ereignisse', yearCount: 'Einträge in diesem Jahr', imageContext: 'Das Bild steht mit dem Ereignis oder Thema in Verbindung; es zeigt nicht in jedem Fall den beschriebenen Augenblick.',
      footerNote: 'Erinnerung · Belege · Rechenschaft', backTop: 'Nach oben ↑', records: 'Ereignisse', openCategory: 'Ereignisse dieser Art ansehen', openRecord: 'Den vollständigen Bericht lesen', sourceCount: 'Quellen', evidence: 'Belege', date: 'Wann', location: 'Wo', attribution: 'Wer beschuldigt oder verantwortlich gemacht wird', governmentRelation: 'Verbindungen zu Regierung und Machthabern', status: 'Was die Belege derzeit zeigen', caution: 'Was beim Lesen zu beachten ist', originalRecord: 'Bengalische Originaldarstellung', recordSummary: 'Wie sich das Ereignis abspielte', sourcesUsed: 'Originalberichte und Belege', externalSource: 'Quelle öffnen', allYears: 'Alle Jahre', searchResults: 'Suchergebnisse', timeMap: 'Ereignisse nach Jahr', categoryMap: 'Karte aller Ereignisse', datasetError: 'Die Archivdaten konnten nicht geladen werden. Bitte versuchen Sie es erneut.', evidenceReason: 'Warum diese Informationen glaubwürdig sind', tagsLabel: 'Hilfreiche Suchbegriffe', accountabilityTitle: 'Wo die Verantwortung liegt', stanceLabel: 'Rechenschaft', stanceTitle: 'Was jetzt geschehen muss', stanceBody: 'Die Wahrheit über jedes Verschwindenlassen, jede Folter, politische Tötung, Verweigerung des Wahlrechts und Unterdrückung von Bürgern muss offengelegt werden. Wir fordern unabhängige Ermittlungen, Gerechtigkeit gegenüber den Verantwortlichen und wirksame Abhilfe für Opfer und ihre Familien.', relatedTitle: 'Weitere Ereignisse derselben Zeit und desselben Musters', relatedIntro: 'Dieses Ereignis stand nicht allein. Lesen Sie weitere Fälle aus derselben Zeit und solche, die mit ähnlichen Methoden begangen wurden.', verifyTitle: 'Weiterlesen', verifyBody: 'Die nachstehenden Originalberichte und Dokumente enthalten weitere Einzelheiten. Jede Quelle öffnet sich in einem neuen Tab.'
    }
  };

  const CATEGORY_TRANSLATIONS = {
    MAJOR_TRAGEDY: ['বড় ট্র্যাজেডি', 'Major tragedy', 'Große Tragödie'], STATE_VIOLENCE: ['রাষ্ট্রীয় সহিংসতা / নিরাপত্তা বাহিনী', 'State violence / security forces', 'Staatliche Gewalt / Sicherheitskräfte'], ENFORCED_DISAPPEARANCE: ['গুম ও গোপন আটক', 'Disappearances and secret detention', 'Verschwindenlassen und Geheimhaft'], BORDER_KILLING: ['সীমান্ত হত্যা', 'Border killings', 'Tötungen an der Grenze'], DEMOCRACY_ELECTIONS: ['গণতন্ত্র ও নির্বাচন', 'Democracy and elections', 'Demokratie und Wahlen'], LABOR_RIGHTS: ['শ্রম অধিকার', 'Labour rights', 'Arbeitsrechte'], LABOR_SAFETY: ['শ্রমিক নিরাপত্তা', 'Worker safety', 'Arbeitssicherheit'], POLITICAL_VIOLENCE: ['রাজনৈতিক সহিংসতা', 'Political violence', 'Politische Gewalt'], FREEDOM_EXPRESSION: ['মতপ্রকাশ ও গণমাধ্যম', 'Expression and media', 'Meinungsfreiheit und Medien'], EXTREMIST_ATTACK: ['উগ্রবাদী / নন-স্টেট হামলা', 'Extremist / non-state attacks', 'Extremistische / nichtstaatliche Angriffe'], STATE_REPRESSION: ['রাষ্ট্রীয় দমন', 'State repression', 'Staatliche Repression'], JUDICIAL_INDEPENDENCE: ['বিচার বিভাগের স্বাধীনতা', 'Judicial independence', 'Unabhängigkeit der Justiz'], STUDENT_PROTESTS: ['ছাত্র আন্দোলন', 'Student protests', 'Studierendenproteste'], INTERNATIONAL_ACCOUNTABILITY: ['আন্তর্জাতিক জবাবদিহি', 'International accountability', 'Internationale Rechenschaft'], POLITICAL_REPRESSION: ['রাজনৈতিক দমন', 'Political repression', 'Politische Repression'], JULY_2024: ['জুলাই ২০২৪', 'July 2024', 'Juli 2024']
  };
  const CATEGORY_COLORS = ['#c6535a','#8a725d','#4f9270','#668f9d','#96715d','#8e8455','#7e705e','#9c5961','#6c8499','#85708e','#b34a55','#657f88','#7c8e67','#7b6c9a','#9b6670','#c33b46'];
  const EVIDENCE_COLORS = { A: '#53ce83', B: '#d1aa60', C: '#dc6369' };
  const SOURCE_MEDIA = {
    S01: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2015/bangladesh0712_coverimage.jpg?itok=jW0hVV--',
    S04: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media/images/report-covers/BangladeshCoverWeb.jpg?itok=hKwF0zdk',
    S05: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2021/02/202102asia_india_bsf.jpg?h=76cd474c&itok=KhQ7fAqy',
    S08: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2017/201707asia_bangladesh_disappearances_main.jpg?itok=ZGEpGsW_',
    S09: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2021/08/202108asia_bangladesh_collage.jpg?h=9ab7a65e&itok=gD2kn_xr',
    S17: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2015/bangladesh0414_coverimage.jpg?itok=OsXnhb8d',
    S20: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2015/niladri_chakrabarti_2015_08.jpg?itok=pV8TkYgB',
    S22: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2016/2016-6-bangladesh-asia-police.jpg?itok=oLupR414',
    S24: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2017/rtx2jipw_0.jpg?itok=UH1lc90s',
    S25: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2016/2016-10-asia-bangladesh-police.jpg?itok=NaBkkWvi',
    S26: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2016/2016-09-asia-bangladesh-main.jpg?itok=GTUJk-t1',
    S27: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2025/01/202501asia_bangladesh_protest_flags.jpg?h=833ce7e2&itok=roRw75CY',
    S28: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2018/201812asia_bangladesh_main.jpg?itok=_B0TuLw_',
    S29: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2018/201808asia_bangladesh_shahidul.jpg?itok=fnul0TZ8',
    S31: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2018/201802asia_bangladesh_dsa.jpg?itok=U2h5EGPr',
    S33: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2019/201901asia_bangldesh_elections.jpg?itok=l-jRy94K',
    S35: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2019/201910asia_bangladesh_facebook.jpg?itok=bjAVn26C',
    S36: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/multimedia_images_2017/201707asia_bangladesh_disappearances_mainpresser.jpg?itok=qPF-TLJh',
    S38: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2020/06/202006asia_bangladesh_kajol.jpeg?h=29234840&itok=LxsE1sHe',
    S39: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2020/05/202005asia_bangladesh_kajol.jpg?h=6f8e8448&itok=NsX5zxZf',
    S41: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2020/08/2020ASIA_Bangladesh_Army_murder.jpg?h=a1bf1608&itok=dfotjZYD',
    S45: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2022/12/202212asia_bangladesh_police_protest_barricade.jpg?h=6acbff97&itok=FKIQzaLc',
    S48: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2023/09/202309asia_bangladesh_adilur_rahman_khan.jpg?h=b5ea2ea4&itok=Bk6slnEJ',
    S51: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2023/10/202310asia_bangladesh_police_clash_bnp_protestors_election.jpg?h=c6980913&itok=cuPkkKde',
    S53: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2023/11/202311asia_bangladesh_garmet_workers_protest.jpg?h=56d0ca2e&itok=_-TWfbch',
    S55: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2023/12/202312asia_bangladesh_wr.jpg?h=dc717abb&itok=2KbllyBE',
    S57: 'https://www.hrw.org/sites/default/files/styles/opengraph/public/media_2024/07/202407asia_bangladesh_anti-quota_protestors.jpg?h=2992ba0a&itok=pgLD9Yfb'
  };
  const CATEGORY_MEDIA_SOURCE = {
    MAJOR_TRAGEDY: 'S01', STATE_VIOLENCE: 'S26', ENFORCED_DISAPPEARANCE: 'S09', BORDER_KILLING: 'S05', DEMOCRACY_ELECTIONS: 'S55', LABOR_RIGHTS: 'S53', LABOR_SAFETY: 'S53', POLITICAL_VIOLENCE: 'S51', FREEDOM_EXPRESSION: 'S31', EXTREMIST_ATTACK: 'S24', STATE_REPRESSION: 'S22', JUDICIAL_INDEPENDENCE: 'S27', STUDENT_PROTESTS: 'S29', INTERNATIONAL_ACCOUNTABILITY: 'S27', POLITICAL_REPRESSION: 'S45', JULY_2024: 'S57'
  };
  const INCIDENT_MEDIA = {
    '2013-rana-plaza': { src: 'media/rana-plaza.webp', sourceUrl: 'https://commons.wikimedia.org/wiki/File:2013_Savar_building_collapse_aftermath.jpg', credit: 'Sudipta06 · CC BY-SA 3.0', exact: true },
    '2018-road-safety-crackdown': { src: 'media/road-safety.webp', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bangladesh_road-safety_protests.jpg', credit: 'Jubair1985 · CC BY-SA 4.0', exact: true },
    '2024-july15-bcl-attacks': { src: 'media/parliament.webp', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Parliament_storming_on_August_5,_2024.jpg', credit: 'Shazid Ahsan · CC BY-SA 4.0', exact: false },
    '2024-abu-sayed': { src: SOURCE_MEDIA.S57, sourceId: 'S57', exact: false },
    '2024-internet-shutdown': { src: SOURCE_MEDIA.S57, sourceId: 'S57', exact: false },
    '2024-mass-arrests-coordinators': { src: SOURCE_MEDIA.S57, sourceId: 'S57', exact: false },
    '2024-july-august-crackdown': { src: 'media/parliament.webp', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Parliament_storming_on_August_5,_2024.jpg', credit: 'Shazid Ahsan · CC BY-SA 4.0', exact: false }
  };

  const state = { data: null, lang: 'bn', mode: 'all', category: null, year: null, query: '', sourcesExpanded: false, sourceQuery: '', active: null, rendered: [], positions: new Map(), animationFrame: 0 };
  const elements = {
    canvas: $('#network-canvas'), lines: $('#network-lines'), shell: $('#network-shell'), preview: $('#record-preview'), rail: $('#mobile-node-rail'), axis: $('#time-axis'), years: $('#year-navigator'), search: $('#archive-search'), reset: $('#reset-view'), count: $('#network-count'), label: $('#network-label'), empty: $('#empty-state'), dialog: $('#record-dialog'), dialogContent: $('#dialog-content'), sourceList: $('#source-list'), sourceSearch: $('#source-search'), sourceCount: $('#visible-source-count'), sourceTotal: $('#source-total-count'), sourceMore: $('#show-more-sources'), sourceDisclosure: $('#source-disclosure'), timelineChart: $('#timeline-chart'), categoryChart: $('#category-chart'), evidenceChart: $('#evidence-chart'), patterns: $('#patterns')
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
    if (state.lang === 'en') {
      if (value.includes('STRONGLY_CORROBORATED') || value.includes('UN_FACT_FINDING_STRONG')) return 'Confirmed by several strong or UN sources';
      if (value.includes('LATER_CORROBORATED')) return 'Earlier allegations later supported by further evidence';
      if (value.includes('CONTESTED')) return 'The event is documented, though some claims remain disputed';
      if (value.includes('MIXED_RESPONSIBILITY')) return 'The evidence identifies responsibility among several actors';
      if (value.includes('UNRESOLVED')) return 'Documented, but key questions remain unresolved';
      if (value.includes('WELL_DOCUMENTED_ALLEGATION')) return 'A strongly documented allegation';
      if (value.includes('DOCUMENTED_PATTERN')) return 'A long-running pattern documented across sources';
      if (value.includes('VERIFIED')) return 'The event is confirmed by reliable sources';
      if (value.includes('DOCUMENTED')) return 'Documented by credible sources';
      return 'The available evidence is still being assessed';
    }
    if (state.lang === 'de') {
      if (value.includes('STRONGLY_CORROBORATED') || value.includes('UN_FACT_FINDING_STRONG')) return 'Durch mehrere starke oder UN-Quellen bestätigt';
      if (value.includes('LATER_CORROBORATED')) return 'Frühere Vorwürfe wurden später durch weitere Belege gestützt';
      if (value.includes('CONTESTED')) return 'Das Ereignis ist dokumentiert; einzelne Aussagen bleiben umstritten';
      if (value.includes('MIXED_RESPONSIBILITY')) return 'Die Belege weisen mehreren Akteuren Verantwortung zu';
      if (value.includes('UNRESOLVED')) return 'Dokumentiert, doch zentrale Fragen bleiben ungeklärt';
      if (value.includes('WELL_DOCUMENTED_ALLEGATION')) return 'Ein stark dokumentierter Vorwurf';
      if (value.includes('DOCUMENTED_PATTERN')) return 'Ein über längere Zeit und mehrere Quellen dokumentiertes Muster';
      if (value.includes('VERIFIED')) return 'Das Ereignis ist durch verlässliche Quellen bestätigt';
      if (value.includes('DOCUMENTED')) return 'Durch glaubwürdige Quellen dokumentiert';
      return 'Die vorhandenen Belege werden weiter geprüft';
    }
    if (value.includes('STRONGLY_CORROBORATED')) return 'একাধিক শক্ত উৎসে দৃঢ়ভাবে সমর্থিত';
    if (value.includes('LATER_CORROBORATED')) return 'আগের অভিযোগ পরে অতিরিক্ত প্রমাণে সমর্থিত';
    if (value.includes('UN_FACT_FINDING_STRONG')) return 'জাতিসংঘের তথ্যানুসন্ধানে শক্ত সিদ্ধান্ত';
    if (value.includes('CONTESTED')) return 'ঘটনা নথিভুক্ত; কিছু দাবি এখনো বিতর্কিত';
    if (value.includes('MIXED_RESPONSIBILITY')) return 'একাধিক পক্ষের নথিভুক্ত দায়';
    if (value.includes('UNRESOLVED')) return 'নথিভুক্ত কিন্তু চূড়ান্তভাবে অমীমাংসিত';
    if (value.includes('WELL_DOCUMENTED_ALLEGATION')) return 'শক্তভাবে নথিভুক্ত অভিযোগ';
    if (value.includes('DOCUMENTED_PATTERN')) return 'দীর্ঘমেয়াদি নথিভুক্ত প্যাটার্ন';
    if (value.includes('VERIFIED')) return 'ঘটনাটি নির্ভরযোগ্য উৎসে নিশ্চিত';
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
  const incidentMedia = incident => {
    const override = INCIDENT_MEDIA[incident.id];
    if (override) {
      const source = override.sourceId ? state.data.sources[override.sourceId] : null;
      return { ...override, sourceUrl: override.sourceUrl || source?.url, credit: override.credit || `${source?.publisher || 'Source'} · ${source?.title || ''}` };
    }
    const sourceId = incident.source_ids.find(id => SOURCE_MEDIA[id]) || CATEGORY_MEDIA_SOURCE[incident.category];
    const source = state.data.sources[sourceId];
    return { src: SOURCE_MEDIA[sourceId] || 'media/parliament.webp', sourceUrl: source?.url || 'https://commons.wikimedia.org/wiki/File:Parliament_storming_on_August_5,_2024.jpg', credit: source ? `${source.publisher} · ${source.title}` : 'Shazid Ahsan · CC BY-SA 4.0', exact: false };
  };
  const incidentStory = incident => {
    const category = incident.category;
    const bn = {
      ENFORCED_DISAPPEARANCE: 'কাউকে তুলে নিয়ে রাষ্ট্র যখন কোনো তথ্য দেয় না, তখন শুধু একজন মানুষ নয়—তাঁর পরিবারকেও অনিশ্চয়তার কারাগারে বন্দি করা হয়। এই নথি হাসিনা আমলে সেই ভয়কে শাসনের পদ্ধতি বানানোর একটি অংশ।',
      STATE_VIOLENCE: 'রাষ্ট্রের বাহিনীর হাতে অস্ত্র, আইন ও আটকের ক্ষমতা থাকে; তাই তাদের প্রতিটি গুলি, হেফাজত ও নির্যাতনের জন্য উচ্চতম মানের জবাবদিহি দরকার। হাসিনা সরকার সেই বাহিনীগুলোকে নিয়ন্ত্রণ করেছে এবং ব্যর্থতার পুনরাবৃত্তি থামায়নি—রাজনৈতিক ও প্রাতিষ্ঠানিক দায় তাই অনস্বীকার্য।',
      DEMOCRACY_ELECTIONS: 'ভোট শুধু ব্যালট বাক্সে কাগজ দেওয়া নয়; প্রতিযোগিতা, প্রচার, নিরাপত্তা ও ফলাফলের ওপর আস্থাই তাকে নির্বাচন করে। হাসিনা শাসন ধাপে ধাপে এই শর্তগুলো ভেঙে নির্বাচনকে ক্ষমতা নবায়নের আনুষ্ঠানিকতায় নামিয়ে আনে।',
      FREEDOM_EXPRESSION: 'ভয় পেয়ে মানুষ যখন লেখা, সংবাদ বা প্রশ্ন থামিয়ে দেয়, শাসককে আর প্রতিটি কণ্ঠ বন্ধ করতে হয় না। হাসিনা সরকারের ডিজিটাল আইন, গ্রেপ্তার ও মামলা সেই আত্ম-সেন্সরশিপের ভয় তৈরি করেছে।',
      JULY_2024: 'জুলাই ২০২৪-এর নথিগুলো দেখায়, হাসিনা সরকার তার ক্ষমতা রক্ষায় ছাত্র-জনতার বিরুদ্ধে প্রাণঘাতী বলপ্রয়োগ, গণগ্রেপ্তার ও তথ্য-অন্ধকার ব্যবহার করেছে। এটি ছিল ১৬ বছরের দমন-পদ্ধতির চূড়ান্ত প্রকাশ।'
    };
    const en = {
      ENFORCED_DISAPPEARANCE: 'When a person is taken and the state denies knowledge, an entire family is imprisoned in uncertainty. This record belongs to the architecture of fear that made disappearance a method of rule during the Hasina era.',
      STATE_VIOLENCE: 'State forces hold weapons, detention power and the authority of law; their violence therefore demands the highest accountability. The Hasina government controlled these institutions and failed to stop recurring abuse—its political and institutional responsibility cannot be evaded.',
      DEMOCRACY_ELECTIONS: 'An election requires genuine competition, free campaigning, safety and trust in the count. The Hasina regime dismantled those conditions step by step and reduced elections to rituals for renewing its own power.',
      FREEDOM_EXPRESSION: 'When fear makes people stop writing, reporting or questioning, the ruler no longer needs to silence every voice. Digital laws, arrests and prosecutions under the Hasina government cultivated precisely that self-censorship.',
      JULY_2024: 'The July 2024 record shows the Hasina government using lethal force, mass arrest and an information blackout against students and citizens to preserve power. It was the final expression of a 16-year machinery of repression.'
    };
    const de = {
      ENFORCED_DISAPPEARANCE: 'Wenn ein Mensch verschleppt wird und der Staat jede Kenntnis bestreitet, wird eine ganze Familie in Ungewissheit gefangen. Dieser Eintrag gehört zu der Angstarchitektur, die Verschwindenlassen in der Hasina-Ära zur Herrschaftsmethode machte.',
      STATE_VIOLENCE: 'Staatliche Kräfte verfügen über Waffen, Haftgewalt und Gesetzesmacht; ihre Gewalt verlangt daher höchste Rechenschaft. Die Hasina-Regierung kontrollierte diese Institutionen und stoppte wiederkehrenden Missbrauch nicht—ihre politische und institutionelle Verantwortung bleibt.',
      DEMOCRACY_ELECTIONS: 'Eine Wahl braucht echten Wettbewerb, freie Kampagnen, Sicherheit und Vertrauen in die Auszählung. Das Hasina-Regime zerstörte diese Voraussetzungen schrittweise und machte Wahlen zum Ritual der eigenen Machterneuerung.',
      FREEDOM_EXPRESSION: 'Wenn Angst Menschen vom Schreiben, Berichten und Fragen abhält, muss ein Herrscher nicht jede Stimme einzeln zum Schweigen bringen. Digitale Gesetze, Verhaftungen und Verfahren der Hasina-Regierung erzeugten genau diese Selbstzensur.',
      JULY_2024: 'Die Dokumente vom Juli 2024 zeigen, wie die Hasina-Regierung tödliche Gewalt, Massenverhaftungen und eine Informationssperre gegen Studierende und Bürger einsetzte, um die Macht zu halten. Es war der Endpunkt einer 16-jährigen Repressionsmaschinerie.'
    };
    const fallbackBn = 'এই ঘটনাটি বিচ্ছিন্ন নয়। একই শাসনামলে হুমকি, দলীয় প্রভাব, দুর্বল তদন্ত ও দায়মুক্তি পুনরাবৃত্ত হওয়া দেখায় যে হাসিনা শাসন নাগরিক সুরক্ষার চেয়ে ক্ষমতার সুরক্ষাকে অগ্রাধিকার দিয়েছে।';
    if (state.lang === 'en') return en[category] || 'This was not an isolated incident. Repeated intimidation, partisan influence, failed investigations and impunity show a regime that placed its own hold on power above public protection and accountability.';
    if (state.lang === 'de') return de[category] || 'Dies war kein isolierter Vorfall. Wiederholte Einschüchterung, parteipolitischer Einfluss, gescheiterte Ermittlungen und Straflosigkeit zeigen ein Regime, das den eigenen Machterhalt über Schutz und Rechenschaft stellte.';
    return bn[category] || fallbackBn;
  };

  function renderDashboard() {
    const byYear = YEARS.map(year => ({ year, count: state.data.incidents.filter(item => item.year === year).length }));
    const maxYear = Math.max(...byYear.map(item => item.count), 1);
    elements.timelineChart.innerHTML = byYear.map(item => `<button type="button" class="timeline-bar" data-dashboard-year="${item.year}" aria-label="${yearNumber(item.year)}: ${number(item.count)} ${escapeAttribute(copy('chartRecords'))}"><i style="--bar:${Math.max(7, item.count / maxYear * 100)}%"><b>${number(item.count)}</b></i><span>${yearNumber(item.year)}</span></button>`).join('');
    const categories = Object.keys(CATEGORY_TRANSLATIONS).map(category => ({ category, count: state.data.incidents.filter(item => item.category === category).length })).sort((a, b) => b.count - a.count);
    const maxCategory = Math.max(...categories.map(item => item.count), 1);
    elements.categoryChart.innerHTML = categories.map(item => `<button type="button" data-dashboard-category="${item.category}"><span><b>${escapeHtml(categoryLabel(item.category))}</b><em>${number(item.count)}</em></span><i style="--width:${item.count / maxCategory * 100}%;--chart-accent:${categoryColor(item.category)}"></i></button>`).join('');
    const levels = ['A', 'B', 'C'].map(level => ({ level, count: state.data.incidents.filter(item => (item.evidence_level || 'C') === level).length }));
    const total = state.data.incidents.length;
    elements.evidenceChart.innerHTML = `<div class="evidence-ring" style="--a:${levels[0].count / total * 360}deg;--b:${(levels[0].count + levels[1].count) / total * 360}deg"><strong>${number(total)}</strong><span>${escapeHtml(copy('chartRecords'))}</span></div><div class="evidence-legend">${levels.map(item => `<span><i class="level-${item.level.toLowerCase()}"></i><b>${item.level}</b><em>${number(item.count)} · ${escapeHtml(evidenceLabel(item.level))}</em></span>`).join('')}</div>`;
  }

  function applyLanguage(lang, rerender = true) {
    state.lang = COPY[lang] ? lang : 'bn';
    document.documentElement.lang = state.lang;
    document.body.dataset.lang = state.lang;
    $$('[data-copy]').forEach(node => { node.textContent = copy(node.dataset.copy); });
    $$('[data-copy-placeholder]').forEach(node => { node.placeholder = copy(node.dataset.copyPlaceholder); });
    $$('.language-switcher button').forEach(button => { const active = button.dataset.lang === state.lang; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    $('#brand-logo').src = state.lang === 'bn' ? '../img/logo/logo-navbar-bn-clear.png' : '../img/logo/logo-navbar-en-clear.png';
    $('#hero-year-count').textContent = number(16);
    if (state.data) {
      $('#scope-note').textContent = state.lang === 'bn' ? state.data.meta.scope_note_bn : (state.lang === 'de' ? 'Dieses forschungsbasierte Kerndataset umfasst 70 wichtige Ereignisse, Fälle und Muster von 2009 bis 2024. Es ist keine vollständige Liste aller Gewalttaten, Fälle des Verschwindenlassens, Grenztötungen, politischen Ereignisse oder Menschenrechtsverletzungen in Bangladesch.' : 'This research-based core dataset covers 70 important events, cases and patterns from 2009 to 2024. It is not a complete list of every act of violence, disappearance, border killing, political event or human-rights violation in Bangladesh.');
      if (rerender) { renderDashboard(); buildYears(); renderNetwork(); renderSources(); if (state.active) showPreview(state.active); }
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
      const incident = record.incident; const level = incident.evidence_level || 'C'; const media = incidentMedia(incident); elements.preview.style.setProperty('--preview-accent', EVIDENCE_COLORS[level]);
      elements.preview.innerHTML = `<div class="preview-record"><figure class="preview-media"><img src="${escapeAttribute(media.src)}" alt="${escapeAttribute(incidentTitle(incident))}" loading="lazy" referrerpolicy="no-referrer"><span>${escapeHtml(copy('visualEvidence'))}</span></figure><div class="preview-meta"><b>${escapeHtml(evidenceLabel(level))}</b><span>${escapeHtml(formatDate(incident))}</span></div><span class="preview-category">${escapeHtml(categoryLabel(incident.category))}</span><h3>${escapeHtml(incidentTitle(incident))}</h3><p class="preview-summary">${escapeHtml(incident.summary_bn)}</p>${incident.display_caution_bn ? `<p class="preview-caution">${escapeHtml(incident.display_caution_bn)}</p>` : ''}<div class="preview-stats"><span>${escapeHtml(copy('evidence'))}<strong>${escapeHtml(level)}</strong></span><span>${escapeHtml(copy('sourceCount'))}<strong>${number(incident.source_ids.length)}</strong></span></div><button class="open-record" type="button" data-open-incident="${incident.id}">${escapeHtml(copy('openRecord'))}</button></div>`;
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
    const sources = incidentSources(incident); const level = incident.evidence_level || 'C'; const media = incidentMedia(incident);
    const related = state.data.incidents.filter(item => item.id !== incident.id && item.category === incident.category).sort((a, b) => Math.abs(a.year - incident.year) - Math.abs(b.year - incident.year) || a.year - b.year).slice(0, 3);
    const patternTotal = state.data.incidents.filter(item => item.category === incident.category).length;
    const yearTotal = state.data.incidents.filter(item => item.year === incident.year).length;
    const summaryLabel = state.lang === 'bn' ? copy('recordSummary') : copy('originalRecord');
    elements.dialog.style.setProperty('--dialog-accent', EVIDENCE_COLORS[level]);
    elements.dialogContent.innerHTML = `<article>
      <header class="dialog-hero"><div class="dialog-meta"><b>${escapeHtml(evidenceLabel(level))}</b><span>${escapeHtml(formatDate(incident))}</span><span>${escapeHtml(categoryLabel(incident.category))}</span></div><h2 id="dialog-title">${escapeHtml(incidentTitle(incident))}</h2><p class="dialog-record-id">${escapeHtml(evidenceStatusText(incident.evidence_status))}</p></header>
      <div class="dialog-body">
        <figure class="dialog-media"><img src="${escapeAttribute(media.src)}" alt="${escapeAttribute(incidentTitle(incident))}" loading="eager" referrerpolicy="no-referrer"><figcaption><span><b>${escapeHtml(copy('visualEvidence'))}</b><small>${escapeHtml(media.exact ? incidentTitle(incident) : copy('imageContext'))}</small></span><a href="${escapeAttribute(media.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(media.credit)} ↗</a></figcaption></figure>
        <section class="dialog-narrative"><small>${escapeHtml(summaryLabel)}</small><p class="dialog-summary" lang="bn">${highlightNumbers(incident.summary_bn)}</p></section>
        <section class="incident-story"><header><span>${yearNumber(incident.year)}</span><h3>${escapeHtml(copy('storyTitle'))}</h3></header><p>${escapeHtml(incidentStory(incident))}</p><div><span><b>${number(patternTotal)}</b><small>${escapeHtml(copy('patternCount'))}</small></span><span><b>${number(yearTotal)}</b><small>${escapeHtml(copy('yearCount'))}</small></span><span><b>${number(sources.length)}</b><small>${escapeHtml(copy('sourceCount'))}</small></span></div></section>
        <section class="accountability-reading"><small>${escapeHtml(copy('accountabilityTitle'))}</small><p>${escapeHtml(accountabilityInsight(incident))}</p></section>
        <div class="dialog-facts">
          <section><small>${escapeHtml(copy('date'))}</small><p>${escapeHtml(formatDate(incident))}</p></section>
          <section><small>${escapeHtml(copy('location'))}</small><p>${escapeHtml(incident.location || '—')}</p></section>
          <section><small>${escapeHtml(copy('status'))}</small><p>${escapeHtml(evidenceStatusText(incident.evidence_status))}</p></section>
          <section><small>${escapeHtml(copy('evidenceReason'))}</small><p><b class="evidence-grade">${escapeHtml(level)}</b>${escapeHtml(evidenceExplanation(level))}</p></section>
        </div>
        ${incident.display_caution_bn ? `<p class="dialog-caution" lang="bn"><strong>${escapeHtml(copy('caution'))}:</strong> ${escapeHtml(incident.display_caution_bn)}</p>` : ''}
        <section class="dossier-stance"><span>${escapeHtml(copy('stanceLabel'))}</span><div><h3>${escapeHtml(copy('stanceTitle'))}</h3><p>${escapeHtml(copy('stanceBody'))}</p></div></section>
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
  function highlightNumbers(value) { return escapeHtml(value).replace(/(^|[\s(])([0-9০-৯][0-9০-৯,.%–—-]*)/g, '$1<mark>$2</mark>'); }

  function setupEvents() {
    $('.language-switcher').addEventListener('click', event => { const button = event.target.closest('[data-lang]'); if (!button) return; const url = new URL(location.href); if (button.dataset.lang === 'bn') url.searchParams.delete('lang'); else url.searchParams.set('lang', button.dataset.lang); history.replaceState({}, '', url); applyLanguage(button.dataset.lang); });
    $('.mode-switch').addEventListener('click', event => { const button = event.target.closest('[data-mode]'); if (!button) return; state.mode = button.dataset.mode; state.category = null; state.year = null; state.query = ''; elements.search.value = ''; renderNetwork(); });
    elements.years.addEventListener('click', event => { const button = event.target.closest('[data-year]'); if (!button) return; state.year = button.dataset.year ? Number(button.dataset.year) : null; state.category = null; if (state.year) state.mode = 'time'; renderNetwork(); });
    elements.search.addEventListener('input', event => { state.query = event.target.value.trim(); state.category = null; state.year = null; renderNetwork(); });
    elements.reset.addEventListener('click', () => { state.mode = 'all'; state.category = null; state.year = null; state.query = ''; elements.search.value = ''; renderNetwork(); });
    elements.patterns.addEventListener('click', event => {
      const year = event.target.closest('[data-dashboard-year]')?.dataset.dashboardYear;
      const category = event.target.closest('[data-dashboard-category]')?.dataset.dashboardCategory;
      if (!year && !category) return;
      state.query = ''; elements.search.value = ''; state.year = year ? Number(year) : null; state.category = category || null; state.mode = year ? 'time' : 'all'; renderNetwork();
      $('#archive-stage').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
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
      setupEvents(); applyLanguage(new URL(location.href).searchParams.get('lang') || 'bn', false); renderDashboard(); buildYears(); renderNetwork(); renderSources();
      if (location.hash === '#sources') elements.sourceDisclosure.open = true;
      const slug = new URL(location.href).searchParams.get('incident'); if (slug) openDialog(state.data.incidents.find(item => item.slug === slug), false);
    } catch (error) {
      console.error('Archive initialization failed:', error); elements.empty.hidden = false; elements.empty.textContent = copy('datasetError');
    }
  }

  init();
})();
