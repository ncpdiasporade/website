(() => {
  'use strict';

  const SUPPORTED = ['bn', 'en', 'de'];
  const LOCALES = { bn: 'bn-BD', en: 'en-GB', de: 'de-DE' };
  const NAMES = {
    bn: { name: 'বাংলা', code: 'BN' },
    en: { name: 'English', code: 'EN' },
    de: { name: 'Deutsch', code: 'DE' },
  };

  const meta = {
    bn: {
      title: 'NCP Diaspora Alliance Germany | জাতীয় নাগরিক পার্টি',
      description: 'জুলাই গণঅভ্যুত্থান ২০২৪, জাতীয় নাগরিক পার্টি (NCP), প্রবাসী অধিকার এবং NCP Diaspora Alliance Germany-এর কার্যক্রম, ঘোষণা ও তথ্যভান্ডার।',
      ogDescription: 'জুলাই ২০২৪-এর দলিল, NCP-এর তথ্য, প্রবাসী অধিকার, সাম্প্রতিক কার্যক্রম ও ঘোষণার নির্ভরযোগ্য কেন্দ্র।',
    },
    en: {
      title: 'NCP Diaspora Alliance Germany | National Citizen Party',
      description: 'Information on the July Uprising 2024, the National Citizen Party (NCP), diaspora rights, and the work and announcements of NCP Diaspora Alliance Germany.',
      ogDescription: 'A trusted hub for July 2024 records, NCP information, diaspora rights, recent activities and announcements.',
    },
    de: {
      title: 'NCP Diaspora Alliance Germany | National Citizen Party',
      description: 'Informationen zum Juli-Aufstand 2024, zur National Citizen Party (NCP), zu Rechten der Diaspora sowie zur Arbeit und zu Ankündigungen der NCP Diaspora Alliance Germany.',
      ogDescription: 'Eine verlässliche Anlaufstelle für Dokumente zu Juli 2024, Informationen zur NCP, Diaspora-Rechte, aktuelle Aktivitäten und Ankündigungen.',
    },
  };

  const en = {
    'Germany · জার্মানি': 'Germany',
    'কর্মসূচি': 'Programmes',
    'কর্মসূচি ও আয়োজন': 'Programmes & events',
    'জুলাই ২০২৪': 'July 2024',
    'আমাদের সম্পর্কে': 'About us',
    'সর্বশেষ': 'Latest',
    'সর্বশেষ আপডেট': 'Latest updates',
    'সদস্যপদ': 'Membership',
    'আমাদের জানুন': 'About us',
    'সদস্য হোন': 'Become a member',
    'লক্ষ্য ও আদর্শ': 'Goals & principles',
    'ব্লগ': 'Blog',
    'কেন যুক্ত হবেন': 'Why join',
    'জুলাই ২০২৪ গণঅভ্যুত্থানের চেতনায়': 'Inspired by the spirit of the July 2024 Uprising',
    'জুলাইয়ের রক্তে': 'For July’s sacrifice',
    'নতুন বাংলাদেশ': 'a new Bangladesh',
    'গড়ার প্রতিশ্রুতি': 'we pledge to build',
    'বিশ্বের প্রথম সফল জেন-জি বিপ্লবের পর নতুন বাংলাদেশ গড়ার অঙ্গীকারে অনুপ্রাণিত হয়ে জার্মানির বাংলাদেশি প্রবাসীরা আজ ঐক্যবদ্ধ—সংস্কার, গণতন্ত্র ও প্রবাসী অধিকারের সংগ্রামকে আরও শক্তিশালী, সুসংগঠিত ও ফলপ্রসূ করে তুলতে।': 'Inspired by the commitment to build a new Bangladesh after the world’s first successful Gen Z-led uprising, Bangladeshis in Germany are united to make the movement for reform, democracy and diaspora rights stronger, better organised and more effective.',
    'এখনই সদস্য হোন': 'Join now',
    'আমাদের জানুন →': 'About us →',
    '২০২৪': '2024',
    'মুক্তিযুদ্ধের পর দ্বিতীয় সফল গণঅভ্যুত্থান — ৫ আগস্ট ২০২৪': 'The second successful mass uprising since the Liberation War — 5 August 2024',
    'বাংলাদেশের প্রথম ছাত্রনেতৃত্বাধীন রাজনৈতিক দল (২৮ ফেব্রু ২০২৫)': 'Bangladesh’s first student-led political party (28 February 2025)',
    '~১.৫ কোটি': '~15 million',
    'প্রবাসী বাংলাদেশি — যারা প্রথমবারের মতো জাতীয় নির্বাচনে ভোট প্রদান করে ইতিহাস সৃষ্টি করেছেন': 'Bangladeshis abroad — who made history by voting in a national election for the first time',
    'মেধা ও দেশপ্রেমের ঐক্যবদ্ধ শক্তিতে গড়বো আগামীর বাংলাদেশ': 'Building tomorrow’s Bangladesh through the united strength of talent and patriotism',
    '"জুলাইয়ের রক্ত, প্রবাসীদের দায়বদ্ধতা এবং নতুন বাংলাদেশের স্বপ্ন — এই তিনের মিলনেই আমাদের সংগঠিত যাত্রা।"': '“The blood of July, the responsibility of the diaspora and the dream of a new Bangladesh — together they shape our organised journey.”',
    'NCP Diaspora Alliance Germany · প্রতিষ্ঠাকালীন ভাবনা': 'NCP Diaspora Alliance Germany · Founding vision',
    'সংস্কার': 'Reform',
    'গণতন্ত্র': 'Democracy',
    'প্রবাসী অধিকার': 'Diaspora rights',
    'দ্বিতীয় প্রজাতন্ত্র': 'Second Republic',
    'বিশেষ ঘোষণা · আসন্ন আয়োজন': 'Special announcement · Upcoming event',
    'রক্তে জুলাই': 'Rokte July',
    'তারিখ': 'Date',
    'সময়': 'Time',
    'স্থান': 'Venue',
    '২৬ জুলাই ২০২৬ · রবিবার': 'Sunday, 26 July 2026',
    'বিকাল ২টা ৩০ মিনিট': '2:30 pm',
    'পোস্টার ও নিবন্ধন QR দেখুন': 'View poster & registration QR',
    'পোস্টার ও QR দেখুন': 'View poster & QR',
    'ফেসবুকে বিস্তারিত': 'Details on Facebook',
    'Facebook Event দেখুন': 'View Facebook event',
    'Facebook Events দেখুন': 'View Facebook events',
    'Facebook Events · প্রতি ২৪ ঘণ্টায় যাচাই': 'Facebook Events · checked every 24 hours',
    'কেন আমরা এখানে আছি': 'Why we are here',
    'জুলাই গণঅভ্যুত্থান ২০২৪:': 'July Uprising 2024:',
    'ছাত্র-জনতার ঐতিহাসিক অভ্যুত্থান': 'the historic uprising of students and citizens',
    'কোটা সংস্কারের দাবিতে শুরু হওয়া আন্দোলন দ্রুত দেশব্যাপী ছাত্র-জনতার গণঅভ্যুত্থানে রূপ নেয়। জাতিসংঘের মানবাধিকার দপ্তরের অনুসন্ধান অনুযায়ী, ১ জুলাই থেকে ১৫ আগস্ট ২০২৪-এর মধ্যে সর্বোচ্চ ১,৪০০ মানুষ নিহত হয়ে থাকতে পারেন এবং হাজারো মানুষ আহত হন। স্মৃতি সংরক্ষণ, সত্য জানা ও ন্যায়বিচারের দাবি ভবিষ্যৎ প্রজন্মের প্রতি আমাদের সম্মিলিত দায়িত্ব।': 'What began as a movement demanding quota reform quickly became a nationwide uprising of students and citizens. According to the UN Human Rights Office’s fact-finding mission, as many as 1,400 people may have been killed between 1 July and 15 August 2024, while thousands were injured. Preserving memory, establishing the truth and demanding justice are our shared responsibility to future generations.',
    'সর্বোচ্চ ১,৪০০': 'Up to 1,400',
    'OHCHR-এর আনুমানিক নিহতের সংখ্যা (১ জুলাই–১৫ আগস্ট ২০২৪)': 'OHCHR estimate of people killed (1 July–15 August 2024)',
    'হাজারো': 'Thousands',
    'আহতের কথা নথিভুক্ত করেছে জাতিসংঘের অনুসন্ধান': 'people reported injured in the UN investigation',
    '৫ আগস্ট': '5 August',
    'সরকারের পতন ও রাজনৈতিক পটপরিবর্তন, ২০২৪': 'Fall of the government and political transition, 2024',
    '২৮ ফেব্রু': '28 February',
    'NCP প্রতিষ্ঠা দিবস, ২০২৫': 'NCP founding day, 2025',
    'বিস্তারিত জানুন': 'Learn more',
    'জুলাই গণঅভ্যুত্থান সম্পর্কে নির্ভরযোগ্য উৎস': 'Trusted sources on the July Uprising',
    'জাতিসংঘের প্রতিবেদন, সরকারি তথ্য, স্মৃতি জাদুঘর এবং নির্বাচিত সংবাদ ও কমিউনিটি আর্কাইভে ঘটনাপ্রবাহ, সাক্ষ্য, নথি, ছবি ও ভিডিও দেখুন।': 'Explore timelines, testimonies, records, photographs and videos through UN reports, official information, the memorial museum, and selected news and community archives.',
    'ওয়েবসাইটজুড়ে ব্যবহৃত জুলাইয়ের আলোকচিত্র: AFP, পলাশ খান ও অর্কিড চাকমা। আন্দোলনকালীন শিল্পকর্ম: সংগঠনের সংরক্ষিত সংগ্রহ।': 'July photographs used throughout the website: AFP, Palash Khan and Orchid Chakma. Protest-era artwork: the organisation’s preserved collection.',
    'আমাদের পথচলা': 'Our journey',
    'আন্দোলনের চেতনা থেকে প্রবাসী সংগঠন': 'From the spirit of the uprising to an organised diaspora',
    'NCP Diaspora Alliance Germany জার্মানিতে বসবাসরত বাংলাদেশিদের নাগরিক অংশগ্রহণ, প্রবাসী অধিকার, জ্ঞান বিনিময় ও দায়িত্বশীল রাজনৈতিক সংলাপের একটি সংগঠিত প্ল্যাটফর্ম।': 'NCP Diaspora Alliance Germany is an organised platform for civic participation, diaspora rights, knowledge exchange and responsible political dialogue among Bangladeshis living in Germany.',
    'জুলাই–আগস্ট': 'July–August',
    'জুলাই গণঅভ্যুত্থান': 'July Uprising',
    'সরকারি চাকরিতে কোটা সংস্কারের দাবিতে শুরু হওয়া আন্দোলন প্রাণহানি ও ব্যাপক দমন-পীড়নের প্রেক্ষাপটে দেশব্যাপী ছাত্র-জনতার গণঅভ্যুত্থানে রূপ নেয়।': 'The movement for reform of public-service quotas became a nationwide uprising of students and citizens amid loss of life and widespread repression.',
    'ফেব্রুয়ারি': 'February',
    'জাতীয় নাগরিক পার্টি': 'National Citizen Party',
    'NCP প্রতিষ্ঠা (২৮ ফেব্রুয়ারি)': 'NCP founded (28 February)',
    'জুলাই গণঅভ্যুত্থানের নেতৃত্বে থাকা একদল তরুণের উদ্যোগে জাতীয় নাগরিক পার্টি (NCP) আত্মপ্রকাশ করে। দলটি রাষ্ট্র সংস্কার, জবাবদিহি ও নতুন রাজনৈতিক বন্দোবস্তের কর্মসূচি সামনে আনে।': 'The National Citizen Party (NCP) was launched by a group of young leaders from the July Uprising. The party presented a programme focused on state reform, accountability and a new political settlement.',
    'এপ্রিল': 'April',
    'প্রবাসী ঐক্যের জাগরণ': 'A new diaspora unity',
    'ডায়াসপোরা নেটওয়ার্কের উদ্যোগ': 'Diaspora network initiative',
    'প্রবাসীদের অভিজ্ঞতা, পেশাগত দক্ষতা ও নাগরিক দাবি একটি সুসংগঠিত কাঠামোয় যুক্ত করার উদ্যোগ নেওয়া হয়—যাতে বাংলাদেশের গণতান্ত্রিক রূপান্তর এবং প্রবাসী-সংশ্লিষ্ট নীতিতে কার্যকর অবদান রাখা যায়।': 'An initiative was launched to bring diaspora experience, professional expertise and civic priorities into an organised framework that can contribute to Bangladesh’s democratic transition and diaspora-related policy.',
    'জুন–বর্তমান': 'June–present',
    'জার্মানি চ্যাপ্টারের কার্যক্রম': 'Work of the Germany chapter',
    'কমিউনিটি সংযোগ, নাগরিক সচেতনতা, প্রবাসী সেবা ও বাংলাদেশের নীতি-আলোচনায় অংশগ্রহণ—এই চার ক্ষেত্রে জার্মানি চ্যাপ্টার ধারাবাহিক কর্মসূচি গড়ে তুলছে।': 'The Germany chapter is developing sustained programmes in four areas: community connection, civic awareness, diaspora services and participation in policy dialogue on Bangladesh.',
    'আমাদের মূল অঙ্গীকার': 'Our core commitment',
    'জার্মানির বাংলাদেশি কমিউনিটিকে তথ্য, সংলাপ ও অংশগ্রহণের মাধ্যমে যুক্ত করা; প্রবাসী অধিকারকে নীতি-আলোচনায় তুলে ধরা; এবং দেশের জন্য দক্ষতা, জ্ঞান ও নেটওয়ার্কভিত্তিক অবদানের পথ তৈরি করা।': 'To connect the Bangladeshi community in Germany through information, dialogue and participation; bring diaspora rights into policy discussions; and create pathways for skills-, knowledge- and network-based contributions to Bangladesh.',
    'প্রবাসীদের কণ্ঠস্বর': 'The voice of the diaspora',
    'বিশ্বজুড়ে থাকা বাংলাদেশিরা অর্থনীতি, জ্ঞান ও সামাজিক সংযোগে গুরুত্বপূর্ণ অবদান রাখেন। তাদের ভোটাধিকার, কনস্যুলার সেবা, বিনিয়োগ-নিরাপত্তা ও মর্যাদাপূর্ণ নাগরিক অভিজ্ঞতার প্রশ্নগুলোকে আমরা গঠনমূলকভাবে সামনে আনতে চাই।': 'Bangladeshis around the world make important contributions through the economy, knowledge and social networks. We aim to advance, constructively, their voting rights, consular services, investment security and right to a dignified civic experience.',
    'যোগাযোগ': 'Contact',
    'যোগ দিন': 'Join us',
    'আমাদের কাজের নীতি': 'Our guiding principles',
    'যে অঙ্গীকারে আমরা কাজ করি': 'The commitments that guide our work',
    'গণতান্ত্রিক সংস্কার, প্রবাসী নাগরিক অধিকার এবং অন্তর্ভুক্তিমূলক কমিউনিটি—এই তিনটি অগ্রাধিকার আমাদের কর্মসূচি ও জনসম্পৃক্ততার ভিত্তি।': 'Democratic reform, the civic rights of the diaspora and an inclusive community are the three priorities underpinning our programmes and public engagement.',
    '০১': '01',
    '০২': '02',
    '০৩': '03',
    'রাষ্ট্র সংস্কার ও জবাবদিহি': 'State reform and accountability',
    'স্বাধীন প্রতিষ্ঠান, কার্যকর ক্ষমতার ভারসাম্য, মানবাধিকার সুরক্ষা এবং জনগণের কাছে জবাবদিহিমূলক শাসনব্যবস্থার পক্ষে আমরা তথ্যভিত্তিক আলোচনা ও নাগরিক অংশগ্রহণকে উৎসাহিত করি।': 'We encourage informed discussion and civic participation in support of independent institutions, effective checks and balances, human-rights protection and government accountable to the public.',
    'অধিকার': 'Rights',
    'প্রবাসী ভোটাধিকার ও নাগরিক সেবা': 'Diaspora voting rights and civic services',
    'ভোটার নিবন্ধন, প্রবাস থেকে ভোট প্রদান, সহজ ও স্বচ্ছ কনস্যুলার সেবা এবং নীতিনির্ধারণে প্রবাসীদের অর্থবহ প্রতিনিধিত্ব নিশ্চিত করার দাবিকে আমরা সংগঠিতভাবে সামনে আনি।': 'We organise around the demand for voter registration, voting from abroad, accessible and transparent consular services, and meaningful diaspora representation in policymaking.',
    'ঐক্য': 'Unity',
    'সমমর্যাদা ও কমিউনিটি সংহতি': 'Equal dignity and community solidarity',
    'ধর্ম, বর্ণ, লিঙ্গ, অঞ্চল, পেশা ও রাজনৈতিক মতভেদ নির্বিশেষে সবার মর্যাদা রক্ষা এবং জার্মানির বহুসাংস্কৃতিক সমাজে দায়িত্বশীল, সহযোগিতামূলক বাংলাদেশি কমিউনিটি গড়ে তোলা আমাদের অঙ্গীকার।': 'We are committed to protecting everyone’s dignity regardless of religion, ethnicity, gender, region, profession or political opinion, and to building a responsible, cooperative Bangladeshi community within Germany’s multicultural society.',
    'সাম্প্রতিক কার্যক্রম ও আপডেট': 'Recent activities and updates',
    'সাম্প্রতিক সাংগঠনিক কার্যক্রম, ঘোষণা, বিবৃতি, ছবি ও ভিডিও—মূল প্রকাশনার লিংকসহ নিয়মিত হালনাগাদ।': 'Regular updates on organisational activities, announcements, statements, photographs and videos — always linked to the original publication.',
    'আপডেটের ধরন ও উৎস বাছাই': 'Filter updates by type and source',
    'ফিচার্ড': 'Featured',
    'সব আপডেট': 'All updates',
    'জার্মানি চ্যাপ্টার': 'Germany chapter',
    'ভিডিও': 'Video',
    'ছবি': 'Image',
    'প্রতি ঘণ্টায় হালনাগাদ': 'Updated hourly',
    'মূল পোস্ট →': 'Original post →',
    'ভিডিও দেখুন →': 'Watch video →',
    'আপডেট': 'Update',
    'অফিসিয়াল উৎস': 'Official source',
    'ব্লগ ও মতামত': 'Blog & opinion',
    'প্রবাসের কথা, বাংলাদেশের আগামী': 'Diaspora perspectives, Bangladesh’s future',
    'ভোট, রেমিট্যান্স, দক্ষতা, জার্মানি–বাংলাদেশ সংযোগ এবং প্রবাসী নাগরিক শক্তি নিয়ে তথ্যভিত্তিক বিশ্লেষণ, ব্যবহারযোগ্য গাইড ও সম্পাদকীয় মতামত।': 'Evidence-based analysis, practical guides and editorial perspectives on voting, remittances, skills, Germany–Bangladesh connections and the civic strength of the diaspora.',
    'আপনি কি একটি লেখা প্রকাশ করতে চান? আপনার মতামত, বিশ্লেষণ, অভিজ্ঞতা বা প্রবাসী জীবনের গুরুত্বপূর্ণ প্রশ্ন নিয়ে লিখুন। সম্পাদকীয় পর্যালোচনার পর নির্বাচিত লেখা প্রকাশ করা হবে।': 'Would you like to publish an article? Write about your views, analysis, experiences or important questions of diaspora life. Selected submissions will be published after editorial review.',
    'লেখা পাঠান': 'Submit an article',
    'সম্পূর্ণ লেখা পড়ুন': 'Read full article',
    'সম্পাদকীয় টিম': 'Editorial team',
    'তথ্যসূত্র': 'Sources',
    'ছবি ও লাইসেন্স': 'Image & licence',
    'আপনার অংশগ্রহণ কেন গুরুত্বপূর্ণ': 'Why your participation matters',
    'দেশের সঙ্গে সংযোগ কেবল আবেগ বা রেমিট্যান্সে সীমাবদ্ধ নয়। নাগরিক অধিকার, জ্ঞান, দক্ষতা ও কমিউনিটি উদ্যোগে সংগঠিত অংশগ্রহণ দীর্ঘমেয়াদি পরিবর্তন তৈরি করতে পারে।': 'Connection with Bangladesh extends beyond emotion or remittances. Organised participation in civic rights, knowledge, skills and community initiatives can create lasting change.',
    'নীতিগত আলোচনায় প্রবাসী অভিজ্ঞতা': 'Diaspora experience in policy dialogue',
    'জার্মানির শিক্ষা, কর্মক্ষেত্র, স্থানীয় সরকার ও নাগরিক সেবার অভিজ্ঞতাকে বাংলাদেশের সংস্কার-আলোচনায় বাস্তব ও গঠনমূলক প্রস্তাবে রূপ দেওয়ার সুযোগ।': 'An opportunity to turn experience from German education, workplaces, local government and public services into practical, constructive proposals for reform discussions in Bangladesh.',
    'ভোট ও নাগরিক সেবায় তথ্য সহায়তা': 'Information support for voting and civic services',
    'ভোটার নিবন্ধন, প্রবাস থেকে ভোট প্রদান, পাসপোর্ট ও কনস্যুলার সেবা বিষয়ে যাচাই করা তথ্য ছড়িয়ে দেওয়া এবং সেবার মানোন্নয়নে সম্মিলিত মতামত তুলে ধরা।': 'Share verified information about voter registration, voting from abroad, passports and consular services, and collectively advocate for better service standards.',
    'মানুষ ও দক্ষতার নেটওয়ার্ক': 'A network of people and skills',
    'শিক্ষার্থী, পেশাজীবী, উদ্যোক্তা ও কমিউনিটি সংগঠকদের সঙ্গে যুক্ত হয়ে জ্ঞান বিনিময়, পরামর্শ, স্বেচ্ছাসেবা ও বাংলাদেশমুখী উদ্যোগে অংশ নিন।': 'Connect with students, professionals, entrepreneurs and community organisers to exchange knowledge, mentor, volunteer and contribute to Bangladesh-focused initiatives.',
    'স্মৃতিকে নাগরিক দায়িত্বে রূপ দিন': 'Turn memory into civic responsibility',
    'জুলাই ২০২৪-এর নিহত ও আহতদের স্মরণকে কেবল আনুষ্ঠানিকতায় সীমাবদ্ধ না রেখে মানবাধিকার, জবাবদিহি ও বৈষম্যহীন রাষ্ট্রের পক্ষে ধারাবাহিক নাগরিক কাজে রূপ দিন।': 'Honour those killed and injured in July 2024 by turning remembrance into sustained civic work for human rights, accountability and a state free from discrimination.',
    '"আমরা প্রবাসে আছি, কিন্তু দেশের প্রশ্নে নিরপেক্ষ নই। জুলাইয়ের ত্যাগ, তরুণদের স্বপ্ন এবং নতুন বাংলাদেশের প্রতিশ্রুতিকে বাঁচিয়ে রাখাই আমাদের পথচলার কেন্দ্রবিন্দু।"': '“We live abroad, but we are not neutral when it comes to our country. Keeping alive the sacrifices of July, the dreams of young people and the promise of a new Bangladesh is central to our journey.”',
    'NCP সম্পর্কে জানুন': 'About the NCP',
    'জাতীয় নাগরিক পার্টি ২৮ ফেব্রুয়ারি ২০২৫-এ আত্মপ্রকাশ করে। দলটির ঘোষিত অগ্রাধিকারের মধ্যে রাষ্ট্র ও সংবিধান সংস্কার, জবাবদিহিমূলক প্রতিষ্ঠান, বৈষম্যহীনতা এবং নাগরিকের রাজনৈতিক অংশগ্রহণ রয়েছে। সর্বশেষ অবস্থান ও প্রকাশনা জানতে দলটির অফিসিয়াল Facebook পেজ দেখুন।': 'The National Citizen Party was launched on 28 February 2025. Its stated priorities include reform of the state and constitution, accountable institutions, non-discrimination and citizens’ political participation. Visit the party’s official Facebook page for its latest positions and publications.',
    'অফিসিয়াল Facebook পেজ →': 'Official Facebook page →',
    'জার্মানি চ্যাপ্টারের সঙ্গে যুক্ত হোন': 'Join the Germany chapter',
    'সদস্য হিসেবে কমিউনিটি উদ্যোগ, নীতি-আলোচনা, স্বেচ্ছাসেবা ও প্রবাসী অধিকারভিত্তিক কার্যক্রমে নিয়মিতভাবে অংশ নিতে পারবেন।': 'As a member, you can participate regularly in community initiatives, policy discussions, volunteering and activities focused on diaspora rights.',
    'কর্মসূচি ও আলোচনায় অংশগ্রহণ': 'Participate in programmes and discussions',
    'কমিউনিটি সভা, তথ্য অধিবেশন ও বিশেষ উদ্যোগে সরাসরি যুক্ত থাকার সুযোগ।': 'Take part directly in community meetings, information sessions and special initiatives.',
    'ডায়াসপোরা নেটওয়ার্ক': 'Diaspora network',
    'জার্মানি ও অন্যান্য দেশের সদস্য, পেশাজীবী এবং উদ্যোগের সঙ্গে সংযোগ।': 'Connect with members, professionals and initiatives in Germany and other countries.',
    'প্রবাসী অধিকার নিয়ে কাজ': 'Work for diaspora rights',
    'ভোট, নাগরিক সেবা ও প্রতিনিধিত্বের প্রশ্নে তথ্যভিত্তিক উদ্যোগের অংশ হোন।': 'Join evidence-based initiatives on voting, civic services and representation.',
    'জ্ঞান ও দক্ষতার অবদান': 'Contribute knowledge and skills',
    'নিজের পেশাগত অভিজ্ঞতা ও ধারণাকে বাস্তব কমিউনিটি উদ্যোগে রূপ দিন।': 'Turn your professional experience and ideas into practical community initiatives.',
    'সদস্য নিবন্ধন ফর্ম': 'Membership registration form',
    'প্রয়োজনীয় তথ্যগুলো পূরণ করুন। সাবমিট করার আগে তথ্য ব্যবহারের সম্মতিটি পড়ুন। চাইলে নিবন্ধন QR কোডও ব্যবহার করতে পারেন।': 'Complete the required information and read the data-processing consent before submitting. You may also use the registration QR code.',
    'সদস্য নিবন্ধনের QR কোড': 'Membership registration QR code',
    'পূর্ণ নাম (ইংরেজি) *': 'Full name (in English) *',
    'বর্তমান শহর *': 'Current city *',
    'ইমেইল *': 'Email *',
    'হোয়াটসঅ্যাপ *': 'WhatsApp *',
    'পেশা *': 'Profession *',
    'ডাক্তার, প্রকৌশলী, ছাত্র, ব্যবসায়ী…': 'Doctor, engineer, student, entrepreneur…',
    'বাংলাদেশের ঠিকানা (ঐচ্ছিক)': 'Address in Bangladesh (optional)',
    'ইউনিয়ন, উপজেলা, জেলা': 'Union, upazila, district',
    'আপনার ফেসবুক প্রোফাইলের লিংক দিন (Facebook Profile URL) — ঐচ্ছিক': 'Facebook profile URL — optional',
    'আপনার ছোট পরিচয় বা অন্যান্য প্রাসঙ্গিক লিংক, যেমন ওয়েবসাইট বা মিডিয়া উপস্থিতি — ঐচ্ছিক': 'Short bio and relevant links, such as a website or media appearances — optional',
    'সংক্ষিপ্ত পরিচয়, ওয়েবসাইট, প্রকাশনা, সাক্ষাৎকার বা অন্যান্য প্রাসঙ্গিক লিংক': 'Short bio, website, publications, interviews or other relevant links',
    'পূর্বে বা বর্তমানে কোনো রাজনৈতিক সংগঠনের সঙ্গে যুক্ত থাকলে বর্ণনা করুন (Please specify any previous or current political affiliation) — ঐচ্ছিক': 'Please describe any previous or current political affiliation — optional',
    'প্রযোজ্য হলে সংগঠনের নাম, ভূমিকা ও সময়কাল উল্লেখ করুন': 'If applicable, state the organisation, your role and the period involved',
    'তথ্য সুরক্ষা ও গোপনীয়তা': 'Data protection and privacy',
    'সদস্যপদ যাচাই ও সাংগঠনিক যোগাযোগের জন্য আপনার তথ্য জার্মানিতে প্রযোজ্য সাধারণ ডেটা সুরক্ষা বিধিমালা (GDPR) অনুযায়ী গোপনীয়ভাবে সংরক্ষণ ও প্রক্রিয়াজাত করা হবে। ইমেইলে সাবমিশন পৌঁছে দেওয়ার জন্য FormSubmit সীমিতভাবে তথ্য প্রক্রিয়াজাত করবে। এই প্রযুক্তিগত প্রক্রিয়াকরণ ও আইনগত বাধ্যবাধকতা ব্যতীত, আপনার পূর্বানুমতি ছাড়া কোনো তৃতীয় পক্ষের সঙ্গে তথ্য শেয়ার করা হবে না।': 'Your information will be stored and processed confidentially under the General Data Protection Regulation (GDPR) applicable in Germany for membership verification and organisational communication. FormSubmit will process the data only as necessary to deliver the submission by email. Apart from this technical processing and any legal obligation, your information will not be shared with third parties without your prior consent.',
    'আমি উপরের তথ্য-সুরক্ষা শর্তাবলি পড়েছি ও বুঝেছি এবং উল্লিখিত উদ্দেশ্যে আমার তথ্য সংরক্ষণ ও প্রক্রিয়াজাত করার সম্মতি প্রদান করছি। *': 'I have read and understood the data-protection terms above and consent to the storage and processing of my information for the stated purposes. *',
    'সদস্য নিবন্ধন করুন →': 'Register as a member →',
    'নেভিগেশন': 'Navigation',
    'জুলাই গণঅভ্যুত্থানের স্মৃতি, গণতান্ত্রিক সংস্কার, প্রবাসী নাগরিক অধিকার এবং জার্মানির বাংলাদেশি কমিউনিটির দায়িত্বশীল অংশগ্রহণকে যুক্ত করে আমরা একটি তথ্যভিত্তিক ও জবাবদিহিমূলক প্ল্যাটফর্ম গড়ে তুলছি।': 'We are building an informed and accountable platform that connects the memory of the July Uprising, democratic reform, diaspora civic rights and responsible participation by the Bangladeshi community in Germany.',
    '© 2026 NCP Diaspora Alliance Germany. সর্বস্বত্ব সংরক্ষিত।': '© 2026 NCP Diaspora Alliance Germany. All rights reserved.',
    'জুলাইয়ের চেতনায় · বৈষম্যমুক্ত বাংলাদেশ · নতুন প্রজাতন্ত্র': 'Spirit of July · A discrimination-free Bangladesh · A new republic',
    'ভাষা নির্বাচন করুন': 'Select language',
    'ভাষাসমূহ': 'Languages',
    'পেজ স্ক্রল অগ্রগতি': 'Page scroll progress',
    'উপরে ফিরে যান': 'Back to top',
    'প্রধান নেভিগেশন': 'Primary navigation',
    'NCP Diaspora Alliance Germany হোমপেজ': 'NCP Diaspora Alliance Germany homepage',
    'মেনু খুলুন বা বন্ধ করুন': 'Open or close menu',
    'মোবাইল নেভিগেশন': 'Mobile navigation',
    'ব্লগ পাঠক বন্ধ করুন': 'Close blog reader',
    'NCP Diaspora Alliance Germany পরিচিতি': 'About NCP Diaspora Alliance Germany',
    'জুলাই গণঅভ্যুত্থান ২০২৪': 'July Uprising 2024',
    'ছাত্র-জনতার ঐতিহাসিক জাগরণ': 'A historic awakening of students and citizens',
    'OHCHR অনুসন্ধান': 'OHCHR fact-finding mission',
    'সর্বোচ্চ ১,৪০০ মানুষ নিহত হয়ে থাকতে পারেন': 'As many as 1,400 people may have been killed',
    'NCP প্রতিষ্ঠা': 'NCP founded',
    '২৮ ফেব্রুয়ারি ২০২৫': '28 February 2025',
    'জাতীয় নাগরিক পার্টি (NCP)': 'National Citizen Party (NCP)',
    'জুলাই নেতৃত্বের উদ্যোগে গঠিত রাজনৈতিক দল': 'A political party established by leaders of the July Uprising',
    'রাষ্ট্র সংস্কার': 'State reform',
    'গণতান্ত্রিক প্রতিষ্ঠান ও জবাবদিহির অঙ্গীকার': 'A commitment to democratic institutions and accountability',
    'ন্যায়, সাম্য ও গণতন্ত্রের অঙ্গীকার': 'A commitment to justice, equality and democracy',
    'প্রবাসী বাংলাদেশি': 'Bangladeshis abroad',
    'ভোট, সেবা ও প্রতিনিধিত্বের অধিকার': 'The right to vote, services and representation',
    'প্রবাসীদের ঐক্যবদ্ধ প্ল্যাটফর্ম': 'A united platform for the diaspora',
    'সক্রিয় · ২০২৫': 'Active · 2025',
    'ডায়াসপোরা নেটওয়ার্ক': 'Diaspora network',
    'জ্ঞান, দক্ষতা ও নাগরিক অংশগ্রহণ': 'Knowledge, skills and civic participation',
    'রাজনৈতিক অন্তর্ভুক্তির দাবি': 'A call for political inclusion',
    'গণতান্ত্রিক পুনর্গঠনের লক্ষ্য': 'A goal of democratic renewal',
    'বিস্তারিত দেখুন': 'View details',
    'অনুষ্ঠানের তথ্য': 'Event information',
    'জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে রক্তে জুলাই অনুষ্ঠানের পোস্টার': 'Poster for Rokte July, commemorating the July Uprising 2024',
    'জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে ‘রক্তে জুলাই’ অনুষ্ঠান দুটি পর্বে সাজানো—‘স্মৃতি থেকে জাগরণ’ এবং ‘অভিজ্ঞতা, অংশগ্রহণ ও আগামীর ভাবনা’। প্রামাণ্যচিত্র, জুলাইয়ের জীবন্ত গল্প, বক্তব্য, ভিজ্যুয়াল স্টোরি, প্রবাস থেকে আলোচনা, অভিজ্ঞতা ও প্রতিফলন, শর্ট ফিল্ম, July Quiz এবং ইন্টারঅ্যাকটিভ সেশন এতে অন্তর্ভুক্ত।': 'Commemorating the July Uprising 2024, Rokte July is organised in two parts: “From Memory to Awakening” and “Experience, Participation and Visions for the Future”. The programme includes a documentary, living stories of July, speeches, visual storytelling, diaspora discussions, experiences and reflections, short films, a July Quiz and interactive sessions.',
    'নতুন কর্মসূচির অপেক্ষায়': 'Awaiting the next programme',
    'NCP Diaspora Alliance Germany-এর নতুন Facebook Event প্রকাশিত হলে সময়, স্থান ও মূল Event লিংকসহ এখানে স্বয়ংক্রিয়ভাবে দেখা যাবে।': 'When NCP Diaspora Alliance Germany publishes a new Facebook event, it will appear here automatically with the time, venue and original event link.',
    'বিশেষ ঘোষণা': 'Special announcement',
    'তথ্যসূত্র': 'Reference',
    'মূল উৎস দেখুন →': 'View original source →',
    'জাতিসংঘ · প্রতিবেদন': 'United Nations · Report',
    'জুলাই–আগস্ট ২০২৪-এর মানবাধিকার লঙ্ঘন ও সহিংসতা বিষয়ে জাতিসংঘের স্বাধীন অনুসন্ধান প্রতিবেদন।': 'The UN’s independent fact-finding report on human-rights violations and violence in July–August 2024.',
    'মূল PDF পড়ুন →': 'Read the original PDF →',
    'সরকারি তথ্য': 'Official information',
    'জুলাই গণঅভ্যুত্থান অধিদপ্তর': 'Directorate of the July Mass Uprising',
    'শহিদ পরিবার, আহত জুলাই যোদ্ধা, আইন, গেজেট, সহায়তা ও পুনর্বাসন-সংক্রান্ত সরকারি তথ্য।': 'Official information on families of those killed, injured July participants, laws, gazettes, support and rehabilitation.',
    'সরকারি পোর্টাল →': 'Official portal →',
    'স্মৃতি জাদুঘর': 'Memorial museum',
    'জুলাই গণঅভ্যুত্থান ও পূর্ববর্তী দমন-পীড়নের স্মৃতি, উপকরণ ও সাক্ষ্যভিত্তিক ডিজিটাল উপস্থাপনা।': 'A digital presentation of memories, artefacts and testimony from the July Uprising and earlier repression.',
    'ডিজিটাল সংগ্রহ দেখুন →': 'Explore the digital collection →',
    'ডিজিটাল আর্কাইভ': 'Digital archive',
    'সংবাদ, আলোকচিত্র, মতামত ও প্রকাশিত উপকরণের বিষয়ভিত্তিক অনলাইন সংগ্রহ।': 'A thematic online collection of news, photographs, commentary and published materials.',
    'আর্কাইভ দেখুন →': 'View archive →',
    'সংবাদ আর্কাইভ': 'News archive',
    '১ জুলাই থেকে ৫ আগস্ট পর্যন্ত ঘটনাপ্রবাহের দিনভিত্তিক সংবাদ ও মাল্টিমিডিয়া আর্কাইভ।': 'A day-by-day news and multimedia archive covering events from 1 July to 5 August.',
    'টাইমলাইন দেখুন →': 'View timeline →',
    'কমিউনিটি আর্কাইভ': 'Community archive',
    'ছবি, ভিডিও, পোস্টার ও স্মৃতি সংরক্ষণের একটি কমিউনিটি-চালিত উদ্যোগ।': 'A community-led initiative preserving photographs, videos, posters and memories.',
    'সংগ্রহ দেখুন →': 'Explore collection →',
    '২০২৫': '2025',
    'সর্বশেষ হালনাগাদ': 'Last updated',
    'ভিউ': 'views',
    'এই মুহূর্তে কোনো যাচাইকৃত পিন করা Facebook পোস্ট পাওয়া যায়নি। পেজে নতুন পোস্ট পিন করা হলে এখানে দেখা যাবে।': 'No verified pinned Facebook post is available at the moment. A newly pinned post will appear here.',
    'এই উৎসে এখনো কোনো প্রকাশিত আপডেট নেই। নতুন পোস্ট যুক্ত হলে এখানে দেখা যাবে।': 'There are no published updates from this source yet. New posts will appear here.',
    'জুলাইয়ের পক্ষে থাকা সকল শক্তিকে একত্রিত করে NCP Diaspora Alliance Germany আয়োজন করতে যাচ্ছে জুলাইকে ঘিরে ইউরোপের…': 'NCP Diaspora Alliance Germany is bringing together everyone who stands with July for one of Europe’s largest…',
    'জুলাইয়ের পক্ষে থাকা সকল শক্তিকে একত্রিত করে NCP Diaspora Alliance Germany আয়োজন করতে যাচ্ছে জুলাইকে ঘিরে ইউরোপের অন্যতম বৃহৎ অনুষ্ঠান— “রক্তে জুলাই ২০২৬”। আপনিও অংশ নিন, জুলাইয়ের আকাঙ্ক্ষা ধারণ করে নতুন বাংলাদেশ বিনির্মাণের যাত্রায় শরিক হোন। 📅 তারিখ: ২৬ জুলাই ২০২৬, রবিবার': 'Bringing together everyone who stands with July, NCP Diaspora Alliance Germany is organising one of Europe’s largest July-focused events — “Rokte July 2026”. Join us and be part of the journey to build a new Bangladesh guided by the aspirations of July. 📅 Sunday, 26 July 2026.',
    'জুলাইয়ের পক্ষে থাকা সকল শক্তিকে একত্রিত করে NCP Diaspora Alliance Germany আয়োজন করতে যাচ্ছে জুলাইকে ঘিরে ইউরোপের অন্যতম বৃহৎ অনুষ্ঠান— “রক্তে জুলাই ২০২৬”। আমাদের এই আয়োজনে পাশে থাকার জন্য জাতীয় ছাত্রশক্তির ছাত্রীবিষয়ক সম্পাদক মিতু আপুকে অসংখ্য ধন্যবাদ। ইনকিলাব জিন্দাবাদ।': 'NCP Diaspora Alliance Germany is bringing together everyone who stands with July for one of Europe’s largest July-focused events — “Rokte July 2026”. Our sincere thanks to Mitu, women students’ affairs secretary of Jatiya Chhatra Shakti, for supporting the event.',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত “রক্তে জুলাই” অনুষ্ঠানের রেজিস্ট্রেশন শেষ হচ্ছে আগামী বুধবার, ২২ জুলাই…': 'Registration for Rokte July, commemorating the July Uprising 2024, closes on Wednesday, 22 July…',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত “রক্তে জুলাই” অনুষ্ঠানের রেজিস্ট্রেশন শেষ হচ্ছে আগামী বুধবার, ২২ জুলাই ২০২৬। এই বিশেষ আয়োজনে জুলাই গণঅভ্যুত্থানের সম্মুখসারির নেতৃবৃন্দের পাশাপাশি বাংলাদেশি-জার্মান কমিউনিটির নেতৃবৃন্দ, বিশিষ্ট ব্যক্তিবর্গ, পেশাজীবী ও সচেতন প্রবাসীরা অংশগ্রহণ করবেন।': 'Registration for Rokte July, commemorating the July Uprising 2024, closes on Wednesday, 22 July 2026. The special event will bring together frontline leaders of the uprising, leaders of the Bangladeshi-German community, public figures, professionals and engaged members of the diaspora.',
    '‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন নাহিদ ইসলাম': 'Nahid Islam to join Rokte July online',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন নাহিদ ইসলাম (আহ্বায়ক, জাতীয় নাগরিক পার্টি; ২৬ জুলাই ২০২৬, রবিবার)। প্রবাস থেকে জুলাইয়ের স্মৃতি, দায়বদ্ধতা এবং আগামীর বাংলাদেশে প্রবাসীদের ভূমিকা নিয়ে গুরুত্বপূর্ণ আলোচনায় আপনিও অংশ নিন। বিকাল ২টা ৩০ মিনিট—জার্মান সময় · Bilker Str. 29, 40213…': 'Nahid Islam, convenor of the National Citizen Party, will join Rokte July online on Sunday, 26 July 2026. Take part in an important discussion on the memory of July, diaspora responsibility and the diaspora’s role in Bangladesh’s future. 2:30 pm German time · Bilker Str. 29, 40213…',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন নাহিদ ইসলাম (আহ্বায়ক, জাতীয় নাগরিক পার্টি; ২৬ জুলাই ২০২৬, রবিবার)। প্রবাস থেকে জুলাইয়ের স্মৃতি, দায়বদ্ধতা এবং আগামীর বাংলাদেশে প্রবাসীদের ভূমিকা নিয়ে গুরুত্বপূর্ণ আলোচনায় আপনিও অংশ নিন। বিকাল ২টা ৩০ মিনিট—জার্মান সময় · Bilker Str. 29, 40213 Düsseldorf।': 'Nahid Islam, convenor of the National Citizen Party, will join Rokte July online on Sunday, 26 July 2026. Take part in an important discussion on the memory of July, diaspora responsibility and the diaspora’s role in Bangladesh’s future. 2:30 pm German time · Bilker Str. 29, 40213 Düsseldorf.',
    '‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন হাসনাত আব্দুল্লাহ': 'Hasnat Abdullah to join Rokte July online',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন হাসনাত আব্দুল্লাহ (মুখ্য সংগঠক (দক্ষিণাঞ্চল), জাতীয় নাগরিক পার্টি (NCP); ২৬ জুলাই ২০২৬, রবিবার)। প্রবাস থেকে জুলাইয়ের স্মৃতি, দায়বদ্ধতা এবং আগামীর বাংলাদেশে প্রবাসীদের ভূমিকা নিয়ে গুরুত্বপূর্ণ আলোচনায় আপনিও অংশ নিন। বিকাল ২টা ৩০…': 'Hasnat Abdullah, chief organiser (southern region) of the National Citizen Party, will join Rokte July online on Sunday, 26 July 2026. Join the discussion on the memory of July, diaspora responsibility and the diaspora’s role in Bangladesh’s future. 2:30 pm…',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন হাসনাত আব্দুল্লাহ (মুখ্য সংগঠক (দক্ষিণাঞ্চল), জাতীয় নাগরিক পার্টি (NCP); ২৬ জুলাই ২০২৬, রবিবার)। প্রবাস থেকে জুলাইয়ের স্মৃতি, দায়বদ্ধতা এবং আগামীর বাংলাদেশে প্রবাসীদের ভূমিকা নিয়ে গুরুত্বপূর্ণ আলোচনায় আপনিও অংশ নিন। বিকাল ২টা ৩০ মিনিট—জার্মান সময় · Bilker Str. 29, 40213 Düsseldorf।': 'Hasnat Abdullah, chief organiser (southern region) of the National Citizen Party, will join Rokte July online on Sunday, 26 July 2026. Join the discussion on the memory of July, diaspora responsibility and the diaspora’s role in Bangladesh’s future. 2:30 pm German time · Bilker Str. 29, 40213 Düsseldorf.',
    '১৯ জুলাই ২০২৪ | ঐতিহাসিক ৯ দফা ঘোষণা': '19 July 2024 | The historic nine-point declaration',
    'আয়োজন': 'Event',
    'একদিকে চলছিল সমন্বয়কদের গুম, গ্রেপ্তার, দমন-পীড়ন ও খুন; অন্যদিকে আন্দোলনকে ভিন্ন খাতে প্রবাহিত করার নানা ষড়যন্ত্র। এমন এক সংকটময় মুহূর্তে বৈষম্যবিরোধী ছাত্র আন্দোলনের অন্যতম সমন্বয়ক আব্দুল কাদের জাতির সামনে ঘোষণা করেন ঐতিহাসিক ৯ দফা। এই ৯ দফা আন্দোলনকে নতুন রাজনৈতিক লক্ষ্য ও সুস্পষ্ট দিকনির্দেশনা দেয়।': 'While coordinators faced enforced disappearance, arrest, repression and killing, attempts were also being made to divert the movement. At that critical moment, Abdul Kader, a coordinator of Students Against Discrimination, presented the historic nine-point declaration, giving the movement a new political objective and clear direction.',
    '২০ জুলাই ২০২৪ নাহিদ ইসলামকে গুম ও নির্যাতনের স্মারক': 'Remembering the disappearance and torture of Nahid Islam on 20 July 2024',
    'জুলাই': 'July',
    '২০ জুলাই ২০২৪: নাহিদ ইসলামকে গুম ও নির্যাতনের স্মৃতি': '20 July 2024: Remembering the disappearance and torture of Nahid Islam',
    '২০ জুলাই ২০২৪ আন্দোলন প্রত্যাহারের জন্য বৈষম্যবিরোধী ছাত্র আন্দোলনের তৎকালীন সমন্বয়ক নাহিদ ইসলামকে তুলে নিয়ে নির্যাতন করা হয়েছিল। পোস্টটিতে তাঁর সেই অভিজ্ঞতা এবং আন্দোলন চালিয়ে যাওয়ার দৃঢ়তা স্মরণ করা হয়েছে।': 'On 20 July 2024, Nahid Islam, then a coordinator of Students Against Discrimination, was abducted and tortured in an attempt to force the movement’s withdrawal. The post recalls that experience and his resolve to continue the movement.',
    'রক্তে জুলাই অনুষ্ঠানে অনলাইনে যুক্ত হওয়ার জন্য সারোয়ার তুষারের অতিথি ঘোষণা': 'Guest announcement for Sarwar Tusher’s online participation in Rokte July',
    '‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন সারোয়ার তুষার': 'Sarwar Tusher to join Rokte July online',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন জাতীয় নাগরিক পার্টির যুগ্ম আহ্বায়ক সারোয়ার তুষার। অনুষ্ঠানটি ২৬ জুলাই ২০২৬, রবিবার বিকাল ২টা ৩০ মিনিটে Bilker Str. 29, 40213 Düsseldorf-এ অনুষ্ঠিত হবে; নিবন্ধন বাধ্যতামূলক।': 'Sarwar Tusher, joint convenor of the National Citizen Party, will join Rokte July online. The event commemorating the July Uprising 2024 will take place on Sunday, 26 July 2026 at 2:30 pm at Bilker Str. 29, 40213 Düsseldorf; registration is required.',
    'প্রবাসী ভোটের ব্যালট, সংযোগ ও ডেটা প্রবাহের মৌলিক ইলাস্ট্রেশন': 'Original illustration of diaspora ballots, connections and data flows',
    'প্রবাসী ভোট': 'Diaspora vote',
    'ডেটা ডেস্ক': 'Data desk',
    '১৪ জুলাই ২০২৬': '14 July 2026',
    'শেষ নির্বাচনে প্রবাসী ভোট: সংখ্যাগুলো কী বলছে': 'Diaspora voting in the last election: what the numbers tell us',
    '২০২৬ সালের নির্বাচনে পোস্টাল ব্যালট প্রথমবারের মতো প্রবাসী ভোটকে দৃশ্যমান করেছে। নিবন্ধন, ব্যালট ফেরত ও গণনার ডেটা দেখায়—প্রবাসী ভোট এখন বাস্তব রাজনৈতিক শক্তি।': 'Postal ballots made the diaspora vote visible for the first time in the 2026 election. Data on registration, returned ballots and counting show that diaspora voting is now a tangible political force.',
    'প্রবাসী কণ্ঠস্বর ও ভোটের প্রভাব বোঝানো মৌলিক ডেটা ইলাস্ট্রেশন': 'Original data illustration of diaspora voices and electoral impact',
    'নির্বাচনী সমীকরণ': 'Electoral dynamics',
    'প্রবাসী ভোট কীভাবে নির্বাচনের সমীকরণ বদলাতে পারে': 'How diaspora votes can change electoral outcomes',
    'প্রবাসী ভোট শুধু প্রতীকী নয়। ২০২৬ সালের কিছু আসনে পোস্টাল ভোটের ব্যবধান বিজয়-পরাজয়ের ব্যবধানের চেয়েও বড় ছিল।': 'Diaspora voting is more than symbolic. In several constituencies in 2026, the postal-vote margin was larger than the margin between victory and defeat.',
    'জার্মানি ও বাংলাদেশকে জ্ঞান, দক্ষতা ও নেতৃত্বের সেতুতে যুক্ত করা মৌলিক ইলাস্ট্রেশন': 'Original illustration connecting Germany and Bangladesh through knowledge, skills and leadership',
    'জার্মানি ডায়াস্পোরা': 'Germany diaspora',
    'জার্মানি প্রবাসীরা বাংলাদেশের কোন খাতে বাস্তব অবদান রাখতে পারেন': 'Where Bangladeshis in Germany can make a practical contribution',
    'রেমিট্যান্সের বাইরে জার্মানি প্রবাসীদের বড় শক্তি হলো দক্ষতা, নেটওয়ার্ক, প্রযুক্তি, পেশাগত মান ও প্রতিষ্ঠান গঠনের অভিজ্ঞতা।': 'Beyond remittances, the greatest strengths of Bangladeshis in Germany are their skills, networks, technology, professional standards and experience of building institutions.',
    'বাংলাদেশ থেকে জার্মানিতে দক্ষতা, শিক্ষা ও কর্মপথের মৌলিক ইলাস্ট্রেশন': 'Original illustration of skills, education and employment pathways from Bangladesh to Germany',
    'জার্মানি যাওয়ার পথ': 'Pathways to Germany',
    'বাংলাদেশ থেকে জার্মানি: পড়াশোনা, কাজ ও দক্ষ অভিবাসনের বৈধ পথ': 'Bangladesh to Germany: legal pathways for study, work and skilled migration',
    'জার্মানিতে আসার পথ আছে, কিন্তু প্রতিটি পথের শর্ত আলাদা। শিক্ষার্থী, দক্ষ কর্মী, Blue Card, Opportunity Card ও vocational training—সব ক্ষেত্রেই অফিসিয়াল নির্দেশনা অনুসরণ জরুরি।': 'There are several pathways to Germany, each with different requirements. Whether for students, skilled workers, the EU Blue Card, the Opportunity Card or vocational training, official guidance is essential.',
    'রেমিট্যান্স থেকে বিনিয়োগে রূপান্তরের চার্টধর্মী মৌলিক ইলাস্ট্রেশন': 'Original chart-style illustration of converting remittances into investment',
    'রেমিট্যান্স ও বিনিয়োগ': 'Remittances & investment',
    'রেমিট্যান্স থেকে বিনিয়োগ: প্রবাসী অর্থনীতির ডেটা-চিত্র': 'From remittances to investment: a data view of the diaspora economy',
    'রেমিট্যান্স বাংলাদেশের অর্থনীতির বড় শক্তি। কিন্তু দীর্ঘমেয়াদি প্রভাবের জন্য প্রবাসী অর্থকে দক্ষতা, উদ্যোগ, প্রযুক্তি ও উৎপাদনশীল বিনিয়োগের সঙ্গে যুক্ত করতে হবে।': 'Remittances are a major strength of Bangladesh’s economy. For lasting impact, diaspora capital must be connected with skills, entrepreneurship, technology and productive investment.',
    'বাংলাদেশ থেকে জার্মানিতে দক্ষতা করিডর বোঝানো মৌলিক ইলাস্ট্রেশন': 'Original illustration of a skills corridor from Bangladesh to Germany',
    'স্কিল করিডর': 'Skills corridor',
    'জার্মানি–বাংলাদেশ স্কিল করিডর: ভাষা, স্বীকৃতি ও কর্মদক্ষতার রোডম্যাপ': 'Germany–Bangladesh skills corridor: a roadmap for language, recognition and employability',
    'জার্মানির skilled immigration framework বাংলাদেশের তরুণদের জন্য সুযোগ তৈরি করছে, কিন্তু ভাষা, qualification recognition ও বাস্তব দক্ষতা ছাড়া সেই সুযোগ কাজে লাগানো কঠিন।': 'Germany’s skilled-immigration framework creates opportunities for young people from Bangladesh, but those opportunities are difficult to realise without language skills, qualification recognition and practical competence.',
    'জামায়াত-এনসিপির জোট নিয়ে যা বললেন আসিফ মাহমুদ': 'What Asif Mahmud said about a Jamaat–NCP alliance',
    'আমাদের Akhter Hossen 🫡': 'Akhter Hossen, one of our own 🫡',
    'বাংলাদেশের বর্তমান অবস্থা..': 'Bangladesh today',
    'জার্মানিতে NCP-এর কার্যক্রম ও প্রতিনিধিত্ব নিয়ে ভিডিও': 'Video on NCP activities and representation in Germany',
    'জার্মানির একটি গুরুত্বপূর্ণ কর্মসূচিতে অংশগ্রহণ, NCP-এর রাজনৈতিক স্বাতন্ত্র্য এবং NCP Diaspora Alliance Germany-এর প্রতিনিধিত্ব নিয়ে ভিডিওটি প্রকাশ করা হয়েছে।': 'This video covers participation in an important programme in Germany, the NCP’s distinctive political approach and the representation of NCP Diaspora Alliance Germany.',
    'NCP এর তরুণ নেতা-তাহসিন রিয়াজের সামনে বিএনপিপন্থী সাংবাদিকরাও ধরাশায়ী হয়🔥': 'Even pro-BNP journalists were left without an answer before young NCP leader Tahsin Riaz 🔥',
    'গণঅভ্যুত্থানের মহানায়ক কে?': 'Who is the leading figure of the mass uprising?',
    '৫ আগস্ট হাসিনা পালিয়ে গেলে সেনাবাহিনীর সৈনিকেরা যাকে কাঁধে নিয়ে বিজয় উল্লাস করেছিল তিনিই এই অভ্যুত্থানের মহানায়ক - আমাদের মহানায়ক নাহিদ ইসলাম': 'When Sheikh Hasina fled on 5 August, soldiers lifted Nahid Islam onto their shoulders in celebration. The post presents him as the leading figure of the uprising—our Nahid Islam.',
    'কূটনৈতিক সম্পৃক্ততা': 'Diplomatic engagement',
    'জার্মানিতে কূটনৈতিক ও কমিউনিটি নেটওয়ার্কিংয়ে NCPDA Germany': 'NCPDA Germany in diplomatic and community networking',
    'বাংলাদেশ দূতাবাস, বার্লিন আয়োজিত মহান স্বাধীনতা ও জাতীয় দিবস ২০২৬-এর নেটওয়ার্কিং অনুষ্ঠানে NCP Diaspora Alliance Germany-এর প্রতিনিধিদল কূটনীতিক ও কমিউনিটি নেতাদের সঙ্গে বাংলাদেশের জলবায়ু ঝুঁকি, গণতান্ত্রিক আকাঙ্ক্ষা ও রাষ্ট্র সংস্কার নিয়ে মতবিনিময় করে।': 'At a networking event for Independence and National Day 2026 organised by the Embassy of Bangladesh in Berlin, a delegation from NCP Diaspora Alliance Germany exchanged views with diplomats and community leaders on Bangladesh’s climate risks, democratic aspirations and state reform.',
    'বার্লিনে কূটনীতিক ও কমিউনিটি নেতাদের সঙ্গে NCPDA Germany-এর প্রতিনিধিদল': 'NCPDA Germany delegation with diplomats and community leaders in Berlin',
    'দূতাবাস কার্যক্রম': 'Embassy engagement',
    'বাংলাদেশ দূতাবাস, বার্লিনে জুলাই সনদ ও প্রবাসী ইস্যুতে মতবিনিময়': 'Dialogue at the Bangladesh Embassy in Berlin on the July Charter and diaspora issues',
    'NCP Diaspora Alliance Germany-এর প্রতিনিধিদল বাংলাদেশের রাষ্ট্রদূতের সঙ্গে সৌজন্য সাক্ষাতে গণভোটের জনরায়, জুলাই সনদ বাস্তবায়ন, সংবিধান পরিষদ এবং জার্মানিতে বসবাসরত প্রবাসী বাংলাদেশিদের বিভিন্ন বিষয় নিয়ে মতবিনিময় করে।': 'During a courtesy meeting with Bangladesh’s ambassador, an NCP Diaspora Alliance Germany delegation discussed the referendum mandate, implementation of the July Charter, a constituent assembly and issues affecting Bangladeshis living in Germany.',
    'বাংলাদেশ দূতাবাস বার্লিনে NCP Diaspora Alliance Germany-এর প্রতিনিধিদল': 'NCP Diaspora Alliance Germany delegation at the Bangladesh Embassy in Berlin',
    '২০২৬': '2026',
    'নীতি ও ইশতেহার': 'Policy & manifesto',
    'জাতীয় নাগরিক পার্টির নীতি ও ইশতেহারসংক্রান্ত প্রকাশনা': 'National Citizen Party publications on policy and its manifesto',
    'রাষ্ট্র সংস্কার, অর্থনীতি, শিক্ষা, স্বাস্থ্য, স্থানীয় সরকার ও জাতীয় নিরাপত্তাসহ বিভিন্ন খাতে NCP-এর নীতিগত অবস্থান ও ইশতেহারসংক্রান্ত প্রকাশনা দলটির অফিসিয়াল চ্যানেলে পাওয়া যাবে।': 'The NCP’s official channels publish the party’s policy positions and manifesto materials on state reform, the economy, education, health, local government, national security and other sectors.',
    'জুলাইয়ের চেতনায় দেশ গড়ার অঙ্গীকারের গ্রাফিক': 'Graphic expressing the commitment to build the country in the spirit of July',
    'bdnews24-এর লাইভ আপডেট অনুযায়ী প্রবাসী ভোটাররা ব্যালট কাস্ট করেছেন।': 'Diaspora voters who cast their ballots, according to bdnews24’s live updates.',
    'প্রবাসী ভোটারদের ফেরত পাঠানো ব্যালটের সংখ্যা হিসেবে রিপোর্ট করা হয়েছে।': 'Ballots reported as returned by diaspora voters.',
    'দেশে ও বিদেশে কাস্ট করা মোট পোস্টাল ব্যালট গণনায় অন্তর্ভুক্ত হয়েছে।': 'Postal ballots cast at home and abroad that were included in the count.',
    'The Daily Star-এর EC-ডেটা বিশ্লেষণে পোস্টাল ব্যালট টার্নআউট; সামগ্রিক টার্নআউট ছিল 60%।': 'Postal-ballot turnout in The Daily Star’s analysis of Election Commission data; overall turnout was 60%.',
    '২০২৬ সালের জাতীয় নির্বাচন প্রবাসী ভোটের ইতিহাসে একটি বড় বাঁক। আগে প্রবাসীদের রাজনৈতিক আলোচনা ছিল আবেগ, দাবি ও ন্যায্যতার প্রশ্নে সীমাবদ্ধ; এবার পোস্টাল ব্যালটের মাধ্যমে সেই দাবির একটি পরিমাপযোগ্য রূপ দেখা গেল। নিবন্ধন, ব্যালট পাঠানো, ব্যালট ফেরত আসা এবং গণনায় অন্তর্ভুক্ত হওয়ার প্রতিটি ধাপ ভবিষ্যতের জন্য গুরুত্বপূর্ণ শিক্ষা রেখে গেছে।': 'The 2026 national election marked a turning point in the history of diaspora voting. Political discussion among Bangladeshis abroad had previously centred on identity, demands and fairness; postal voting now gave that demand a measurable form. Every stage—from registration and ballot dispatch to return and inclusion in the count—offers important lessons for future elections.',
    'নির্বাচনের আগেই BSS জানিয়েছিল, বিদেশে নিবন্ধিত ভোটারদের জন্য 766,862 ব্যালট পাঠানো হয়েছিল এবং 480,416 প্রবাসী তখন পর্যন্ত ভোট দিয়েছিলেন। নির্বাচনী রাতে bdnews24 জানায়, 544,380 প্রবাসী ভোটার ব্যালট কাস্ট করেছেন এবং 538,370 ব্যালট সংশ্লিষ্ট দেশের পোস্ট অফিস বা মেইলবক্সে ফেরত গেছে। এই সংখ্যা প্রমাণ করে, সুযোগ পেলে প্রবাসীরা শুধু মতামত দেন না, তারা ভোটের প্রক্রিয়ায়ও অংশ নেন।': 'Before the election, BSS reported that 766,862 ballots had been sent to registered voters abroad and that 480,416 diaspora voters had already voted. On election night, bdnews24 reported that 544,380 diaspora voters had cast ballots and 538,370 ballots had been returned through post offices or mailboxes in their respective countries. The figures show that, when given the opportunity, Bangladeshis abroad do more than voice opinions—they participate in the electoral process.',
    'এখানে সবচেয়ে বড় শিক্ষা হলো সংগঠন ও তথ্যের গুরুত্ব। যেসব ভোটার সময়মতো নিবন্ধন, ঠিকানা যাচাই, ব্যালট গ্রহণ এবং ফেরত পাঠানোর প্রক্রিয়া বুঝেছেন, তারাই শেষ পর্যন্ত ভোট দিতে পেরেছেন। তাই প্রবাসী ভোটাধিকার শুধু আইন বা অ্যাপের বিষয় নয়; এটি কমিউনিটি-ভিত্তিক ভোটার শিক্ষা, ভাষা সহায়তা ও আস্থার বিষয়।': 'The clearest lesson is the importance of organisation and reliable information. Voters who understood registration, address verification, ballot receipt and return in time were the ones able to complete the process. Diaspora voting rights therefore depend on more than legislation or an app; they also require community-based voter education, language support and trust.',
    'জার্মানি প্রবাসীদের জন্য এর অর্থ স্পষ্ট: ভবিষ্যৎ নির্বাচনের আগে শহরভিত্তিক ভোটার সহায়তা, তথ্য সেশন, নিবন্ধন-গাইড, ভাষান্তরিত নির্দেশিকা এবং দূতাবাস/নির্বাচন কমিশনের অফিসিয়াল লিংক প্রচার করা জরুরি। ভুল তথ্যের বদলে যাচাই করা তথ্য ছড়ানোই হবে সবচেয়ে বড় নাগরিক সেবা।': 'For Bangladeshis in Germany, the implications are clear: ahead of future elections, communities need city-based voter support, information sessions, registration guides, translated instructions and wide circulation of official embassy and Election Commission links. Replacing misinformation with verified guidance will be one of the most valuable civic services the diaspora can provide.',
    'এই নির্বাচনের প্রবাসী ভোট দেখিয়েছে—বাংলাদেশের গণতন্ত্র এখন ভৌগোলিক সীমানার বাইরে ছড়িয়ে পড়েছে। প্রবাসীরা যদি সংগঠিত, তথ্যভিত্তিক এবং সময়মতো অংশ নেন, তাহলে তারা শুধু অর্থনীতির নয়, রাজনৈতিক জবাবদিহিরও একটি গুরুত্বপূর্ণ শক্তি হয়ে উঠতে পারেন।': 'Diaspora participation in this election showed that Bangladesh’s democracy now extends beyond its geographic borders. When Bangladeshis abroad participate in an organised, informed and timely way, they can become a powerful force not only in the economy but also for political accountability.',
    'Madaripur-1 আসনে জয়ের ব্যবধান; পোস্টাল ব্যালটে বিজয়ীর লিড ছিল 1,165।': 'Winning margin in Madaripur-1; the winner led the postal ballot by 1,165 votes.',
    'Sirajganj-4 আসনে জয়ের ব্যবধান; পোস্টাল ব্যালটে বিজয়ীর লিড ছিল 1,377।': 'Winning margin in Sirajganj-4; the winner led the postal ballot by 1,377 votes.',
    'The Daily Star অনুযায়ী পোস্টাল ব্যালটে Jamaat-এর ভোট শেয়ার।': 'Jamaat’s share of the postal vote, according to The Daily Star.',
    'পোস্টাল ব্যালটে NCP-এর ভোট শেয়ার; নিয়মিত কেন্দ্রে ছিল 3.05%।': 'NCP’s share of the postal vote; its share at regular polling stations was 3.05%.',
    'বাংলাদেশের সংসদীয় নির্বাচন একক আসনভিত্তিক হওয়ায় অল্প ভোটের ব্যবধানও বড় ফল তৈরি করতে পারে। প্রবাসী ভোট যদি কোনো অঞ্চলে ঘনীভূত হয়—যেমন একটি জেলার বড় সংখ্যক মানুষ ইউরোপ বা মধ্যপ্রাচ্যে থাকেন—তাহলে সেই ভোট স্থানীয় ফলাফলে সরাসরি প্রভাব ফেলতে পারে।': 'Because Bangladesh’s parliamentary elections are decided constituency by constituency, even a small number of votes can produce a major result. If diaspora voters are concentrated in a particular area—for example, where many people from one district live in Europe or the Middle East—their votes can directly influence the local outcome.',
    'The Daily Star-এর EC-ডেটা-ভিত্তিক প্রতিবেদনে দেখা যায়, Madaripur-1 আসনে জয়ের ব্যবধান ছিল মাত্র 385 ভোট। ওই আসনে বিজয়ী প্রার্থী পোস্টাল ব্যালটে প্রতিদ্বন্দ্বীর চেয়ে 1,165 ভোটে এগিয়ে ছিলেন। Sirajganj-4 আসনেও জয়ের ব্যবধান ছিল 594 ভোট, আর পোস্টাল ব্যালটে বিজয়ীর লিড ছিল 1,377। অর্থাৎ কিছু আসনে পোস্টাল ভোট ফলাফলের ভারসাম্য বদলে দেওয়ার মতো ছিল।': 'The Daily Star’s analysis of Election Commission data found that the winning margin in Madaripur-1 was only 385 votes, while the winning candidate led the postal ballot by 1,165. In Sirajganj-4, the overall winning margin was 594 votes and the postal-ballot lead was 1,377. In other words, postal voting was large enough to alter the balance of the result in some constituencies.',
    'জাতীয় পর্যায়েও পোস্টাল ব্যালট আলাদা রাজনৈতিক বার্তা দিয়েছে। একই প্রতিবেদনে বলা হয়েছে, BNP নিয়মিত কেন্দ্রে 49.97% ভোট পেলেও পোস্টাল ব্যালটে পেয়েছে 31.55%; Jamaat নিয়মিত কেন্দ্রে 31.76% হলেও পোস্টাল ব্যালটে 47.81%; আর NCP নিয়মিত কেন্দ্রে 3.05% হলেও পোস্টাল ব্যালটে 5.17%। এই পার্থক্য দেখায়, প্রবাসী ও পোস্টাল ভোটারদের রাজনৈতিক আচরণ দেশে থাকা ভোটারদের সঙ্গে এক নয়।': 'Postal ballots also sent a distinct political signal nationally. The same report found that the BNP received 49.97% at regular polling stations but 31.55% of postal ballots; Jamaat received 31.76% at regular stations but 47.81% by post; and the NCP received 3.05% at regular stations compared with 5.17% of postal ballots. These differences show that diaspora and postal voters do not necessarily vote in the same way as voters inside Bangladesh.',
    'এখানে জার্মানি প্রবাসীদের জন্য শিক্ষাটি গুরুত্বপূর্ণ। শুধু ভোট দেওয়া নয়, কোন আসনে কত প্রবাসী ভোটার আছে, তারা কোন ইস্যুতে সাড়া দেন, কোন ভাষায় তথ্য চান, এবং কীভাবে নিরাপদে ভোট ফেরত পাঠাবেন—এসব নিয়ে আগে থেকে ডেটা-ভিত্তিক কাজ করতে হবে।': 'The lesson for Bangladeshis in Germany is important. Work must begin well in advance—not only on casting a vote, but on understanding how many diaspora voters are linked to each constituency, which issues matter to them, which languages they need information in and how they can return ballots securely.',
    'প্রবাসী ভোটের শক্তি দলীয় প্রচারণার বাইরে একটি নাগরিক প্রশ্নও তৈরি করে: বাংলাদেশের রাজনীতি কি প্রবাসীদের বাস্তব সমস্যা শুনছে? পাসপোর্ট, দূতাবাস সেবা, বিমানবন্দর অভিজ্ঞতা, রেমিট্যান্স খরচ, বিনিয়োগ নিরাপত্তা এবং পরিবারের সামাজিক সুরক্ষা—এই প্রশ্নগুলো যারা গুরুত্ব দেবে, ভবিষ্যতে প্রবাসী ভোট তাদের প্রতি বেশি সাড়া দিতে পারে।': 'The influence of diaspora voting also raises a civic question beyond party campaigns: is Bangladeshi politics listening to the real concerns of its citizens abroad? Future diaspora voters may respond most strongly to those who take passports, embassy services, airport treatment, remittance costs, investment security and families’ social protection seriously.',
    '2025 সালের শেষে জার্মানিতে নিবন্ধিত বিদেশি নাগরিকের সংখ্যা, Destatis অনুযায়ী।': 'Foreign nationals registered in Germany at the end of 2025, according to Destatis.',
    'জার্মানির বিদেশি নাগরিকদের মধ্যে এশিয়া-উৎপত্তি/এশীয় নাগরিকত্বের মোট সংখ্যা।': 'Foreign nationals in Germany with Asian nationality or origin.',
    'World Bank ডেটায় 2025 সালে বাংলাদেশের ব্যক্তিগত রেমিট্যান্স গ্রহণ।': 'Personal remittances received by Bangladesh in 2025, according to World Bank data.',
    'জার্মান দূতাবাস দক্ষ কর্মীদের সম্ভাবনাময় খাত হিসেবে IT, care ও skilled crafts উল্লেখ করেছে।': 'The German Embassy identifies IT, care and skilled crafts as promising sectors for skilled workers.',
    'জার্মানি প্রবাসীদের অবদানকে শুধু টাকা পাঠানোর মধ্যে সীমাবদ্ধ রাখলে বড় সম্ভাবনা হারিয়ে যায়। জার্মানির কর্মসংস্কৃতি, কারিগরি শিক্ষা, গবেষণা, স্বাস্থ্যসেবা, শিল্প উৎপাদন, পরিবেশ নীতি, স্থানীয় সরকার এবং সামাজিক সংগঠনের অভিজ্ঞতা বাংলাদেশের জন্য বাস্তব সম্পদ হতে পারে।': 'Limiting the contribution of Bangladeshis in Germany to money transfers overlooks a much larger opportunity. Their experience of German workplace culture, vocational education, research, healthcare, industrial production, environmental policy, local government and civil society can be a practical asset for Bangladesh.',
    'অর্থনীতির দিক থেকে প্রবাসীদের গুরুত্ব স্পষ্ট। World Bank-এর ডেটায় 2025 সালে বাংলাদেশে ব্যক্তিগত রেমিট্যান্স এসেছে প্রায় 33.88 বিলিয়ন ডলার। কিন্তু রেমিট্যান্সের পরের ধাপ হলো উৎপাদনশীল বিনিয়োগ: দক্ষতা প্রশিক্ষণ, স্টার্টআপ, স্বাস্থ্যসেবা, কৃষি-প্রযুক্তি, নবায়নযোগ্য জ্বালানি, ডিজিটাল সেবা এবং স্থানীয় কর্মসংস্থান।': 'The economic importance of the diaspora is clear. World Bank data put personal remittances to Bangladesh at about USD 33.88 billion in 2025. The next step, however, is productive investment: skills training, start-ups, healthcare, agricultural technology, renewable energy, digital services and local employment.',
    'জার্মানির অভিজ্ঞতা বিশেষভাবে মূল্যবান তিনটি ক্ষেত্রে: কারিগরি ও ভোকেশনাল ট্রেনিং, স্বাস্থ্য ও কেয়ার সেক্টর, এবং IT/ইঞ্জিনিয়ারিং। জার্মান দূতাবাস নিজেই IT, care এবং skilled crafts-কে সম্ভাবনাময় খাত হিসেবে তুলে ধরে। জার্মানি প্রবাসীরা বাংলাদেশের তরুণদের ভাষা, দক্ষতা, সার্টিফিকেশন ও কর্মসংস্থান-প্রস্তুতিতে মেন্টরশিপ দিতে পারেন।': 'German experience is especially valuable in three areas: technical and vocational training, health and care, and IT and engineering. The German Embassy itself highlights IT, care and skilled crafts as promising sectors. Bangladeshis in Germany can mentor young people in Bangladesh on language, skills, certification and preparation for employment.',
    'আরেকটি বড় ক্ষেত্র হলো প্রতিষ্ঠান গঠন। প্রবাসীরা যদি বিশ্ববিদ্যালয়, হাসপাতাল, ট্রেনিং সেন্টার, পৌরসভা, চেম্বার, স্টার্টআপ এবং সামাজিক সংগঠনের সঙ্গে নির্দিষ্ট প্রকল্পে যুক্ত হন, তাহলে ব্যক্তিগত অনুদানের বদলে দীর্ঘমেয়াদি ফল তৈরি হবে। উদাহরণ: নার্সিং ভাষা প্রস্তুতি, সফটওয়্যার মেন্টরশিপ, জার্মান-স্টাইল অ্যাপ্রেন্টিসশিপ, সিটি-টু-সিটি সহযোগিতা।': 'Institution building is another major area. When diaspora professionals work with universities, hospitals, training centres, municipalities, chambers of commerce, start-ups and civil-society organisations on defined projects, they can create lasting results beyond individual donations. Examples include language preparation for nurses, software mentoring, German-style apprenticeships and city-to-city cooperation.',
    'জার্মানি ডায়াস্পোরার সবচেয়ে বড় ভূমিকা হতে পারে ‘নেটওয়ার্ক আর্কিটেক্ট’ হওয়া—যারা বাংলাদেশি তরুণ, জার্মান প্রতিষ্ঠান, বাংলাদেশি নীতিনির্ধারক এবং প্রবাসী পেশাজীবীদের একই টেবিলে আনবে। এতে প্রবাসী শক্তি আবেগ থেকে বাস্তব উন্নয়ন-পরিকল্পনায় রূপ নেবে।': 'The German diaspora’s most valuable role may be to act as a “network architect”—bringing young Bangladeshis, German institutions, Bangladeshi policymakers and diaspora professionals to the same table. That can turn diaspora commitment into practical development planning.',
    'জার্মান দূতাবাসের স্ট্যান্ডার্ড প্রসেসিং টাইম: student visa।': 'Standard processing time stated by the German Embassy for a student visa.',
    'Blue Card বা pre-approval সহ employment-এর নির্দেশিত প্রসেসিং টাইম।': 'Indicative processing time for employment with an EU Blue Card or pre-approval.',
    'Opportunity Card-এর নির্দেশিত প্রসেসিং টাইম।': 'Indicative processing time for the Opportunity Card.',
    '2026 Blue Card salary threshold: shortage/new entrant এবং regular occupation।': '2026 EU Blue Card salary thresholds for shortage/new-entrant and regular occupations.',
    'বাংলাদেশ থেকে জার্মানিতে আসার বৈধ পথগুলোকে এক কথায় বোঝা যায় না। কারও জন্য সেরা পথ উচ্চশিক্ষা, কারও জন্য vocational training, কারও জন্য skilled worker visa, কারও জন্য EU Blue Card, আর কারও জন্য Opportunity Card। তাই প্রথম কাজ হলো নিজের প্রোফাইল—শিক্ষা, ভাষা, অভিজ্ঞতা, পেশা ও অর্থনৈতিক প্রস্তুতি—সৎভাবে মূল্যায়ন করা।': 'There is no single legal route from Bangladesh to Germany. Higher education may be right for one person, vocational training for another, while others may qualify for a skilled-worker visa, an EU Blue Card or the Opportunity Card. The first step is therefore an honest assessment of one’s education, language ability, experience, profession and financial readiness.',
    'শিক্ষার্থীদের জন্য জার্মান দূতাবাসের নির্দেশনা অনুযায়ী student visa অনলাইন সিস্টেমের মাধ্যমে আবেদন করা যায়। skilled worker/Blue Card applicants-দের ক্ষেত্রে পূর্ণ ডকুমেন্টেশন, বৈধ পাসপোর্ট, আবেদন ফর্ম, qualification proof, German recognition বা equivalence proof, employer declaration এবং প্রাসঙ্গিক স্বাস্থ্যবিমার নথি দরকার হতে পারে। কোনো আবেদন অসম্পূর্ণ হলে প্রক্রিয়া বিলম্বিত হয়।': 'According to the German Embassy’s guidance, students can apply for a visa through the online system. Skilled-worker and EU Blue Card applicants may need complete documentation, a valid passport, application forms, proof of qualifications and German recognition or equivalence, an employer declaration and appropriate health-insurance documents. Incomplete applications delay the process.',
    '২০২৬ সালের Make it in Germany তথ্য অনুযায়ী EU Blue Card-এর বেতন সীমা shortage occupation ও নতুন গ্র্যাজুয়েটদের জন্য €45,934.20 এবং অন্যান্য পেশার জন্য €50,700। IT specialists-দের ক্ষেত্রে নির্দিষ্ট অভিজ্ঞতা থাকলে বিশ্ববিদ্যালয় ডিগ্রি ছাড়াও কিছু সুযোগ আছে, তবে এটি শর্তসাপেক্ষ এবং অফিসিয়াল নির্দেশনা দেখে এগোতে হবে।': 'According to 2026 information from Make it in Germany, the EU Blue Card salary threshold is €45,934.20 for shortage occupations and new graduates and €50,700 for other occupations. Some IT specialists with the required experience may qualify without a university degree, but this is subject to specific conditions and should be checked against official guidance.',
    'ভিসা প্রক্রিয়ায় বাস্তববাদী হওয়া জরুরি। দূতাবাসের প্রকাশিত স্ট্যান্ডার্ড সময় অনুযায়ী student visa প্রায় 4 সপ্তাহ, Blue Card/pre-approval employment প্রায় 3 সপ্তাহ, general employment 4-6 সপ্তাহ এবং Opportunity Card প্রায় 8 সপ্তাহ লাগতে পারে। এগুলো গ্যারান্টি নয়; সম্পূর্ণ নথি, কেসভেদে যাচাই এবং দূতাবাসের কাজের চাপের ওপর সময় বদলাতে পারে।': 'It is important to be realistic about visa processing. The embassy’s published standard times are around four weeks for a student visa, three weeks for Blue Card or pre-approved employment, four to six weeks for general employment and eight weeks for the Opportunity Card. These are not guarantees; timings vary with document completeness, individual checks and embassy workload.',
    'কমিউনিটি পর্যায়ে জার্মানি প্রবাসীরা এখানে সহায়তা করতে পারেন: ভুল তথ্য কমানো, অফিসিয়াল লিংক শেয়ার করা, ভাষা প্রস্তুতি গাইড করা, CV/মোটিভেশন লেটার রিভিউ, recognition process বোঝানো এবং প্রতারণামূলক এজেন্সি থেকে মানুষকে সতর্ক করা। বৈধ পথ কঠিন হতে পারে, কিন্তু ভুল পথের ক্ষতি অনেক বড়।': 'The community in Germany can help by countering misinformation, sharing official links, guiding language preparation, reviewing CVs and motivation letters, explaining the recognition process and warning people about fraudulent agencies. Legal routes can be demanding, but the cost of taking the wrong route is far greater.',
    'World Bank ডেটায় 2025 সালে বাংলাদেশের personal remittances received।': 'Personal remittances received by Bangladesh in 2025, according to World Bank data.',
    'World Bank ডেটায় 2024 সালের personal remittances received।': 'Personal remittances received by Bangladesh in 2024, according to World Bank data.',
    'BSS/BMET অনুযায়ী 2025 সালের জানুয়ারি-নভেম্বর বিদেশে কর্মসংস্থানে গেছেন।': 'Bangladeshis who took up overseas employment from January to November 2025, according to BSS/BMET.',
    'BSS/BMET অনুযায়ী 2004 সাল থেকে বিদেশে কর্মসংস্থান পাওয়া বাংলাদেশির সংখ্যা।': 'Bangladeshis who have found overseas employment since 2004, according to BSS/BMET.',
    'রেমিট্যান্স বাংলাদেশের পরিবার, বৈদেশিক মুদ্রা, ভোগব্যয় এবং গ্রামীণ অর্থনীতির জন্য অত্যন্ত গুরুত্বপূর্ণ। World Bank-এর ডেটায় 2025 সালে বাংলাদেশে personal remittances received প্রায় 33.88 বিলিয়ন ডলার, যা 2024 সালের প্রায় 27.52 বিলিয়ন ডলারের তুলনায় বড় বৃদ্ধি।': 'Remittances are vital to Bangladeshi households, foreign-exchange reserves, consumption and the rural economy. World Bank data show personal remittances to Bangladesh of about USD 33.88 billion in 2025, a substantial rise from around USD 27.52 billion in 2024.',
    'BSS-এর BMET-ভিত্তিক রিপোর্ট অনুযায়ী 2025 সালের জানুয়ারি থেকে নভেম্বর পর্যন্ত 1,011,882 বাংলাদেশি বিদেশে কর্মসংস্থানে গেছেন। একই রিপোর্টে 2004 সাল থেকে 14,461,546 বাংলাদেশির বিদেশে কর্মসংস্থানের কথা উল্লেখ করা হয়েছে। এই কর্মসংস্থান ও রেমিট্যান্স একসঙ্গে বাংলাদেশের অর্থনীতির একটি বিশাল প্রবাসী ভিত্তি তৈরি করেছে।': 'According to BSS reporting based on BMET data, 1,011,882 Bangladeshis took up overseas employment between January and November 2025. The same report states that 14,461,546 Bangladeshis had found work abroad since 2004. Together, overseas employment and remittances have created an enormous diaspora foundation for Bangladesh’s economy.',
    'কিন্তু রেমিট্যান্সের বড় অংশ যদি শুধু দৈনন্দিন ব্যয়, জমি বা অনুৎপাদনশীল সম্পদে আটকে থাকে, তাহলে দীর্ঘমেয়াদি শিল্প, কর্মসংস্থান ও উদ্ভাবনে তার প্রভাব সীমিত থাকে। প্রয়োজন নিরাপদ ও স্বচ্ছ প্রবাসী বিনিয়োগ পণ্য, ছোট উদ্যোগে co-investment, diaspora bond, skills fund এবং স্থানীয় উদ্যোক্তাদের সঙ্গে জবাবদিহিমূলক অংশীদারিত্ব।': 'If most remittances remain tied to daily expenses, land or unproductive assets, however, their long-term impact on industry, employment and innovation is limited. Bangladesh needs safe and transparent diaspora investment products, co-investment in small businesses, diaspora bonds, skills funds and accountable partnerships with local entrepreneurs.',
    'জার্মানি প্রবাসীরা এখানে আলাদা মূল্য যোগ করতে পারেন। জার্মানির নিয়মভিত্তিক কাজ, অডিট, কোয়ালিটি কন্ট্রোল, apprenticeship, green technology এবং SME ব্যবস্থাপনার অভিজ্ঞতা বাংলাদেশের ছোট-মাঝারি উদ্যোগে প্রয়োগ করা যেতে পারে।': 'Bangladeshis in Germany can add distinctive value here. Experience with rules-based operations, auditing, quality control, apprenticeships, green technology and SME management in Germany can be applied to small and medium-sized enterprises in Bangladesh.',
    'স্লোগান হওয়া উচিত: শুধু টাকা পাঠাবো না, প্রতিষ্ঠান গড়বো। প্রবাসী অর্থ যদি দক্ষতা, প্রযুক্তি, বাজার-সংযোগ ও নৈতিক ব্যবস্থাপনার সঙ্গে যুক্ত হয়, তাহলে রেমিট্যান্স বাংলাদেশের পরবর্তী উন্নয়ন-ধাপের শক্তিশালী ইঞ্জিন হতে পারে।': 'The guiding idea should be: do not only send money—build institutions. When diaspora capital is combined with skills, technology, market access and ethical management, remittances can become a powerful engine for Bangladesh’s next stage of development.',
    'Recognition partnership-এর ক্ষেত্রে সাধারণভাবে জার্মান ভাষার A2 বা সমমানের শর্ত উল্লেখ করা হয়েছে।': 'Recognition partnerships generally require German at A2 level or an equivalent standard.',
    'Qualification measure চলাকালে secondary employment limit 10 থেকে 20 ঘণ্টায় বাড়ানো হয়েছে।': 'The limit on secondary employment during a qualification measure has been raised from 10 to 20 hours.',
    'Recognition-related residence প্রথমে 24 মাস, পরে 12 মাস পর্যন্ত বাড়তে পারে।': 'Residence for qualification recognition is initially granted for 24 months and may be extended by up to 12 months.',
    'জার্মান দূতাবাসের ভাষায় বিশেষ সম্ভাবনাময় দক্ষতার ক্ষেত্র।': 'Skills areas described by the German Embassy as particularly promising.',
    'বাংলাদেশের তরুণদের জন্য জার্মানি একটি বড় সুযোগ, কিন্তু সুযোগ মানেই সহজ পথ নয়। জার্মান শ্রমবাজার দক্ষতা, ভাষা, নথি, স্বীকৃতি এবং পেশাগত শৃঙ্খলা চায়। তাই জার্মানি–বাংলাদেশ স্কিল করিডর গড়তে হলে শুধু ভিসা তথ্য নয়, পূর্ণ প্রস্তুতি-ব্যবস্থা দরকার।': 'Germany offers significant opportunities for young Bangladeshis, but opportunity does not mean an easy route. The German labour market expects skills, language ability, documentation, recognition and professional discipline. A Germany–Bangladesh skills corridor therefore requires a complete preparation system, not visa information alone.',
    'Make it in Germany-এর তথ্য অনুযায়ী নতুন Skilled Immigration Act vocational training, practical knowledge, recognition partnership, Opportunity Card এবং EU Blue Card-এর মতো পথগুলোকে বিস্তৃত করেছে। Recognition partnership-এর ক্ষেত্রে চাকরির চুক্তি, যোগ্যতার ভিত্তি এবং সাধারণভাবে A2 স্তরের জার্মান ভাষার শর্ত গুরুত্বপূর্ণ।': 'According to Make it in Germany, the new Skilled Immigration Act has broadened routes including vocational training, practical professional knowledge, recognition partnerships, the Opportunity Card and the EU Blue Card. For a recognition partnership, an employment contract, an appropriate qualification and generally A2-level German are important requirements.',
    'এখানে জার্মানি প্রবাসীরা খুব বাস্তব ভূমিকা রাখতে পারেন। তারা বাংলাদেশে language bootcamp, nursing/care orientation, IT portfolio review, Ausbildung readiness, CV clinic, interview practice এবং German workplace culture training চালু করতে পারেন। এতে migration হবে নিরাপদ, দক্ষতাভিত্তিক এবং কম খরচে।': 'Bangladeshis in Germany can play a very practical role by supporting language boot camps, nursing and care orientation, IT portfolio reviews, Ausbildung readiness, CV clinics, interview practice and German workplace-culture training in Bangladesh. This can make migration safer, more skills-based and less costly.',
    'বাংলাদেশের প্রতিষ্ঠানগুলোরও করণীয় আছে। ভোকেশনাল ট্রেনিং সেন্টারকে জার্মান occupational standard-এর সঙ্গে মিলিয়ে কোর্স বানাতে হবে, নার্সিং ও কেয়ার সেক্টরে ভাষা ও clinical skill জোরদার করতে হবে, IT সেক্টরে portfolio ও practical project-based assessment চালু করতে হবে।': 'Institutions in Bangladesh also have work to do. Vocational centres should align courses with German occupational standards; nursing and care programmes should strengthen language and clinical skills; and the IT sector should adopt portfolio and practical project-based assessment.',
    'স্কিল করিডর সফল হলে লাভ দুই দিকেই: জার্মানি পাবে প্রস্তুত দক্ষ কর্মী, বাংলাদেশ পাবে উচ্চমানের রেমিট্যান্স, জ্ঞান, প্রযুক্তি ও ভবিষ্যৎ বিনিয়োগকারী। এটি শুধু অভিবাসন নয়; এটি মানবসম্পদ উন্নয়নের দীর্ঘমেয়াদি কৌশল।': 'A successful skills corridor benefits both countries: Germany gains well-prepared skilled workers, while Bangladesh gains higher-value remittances, knowledge, technology and future investors. This is more than migration; it is a long-term human-capital strategy.',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    'ফর্মের তথ্য কেবল সদস্যপদ যাচাই ও সাংগঠনিক যোগাযোগে ব্যবহৃত হবে। সাবমিশন FormSubmit-এর মাধ্যমে আমাদের ইমেইলে পৌঁছায়; তাদের নীতিমালা অনুযায়ী সাবমিশন সর্বোচ্চ ৩০ দিন আর্কাইভে থাকতে পারে। তথ্য সংশোধন বা মুছে দেওয়ার অনুরোধ ইমেইলে জানাতে পারবেন।': 'Form data is used only for membership verification and organisational communication. FormSubmit delivers submissions to our email and may retain them for up to 30 days under its policy. You may request correction or deletion of your data by email.',
    'অনুগ্রহ করে সব আবশ্যিক তথ্য পূরণ করুন এবং তথ্য ব্যবহারের সম্মতিটি নিশ্চিত করুন।': 'Please complete all required fields and confirm your consent to data processing.',
    '✅ ধন্যবাদ! আপনার নিবন্ধন সফল হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।': '✅ Thank you! Your registration was successful. We will contact you shortly.',
    '❌ কিছু একটা ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি ইমেইল করুন: ncpdiasporade@gmail.com': '❌ Something went wrong. Please try again or email us directly at ncpdiasporade@gmail.com.',
  };

  const de = {
    'Germany · জার্মানি': 'Deutschland',
    'কর্মসূচি': 'Programme',
    'কর্মসূচি ও আয়োজন': 'Programme & Veranstaltungen',
    'জুলাই ২০২৪': 'Juli 2024',
    'আমাদের সম্পর্কে': 'Über uns',
    'সর্বশেষ': 'Aktuelles',
    'সর্বশেষ আপডেট': 'Aktuelle Meldungen',
    'সদস্যপদ': 'Mitgliedschaft',
    'আমাদের জানুন': 'Über uns',
    'সদস্য হোন': 'Mitglied werden',
    'লক্ষ্য ও আদর্শ': 'Ziele & Grundsätze',
    'ব্লগ': 'Blog',
    'কেন যুক্ত হবেন': 'Warum mitmachen',
    'জুলাই ২০২৪ গণঅভ্যুত্থানের চেতনায়': 'Inspiriert vom Geist des Juli-Aufstands 2024',
    'জুলাইয়ের রক্তে': 'Für die Opfer des Juli',
    'নতুন বাংলাদেশ': 'ein neues Bangladesch',
    'গড়ার প্রতিশ্রুতি': 'bauen wir gemeinsam',
    'বিশ্বের প্রথম সফল জেন-জি বিপ্লবের পর নতুন বাংলাদেশ গড়ার অঙ্গীকারে অনুপ্রাণিত হয়ে জার্মানির বাংলাদেশি প্রবাসীরা আজ ঐক্যবদ্ধ—সংস্কার, গণতন্ত্র ও প্রবাসী অধিকারের সংগ্রামকে আরও শক্তিশালী, সুসংগঠিত ও ফলপ্রসূ করে তুলতে।': 'Inspiriert vom Ziel, nach dem weltweit ersten erfolgreichen von der Generation Z getragenen Aufstand ein neues Bangladesch aufzubauen, schließen sich Bangladeschstämmige in Deutschland zusammen, um den Einsatz für Reformen, Demokratie und Diaspora-Rechte zu stärken, besser zu organisieren und wirksamer zu machen.',
    'এখনই সদস্য হোন': 'Jetzt mitmachen',
    'আমাদের জানুন →': 'Über uns →',
    '২০২৪': '2024',
    'মুক্তিযুদ্ধের পর দ্বিতীয় সফল গণঅভ্যুত্থান — ৫ আগস্ট ২০২৪': 'Der zweite erfolgreiche Volksaufstand seit dem Befreiungskrieg — 5. August 2024',
    'বাংলাদেশের প্রথম ছাত্রনেতৃত্বাধীন রাজনৈতিক দল (২৮ ফেব্রু ২০২৫)': 'Bangladeschs erste studentisch geführte politische Partei (28. Februar 2025)',
    '~১.৫ কোটি': '~15 Millionen',
    'প্রবাসী বাংলাদেশি — যারা প্রথমবারের মতো জাতীয় নির্বাচনে ভোট প্রদান করে ইতিহাস সৃষ্টি করেছেন': 'Bangladescherinnen und Bangladescher im Ausland — die erstmals bei einer nationalen Wahl abstimmten und Geschichte schrieben',
    'মেধা ও দেশপ্রেমের ঐক্যবদ্ধ শক্তিতে গড়বো আগামীর বাংলাদেশ': 'Mit der vereinten Kraft von Kompetenz und Verantwortung gestalten wir Bangladeschs Zukunft',
    '"জুলাইয়ের রক্ত, প্রবাসীদের দায়বদ্ধতা এবং নতুন বাংলাদেশের স্বপ্ন — এই তিনের মিলনেই আমাদের সংগঠিত যাত্রা।"': '„Das Blut des Juli, die Verantwortung der Diaspora und der Traum von einem neuen Bangladesch — gemeinsam prägen sie unseren organisierten Weg.“',
    'NCP Diaspora Alliance Germany · প্রতিষ্ঠাকালীন ভাবনা': 'NCP Diaspora Alliance Germany · Gründungsgedanke',
    'সংস্কার': 'Reform',
    'গণতন্ত্র': 'Demokratie',
    'প্রবাসী অধিকার': 'Diaspora-Rechte',
    'দ্বিতীয় প্রজাতন্ত্র': 'Zweite Republik',
    'বিশেষ ঘোষণা · আসন্ন আয়োজন': 'Besondere Ankündigung · Bevorstehende Veranstaltung',
    'রক্তে জুলাই': 'Rokte July',
    'তারিখ': 'Datum',
    'সময়': 'Uhrzeit',
    'স্থান': 'Ort',
    '২৬ জুলাই ২০২৬ · রবিবার': 'Sonntag, 26. Juli 2026',
    'বিকাল ২টা ৩০ মিনিট': '14:30 Uhr',
    'পোস্টার ও নিবন্ধন QR দেখুন': 'Poster & Anmelde-QR ansehen',
    'পোস্টার ও QR দেখুন': 'Poster & QR ansehen',
    'ফেসবুকে বিস্তারিত': 'Details auf Facebook',
    'Facebook Event দেখুন': 'Facebook-Veranstaltung ansehen',
    'Facebook Events দেখুন': 'Facebook-Veranstaltungen ansehen',
    'Facebook Events · প্রতি ২৪ ঘণ্টায় যাচাই': 'Facebook Events · alle 24 Stunden geprüft',
    'কেন আমরা এখানে আছি': 'Warum wir hier sind',
    'জুলাই গণঅভ্যুত্থান ২০২৪:': 'Juli-Aufstand 2024:',
    'ছাত্র-জনতার ঐতিহাসিক অভ্যুত্থান': 'der historische Aufstand von Studierenden und Bevölkerung',
    'কোটা সংস্কারের দাবিতে শুরু হওয়া আন্দোলন দ্রুত দেশব্যাপী ছাত্র-জনতার গণঅভ্যুত্থানে রূপ নেয়। জাতিসংঘের মানবাধিকার দপ্তরের অনুসন্ধান অনুযায়ী, ১ জুলাই থেকে ১৫ আগস্ট ২০২৪-এর মধ্যে সর্বোচ্চ ১,৪০০ মানুষ নিহত হয়ে থাকতে পারেন এবং হাজারো মানুষ আহত হন। স্মৃতি সংরক্ষণ, সত্য জানা ও ন্যায়বিচারের দাবি ভবিষ্যৎ প্রজন্মের প্রতি আমাদের সম্মিলিত দায়িত্ব।': 'Was als Bewegung für eine Reform des Quotensystems begann, entwickelte sich rasch zu einem landesweiten Aufstand von Studierenden und Bevölkerung. Laut der Untersuchung des UN-Menschenrechtsbüros könnten zwischen dem 1. Juli und dem 15. August 2024 bis zu 1.400 Menschen getötet und Tausende verletzt worden sein. Erinnerung zu bewahren, die Wahrheit festzustellen und Gerechtigkeit einzufordern, ist unsere gemeinsame Verantwortung gegenüber künftigen Generationen.',
    'সর্বোচ্চ ১,৪০০': 'Bis zu 1.400',
    'OHCHR-এর আনুমানিক নিহতের সংখ্যা (১ জুলাই–১৫ আগস্ট ২০২৪)': 'OHCHR-Schätzung der Getöteten (1. Juli–15. August 2024)',
    'হাজারো': 'Tausende',
    'আহতের কথা নথিভুক্ত করেছে জাতিসংঘের অনুসন্ধান': 'Verletzte laut UN-Untersuchung',
    '৫ আগস্ট': '5. August',
    'সরকারের পতন ও রাজনৈতিক পটপরিবর্তন, ২০২৪': 'Sturz der Regierung und politischer Umbruch, 2024',
    '২৮ ফেব্রু': '28. Februar',
    'NCP প্রতিষ্ঠা দিবস, ২০২৫': 'Gründungstag der NCP, 2025',
    'বিস্তারিত জানুন': 'Mehr erfahren',
    'জুলাই গণঅভ্যুত্থান সম্পর্কে নির্ভরযোগ্য উৎস': 'Verlässliche Quellen zum Juli-Aufstand',
    'জাতিসংঘের প্রতিবেদন, সরকারি তথ্য, স্মৃতি জাদুঘর এবং নির্বাচিত সংবাদ ও কমিউনিটি আর্কাইভে ঘটনাপ্রবাহ, সাক্ষ্য, নথি, ছবি ও ভিডিও দেখুন।': 'Entdecken Sie Abläufe, Zeugenaussagen, Dokumente, Fotos und Videos in UN-Berichten, offiziellen Informationen, dem Gedenkmuseum sowie ausgewählten Nachrichten- und Community-Archiven.',
    'ওয়েবসাইটজুড়ে ব্যবহৃত জুলাইয়ের আলোকচিত্র: AFP, পলাশ খান ও অর্কিড চাকমা। আন্দোলনকালীন শিল্পকর্ম: সংগঠনের সংরক্ষিত সংগ্রহ।': 'Auf der Website verwendete Juli-Fotografien: AFP, Palash Khan und Orchid Chakma. Kunstwerke aus der Protestzeit: Archiv der Organisation.',
    'আমাদের পথচলা': 'Unser Weg',
    'আন্দোলনের চেতনা থেকে প্রবাসী সংগঠন': 'Vom Geist des Aufstands zur organisierten Diaspora',
    'NCP Diaspora Alliance Germany জার্মানিতে বসবাসরত বাংলাদেশিদের নাগরিক অংশগ্রহণ, প্রবাসী অধিকার, জ্ঞান বিনিময় ও দায়িত্বশীল রাজনৈতিক সংলাপের একটি সংগঠিত প্ল্যাটফর্ম।': 'Die NCP Diaspora Alliance Germany ist eine organisierte Plattform für gesellschaftliche Teilhabe, Diaspora-Rechte, Wissensaustausch und verantwortungsvollen politischen Dialog unter in Deutschland lebenden Bangladescherinnen und Bangladeschern.',
    'জুলাই–আগস্ট': 'Juli–August',
    'জুলাই গণঅভ্যুত্থান': 'Juli-Aufstand',
    'সরকারি চাকরিতে কোটা সংস্কারের দাবিতে শুরু হওয়া আন্দোলন প্রাণহানি ও ব্যাপক দমন-পীড়নের প্রেক্ষাপটে দেশব্যাপী ছাত্র-জনতার গণঅভ্যুত্থানে রূপ নেয়।': 'Die Bewegung für eine Reform der Quoten im öffentlichen Dienst entwickelte sich angesichts von Todesopfern und massiver Repression zu einem landesweiten Aufstand von Studierenden und Bevölkerung.',
    'ফেব্রুয়ারি': 'Februar',
    'জাতীয় নাগরিক পার্টি': 'National Citizen Party',
    'NCP প্রতিষ্ঠা (২৮ ফেব্রুয়ারি)': 'Gründung der NCP (28. Februar)',
    'জুলাই গণঅভ্যুত্থানের নেতৃত্বে থাকা একদল তরুণের উদ্যোগে জাতীয় নাগরিক পার্টি (NCP) আত্মপ্রকাশ করে। দলটি রাষ্ট্র সংস্কার, জবাবদিহি ও নতুন রাজনৈতিক বন্দোবস্তের কর্মসূচি সামনে আনে।': 'Die National Citizen Party (NCP) wurde von einer Gruppe junger Führungspersönlichkeiten des Juli-Aufstands gegründet. Die Partei stellte ein Programm für Staatsreform, Rechenschaftspflicht und eine neue politische Ordnung vor.',
    'এপ্রিল': 'April',
    'প্রবাসী ঐক্যের জাগরণ': 'Neue Einheit der Diaspora',
    'ডায়াসপোরা নেটওয়ার্কের উদ্যোগ': 'Initiative für ein Diaspora-Netzwerk',
    'প্রবাসীদের অভিজ্ঞতা, পেশাগত দক্ষতা ও নাগরিক দাবি একটি সুসংগঠিত কাঠামোয় যুক্ত করার উদ্যোগ নেওয়া হয়—যাতে বাংলাদেশের গণতান্ত্রিক রূপান্তর এবং প্রবাসী-সংশ্লিষ্ট নীতিতে কার্যকর অবদান রাখা যায়।': 'Eine Initiative wurde gestartet, um Erfahrungen, berufliche Kompetenzen und gesellschaftliche Anliegen der Diaspora in einer organisierten Struktur zu bündeln und so zur demokratischen Transformation Bangladeschs und zu diasporabezogener Politik beizutragen.',
    'জুন–বর্তমান': 'Juni–heute',
    'জার্মানি চ্যাপ্টারের কার্যক্রম': 'Arbeit des Deutschland-Chapters',
    'কমিউনিটি সংযোগ, নাগরিক সচেতনতা, প্রবাসী সেবা ও বাংলাদেশের নীতি-আলোচনায় অংশগ্রহণ—এই চার ক্ষেত্রে জার্মানি চ্যাপ্টার ধারাবাহিক কর্মসূচি গড়ে তুলছে।': 'Das Deutschland-Chapter entwickelt kontinuierliche Programme in vier Bereichen: Community-Vernetzung, politische Bildung, Diaspora-Services und Beteiligung am politischen Dialog über Bangladesch.',
    'আমাদের মূল অঙ্গীকার': 'Unser zentrales Versprechen',
    'জার্মানির বাংলাদেশি কমিউনিটিকে তথ্য, সংলাপ ও অংশগ্রহণের মাধ্যমে যুক্ত করা; প্রবাসী অধিকারকে নীতি-আলোচনায় তুলে ধরা; এবং দেশের জন্য দক্ষতা, জ্ঞান ও নেটওয়ার্কভিত্তিক অবদানের পথ তৈরি করা।': 'Die bangladeschische Community in Deutschland durch Information, Dialog und Beteiligung zu verbinden, Diaspora-Rechte in politische Debatten einzubringen und Wege für Beiträge auf Grundlage von Fähigkeiten, Wissen und Netzwerken zu schaffen.',
    'প্রবাসীদের কণ্ঠস্বর': 'Die Stimme der Diaspora',
    'বিশ্বজুড়ে থাকা বাংলাদেশিরা অর্থনীতি, জ্ঞান ও সামাজিক সংযোগে গুরুত্বপূর্ণ অবদান রাখেন। তাদের ভোটাধিকার, কনস্যুলার সেবা, বিনিয়োগ-নিরাপত্তা ও মর্যাদাপূর্ণ নাগরিক অভিজ্ঞতার প্রশ্নগুলোকে আমরা গঠনমূলকভাবে সামনে আনতে চাই।': 'Bangladescherinnen und Bangladescher weltweit leisten wichtige Beiträge in Wirtschaft, Wissen und gesellschaftlicher Vernetzung. Wir möchten ihre Wahlrechte, konsularische Dienstleistungen, Investitionssicherheit und ihr Recht auf eine würdevolle staatsbürgerliche Erfahrung konstruktiv voranbringen.',
    'যোগাযোগ': 'Kontakt',
    'যোগ দিন': 'Mitmachen',
    'আমাদের কাজের নীতি': 'Unsere Arbeitsgrundsätze',
    'যে অঙ্গীকারে আমরা কাজ করি': 'Die Grundsätze unserer Arbeit',
    'গণতান্ত্রিক সংস্কার, প্রবাসী নাগরিক অধিকার এবং অন্তর্ভুক্তিমূলক কমিউনিটি—এই তিনটি অগ্রাধিকার আমাদের কর্মসূচি ও জনসম্পৃক্ততার ভিত্তি।': 'Demokratische Reformen, staatsbürgerliche Rechte der Diaspora und eine inklusive Community sind die drei Prioritäten unserer Programme und öffentlichen Arbeit.',
    '০১': '01',
    '০২': '02',
    '০৩': '03',
    'রাষ্ট্র সংস্কার ও জবাবদিহি': 'Staatsreform und Rechenschaftspflicht',
    'স্বাধীন প্রতিষ্ঠান, কার্যকর ক্ষমতার ভারসাম্য, মানবাধিকার সুরক্ষা এবং জনগণের কাছে জবাবদিহিমূলক শাসনব্যবস্থার পক্ষে আমরা তথ্যভিত্তিক আলোচনা ও নাগরিক অংশগ্রহণকে উৎসাহিত করি।': 'Wir fördern fundierte Debatten und gesellschaftliche Teilhabe für unabhängige Institutionen, wirksame Gewaltenteilung, Menschenrechtsschutz und eine gegenüber der Bevölkerung rechenschaftspflichtige Regierungsführung.',
    'অধিকার': 'Rechte',
    'প্রবাসী ভোটাধিকার ও নাগরিক সেবা': 'Wahlrechte der Diaspora und Bürgerservices',
    'ভোটার নিবন্ধন, প্রবাস থেকে ভোট প্রদান, সহজ ও স্বচ্ছ কনস্যুলার সেবা এবং নীতিনির্ধারণে প্রবাসীদের অর্থবহ প্রতিনিধিত্ব নিশ্চিত করার দাবিকে আমরা সংগঠিতভাবে সামনে আনি।': 'Wir setzen uns organisiert für Wählerregistrierung, Wahlen aus dem Ausland, zugängliche und transparente konsularische Dienstleistungen sowie eine wirksame Vertretung der Diaspora in politischen Entscheidungsprozessen ein.',
    'ঐক্য': 'Einheit',
    'সমমর্যাদা ও কমিউনিটি সংহতি': 'Gleiche Würde und Zusammenhalt',
    'ধর্ম, বর্ণ, লিঙ্গ, অঞ্চল, পেশা ও রাজনৈতিক মতভেদ নির্বিশেষে সবার মর্যাদা রক্ষা এবং জার্মানির বহুসাংস্কৃতিক সমাজে দায়িত্বশীল, সহযোগিতামূলক বাংলাদেশি কমিউনিটি গড়ে তোলা আমাদের অঙ্গীকার।': 'Wir verpflichten uns, die Würde aller Menschen unabhängig von Religion, ethnischer Zugehörigkeit, Geschlecht, Region, Beruf oder politischer Meinung zu schützen und eine verantwortungsvolle, kooperative bangladeschische Community in Deutschlands vielfältiger Gesellschaft aufzubauen.',
    'সাম্প্রতিক কার্যক্রম ও আপডেট': 'Aktuelle Aktivitäten und Meldungen',
    'সাম্প্রতিক সাংগঠনিক কার্যক্রম, ঘোষণা, বিবৃতি, ছবি ও ভিডিও—মূল প্রকাশনার লিংকসহ নিয়মিত হালনাগাদ।': 'Regelmäßige Meldungen zu Aktivitäten, Ankündigungen, Stellungnahmen, Fotos und Videos — jeweils mit Link zur Originalveröffentlichung.',
    'আপডেটের ধরন ও উৎস বাছাই': 'Meldungen nach Typ und Quelle filtern',
    'ফিচার্ড': 'Hervorgehoben',
    'সব আপডেট': 'Alle Meldungen',
    'জার্মানি চ্যাপ্টার': 'Deutschland-Chapter',
    'ভিডিও': 'Video',
    'ছবি': 'Bild',
    'প্রতি ঘণ্টায় হালনাগাদ': 'Stündlich aktualisiert',
    'মূল পোস্ট →': 'Originalbeitrag →',
    'ভিডিও দেখুন →': 'Video ansehen →',
    'আপডেট': 'Meldung',
    'অফিসিয়াল উৎস': 'Offizielle Quelle',
    'ব্লগ ও মতামত': 'Blog & Meinungen',
    'প্রবাসের কথা, বাংলাদেশের আগামী': 'Stimmen der Diaspora, Bangladeschs Zukunft',
    'ভোট, রেমিট্যান্স, দক্ষতা, জার্মানি–বাংলাদেশ সংযোগ এবং প্রবাসী নাগরিক শক্তি নিয়ে তথ্যভিত্তিক বিশ্লেষণ, ব্যবহারযোগ্য গাইড ও সম্পাদকীয় মতামত।': 'Faktenbasierte Analysen, praktische Leitfäden und redaktionelle Beiträge zu Wahlen, Rücküberweisungen, Qualifikationen, den Beziehungen zwischen Deutschland und Bangladesch sowie zur gesellschaftlichen Kraft der Diaspora.',
    'আপনি কি একটি লেখা প্রকাশ করতে চান? আপনার মতামত, বিশ্লেষণ, অভিজ্ঞতা বা প্রবাসী জীবনের গুরুত্বপূর্ণ প্রশ্ন নিয়ে লিখুন। সম্পাদকীয় পর্যালোচনার পর নির্বাচিত লেখা প্রকাশ করা হবে।': 'Möchten Sie einen Beitrag veröffentlichen? Schreiben Sie über Ihre Perspektiven, Analysen, Erfahrungen oder wichtige Fragen des Diaspora-Lebens. Ausgewählte Texte werden nach redaktioneller Prüfung veröffentlicht.',
    'লেখা পাঠান': 'Beitrag einreichen',
    'সম্পূর্ণ লেখা পড়ুন': 'Vollständigen Beitrag lesen',
    'সম্পাদকীয় টিম': 'Redaktion',
    'তথ্যসূত্র': 'Quellen',
    'ছবি ও লাইসেন্স': 'Bild & Lizenz',
    'আপনার অংশগ্রহণ কেন গুরুত্বপূর্ণ': 'Warum Ihre Beteiligung wichtig ist',
    'দেশের সঙ্গে সংযোগ কেবল আবেগ বা রেমিট্যান্সে সীমাবদ্ধ নয়। নাগরিক অধিকার, জ্ঞান, দক্ষতা ও কমিউনিটি উদ্যোগে সংগঠিত অংশগ্রহণ দীর্ঘমেয়াদি পরিবর্তন তৈরি করতে পারে।': 'Die Verbindung zu Bangladesch geht über Emotionen und Rücküberweisungen hinaus. Organisierte Beteiligung an Bürgerrechten, Wissen, Qualifikationen und Community-Initiativen kann langfristige Veränderungen bewirken.',
    'নীতিগত আলোচনায় প্রবাসী অভিজ্ঞতা': 'Diaspora-Erfahrung im politischen Dialog',
    'জার্মানির শিক্ষা, কর্মক্ষেত্র, স্থানীয় সরকার ও নাগরিক সেবার অভিজ্ঞতাকে বাংলাদেশের সংস্কার-আলোচনায় বাস্তব ও গঠনমূলক প্রস্তাবে রূপ দেওয়ার সুযোগ।': 'Die Chance, Erfahrungen aus Bildung, Arbeitswelt, Kommunalverwaltung und öffentlichen Dienstleistungen in Deutschland in praktische, konstruktive Vorschläge für Reformdebatten in Bangladesch zu übersetzen.',
    'ভোট ও নাগরিক সেবায় তথ্য সহায়তা': 'Informationen zu Wahlen und Bürgerservices',
    'ভোটার নিবন্ধন, প্রবাস থেকে ভোট প্রদান, পাসপোর্ট ও কনস্যুলার সেবা বিষয়ে যাচাই করা তথ্য ছড়িয়ে দেওয়া এবং সেবার মানোন্নয়নে সম্মিলিত মতামত তুলে ধরা।': 'Geprüfte Informationen zu Wählerregistrierung, Wahlen aus dem Ausland, Pässen und konsularischen Dienstleistungen verbreiten und gemeinsam bessere Servicestandards einfordern.',
    'মানুষ ও দক্ষতার নেটওয়ার্ক': 'Ein Netzwerk aus Menschen und Kompetenzen',
    'শিক্ষার্থী, পেশাজীবী, উদ্যোক্তা ও কমিউনিটি সংগঠকদের সঙ্গে যুক্ত হয়ে জ্ঞান বিনিময়, পরামর্শ, স্বেচ্ছাসেবা ও বাংলাদেশমুখী উদ্যোগে অংশ নিন।': 'Vernetzen Sie sich mit Studierenden, Fachkräften, Unternehmerinnen und Unternehmern sowie Community-Organisatoren, um Wissen auszutauschen, zu beraten, sich ehrenamtlich zu engagieren und an Bangladesch-bezogenen Initiativen mitzuwirken.',
    'স্মৃতিকে নাগরিক দায়িত্বে রূপ দিন': 'Erinnerung in gesellschaftliche Verantwortung übersetzen',
    'জুলাই ২০২৪-এর নিহত ও আহতদের স্মরণকে কেবল আনুষ্ঠানিকতায় সীমাবদ্ধ না রেখে মানবাধিকার, জবাবদিহি ও বৈষম্যহীন রাষ্ট্রের পক্ষে ধারাবাহিক নাগরিক কাজে রূপ দিন।': 'Beschränken Sie das Gedenken an die Toten und Verletzten des Juli 2024 nicht auf Zeremonien, sondern machen Sie es zu dauerhaftem gesellschaftlichem Engagement für Menschenrechte, Rechenschaftspflicht und einen diskriminierungsfreien Staat.',
    '"আমরা প্রবাসে আছি, কিন্তু দেশের প্রশ্নে নিরপেক্ষ নই। জুলাইয়ের ত্যাগ, তরুণদের স্বপ্ন এবং নতুন বাংলাদেশের প্রতিশ্রুতিকে বাঁচিয়ে রাখাই আমাদের পথচলার কেন্দ্রবিন্দু।"': '„Wir leben im Ausland, sind aber nicht neutral, wenn es um unser Land geht. Die Opfer des Juli, die Träume der jungen Generation und das Versprechen eines neuen Bangladesch lebendig zu halten, steht im Mittelpunkt unseres Weges.“',
    'NCP সম্পর্কে জানুন': 'Über die NCP',
    'জাতীয় নাগরিক পার্টি ২৮ ফেব্রুয়ারি ২০২৫-এ আত্মপ্রকাশ করে। দলটির ঘোষিত অগ্রাধিকারের মধ্যে রাষ্ট্র ও সংবিধান সংস্কার, জবাবদিহিমূলক প্রতিষ্ঠান, বৈষম্যহীনতা এবং নাগরিকের রাজনৈতিক অংশগ্রহণ রয়েছে। সর্বশেষ অবস্থান ও প্রকাশনা জানতে দলটির অফিসিয়াল Facebook পেজ দেখুন।': 'Die National Citizen Party wurde am 28. Februar 2025 gegründet. Zu ihren erklärten Prioritäten zählen Staats- und Verfassungsreformen, rechenschaftspflichtige Institutionen, Nichtdiskriminierung und politische Teilhabe. Aktuelle Positionen und Veröffentlichungen finden Sie auf der offiziellen Facebook-Seite der Partei.',
    'অফিসিয়াল Facebook পেজ →': 'Offizielle Facebook-Seite →',
    'জার্মানি চ্যাপ্টারের সঙ্গে যুক্ত হোন': 'Beim Deutschland-Chapter mitmachen',
    'সদস্য হিসেবে কমিউনিটি উদ্যোগ, নীতি-আলোচনা, স্বেচ্ছাসেবা ও প্রবাসী অধিকারভিত্তিক কার্যক্রমে নিয়মিতভাবে অংশ নিতে পারবেন।': 'Als Mitglied können Sie sich regelmäßig an Community-Initiativen, politischen Diskussionen, ehrenamtlicher Arbeit und Aktivitäten zu Diaspora-Rechten beteiligen.',
    'কর্মসূচি ও আলোচনায় অংশগ্রহণ': 'An Programmen und Diskussionen teilnehmen',
    'কমিউনিটি সভা, তথ্য অধিবেশন ও বিশেষ উদ্যোগে সরাসরি যুক্ত থাকার সুযোগ।': 'Direkte Beteiligung an Community-Treffen, Informationsveranstaltungen und besonderen Initiativen.',
    'ডায়াসপোরা নেটওয়ার্ক': 'Diaspora-Netzwerk',
    'জার্মানি ও অন্যান্য দেশের সদস্য, পেশাজীবী এবং উদ্যোগের সঙ্গে সংযোগ।': 'Vernetzung mit Mitgliedern, Fachkräften und Initiativen in Deutschland und anderen Ländern.',
    'প্রবাসী অধিকার নিয়ে কাজ': 'Für Diaspora-Rechte arbeiten',
    'ভোট, নাগরিক সেবা ও প্রতিনিধিত্বের প্রশ্নে তথ্যভিত্তিক উদ্যোগের অংশ হোন।': 'Beteiligen Sie sich an faktenbasierten Initiativen zu Wahlen, Bürgerservices und Repräsentation.',
    'জ্ঞান ও দক্ষতার অবদান': 'Wissen und Kompetenzen einbringen',
    'নিজের পেশাগত অভিজ্ঞতা ও ধারণাকে বাস্তব কমিউনিটি উদ্যোগে রূপ দিন।': 'Verwandeln Sie Ihre beruflichen Erfahrungen und Ideen in praktische Community-Initiativen.',
    'সদস্য নিবন্ধন ফর্ম': 'Formular zur Mitgliedsregistrierung',
    'প্রয়োজনীয় তথ্যগুলো পূরণ করুন। সাবমিট করার আগে তথ্য ব্যবহারের সম্মতিটি পড়ুন। চাইলে নিবন্ধন QR কোডও ব্যবহার করতে পারেন।': 'Füllen Sie die erforderlichen Angaben aus und lesen Sie vor dem Absenden die Einwilligung zur Datenverarbeitung. Alternativ können Sie den Anmelde-QR-Code verwenden.',
    'সদস্য নিবন্ধনের QR কোড': 'QR-Code zur Mitgliedsregistrierung',
    'পূর্ণ নাম (ইংরেজি) *': 'Vollständiger Name (auf Englisch) *',
    'বর্তমান শহর *': 'Aktueller Wohnort *',
    'ইমেইল *': 'E-Mail *',
    'হোয়াটসঅ্যাপ *': 'WhatsApp *',
    'পেশা *': 'Beruf *',
    'ডাক্তার, প্রকৌশলী, ছাত্র, ব্যবসায়ী…': 'Ärztin/Arzt, Ingenieur/in, Student/in, Unternehmer/in …',
    'বাংলাদেশের ঠিকানা (ঐচ্ছিক)': 'Adresse in Bangladesch (optional)',
    'ইউনিয়ন, উপজেলা, জেলা': 'Union, Upazila, Distrikt',
    'আপনার ফেসবুক প্রোফাইলের লিংক দিন (Facebook Profile URL) — ঐচ্ছিক': 'URL Ihres Facebook-Profils — optional',
    'আপনার ছোট পরিচয় বা অন্যান্য প্রাসঙ্গিক লিংক, যেমন ওয়েবসাইট বা মিডিয়া উপস্থিতি — ঐচ্ছিক': 'Kurzbiografie und relevante Links, z. B. Website oder Medienauftritte — optional',
    'সংক্ষিপ্ত পরিচয়, ওয়েবসাইট, প্রকাশনা, সাক্ষাৎকার বা অন্যান্য প্রাসঙ্গিক লিংক': 'Kurzbiografie, Website, Veröffentlichungen, Interviews oder andere relevante Links',
    'পূর্বে বা বর্তমানে কোনো রাজনৈতিক সংগঠনের সঙ্গে যুক্ত থাকলে বর্ণনা করুন (Please specify any previous or current political affiliation) — ঐচ্ছিক': 'Bitte beschreiben Sie frühere oder aktuelle politische Zugehörigkeiten — optional',
    'প্রযোজ্য হলে সংগঠনের নাম, ভূমিকা ও সময়কাল উল্লেখ করুন': 'Falls zutreffend: Organisation, Funktion und Zeitraum angeben',
    'তথ্য সুরক্ষা ও গোপনীয়তা': 'Datenschutz und Vertraulichkeit',
    'সদস্যপদ যাচাই ও সাংগঠনিক যোগাযোগের জন্য আপনার তথ্য জার্মানিতে প্রযোজ্য সাধারণ ডেটা সুরক্ষা বিধিমালা (GDPR) অনুযায়ী গোপনীয়ভাবে সংরক্ষণ ও প্রক্রিয়াজাত করা হবে। ইমেইলে সাবমিশন পৌঁছে দেওয়ার জন্য FormSubmit সীমিতভাবে তথ্য প্রক্রিয়াজাত করবে। এই প্রযুক্তিগত প্রক্রিয়াকরণ ও আইনগত বাধ্যবাধকতা ব্যতীত, আপনার পূর্বানুমতি ছাড়া কোনো তৃতীয় পক্ষের সঙ্গে তথ্য শেয়ার করা হবে না।': 'Ihre Daten werden zur Prüfung der Mitgliedschaft und zur organisatorischen Kommunikation gemäß der in Deutschland geltenden Datenschutz-Grundverordnung (DSGVO) vertraulich gespeichert und verarbeitet. FormSubmit verarbeitet die Daten ausschließlich, soweit dies für die Übermittlung per E-Mail erforderlich ist. Abgesehen von dieser technischen Verarbeitung und gesetzlichen Verpflichtungen werden Ihre Daten ohne Ihre vorherige Einwilligung nicht an Dritte weitergegeben.',
    'আমি উপরের তথ্য-সুরক্ষা শর্তাবলি পড়েছি ও বুঝেছি এবং উল্লিখিত উদ্দেশ্যে আমার তথ্য সংরক্ষণ ও প্রক্রিয়াজাত করার সম্মতি প্রদান করছি। *': 'Ich habe die vorstehenden Datenschutzbedingungen gelesen und verstanden und willige in die Speicherung und Verarbeitung meiner Daten für die genannten Zwecke ein. *',
    'সদস্য নিবন্ধন করুন →': 'Als Mitglied registrieren →',
    'নেভিগেশন': 'Navigation',
    'জুলাই গণঅভ্যুত্থানের স্মৃতি, গণতান্ত্রিক সংস্কার, প্রবাসী নাগরিক অধিকার এবং জার্মানির বাংলাদেশি কমিউনিটির দায়িত্বশীল অংশগ্রহণকে যুক্ত করে আমরা একটি তথ্যভিত্তিক ও জবাবদিহিমূলক প্ল্যাটফর্ম গড়ে তুলছি।': 'Wir schaffen eine faktenbasierte und verantwortungsvolle Plattform, die die Erinnerung an den Juli-Aufstand, demokratische Reformen, die Bürgerrechte der Diaspora und die verantwortungsvolle Beteiligung der bangladeschischen Community in Deutschland verbindet.',
    '© 2026 NCP Diaspora Alliance Germany. সর্বস্বত্ব সংরক্ষিত।': '© 2026 NCP Diaspora Alliance Germany. Alle Rechte vorbehalten.',
    'জুলাইয়ের চেতনায় · বৈষম্যমুক্ত বাংলাদেশ · নতুন প্রজাতন্ত্র': 'Im Geist des Juli · Ein diskriminierungsfreies Bangladesch · Eine neue Republik',
    'ভাষা নির্বাচন করুন': 'Sprache auswählen',
    'ভাষাসমূহ': 'Sprachen',
    'পেজ স্ক্রল অগ্রগতি': 'Lesefortschritt',
    'উপরে ফিরে যান': 'Nach oben',
    'প্রধান নেভিগেশন': 'Hauptnavigation',
    'NCP Diaspora Alliance Germany হোমপেজ': 'Startseite der NCP Diaspora Alliance Germany',
    'মেনু খুলুন বা বন্ধ করুন': 'Menü öffnen oder schließen',
    'মোবাইল নেভিগেশন': 'Mobile Navigation',
    'ব্লগ পাঠক বন্ধ করুন': 'Blogansicht schließen',
    'NCP Diaspora Alliance Germany পরিচিতি': 'Über die NCP Diaspora Alliance Germany',
    'জুলাই গণঅভ্যুত্থান ২০২৪': 'Juli-Aufstand 2024',
    'ছাত্র-জনতার ঐতিহাসিক জাগরণ': 'Ein historisches Erwachen von Studierenden und Bevölkerung',
    'OHCHR অনুসন্ধান': 'OHCHR-Untersuchung',
    'সর্বোচ্চ ১,৪০০ মানুষ নিহত হয়ে থাকতে পারেন': 'Bis zu 1.400 Menschen könnten getötet worden sein',
    'NCP প্রতিষ্ঠা': 'Gründung der NCP',
    '২৮ ফেব্রুয়ারি ২০২৫': '28. Februar 2025',
    'জাতীয় নাগরিক পার্টি (NCP)': 'National Citizen Party (NCP)',
    'জুলাই নেতৃত্বের উদ্যোগে গঠিত রাজনৈতিক দল': 'Eine von Führungspersönlichkeiten des Juli-Aufstands gegründete Partei',
    'রাষ্ট্র সংস্কার': 'Staatsreform',
    'গণতান্ত্রিক প্রতিষ্ঠান ও জবাবদিহির অঙ্গীকার': 'Bekenntnis zu demokratischen Institutionen und Rechenschaftspflicht',
    'ন্যায়, সাম্য ও গণতন্ত্রের অঙ্গীকার': 'Bekenntnis zu Gerechtigkeit, Gleichheit und Demokratie',
    'প্রবাসী বাংলাদেশি': 'Bangladescherinnen und Bangladescher im Ausland',
    'ভোট, সেবা ও প্রতিনিধিত্বের অধিকার': 'Recht auf Wahl, Dienstleistungen und Repräsentation',
    'প্রবাসীদের ঐক্যবদ্ধ প্ল্যাটফর্ম': 'Eine gemeinsame Plattform für die Diaspora',
    'সক্রিয় · ২০২৫': 'Aktiv · 2025',
    'ডায়াসপোরা নেটওয়ার্ক': 'Diaspora-Netzwerk',
    'জ্ঞান, দক্ষতা ও নাগরিক অংশগ্রহণ': 'Wissen, Kompetenzen und gesellschaftliche Teilhabe',
    'রাজনৈতিক অন্তর্ভুক্তির দাবি': 'Forderung nach politischer Einbeziehung',
    'গণতান্ত্রিক পুনর্গঠনের লক্ষ্য': 'Ziel einer demokratischen Erneuerung',
    'বিস্তারিত দেখুন': 'Details ansehen',
    'অনুষ্ঠানের তথ্য': 'Veranstaltungsinformationen',
    'জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে রক্তে জুলাই অনুষ্ঠানের পোস্টার': 'Poster zu Rokte July im Gedenken an den Juli-Aufstand 2024',
    'জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে ‘রক্তে জুলাই’ অনুষ্ঠান দুটি পর্বে সাজানো—‘স্মৃতি থেকে জাগরণ’ এবং ‘অভিজ্ঞতা, অংশগ্রহণ ও আগামীর ভাবনা’। প্রামাণ্যচিত্র, জুলাইয়ের জীবন্ত গল্প, বক্তব্য, ভিজ্যুয়াল স্টোরি, প্রবাস থেকে আলোচনা, অভিজ্ঞতা ও প্রতিফলন, শর্ট ফিল্ম, July Quiz এবং ইন্টারঅ্যাকটিভ সেশন এতে অন্তর্ভুক্ত।': 'Rokte July erinnert an den Juli-Aufstand 2024 und besteht aus zwei Teilen: „Von der Erinnerung zum Erwachen“ und „Erfahrungen, Beteiligung und Perspektiven für die Zukunft“. Zum Programm gehören ein Dokumentarfilm, lebendige Geschichten des Juli, Reden, visuelles Storytelling, Diskussionen aus der Diaspora, Erfahrungen und Reflexionen, Kurzfilme, ein July Quiz und interaktive Formate.',
    'নতুন কর্মসূচির অপেক্ষায়': 'Das nächste Programm folgt',
    'NCP Diaspora Alliance Germany-এর নতুন Facebook Event প্রকাশিত হলে সময়, স্থান ও মূল Event লিংকসহ এখানে স্বয়ংক্রিয়ভাবে দেখা যাবে।': 'Sobald die NCP Diaspora Alliance Germany eine neue Facebook-Veranstaltung veröffentlicht, erscheint sie hier automatisch mit Uhrzeit, Ort und Originallink.',
    'বিশেষ ঘোষণা': 'Besondere Ankündigung',
    'তথ্যসূত্র': 'Informationsquelle',
    'মূল উৎস দেখুন →': 'Originalquelle ansehen →',
    'জাতিসংঘ · প্রতিবেদন': 'Vereinte Nationen · Bericht',
    'জুলাই–আগস্ট ২০২৪-এর মানবাধিকার লঙ্ঘন ও সহিংসতা বিষয়ে জাতিসংঘের স্বাধীন অনুসন্ধান প্রতিবেদন।': 'Der unabhängige UN-Untersuchungsbericht zu Menschenrechtsverletzungen und Gewalt im Juli und August 2024.',
    'মূল PDF পড়ুন →': 'Original-PDF lesen →',
    'সরকারি তথ্য': 'Offizielle Informationen',
    'জুলাই গণঅভ্যুত্থান অধিদপ্তর': 'Direktion des Juli-Volksaufstands',
    'শহিদ পরিবার, আহত জুলাই যোদ্ধা, আইন, গেজেট, সহায়তা ও পুনর্বাসন-সংক্রান্ত সরকারি তথ্য।': 'Offizielle Informationen zu Familien der Getöteten, verletzten Juli-Beteiligten, Gesetzen, Amtsblättern, Unterstützung und Rehabilitation.',
    'সরকারি পোর্টাল →': 'Offizielles Portal →',
    'স্মৃতি জাদুঘর': 'Gedenkmuseum',
    'জুলাই গণঅভ্যুত্থান ও পূর্ববর্তী দমন-পীড়নের স্মৃতি, উপকরণ ও সাক্ষ্যভিত্তিক ডিজিটাল উপস্থাপনা।': 'Digitale Präsentation von Erinnerungen, Objekten und Zeugenaussagen zum Juli-Aufstand und früherer Repression.',
    'ডিজিটাল সংগ্রহ দেখুন →': 'Digitale Sammlung ansehen →',
    'ডিজিটাল আর্কাইভ': 'Digitales Archiv',
    'সংবাদ, আলোকচিত্র, মতামত ও প্রকাশিত উপকরণের বিষয়ভিত্তিক অনলাইন সংগ্রহ।': 'Thematische Online-Sammlung von Nachrichten, Fotografien, Kommentaren und veröffentlichten Materialien.',
    'আর্কাইভ দেখুন →': 'Archiv ansehen →',
    'সংবাদ আর্কাইভ': 'Nachrichtenarchiv',
    '১ জুলাই থেকে ৫ আগস্ট পর্যন্ত ঘটনাপ্রবাহের দিনভিত্তিক সংবাদ ও মাল্টিমিডিয়া আর্কাইভ।': 'Tageschronologisches Nachrichten- und Multimedia-Archiv der Ereignisse vom 1. Juli bis 5. August.',
    'টাইমলাইন দেখুন →': 'Chronik ansehen →',
    'কমিউনিটি আর্কাইভ': 'Community-Archiv',
    'ছবি, ভিডিও, পোস্টার ও স্মৃতি সংরক্ষণের একটি কমিউনিটি-চালিত উদ্যোগ।': 'Eine von der Community getragene Initiative zur Bewahrung von Fotos, Videos, Postern und Erinnerungen.',
    'সংগ্রহ দেখুন →': 'Sammlung ansehen →',
    '২০২৫': '2025',
    'সর্বশেষ হালনাগাদ': 'Zuletzt aktualisiert',
    'ভিউ': 'Aufrufe',
    'এই মুহূর্তে কোনো যাচাইকৃত পিন করা Facebook পোস্ট পাওয়া যায়নি। পেজে নতুন পোস্ট পিন করা হলে এখানে দেখা যাবে।': 'Derzeit ist kein verifizierter angehefteter Facebook-Beitrag verfügbar. Ein neuer angehefteter Beitrag erscheint hier.',
    'এই উৎসে এখনো কোনো প্রকাশিত আপডেট নেই। নতুন পোস্ট যুক্ত হলে এখানে দেখা যাবে।': 'Von dieser Quelle liegen noch keine veröffentlichten Meldungen vor. Neue Beiträge erscheinen hier.',
    'জুলাইয়ের পক্ষে থাকা সকল শক্তিকে একত্রিত করে NCP Diaspora Alliance Germany আয়োজন করতে যাচ্ছে জুলাইকে ঘিরে ইউরোপের…': 'Die NCP Diaspora Alliance Germany bringt alle Unterstützer des Juli für eine der größten europäischen…',
    'জুলাইয়ের পক্ষে থাকা সকল শক্তিকে একত্রিত করে NCP Diaspora Alliance Germany আয়োজন করতে যাচ্ছে জুলাইকে ঘিরে ইউরোপের অন্যতম বৃহৎ অনুষ্ঠান— “রক্তে জুলাই ২০২৬”। আপনিও অংশ নিন, জুলাইয়ের আকাঙ্ক্ষা ধারণ করে নতুন বাংলাদেশ বিনির্মাণের যাত্রায় শরিক হোন। 📅 তারিখ: ২৬ জুলাই ২০২৬, রবিবার': 'Die NCP Diaspora Alliance Germany bringt alle, die für den Juli stehen, zu einer der größten europäischen Juli-Veranstaltungen zusammen — „Rokte July 2026“. Seien Sie dabei und wirken Sie am Aufbau eines neuen Bangladesch im Sinne der Ziele des Juli mit. 📅 Sonntag, 26. Juli 2026.',
    'জুলাইয়ের পক্ষে থাকা সকল শক্তিকে একত্রিত করে NCP Diaspora Alliance Germany আয়োজন করতে যাচ্ছে জুলাইকে ঘিরে ইউরোপের অন্যতম বৃহৎ অনুষ্ঠান— “রক্তে জুলাই ২০২৬”। আমাদের এই আয়োজনে পাশে থাকার জন্য জাতীয় ছাত্রশক্তির ছাত্রীবিষয়ক সম্পাদক মিতু আপুকে অসংখ্য ধন্যবাদ। ইনকিলাব জিন্দাবাদ।': 'Die NCP Diaspora Alliance Germany bringt alle, die für den Juli stehen, zu einer der größten europäischen Juli-Veranstaltungen zusammen — „Rokte July 2026“. Unser herzlicher Dank gilt Mitu, Beauftragte für Studentinnenangelegenheiten bei Jatiya Chhatra Shakti, für ihre Unterstützung.',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত “রক্তে জুলাই” অনুষ্ঠানের রেজিস্ট্রেশন শেষ হচ্ছে আগামী বুধবার, ২২ জুলাই…': 'Die Anmeldung für Rokte July zum Gedenken an den Juli-Aufstand 2024 endet am Mittwoch, 22. Juli…',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত “রক্তে জুলাই” অনুষ্ঠানের রেজিস্ট্রেশন শেষ হচ্ছে আগামী বুধবার, ২২ জুলাই ২০২৬। এই বিশেষ আয়োজনে জুলাই গণঅভ্যুত্থানের সম্মুখসারির নেতৃবৃন্দের পাশাপাশি বাংলাদেশি-জার্মান কমিউনিটির নেতৃবৃন্দ, বিশিষ্ট ব্যক্তিবর্গ, পেশাজীবী ও সচেতন প্রবাসীরা অংশগ্রহণ করবেন।': 'Die Anmeldung für Rokte July zum Gedenken an den Juli-Aufstand 2024 endet am Mittwoch, 22. Juli 2026. An der Veranstaltung nehmen Führungspersönlichkeiten des Aufstands, Vertreterinnen und Vertreter der bangladeschisch-deutschen Community, Persönlichkeiten des öffentlichen Lebens, Fachkräfte und engagierte Diaspora-Mitglieder teil.',
    '‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন নাহিদ ইসলাম': 'Nahid Islam nimmt online an Rokte July teil',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন নাহিদ ইসলাম (আহ্বায়ক, জাতীয় নাগরিক পার্টি; ২৬ জুলাই ২০২৬, রবিবার)। প্রবাস থেকে জুলাইয়ের স্মৃতি, দায়বদ্ধতা এবং আগামীর বাংলাদেশে প্রবাসীদের ভূমিকা নিয়ে গুরুত্বপূর্ণ আলোচনায় আপনিও অংশ নিন। বিকাল ২টা ৩০ মিনিট—জার্মান সময় · Bilker Str. 29, 40213…': 'Nahid Islam, Vorsitzender der National Citizen Party, nimmt am Sonntag, 26. Juli 2026 online an Rokte July teil. Beteiligen Sie sich an der Diskussion über die Erinnerung an den Juli, die Verantwortung der Diaspora und ihre Rolle in Bangladeschs Zukunft. 14:30 Uhr · Bilker Str. 29, 40213…',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন নাহিদ ইসলাম (আহ্বায়ক, জাতীয় নাগরিক পার্টি; ২৬ জুলাই ২০২৬, রবিবার)। প্রবাস থেকে জুলাইয়ের স্মৃতি, দায়বদ্ধতা এবং আগামীর বাংলাদেশে প্রবাসীদের ভূমিকা নিয়ে গুরুত্বপূর্ণ আলোচনায় আপনিও অংশ নিন। বিকাল ২টা ৩০ মিনিট—জার্মান সময় · Bilker Str. 29, 40213 Düsseldorf।': 'Nahid Islam, Vorsitzender der National Citizen Party, nimmt am Sonntag, 26. Juli 2026 online an Rokte July teil. Beteiligen Sie sich an der Diskussion über die Erinnerung an den Juli, die Verantwortung der Diaspora und ihre Rolle in Bangladeschs Zukunft. 14:30 Uhr · Bilker Str. 29, 40213 Düsseldorf.',
    '‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন হাসনাত আব্দুল্লাহ': 'Hasnat Abdullah nimmt online an Rokte July teil',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন হাসনাত আব্দুল্লাহ (মুখ্য সংগঠক (দক্ষিণাঞ্চল), জাতীয় নাগরিক পার্টি (NCP); ২৬ জুলাই ২০২৬, রবিবার)। প্রবাস থেকে জুলাইয়ের স্মৃতি, দায়বদ্ধতা এবং আগামীর বাংলাদেশে প্রবাসীদের ভূমিকা নিয়ে গুরুত্বপূর্ণ আলোচনায় আপনিও অংশ নিন। বিকাল ২টা ৩০…': 'Hasnat Abdullah, Chef-Organisator (Südregion) der National Citizen Party, nimmt am Sonntag, 26. Juli 2026 online an Rokte July teil. Diskutieren Sie mit über die Erinnerung an den Juli, die Verantwortung der Diaspora und ihre Rolle in Bangladeschs Zukunft. 14:30 Uhr…',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন হাসনাত আব্দুল্লাহ (মুখ্য সংগঠক (দক্ষিণাঞ্চল), জাতীয় নাগরিক পার্টি (NCP); ২৬ জুলাই ২০২৬, রবিবার)। প্রবাস থেকে জুলাইয়ের স্মৃতি, দায়বদ্ধতা এবং আগামীর বাংলাদেশে প্রবাসীদের ভূমিকা নিয়ে গুরুত্বপূর্ণ আলোচনায় আপনিও অংশ নিন। বিকাল ২টা ৩০ মিনিট—জার্মান সময় · Bilker Str. 29, 40213 Düsseldorf।': 'Hasnat Abdullah, Chef-Organisator (Südregion) der National Citizen Party, nimmt am Sonntag, 26. Juli 2026 online an Rokte July teil. Diskutieren Sie mit über die Erinnerung an den Juli, die Verantwortung der Diaspora und ihre Rolle in Bangladeschs Zukunft. 14:30 Uhr · Bilker Str. 29, 40213 Düsseldorf.',
    '১৯ জুলাই ২০২৪ | ঐতিহাসিক ৯ দফা ঘোষণা': '19. Juli 2024 | Die historische Neun-Punkte-Erklärung',
    'আয়োজন': 'Veranstaltung',
    'একদিকে চলছিল সমন্বয়কদের গুম, গ্রেপ্তার, দমন-পীড়ন ও খুন; অন্যদিকে আন্দোলনকে ভিন্ন খাতে প্রবাহিত করার নানা ষড়যন্ত্র। এমন এক সংকটময় মুহূর্তে বৈষম্যবিরোধী ছাত্র আন্দোলনের অন্যতম সমন্বয়ক আব্দুল কাদের জাতির সামনে ঘোষণা করেন ঐতিহাসিক ৯ দফা। এই ৯ দফা আন্দোলনকে নতুন রাজনৈতিক লক্ষ্য ও সুস্পষ্ট দিকনির্দেশনা দেয়।': 'Während Koordinatoren Opfer von Verschwindenlassen, Festnahmen, Repression und Tötungen wurden, gab es zugleich Versuche, die Bewegung umzulenken. In diesem kritischen Moment stellte Abdul Kader, Koordinator von Students Against Discrimination, die historische Neun-Punkte-Erklärung vor und gab der Bewegung ein neues politisches Ziel und klare Orientierung.',
    '২০ জুলাই ২০২৪ নাহিদ ইসলামকে গুম ও নির্যাতনের স্মারক': 'Erinnerung an das Verschwindenlassen und die Folter von Nahid Islam am 20. Juli 2024',
    'জুলাই': 'Juli',
    '২০ জুলাই ২০২৪: নাহিদ ইসলামকে গুম ও নির্যাতনের স্মৃতি': '20. Juli 2024: Erinnerung an das Verschwindenlassen und die Folter von Nahid Islam',
    '২০ জুলাই ২০২৪ আন্দোলন প্রত্যাহারের জন্য বৈষম্যবিরোধী ছাত্র আন্দোলনের তৎকালীন সমন্বয়ক নাহিদ ইসলামকে তুলে নিয়ে নির্যাতন করা হয়েছিল। পোস্টটিতে তাঁর সেই অভিজ্ঞতা এবং আন্দোলন চালিয়ে যাওয়ার দৃঢ়তা স্মরণ করা হয়েছে।': 'Am 20. Juli 2024 wurde Nahid Islam, damals Koordinator von Students Against Discrimination, entführt und gefoltert, um die Rücknahme der Bewegung zu erzwingen. Der Beitrag erinnert an diese Erfahrung und an seine Entschlossenheit, die Bewegung fortzusetzen.',
    'রক্তে জুলাই অনুষ্ঠানে অনলাইনে যুক্ত হওয়ার জন্য সারোয়ার তুষারের অতিথি ঘোষণা': 'Gastankündigung zur Online-Teilnahme von Sarwar Tusher an Rokte July',
    '‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন সারোয়ার তুষার': 'Sarwar Tusher nimmt online an Rokte July teil',
    'মহান জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে আয়োজিত ‘রক্তে জুলাই’ অনুষ্ঠানে অনলাইনে যুক্ত হবেন জাতীয় নাগরিক পার্টির যুগ্ম আহ্বায়ক সারোয়ার তুষার। অনুষ্ঠানটি ২৬ জুলাই ২০২৬, রবিবার বিকাল ২টা ৩০ মিনিটে Bilker Str. 29, 40213 Düsseldorf-এ অনুষ্ঠিত হবে; নিবন্ধন বাধ্যতামূলক।': 'Sarwar Tusher, stellvertretender Vorsitzender der National Citizen Party, nimmt online an Rokte July teil. Die Gedenkveranstaltung zum Juli-Aufstand 2024 findet am Sonntag, 26. Juli 2026 um 14:30 Uhr in der Bilker Str. 29, 40213 Düsseldorf statt; eine Anmeldung ist erforderlich.',
    'প্রবাসী ভোটের ব্যালট, সংযোগ ও ডেটা প্রবাহের মৌলিক ইলাস্ট্রেশন': 'Originalillustration zu Diaspora-Stimmzetteln, Verbindungen und Datenflüssen',
    'প্রবাসী ভোট': 'Diaspora-Wahl',
    'ডেটা ডেস্ক': 'Datenredaktion',
    '১৪ জুলাই ২০২৬': '14. Juli 2026',
    'শেষ নির্বাচনে প্রবাসী ভোট: সংখ্যাগুলো কী বলছে': 'Diaspora-Stimmen bei der letzten Wahl: Was die Zahlen zeigen',
    '২০২৬ সালের নির্বাচনে পোস্টাল ব্যালট প্রথমবারের মতো প্রবাসী ভোটকে দৃশ্যমান করেছে। নিবন্ধন, ব্যালট ফেরত ও গণনার ডেটা দেখায়—প্রবাসী ভোট এখন বাস্তব রাজনৈতিক শক্তি।': 'Briefwahlstimmen machten die Diaspora-Wahl bei der Wahl 2026 erstmals sichtbar. Daten zu Registrierung, Rücksendung und Auszählung zeigen: Diaspora-Stimmen sind inzwischen eine reale politische Kraft.',
    'প্রবাসী কণ্ঠস্বর ও ভোটের প্রভাব বোঝানো মৌলিক ডেটা ইলাস্ট্রেশন': 'Originale Datenillustration zu Diaspora-Stimmen und ihrem Einfluss auf Wahlen',
    'নির্বাচনী সমীকরণ': 'Wahldynamik',
    'প্রবাসী ভোট কীভাবে নির্বাচনের সমীকরণ বদলাতে পারে': 'Wie Diaspora-Stimmen Wahlergebnisse verändern können',
    'প্রবাসী ভোট শুধু প্রতীকী নয়। ২০২৬ সালের কিছু আসনে পোস্টাল ভোটের ব্যবধান বিজয়-পরাজয়ের ব্যবধানের চেয়েও বড় ছিল।': 'Diaspora-Stimmen sind mehr als ein Symbol. In mehreren Wahlkreisen war der Abstand bei den Briefwahlstimmen 2026 größer als der Abstand zwischen Sieg und Niederlage.',
    'জার্মানি ও বাংলাদেশকে জ্ঞান, দক্ষতা ও নেতৃত্বের সেতুতে যুক্ত করা মৌলিক ইলাস্ট্রেশন': 'Originalillustration einer Brücke aus Wissen, Kompetenzen und Führung zwischen Deutschland und Bangladesch',
    'জার্মানি ডায়াস্পোরা': 'Diaspora in Deutschland',
    'জার্মানি প্রবাসীরা বাংলাদেশের কোন খাতে বাস্তব অবদান রাখতে পারেন': 'Wo Bangladescherinnen und Bangladescher in Deutschland konkret beitragen können',
    'রেমিট্যান্সের বাইরে জার্মানি প্রবাসীদের বড় শক্তি হলো দক্ষতা, নেটওয়ার্ক, প্রযুক্তি, পেশাগত মান ও প্রতিষ্ঠান গঠনের অভিজ্ঞতা।': 'Über Rücküberweisungen hinaus liegen die größten Stärken der Diaspora in Deutschland in Kompetenzen, Netzwerken, Technologie, beruflichen Standards und Erfahrung im Aufbau von Institutionen.',
    'বাংলাদেশ থেকে জার্মানিতে দক্ষতা, শিক্ষা ও কর্মপথের মৌলিক ইলাস্ট্রেশন': 'Originalillustration zu Qualifikations-, Bildungs- und Arbeitswegen von Bangladesch nach Deutschland',
    'জার্মানি যাওয়ার পথ': 'Wege nach Deutschland',
    'বাংলাদেশ থেকে জার্মানি: পড়াশোনা, কাজ ও দক্ষ অভিবাসনের বৈধ পথ': 'Von Bangladesch nach Deutschland: legale Wege für Studium, Arbeit und Fachkräfteeinwanderung',
    'জার্মানিতে আসার পথ আছে, কিন্তু প্রতিটি পথের শর্ত আলাদা। শিক্ষার্থী, দক্ষ কর্মী, Blue Card, Opportunity Card ও vocational training—সব ক্ষেত্রেই অফিসিয়াল নির্দেশনা অনুসরণ জরুরি।': 'Es gibt mehrere Wege nach Deutschland, jeweils mit eigenen Voraussetzungen. Ob Studium, Fachkräfteeinwanderung, EU Blue Card, Chancenkarte oder Ausbildung: Offizielle Hinweise sind entscheidend.',
    'রেমিট্যান্স থেকে বিনিয়োগে রূপান্তরের চার্টধর্মী মৌলিক ইলাস্ট্রেশন': 'Originale Diagrammillustration zur Umwandlung von Rücküberweisungen in Investitionen',
    'রেমিট্যান্স ও বিনিয়োগ': 'Rücküberweisungen & Investitionen',
    'রেমিট্যান্স থেকে বিনিয়োগ: প্রবাসী অর্থনীতির ডেটা-চিত্র': 'Von Rücküberweisungen zu Investitionen: Daten zur Diaspora-Ökonomie',
    'রেমিট্যান্স বাংলাদেশের অর্থনীতির বড় শক্তি। কিন্তু দীর্ঘমেয়াদি প্রভাবের জন্য প্রবাসী অর্থকে দক্ষতা, উদ্যোগ, প্রযুক্তি ও উৎপাদনশীল বিনিয়োগের সঙ্গে যুক্ত করতে হবে।': 'Rücküberweisungen sind eine große Stärke der bangladeschischen Wirtschaft. Für langfristige Wirkung muss Diaspora-Kapital mit Qualifikationen, Unternehmertum, Technologie und produktiven Investitionen verbunden werden.',
    'বাংলাদেশ থেকে জার্মানিতে দক্ষতা করিডর বোঝানো মৌলিক ইলাস্ট্রেশন': 'Originalillustration eines Qualifikationskorridors von Bangladesch nach Deutschland',
    'স্কিল করিডর': 'Qualifikationskorridor',
    'জার্মানি–বাংলাদেশ স্কিল করিডর: ভাষা, স্বীকৃতি ও কর্মদক্ষতার রোডম্যাপ': 'Deutschland–Bangladesch-Qualifikationskorridor: Fahrplan für Sprache, Anerkennung und Beschäftigungsfähigkeit',
    'জার্মানির skilled immigration framework বাংলাদেশের তরুণদের জন্য সুযোগ তৈরি করছে, কিন্তু ভাষা, qualification recognition ও বাস্তব দক্ষতা ছাড়া সেই সুযোগ কাজে লাগানো কঠিন।': 'Deutschlands Fachkräfteeinwanderungsrecht eröffnet jungen Menschen aus Bangladesch Chancen. Ohne Sprachkenntnisse, Anerkennung von Qualifikationen und praktische Kompetenzen lassen sie sich jedoch schwer nutzen.',
    'জামায়াত-এনসিপির জোট নিয়ে যা বললেন আসিফ মাহমুদ': 'Was Asif Mahmud über ein Bündnis von Jamaat und NCP sagte',
    'আমাদের Akhter Hossen 🫡': 'Unser Akhter Hossen 🫡',
    'বাংলাদেশের বর্তমান অবস্থা..': 'Bangladesch heute',
    'জার্মানিতে NCP-এর কার্যক্রম ও প্রতিনিধিত্ব নিয়ে ভিডিও': 'Video über Aktivitäten und Vertretung der NCP in Deutschland',
    'জার্মানির একটি গুরুত্বপূর্ণ কর্মসূচিতে অংশগ্রহণ, NCP-এর রাজনৈতিক স্বাতন্ত্র্য এবং NCP Diaspora Alliance Germany-এর প্রতিনিধিত্ব নিয়ে ভিডিওটি প্রকাশ করা হয়েছে।': 'Das Video behandelt die Teilnahme an einer wichtigen Veranstaltung in Deutschland, das eigenständige politische Profil der NCP und die Vertretung der NCP Diaspora Alliance Germany.',
    'NCP এর তরুণ নেতা-তাহসিন রিয়াজের সামনে বিএনপিপন্থী সাংবাদিকরাও ধরাশায়ী হয়🔥': 'Selbst BNP-nahe Journalisten blieben dem jungen NCP-Politiker Tahsin Riaz eine Antwort schuldig 🔥',
    'গণঅভ্যুত্থানের মহানায়ক কে?': 'Wer ist die prägende Figur des Volksaufstands?',
    '৫ আগস্ট হাসিনা পালিয়ে গেলে সেনাবাহিনীর সৈনিকেরা যাকে কাঁধে নিয়ে বিজয় উল্লাস করেছিল তিনিই এই অভ্যুত্থানের মহানায়ক - আমাদের মহানায়ক নাহিদ ইসলাম': 'Als Sheikh Hasina am 5. August floh, hoben Soldaten Nahid Islam im Siegesjubel auf ihre Schultern. Der Beitrag stellt ihn als prägende Figur des Aufstands dar – unseren Nahid Islam.',
    'কূটনৈতিক সম্পৃক্ততা': 'Diplomatischer Austausch',
    'জার্মানিতে কূটনৈতিক ও কমিউনিটি নেটওয়ার্কিংয়ে NCPDA Germany': 'NCPDA Germany im diplomatischen und gesellschaftlichen Austausch',
    'বাংলাদেশ দূতাবাস, বার্লিন আয়োজিত মহান স্বাধীনতা ও জাতীয় দিবস ২০২৬-এর নেটওয়ার্কিং অনুষ্ঠানে NCP Diaspora Alliance Germany-এর প্রতিনিধিদল কূটনীতিক ও কমিউনিটি নেতাদের সঙ্গে বাংলাদেশের জলবায়ু ঝুঁকি, গণতান্ত্রিক আকাঙ্ক্ষা ও রাষ্ট্র সংস্কার নিয়ে মতবিনিময় করে।': 'Bei einer Netzwerkveranstaltung zum Unabhängigkeits- und Nationalfeiertag 2026, organisiert von der Botschaft von Bangladesch in Berlin, tauschte sich eine Delegation der NCP Diaspora Alliance Germany mit Diplomaten und Community-Vertretern über Bangladeschs Klimarisiken, demokratische Bestrebungen und Staatsreformen aus.',
    'বার্লিনে কূটনীতিক ও কমিউনিটি নেতাদের সঙ্গে NCPDA Germany-এর প্রতিনিধিদল': 'Delegation der NCPDA Germany mit Diplomaten und Community-Vertretern in Berlin',
    'দূতাবাস কার্যক্রম': 'Austausch mit der Botschaft',
    'বাংলাদেশ দূতাবাস, বার্লিনে জুলাই সনদ ও প্রবাসী ইস্যুতে মতবিনিময়': 'Gespräch in der Botschaft von Bangladesch in Berlin über die Juli-Charta und Diaspora-Themen',
    'NCP Diaspora Alliance Germany-এর প্রতিনিধিদল বাংলাদেশের রাষ্ট্রদূতের সঙ্গে সৌজন্য সাক্ষাতে গণভোটের জনরায়, জুলাই সনদ বাস্তবায়ন, সংবিধান পরিষদ এবং জার্মানিতে বসবাসরত প্রবাসী বাংলাদেশিদের বিভিন্ন বিষয় নিয়ে মতবিনিময় করে।': 'Bei einem Höflichkeitsbesuch beim Botschafter Bangladeschs sprach eine Delegation der NCP Diaspora Alliance Germany über das Referendumsmandat, die Umsetzung der Juli-Charta, eine verfassungsgebende Versammlung und Anliegen der in Deutschland lebenden Bangladescherinnen und Bangladescher.',
    'বাংলাদেশ দূতাবাস বার্লিনে NCP Diaspora Alliance Germany-এর প্রতিনিধিদল': 'Delegation der NCP Diaspora Alliance Germany in der Botschaft von Bangladesch in Berlin',
    '২০২৬': '2026',
    'নীতি ও ইশতেহার': 'Politik & Wahlprogramm',
    'জাতীয় নাগরিক পার্টির নীতি ও ইশতেহারসংক্রান্ত প্রকাশনা': 'Veröffentlichungen der National Citizen Party zu Politik und Wahlprogramm',
    'রাষ্ট্র সংস্কার, অর্থনীতি, শিক্ষা, স্বাস্থ্য, স্থানীয় সরকার ও জাতীয় নিরাপত্তাসহ বিভিন্ন খাতে NCP-এর নীতিগত অবস্থান ও ইশতেহারসংক্রান্ত প্রকাশনা দলটির অফিসিয়াল চ্যানেলে পাওয়া যাবে।': 'Auf den offiziellen Kanälen der NCP finden sich politische Positionen und Wahlprogramm-Materialien der Partei zu Staatsreform, Wirtschaft, Bildung, Gesundheit, kommunaler Verwaltung, nationaler Sicherheit und weiteren Bereichen.',
    'জুলাইয়ের চেতনায় দেশ গড়ার অঙ্গীকারের গ্রাফিক': 'Grafik zum Bekenntnis, das Land im Geist des Juli aufzubauen',
    'bdnews24-এর লাইভ আপডেট অনুযায়ী প্রবাসী ভোটাররা ব্যালট কাস্ট করেছেন।': 'Auslandswählerinnen und -wähler, die laut Live-Berichterstattung von bdnews24 ihre Stimme abgegeben haben.',
    'প্রবাসী ভোটারদের ফেরত পাঠানো ব্যালটের সংখ্যা হিসেবে রিপোর্ট করা হয়েছে।': 'Als zurückgesandt gemeldete Stimmzettel von Auslandswählerinnen und -wählern.',
    'দেশে ও বিদেশে কাস্ট করা মোট পোস্টাল ব্যালট গণনায় অন্তর্ভুক্ত হয়েছে।': 'Im In- und Ausland abgegebene Briefwahlstimmen, die in die Auszählung eingingen.',
    'The Daily Star-এর EC-ডেটা বিশ্লেষণে পোস্টাল ব্যালট টার্নআউট; সামগ্রিক টার্নআউট ছিল 60%।': 'Briefwahlbeteiligung laut Analyse der Daten der Wahlkommission durch The Daily Star; die Gesamtwahlbeteiligung lag bei 60 %.',
    '২০২৬ সালের জাতীয় নির্বাচন প্রবাসী ভোটের ইতিহাসে একটি বড় বাঁক। আগে প্রবাসীদের রাজনৈতিক আলোচনা ছিল আবেগ, দাবি ও ন্যায্যতার প্রশ্নে সীমাবদ্ধ; এবার পোস্টাল ব্যালটের মাধ্যমে সেই দাবির একটি পরিমাপযোগ্য রূপ দেখা গেল। নিবন্ধন, ব্যালট পাঠানো, ব্যালট ফেরত আসা এবং গণনায় অন্তর্ভুক্ত হওয়ার প্রতিটি ধাপ ভবিষ্যতের জন্য গুরুত্বপূর্ণ শিক্ষা রেখে গেছে।': 'Die Parlamentswahl 2026 markierte einen Wendepunkt in der Geschichte der Diaspora-Wahl. Zuvor kreisten politische Debatten der Bangladesch-Diaspora vor allem um Zugehörigkeit, Forderungen und Gerechtigkeit; die Briefwahl machte dieses Anliegen nun messbar. Jede Phase – von der Registrierung und dem Versand bis zur Rücksendung und Auszählung – liefert wichtige Erkenntnisse für künftige Wahlen.',
    'নির্বাচনের আগেই BSS জানিয়েছিল, বিদেশে নিবন্ধিত ভোটারদের জন্য 766,862 ব্যালট পাঠানো হয়েছিল এবং 480,416 প্রবাসী তখন পর্যন্ত ভোট দিয়েছিলেন। নির্বাচনী রাতে bdnews24 জানায়, 544,380 প্রবাসী ভোটার ব্যালট কাস্ট করেছেন এবং 538,370 ব্যালট সংশ্লিষ্ট দেশের পোস্ট অফিস বা মেইলবক্সে ফেরত গেছে। এই সংখ্যা প্রমাণ করে, সুযোগ পেলে প্রবাসীরা শুধু মতামত দেন না, তারা ভোটের প্রক্রিয়ায়ও অংশ নেন।': 'Bereits vor der Wahl berichtete BSS, dass 766.862 Stimmzettel an registrierte Wahlberechtigte im Ausland versandt worden waren und 480.416 von ihnen abgestimmt hatten. Am Wahlabend meldete bdnews24 544.380 abgegebene Stimmen aus der Diaspora und 538.370 über Postämter oder Briefkästen der jeweiligen Länder zurückgesandte Stimmzettel. Die Zahlen zeigen: Wenn die Möglichkeit besteht, äußern Bangladescherinnen und Bangladescher im Ausland nicht nur ihre Meinung, sondern beteiligen sich aktiv am Wahlprozess.',
    'এখানে সবচেয়ে বড় শিক্ষা হলো সংগঠন ও তথ্যের গুরুত্ব। যেসব ভোটার সময়মতো নিবন্ধন, ঠিকানা যাচাই, ব্যালট গ্রহণ এবং ফেরত পাঠানোর প্রক্রিয়া বুঝেছেন, তারাই শেষ পর্যন্ত ভোট দিতে পেরেছেন। তাই প্রবাসী ভোটাধিকার শুধু আইন বা অ্যাপের বিষয় নয়; এটি কমিউনিটি-ভিত্তিক ভোটার শিক্ষা, ভাষা সহায়তা ও আস্থার বিষয়।': 'Die wichtigste Lehre ist die Bedeutung von Organisation und verlässlichen Informationen. Wer Registrierung, Adressprüfung, Empfang und Rücksendung des Stimmzettels rechtzeitig verstanden hatte, konnte den Wahlvorgang auch abschließen. Das Wahlrecht der Diaspora hängt daher nicht allein von Gesetzen oder einer App ab, sondern ebenso von gemeindenaher Wählerinformation, Sprachunterstützung und Vertrauen.',
    'জার্মানি প্রবাসীদের জন্য এর অর্থ স্পষ্ট: ভবিষ্যৎ নির্বাচনের আগে শহরভিত্তিক ভোটার সহায়তা, তথ্য সেশন, নিবন্ধন-গাইড, ভাষান্তরিত নির্দেশিকা এবং দূতাবাস/নির্বাচন কমিশনের অফিসিয়াল লিংক প্রচার করা জরুরি। ভুল তথ্যের বদলে যাচাই করা তথ্য ছড়ানোই হবে সবচেয়ে বড় নাগরিক সেবা।': 'Für die bangladeschische Community in Deutschland ist die Konsequenz klar: Vor künftigen Wahlen braucht es lokale Anlaufstellen, Informationsveranstaltungen, Registrierungshilfen, übersetzte Anleitungen und eine breite Verbreitung offizieller Links der Botschaft und der Wahlkommission. Verifizierte Informationen anstelle von Falschmeldungen bereitzustellen, ist dabei eine zentrale zivilgesellschaftliche Aufgabe.',
    'এই নির্বাচনের প্রবাসী ভোট দেখিয়েছে—বাংলাদেশের গণতন্ত্র এখন ভৌগোলিক সীমানার বাইরে ছড়িয়ে পড়েছে। প্রবাসীরা যদি সংগঠিত, তথ্যভিত্তিক এবং সময়মতো অংশ নেন, তাহলে তারা শুধু অর্থনীতির নয়, রাজনৈতিক জবাবদিহিরও একটি গুরুত্বপূর্ণ শক্তি হয়ে উঠতে পারেন।': 'Die Beteiligung der Diaspora an dieser Wahl zeigt, dass Bangladeschs Demokratie heute über geografische Grenzen hinausreicht. Wenn Menschen im Ausland organisiert, informiert und rechtzeitig teilnehmen, können sie nicht nur wirtschaftlich, sondern auch für politische Rechenschaftspflicht zu einer bedeutenden Kraft werden.',
    'Madaripur-1 আসনে জয়ের ব্যবধান; পোস্টাল ব্যালটে বিজয়ীর লিড ছিল 1,165।': 'Siegmarge im Wahlkreis Madaripur-1; bei den Briefwahlstimmen lag der Sieger mit 1.165 Stimmen vorn.',
    'Sirajganj-4 আসনে জয়ের ব্যবধান; পোস্টাল ব্যালটে বিজয়ীর লিড ছিল 1,377।': 'Siegmarge im Wahlkreis Sirajganj-4; bei den Briefwahlstimmen lag der Sieger mit 1.377 Stimmen vorn.',
    'The Daily Star অনুযায়ী পোস্টাল ব্যালটে Jamaat-এর ভোট শেয়ার।': 'Anteil der Jamaat an den Briefwahlstimmen laut The Daily Star.',
    'পোস্টাল ব্যালটে NCP-এর ভোট শেয়ার; নিয়মিত কেন্দ্রে ছিল 3.05%।': 'Anteil der NCP an den Briefwahlstimmen; in regulären Wahllokalen lag er bei 3,05 %.',
    'বাংলাদেশের সংসদীয় নির্বাচন একক আসনভিত্তিক হওয়ায় অল্প ভোটের ব্যবধানও বড় ফল তৈরি করতে পারে। প্রবাসী ভোট যদি কোনো অঞ্চলে ঘনীভূত হয়—যেমন একটি জেলার বড় সংখ্যক মানুষ ইউরোপ বা মধ্যপ্রাচ্যে থাকেন—তাহলে সেই ভোট স্থানীয় ফলাফলে সরাসরি প্রভাব ফেলতে পারে।': 'Da Bangladeschs Parlamentswahlen in einzelnen Wahlkreisen entschieden werden, können bereits wenige Stimmen große Auswirkungen haben. Konzentrieren sich Diaspora-Wählerinnen und -Wähler auf eine Region – etwa weil viele Menschen aus einem Distrikt in Europa oder im Nahen Osten leben –, können ihre Stimmen das örtliche Ergebnis unmittelbar beeinflussen.',
    'The Daily Star-এর EC-ডেটা-ভিত্তিক প্রতিবেদনে দেখা যায়, Madaripur-1 আসনে জয়ের ব্যবধান ছিল মাত্র 385 ভোট। ওই আসনে বিজয়ী প্রার্থী পোস্টাল ব্যালটে প্রতিদ্বন্দ্বীর চেয়ে 1,165 ভোটে এগিয়ে ছিলেন। Sirajganj-4 আসনেও জয়ের ব্যবধান ছিল 594 ভোট, আর পোস্টাল ব্যালটে বিজয়ীর লিড ছিল 1,377। অর্থাৎ কিছু আসনে পোস্টাল ভোট ফলাফলের ভারসাম্য বদলে দেওয়ার মতো ছিল।': 'Die auf Daten der Wahlkommission beruhende Analyse von The Daily Star zeigt: In Madaripur-1 betrug die Siegermarge nur 385 Stimmen, während der erfolgreiche Kandidat bei der Briefwahl 1.165 Stimmen vor seinem Konkurrenten lag. In Sirajganj-4 lag die Gesamtmarge bei 594 Stimmen, der Briefwahlvorsprung aber bei 1.377. In einigen Wahlkreisen war die Briefwahl somit groß genug, das Kräfteverhältnis des Ergebnisses zu verändern.',
    'জাতীয় পর্যায়েও পোস্টাল ব্যালট আলাদা রাজনৈতিক বার্তা দিয়েছে। একই প্রতিবেদনে বলা হয়েছে, BNP নিয়মিত কেন্দ্রে 49.97% ভোট পেলেও পোস্টাল ব্যালটে পেয়েছে 31.55%; Jamaat নিয়মিত কেন্দ্রে 31.76% হলেও পোস্টাল ব্যালটে 47.81%; আর NCP নিয়মিত কেন্দ্রে 3.05% হলেও পোস্টাল ব্যালটে 5.17%। এই পার্থক্য দেখায়, প্রবাসী ও পোস্টাল ভোটারদের রাজনৈতিক আচরণ দেশে থাকা ভোটারদের সঙ্গে এক নয়।': 'Auch landesweit sendete die Briefwahl ein eigenes politisches Signal. Dem Bericht zufolge erhielt die BNP in regulären Wahllokalen 49,97 %, bei der Briefwahl aber 31,55 %; die Jamaat kam regulär auf 31,76 %, per Brief auf 47,81 %; und die NCP erreichte regulär 3,05 %, bei der Briefwahl hingegen 5,17 %. Diese Unterschiede zeigen, dass Diaspora- und Briefwählende nicht zwingend so abstimmen wie die Wahlbevölkerung in Bangladesch.',
    'এখানে জার্মানি প্রবাসীদের জন্য শিক্ষাটি গুরুত্বপূর্ণ। শুধু ভোট দেওয়া নয়, কোন আসনে কত প্রবাসী ভোটার আছে, তারা কোন ইস্যুতে সাড়া দেন, কোন ভাষায় তথ্য চান, এবং কীভাবে নিরাপদে ভোট ফেরত পাঠাবেন—এসব নিয়ে আগে থেকে ডেটা-ভিত্তিক কাজ করতে হবে।': 'Für die bangladeschische Community in Deutschland ist diese Erkenntnis wichtig. Frühzeitige, datenbasierte Arbeit muss mehr umfassen als die Stimmabgabe: Wie viele Auslandswähler sind einem Wahlkreis zugeordnet? Welche Themen bewegen sie, in welchen Sprachen benötigen sie Informationen und wie können sie ihre Stimmzettel sicher zurücksenden?',
    'প্রবাসী ভোটের শক্তি দলীয় প্রচারণার বাইরে একটি নাগরিক প্রশ্নও তৈরি করে: বাংলাদেশের রাজনীতি কি প্রবাসীদের বাস্তব সমস্যা শুনছে? পাসপোর্ট, দূতাবাস সেবা, বিমানবন্দর অভিজ্ঞতা, রেমিট্যান্স খরচ, বিনিয়োগ নিরাপত্তা এবং পরিবারের সামাজিক সুরক্ষা—এই প্রশ্নগুলো যারা গুরুত্ব দেবে, ভবিষ্যতে প্রবাসী ভোট তাদের প্রতি বেশি সাড়া দিতে পারে।': 'Der Einfluss der Diaspora-Wahl wirft jenseits des Parteienwettbewerbs eine zivilgesellschaftliche Frage auf: Hört die Politik Bangladeschs auf die konkreten Anliegen der Menschen im Ausland? Wer Pässe, Botschaftsdienste, die Behandlung an Flughäfen, Überweisungskosten, Investitionssicherheit und den sozialen Schutz von Familien ernst nimmt, dürfte künftig besonders bei Auslandswählerinnen und -wählern Resonanz finden.',
    '2025 সালের শেষে জার্মানিতে নিবন্ধিত বিদেশি নাগরিকের সংখ্যা, Destatis অনুযায়ী।': 'In Deutschland registrierte ausländische Staatsangehörige Ende 2025 laut Destatis.',
    'জার্মানির বিদেশি নাগরিকদের মধ্যে এশিয়া-উৎপত্তি/এশীয় নাগরিকত্বের মোট সংখ্যা।': 'Ausländische Staatsangehörige in Deutschland mit asiatischer Staatsangehörigkeit oder Herkunft.',
    'World Bank ডেটায় 2025 সালে বাংলাদেশের ব্যক্তিগত রেমিট্যান্স গ্রহণ।': 'Von Bangladesch 2025 empfangene persönliche Rücküberweisungen laut Weltbank.',
    'জার্মান দূতাবাস দক্ষ কর্মীদের সম্ভাবনাময় খাত হিসেবে IT, care ও skilled crafts উল্লেখ করেছে।': 'Die Deutsche Botschaft nennt IT, Pflege und Handwerk als aussichtsreiche Bereiche für Fachkräfte.',
    'জার্মানি প্রবাসীদের অবদানকে শুধু টাকা পাঠানোর মধ্যে সীমাবদ্ধ রাখলে বড় সম্ভাবনা হারিয়ে যায়। জার্মানির কর্মসংস্কৃতি, কারিগরি শিক্ষা, গবেষণা, স্বাস্থ্যসেবা, শিল্প উৎপাদন, পরিবেশ নীতি, স্থানীয় সরকার এবং সামাজিক সংগঠনের অভিজ্ঞতা বাংলাদেশের জন্য বাস্তব সম্পদ হতে পারে।': 'Den Beitrag der bangladeschischen Diaspora in Deutschland auf Geldüberweisungen zu reduzieren, lässt ein weit größeres Potenzial ungenutzt. Erfahrungen mit deutscher Arbeitskultur, beruflicher Bildung, Forschung, Gesundheitswesen, Industrieproduktion, Umweltpolitik, kommunaler Verwaltung und Zivilgesellschaft können für Bangladesch einen konkreten Wert schaffen.',
    'অর্থনীতির দিক থেকে প্রবাসীদের গুরুত্ব স্পষ্ট। World Bank-এর ডেটায় 2025 সালে বাংলাদেশে ব্যক্তিগত রেমিট্যান্স এসেছে প্রায় 33.88 বিলিয়ন ডলার। কিন্তু রেমিট্যান্সের পরের ধাপ হলো উৎপাদনশীল বিনিয়োগ: দক্ষতা প্রশিক্ষণ, স্টার্টআপ, স্বাস্থ্যসেবা, কৃষি-প্রযুক্তি, নবায়নযোগ্য জ্বালানি, ডিজিটাল সেবা এবং স্থানীয় কর্মসংস্থান।': 'Die wirtschaftliche Bedeutung der Diaspora ist offensichtlich. Laut Weltbank erhielt Bangladesch 2025 persönliche Rücküberweisungen in Höhe von rund 33,88 Milliarden US-Dollar. Der nächste Schritt sind jedoch produktive Investitionen: Qualifizierung, Start-ups, Gesundheitsversorgung, Agrartechnologie, erneuerbare Energien, digitale Dienste und lokale Beschäftigung.',
    'জার্মানির অভিজ্ঞতা বিশেষভাবে মূল্যবান তিনটি ক্ষেত্রে: কারিগরি ও ভোকেশনাল ট্রেনিং, স্বাস্থ্য ও কেয়ার সেক্টর, এবং IT/ইঞ্জিনিয়ারিং। জার্মান দূতাবাস নিজেই IT, care এবং skilled crafts-কে সম্ভাবনাময় খাত হিসেবে তুলে ধরে। জার্মানি প্রবাসীরা বাংলাদেশের তরুণদের ভাষা, দক্ষতা, সার্টিফিকেশন ও কর্মসংস্থান-প্রস্তুতিতে মেন্টরশিপ দিতে পারেন।': 'Deutsche Erfahrungen sind in drei Bereichen besonders wertvoll: technische und berufliche Ausbildung, Gesundheit und Pflege sowie IT und Ingenieurwesen. Die Deutsche Botschaft hebt selbst IT, Pflege und Handwerk als aussichtsreiche Felder hervor. Diaspora-Fachkräfte in Deutschland können junge Menschen in Bangladesch bei Sprache, Kompetenzen, Zertifizierung und Berufsvorbereitung begleiten.',
    'আরেকটি বড় ক্ষেত্র হলো প্রতিষ্ঠান গঠন। প্রবাসীরা যদি বিশ্ববিদ্যালয়, হাসপাতাল, ট্রেনিং সেন্টার, পৌরসভা, চেম্বার, স্টার্টআপ এবং সামাজিক সংগঠনের সঙ্গে নির্দিষ্ট প্রকল্পে যুক্ত হন, তাহলে ব্যক্তিগত অনুদানের বদলে দীর্ঘমেয়াদি ফল তৈরি হবে। উদাহরণ: নার্সিং ভাষা প্রস্তুতি, সফটওয়্যার মেন্টরশিপ, জার্মান-স্টাইল অ্যাপ্রেন্টিসশিপ, সিটি-টু-সিটি সহযোগিতা।': 'Ein weiteres großes Feld ist der Aufbau von Institutionen. Arbeiten Diaspora-Fachkräfte mit Universitäten, Krankenhäusern, Bildungszentren, Kommunen, Kammern, Start-ups und zivilgesellschaftlichen Organisationen an klar definierten Projekten, entstehen über Einzelspenden hinaus langfristige Wirkungen. Beispiele sind Sprachvorbereitung für Pflegekräfte, Software-Mentoring, duale Ausbildung nach deutschem Vorbild und Städtepartnerschaften.',
    'জার্মানি ডায়াস্পোরার সবচেয়ে বড় ভূমিকা হতে পারে ‘নেটওয়ার্ক আর্কিটেক্ট’ হওয়া—যারা বাংলাদেশি তরুণ, জার্মান প্রতিষ্ঠান, বাংলাদেশি নীতিনির্ধারক এবং প্রবাসী পেশাজীবীদের একই টেবিলে আনবে। এতে প্রবাসী শক্তি আবেগ থেকে বাস্তব উন্নয়ন-পরিকল্পনায় রূপ নেবে।': 'Die wichtigste Rolle der Deutschland-Diaspora könnte die eines „Netzwerkarchitekten“ sein: junge Menschen aus Bangladesch, deutsche Institutionen, bangladeschische Entscheidungsträger und Diaspora-Fachkräfte an einen Tisch zu bringen. So wird aus Verbundenheit eine konkrete Entwicklungsplanung.',
    'জার্মান দূতাবাসের স্ট্যান্ডার্ড প্রসেসিং টাইম: student visa।': 'Von der Deutschen Botschaft angegebene Standardbearbeitungszeit für ein Studierendenvisum.',
    'Blue Card বা pre-approval সহ employment-এর নির্দেশিত প্রসেসিং টাইম।': 'Richtwert für die Bearbeitung einer Beschäftigung mit EU Blue Card oder Vorabzustimmung.',
    'Opportunity Card-এর নির্দেশিত প্রসেসিং টাইম।': 'Richtwert für die Bearbeitung der Chancenkarte.',
    '2026 Blue Card salary threshold: shortage/new entrant এবং regular occupation।': 'Gehaltsgrenzen 2026 für die EU Blue Card: Engpassberufe/Berufseinsteiger und reguläre Berufe.',
    'বাংলাদেশ থেকে জার্মানিতে আসার বৈধ পথগুলোকে এক কথায় বোঝা যায় না। কারও জন্য সেরা পথ উচ্চশিক্ষা, কারও জন্য vocational training, কারও জন্য skilled worker visa, কারও জন্য EU Blue Card, আর কারও জন্য Opportunity Card। তাই প্রথম কাজ হলো নিজের প্রোফাইল—শিক্ষা, ভাষা, অভিজ্ঞতা, পেশা ও অর্থনৈতিক প্রস্তুতি—সৎভাবে মূল্যায়ন করা।': 'Es gibt nicht den einen legalen Weg von Bangladesch nach Deutschland. Für manche passt ein Studium, für andere eine Berufsausbildung; weitere kommen für ein Fachkräftevisum, eine EU Blue Card oder die Chancenkarte infrage. Der erste Schritt ist deshalb eine ehrliche Einschätzung von Ausbildung, Sprachkenntnissen, Erfahrung, Beruf und finanzieller Vorbereitung.',
    'শিক্ষার্থীদের জন্য জার্মান দূতাবাসের নির্দেশনা অনুযায়ী student visa অনলাইন সিস্টেমের মাধ্যমে আবেদন করা যায়। skilled worker/Blue Card applicants-দের ক্ষেত্রে পূর্ণ ডকুমেন্টেশন, বৈধ পাসপোর্ট, আবেদন ফর্ম, qualification proof, German recognition বা equivalence proof, employer declaration এবং প্রাসঙ্গিক স্বাস্থ্যবিমার নথি দরকার হতে পারে। কোনো আবেদন অসম্পূর্ণ হলে প্রক্রিয়া বিলম্বিত হয়।': 'Nach den Hinweisen der Deutschen Botschaft können Studierende ihr Visum über das Online-System beantragen. Für Fachkräfte und EU-Blue-Card-Anträge können vollständige Unterlagen, ein gültiger Pass, Antragsformulare, Qualifikationsnachweise samt deutscher Anerkennung oder Gleichwertigkeit, eine Arbeitgebererklärung und geeignete Krankenversicherungsnachweise erforderlich sein. Unvollständige Anträge verzögern das Verfahren.',
    '২০২৬ সালের Make it in Germany তথ্য অনুযায়ী EU Blue Card-এর বেতন সীমা shortage occupation ও নতুন গ্র্যাজুয়েটদের জন্য €45,934.20 এবং অন্যান্য পেশার জন্য €50,700। IT specialists-দের ক্ষেত্রে নির্দিষ্ট অভিজ্ঞতা থাকলে বিশ্ববিদ্যালয় ডিগ্রি ছাড়াও কিছু সুযোগ আছে, তবে এটি শর্তসাপেক্ষ এবং অফিসিয়াল নির্দেশনা দেখে এগোতে হবে।': 'Nach den Angaben von Make it in Germany für 2026 liegt die Gehaltsgrenze der EU Blue Card für Engpassberufe und neue Hochschulabsolventen bei 45.934,20 Euro, für andere Berufe bei 50.700 Euro. IT-Fachkräfte können unter bestimmten Voraussetzungen auch ohne Hochschulabschluss infrage kommen, wenn sie die erforderliche Erfahrung besitzen; maßgeblich sind stets die offiziellen Vorgaben.',
    'ভিসা প্রক্রিয়ায় বাস্তববাদী হওয়া জরুরি। দূতাবাসের প্রকাশিত স্ট্যান্ডার্ড সময় অনুযায়ী student visa প্রায় 4 সপ্তাহ, Blue Card/pre-approval employment প্রায় 3 সপ্তাহ, general employment 4-6 সপ্তাহ এবং Opportunity Card প্রায় 8 সপ্তাহ লাগতে পারে। এগুলো গ্যারান্টি নয়; সম্পূর্ণ নথি, কেসভেদে যাচাই এবং দূতাবাসের কাজের চাপের ওপর সময় বদলাতে পারে।': 'Bei Visaverfahren sind realistische Erwartungen wichtig. Die Botschaft nennt als Standard etwa vier Wochen für ein Studierendenvisum, drei Wochen für Blue Card oder vorab genehmigte Beschäftigung, vier bis sechs Wochen für allgemeine Beschäftigung und acht Wochen für die Chancenkarte. Das sind keine Garantien; vollständige Unterlagen, Einzelfallprüfungen und die Auslastung der Botschaft beeinflussen die Dauer.',
    'কমিউনিটি পর্যায়ে জার্মানি প্রবাসীরা এখানে সহায়তা করতে পারেন: ভুল তথ্য কমানো, অফিসিয়াল লিংক শেয়ার করা, ভাষা প্রস্তুতি গাইড করা, CV/মোটিভেশন লেটার রিভিউ, recognition process বোঝানো এবং প্রতারণামূলক এজেন্সি থেকে মানুষকে সতর্ক করা। বৈধ পথ কঠিন হতে পারে, কিন্তু ভুল পথের ক্ষতি অনেক বড়।': 'Die Community in Deutschland kann helfen, Falschinformationen zu reduzieren, offizielle Links zu teilen, bei der Sprachvorbereitung zu beraten, Lebensläufe und Motivationsschreiben zu prüfen, Anerkennungsverfahren zu erklären und vor betrügerischen Agenturen zu warnen. Legale Wege können anspruchsvoll sein – der Schaden eines falschen Weges ist jedoch weit größer.',
    'World Bank ডেটায় 2025 সালে বাংলাদেশের personal remittances received।': 'Von Bangladesch 2025 empfangene persönliche Rücküberweisungen laut Weltbank.',
    'World Bank ডেটায় 2024 সালের personal remittances received।': 'Von Bangladesch 2024 empfangene persönliche Rücküberweisungen laut Weltbank.',
    'BSS/BMET অনুযায়ী 2025 সালের জানুয়ারি-নভেম্বর বিদেশে কর্মসংস্থানে গেছেন।': 'Bangladescherinnen und Bangladescher, die von Januar bis November 2025 laut BSS/BMET eine Beschäftigung im Ausland aufnahmen.',
    'BSS/BMET অনুযায়ী 2004 সাল থেকে বিদেশে কর্মসংস্থান পাওয়া বাংলাদেশির সংখ্যা।': 'Bangladescherinnen und Bangladescher, die seit 2004 laut BSS/BMET eine Beschäftigung im Ausland fanden.',
    'রেমিট্যান্স বাংলাদেশের পরিবার, বৈদেশিক মুদ্রা, ভোগব্যয় এবং গ্রামীণ অর্থনীতির জন্য অত্যন্ত গুরুত্বপূর্ণ। World Bank-এর ডেটায় 2025 সালে বাংলাদেশে personal remittances received প্রায় 33.88 বিলিয়ন ডলার, যা 2024 সালের প্রায় 27.52 বিলিয়ন ডলারের তুলনায় বড় বৃদ্ধি।': 'Rücküberweisungen sind für bangladeschische Familien, Devisenreserven, Konsum und ländliche Wirtschaft von zentraler Bedeutung. Laut Weltbank erhielt Bangladesch 2025 rund 33,88 Milliarden US-Dollar an persönlichen Rücküberweisungen – ein deutlicher Anstieg gegenüber etwa 27,52 Milliarden US-Dollar im Jahr 2024.',
    'BSS-এর BMET-ভিত্তিক রিপোর্ট অনুযায়ী 2025 সালের জানুয়ারি থেকে নভেম্বর পর্যন্ত 1,011,882 বাংলাদেশি বিদেশে কর্মসংস্থানে গেছেন। একই রিপোর্টে 2004 সাল থেকে 14,461,546 বাংলাদেশির বিদেশে কর্মসংস্থানের কথা উল্লেখ করা হয়েছে। এই কর্মসংস্থান ও রেমিট্যান্স একসঙ্গে বাংলাদেশের অর্থনীতির একটি বিশাল প্রবাসী ভিত্তি তৈরি করেছে।': 'Laut einem auf BMET-Daten beruhenden BSS-Bericht nahmen zwischen Januar und November 2025 insgesamt 1.011.882 Bangladescherinnen und Bangladescher eine Beschäftigung im Ausland auf. Derselbe Bericht nennt seit 2004 insgesamt 14.461.546 im Ausland Beschäftigte. Auslandsmigration und Rücküberweisungen bilden gemeinsam ein gewaltiges Diaspora-Fundament der bangladeschischen Wirtschaft.',
    'কিন্তু রেমিট্যান্সের বড় অংশ যদি শুধু দৈনন্দিন ব্যয়, জমি বা অনুৎপাদনশীল সম্পদে আটকে থাকে, তাহলে দীর্ঘমেয়াদি শিল্প, কর্মসংস্থান ও উদ্ভাবনে তার প্রভাব সীমিত থাকে। প্রয়োজন নিরাপদ ও স্বচ্ছ প্রবাসী বিনিয়োগ পণ্য, ছোট উদ্যোগে co-investment, diaspora bond, skills fund এবং স্থানীয় উদ্যোক্তাদের সঙ্গে জবাবদিহিমূলক অংশীদারিত্ব।': 'Bleibt ein Großteil der Rücküberweisungen jedoch in Alltagsausgaben, Grundstücken oder unproduktiven Vermögenswerten gebunden, ist ihre langfristige Wirkung auf Industrie, Beschäftigung und Innovation begrenzt. Nötig sind sichere und transparente Anlageprodukte für die Diaspora, Koinvestitionen in kleine Unternehmen, Diaspora-Anleihen, Qualifizierungsfonds und verantwortliche Partnerschaften mit lokalen Unternehmern.',
    'জার্মানি প্রবাসীরা এখানে আলাদা মূল্য যোগ করতে পারেন। জার্মানির নিয়মভিত্তিক কাজ, অডিট, কোয়ালিটি কন্ট্রোল, apprenticeship, green technology এবং SME ব্যবস্থাপনার অভিজ্ঞতা বাংলাদেশের ছোট-মাঝারি উদ্যোগে প্রয়োগ করা যেতে পারে।': 'Bangladescherinnen und Bangladescher in Deutschland können hier einen besonderen Mehrwert schaffen. Erfahrungen mit regelgebundenen Prozessen, Prüfung, Qualitätskontrolle, Ausbildung, grüner Technologie und KMU-Management lassen sich auf kleine und mittlere Unternehmen in Bangladesch übertragen.',
    'স্লোগান হওয়া উচিত: শুধু টাকা পাঠাবো না, প্রতিষ্ঠান গড়বো। প্রবাসী অর্থ যদি দক্ষতা, প্রযুক্তি, বাজার-সংযোগ ও নৈতিক ব্যবস্থাপনার সঙ্গে যুক্ত হয়, তাহলে রেমিট্যান্স বাংলাদেশের পরবর্তী উন্নয়ন-ধাপের শক্তিশালী ইঞ্জিন হতে পারে।': 'Das Leitmotiv sollte lauten: nicht nur Geld senden, sondern Institutionen aufbauen. Wird Diaspora-Kapital mit Kompetenzen, Technologie, Marktzugang und verantwortungsvoller Führung verbunden, können Rücküberweisungen zu einem starken Motor der nächsten Entwicklungsphase Bangladeschs werden.',
    'Recognition partnership-এর ক্ষেত্রে সাধারণভাবে জার্মান ভাষার A2 বা সমমানের শর্ত উল্লেখ করা হয়েছে।': 'Für eine Anerkennungspartnerschaft werden in der Regel Deutschkenntnisse auf Niveau A2 oder ein gleichwertiger Nachweis verlangt.',
    'Qualification measure চলাকালে secondary employment limit 10 থেকে 20 ঘণ্টায় বাড়ানো হয়েছে।': 'Die zulässige Nebenbeschäftigung während einer Qualifizierungsmaßnahme wurde von 10 auf 20 Stunden erhöht.',
    'Recognition-related residence প্রথমে 24 মাস, পরে 12 মাস পর্যন্ত বাড়তে পারে।': 'Der Aufenthalt zur Anerkennung wird zunächst für 24 Monate erteilt und kann um bis zu 12 Monate verlängert werden.',
    'জার্মান দূতাবাসের ভাষায় বিশেষ সম্ভাবনাময় দক্ষতার ক্ষেত্র।': 'Von der Deutschen Botschaft als besonders aussichtsreich bezeichnete Kompetenzfelder.',
    'বাংলাদেশের তরুণদের জন্য জার্মানি একটি বড় সুযোগ, কিন্তু সুযোগ মানেই সহজ পথ নয়। জার্মান শ্রমবাজার দক্ষতা, ভাষা, নথি, স্বীকৃতি এবং পেশাগত শৃঙ্খলা চায়। তাই জার্মানি–বাংলাদেশ স্কিল করিডর গড়তে হলে শুধু ভিসা তথ্য নয়, পূর্ণ প্রস্তুতি-ব্যবস্থা দরকার।': 'Deutschland bietet jungen Menschen aus Bangladesch große Chancen, doch Chancen bedeuten keinen einfachen Weg. Der deutsche Arbeitsmarkt erwartet Kompetenzen, Sprache, vollständige Unterlagen, Anerkennung und berufliche Disziplin. Ein Deutschland–Bangladesch-Qualifikationskorridor braucht daher ein umfassendes Vorbereitungssystem und nicht nur Visainformationen.',
    'Make it in Germany-এর তথ্য অনুযায়ী নতুন Skilled Immigration Act vocational training, practical knowledge, recognition partnership, Opportunity Card এবং EU Blue Card-এর মতো পথগুলোকে বিস্তৃত করেছে। Recognition partnership-এর ক্ষেত্রে চাকরির চুক্তি, যোগ্যতার ভিত্তি এবং সাধারণভাবে A2 স্তরের জার্মান ভাষার শর্ত গুরুত্বপূর্ণ।': 'Laut Make it in Germany hat das neue Fachkräfteeinwanderungsrecht Wege wie Berufsausbildung, berufspraktische Kenntnisse, Anerkennungspartnerschaft, Chancenkarte und EU Blue Card erweitert. Für eine Anerkennungspartnerschaft sind ein Arbeitsvertrag, eine geeignete Qualifikation und in der Regel Deutschkenntnisse auf Niveau A2 zentrale Voraussetzungen.',
    'এখানে জার্মানি প্রবাসীরা খুব বাস্তব ভূমিকা রাখতে পারেন। তারা বাংলাদেশে language bootcamp, nursing/care orientation, IT portfolio review, Ausbildung readiness, CV clinic, interview practice এবং German workplace culture training চালু করতে পারেন। এতে migration হবে নিরাপদ, দক্ষতাভিত্তিক এবং কম খরচে।': 'Die Diaspora in Deutschland kann hier sehr konkret helfen: mit Sprach-Bootcamps, Orientierung für Pflegeberufe, IT-Portfolio-Reviews, Ausbildungsvorbereitung, Lebenslauf-Sprechstunden, Bewerbungstrainings und Schulungen zur deutschen Arbeitskultur in Bangladesch. So wird Migration sicherer, kompetenzbasierter und kostengünstiger.',
    'বাংলাদেশের প্রতিষ্ঠানগুলোরও করণীয় আছে। ভোকেশনাল ট্রেনিং সেন্টারকে জার্মান occupational standard-এর সঙ্গে মিলিয়ে কোর্স বানাতে হবে, নার্সিং ও কেয়ার সেক্টরে ভাষা ও clinical skill জোরদার করতে হবে, IT সেক্টরে portfolio ও practical project-based assessment চালু করতে হবে।': 'Auch Institutionen in Bangladesch sind gefordert. Berufsbildungszentren sollten Kurse an deutschen Berufsstandards ausrichten, Pflegeprogramme Sprache und klinische Kompetenzen stärken und der IT-Sektor Portfolio- sowie praxisbezogene Projektbewertungen einführen.',
    'স্কিল করিডর সফল হলে লাভ দুই দিকেই: জার্মানি পাবে প্রস্তুত দক্ষ কর্মী, বাংলাদেশ পাবে উচ্চমানের রেমিট্যান্স, জ্ঞান, প্রযুক্তি ও ভবিষ্যৎ বিনিয়োগকারী। এটি শুধু অভিবাসন নয়; এটি মানবসম্পদ উন্নয়নের দীর্ঘমেয়াদি কৌশল।': 'Ein erfolgreicher Qualifikationskorridor nützt beiden Seiten: Deutschland gewinnt gut vorbereitete Fachkräfte; Bangladesch erhält höherwertige Rücküberweisungen, Wissen, Technologie und künftige Investoren. Es geht um mehr als Migration – es ist eine langfristige Strategie zur Entwicklung von Humankapital.',
    '১': '1',
    '২': '2',
    '৩': '3',
    '৪': '4',
    'ফর্মের তথ্য কেবল সদস্যপদ যাচাই ও সাংগঠনিক যোগাযোগে ব্যবহৃত হবে। সাবমিশন FormSubmit-এর মাধ্যমে আমাদের ইমেইলে পৌঁছায়; তাদের নীতিমালা অনুযায়ী সাবমিশন সর্বোচ্চ ৩০ দিন আর্কাইভে থাকতে পারে। তথ্য সংশোধন বা মুছে দেওয়ার অনুরোধ ইমেইলে জানাতে পারবেন।': 'Formulardaten werden ausschließlich zur Prüfung der Mitgliedschaft und zur organisatorischen Kommunikation verwendet. FormSubmit übermittelt die Angaben an unsere E-Mail-Adresse und kann sie gemäß eigener Richtlinie bis zu 30 Tage speichern. Berichtigung oder Löschung können Sie per E-Mail verlangen.',
    'অনুগ্রহ করে সব আবশ্যিক তথ্য পূরণ করুন এবং তথ্য ব্যবহারের সম্মতিটি নিশ্চিত করুন।': 'Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie Ihre Einwilligung zur Datenverarbeitung.',
    '✅ ধন্যবাদ! আপনার নিবন্ধন সফল হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।': '✅ Vielen Dank! Ihre Registrierung war erfolgreich. Wir melden uns in Kürze.',
    '❌ কিছু একটা ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি ইমেইল করুন: ncpdiasporade@gmail.com': '❌ Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie direkt an ncpdiasporade@gmail.com.',
  };

  const catalogs = { bn: {}, en, de };
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const listeners = new Set();
  let currentLanguage = 'bn';

  function t(value, language = currentLanguage) {
    if (typeof value !== 'string' || language === 'bn') return value;
    return catalogs[language]?.[value] ?? value;
  }

  function localize(value, language = currentLanguage) {
    if (typeof value === 'string') return t(value, language);
    if (Array.isArray(value)) return value.map((item) => localize(item, language));
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localize(item, language)]));
    }
    return value;
  }

  function preserveWhitespace(original, translated) {
    const leading = original.match(/^\s*/)?.[0] ?? '';
    const trailing = original.match(/\s*$/)?.[0] ?? '';
    return `${leading}${translated}${trailing}`;
  }

  function shouldIgnore(element) {
    return !element || element.closest('script, style, [data-i18n-ignore]');
  }

  function captureAndTranslate(root = document) {
    const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (shouldIgnore(node.parentElement) || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node;
    while ((node = walker.nextNode())) {
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const source = originalText.get(node);
      const trimmed = source.trim();
      node.nodeValue = preserveWhitespace(source, t(trimmed));
    }

    const attributes = ['aria-label', 'placeholder', 'alt', 'title'];
    (root.querySelectorAll ? root.querySelectorAll('*') : []).forEach((element) => {
      if (shouldIgnore(element)) return;
      if (!originalAttributes.has(element)) originalAttributes.set(element, {});
      const stored = originalAttributes.get(element);
      attributes.forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        if (!(attribute in stored)) stored[attribute] = element.getAttribute(attribute);
        element.setAttribute(attribute, t(stored[attribute]));
      });
    });
  }

  function updateMeta() {
    const values = meta[currentLanguage];
    document.title = values.title;
    const description = document.querySelector('meta[name="description"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (description) description.content = values.description;
    if (ogDescription) ogDescription.content = values.ogDescription;
  }

  function updateSelector() {
    const currentName = document.querySelector('[data-language-current-name]');
    const currentCode = document.querySelector('[data-language-current-code]');
    const toggle = document.querySelector('[data-language-toggle]');
    const menu = document.querySelector('[data-language-menu]');
    if (currentName) currentName.textContent = NAMES[currentLanguage].name;
    if (currentCode) currentCode.textContent = NAMES[currentLanguage].code;
    if (toggle) toggle.setAttribute('aria-label', t('ভাষা নির্বাচন করুন'));
    if (menu) menu.setAttribute('aria-label', t('ভাষাসমূহ'));
    document.querySelectorAll('[data-language-option]').forEach((option) => {
      const active = option.dataset.languageOption === currentLanguage;
      option.classList.toggle('active', active);
      option.setAttribute('aria-checked', String(active));
    });
  }

  function setLanguage(language, { persist = true, updateUrl = true, notify = true } = {}) {
    if (!SUPPORTED.includes(language)) language = 'bn';
    currentLanguage = language;
    document.documentElement.lang = language;
    document.documentElement.dataset.language = language;
    captureAndTranslate(document);
    updateMeta();
    updateSelector();

    if (persist) {
      try { localStorage.setItem('ncpda-language', language); } catch { /* Storage may be unavailable. */ }
    }

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (language === 'bn') url.searchParams.delete('lang');
      else url.searchParams.set('lang', language);
      history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }

    if (notify) listeners.forEach((listener) => listener(language));
  }

  function closeMenu() {
    const menu = document.querySelector('[data-language-menu]');
    const toggle = document.querySelector('[data-language-toggle]');
    if (menu) menu.hidden = true;
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  function initSelector() {
    const selector = document.querySelector('[data-language-selector]');
    const toggle = document.querySelector('[data-language-toggle]');
    const menu = document.querySelector('[data-language-menu]');
    if (!selector || !toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) menu.querySelector(`[data-language-option="${currentLanguage}"]`)?.focus();
    });

    menu.addEventListener('click', (event) => {
      const option = event.target.closest('[data-language-option]');
      if (!option) return;
      setLanguage(option.dataset.languageOption);
      closeMenu();
      toggle.focus();
    });

    document.addEventListener('click', (event) => {
      if (!selector.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  function initialLanguage() {
    const queryLanguage = new URL(window.location.href).searchParams.get('lang');
    if (SUPPORTED.includes(queryLanguage)) return queryLanguage;
    try {
      const saved = localStorage.getItem('ncpda-language');
      if (SUPPORTED.includes(saved)) return saved;
    } catch { /* Storage may be unavailable. */ }
    return 'bn';
  }

  function init() {
    initSelector();
    setLanguage(initialLanguage(), { persist: false, updateUrl: false, notify: false });
  }

  window.SiteI18n = {
    init,
    t,
    localize,
    setLanguage,
    get language() { return currentLanguage; },
    get locale() { return LOCALES[currentLanguage]; },
    onChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    formatDate(value, options = {}) {
      const date = value instanceof Date ? value : new Date(value);
      return new Intl.DateTimeFormat(LOCALES[currentLanguage], options).format(date);
    },
    formatNumber(value, options = {}) {
      return new Intl.NumberFormat(LOCALES[currentLanguage], options).format(value);
    },
  };
})();
