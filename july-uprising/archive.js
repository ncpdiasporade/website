(() => {
  'use strict';

  const SOURCES = [
    { org: 'OHCHR', title: 'Fact-Finding Report: Human Rights Violations and Abuses, July–August 2024', meta: 'United Nations Human Rights Office · 12 Feb 2025', url: 'https://www.ohchr.org/sites/default/files/documents/countries/bangladesh/ohchr-fftb-hr-violations-bd.pdf' },
    { org: 'OHCHR', title: 'Preliminary Analysis of Recent Protests and Unrest in Bangladesh', meta: 'United Nations Human Rights Office · 16 Aug 2024', url: 'https://www.ohchr.org/sites/default/files/2024-08/OHCHR-Preliminary-Analysis-of-Recent-Protests-and-Unrest-in-Bangladesh-16082024_2.pdf' },
    { org: 'UNICEF', title: 'At least 32 children killed in Bangladesh violence', meta: 'UNICEF South Asia · 2 Aug 2024', url: 'https://www.unicef.org/press-releases/least-32-children-killed-bangladesh-violence' },
    { org: 'Amnesty', title: 'What happened at the quota-reform protests in Bangladesh?', meta: 'Amnesty International · July 2024', url: 'https://www.amnesty.org/en/latest/news/2024/07/what-is-happening-at-the-quota-reform-protests-in-bangladesh/' },
    { org: 'Amnesty', title: 'Thousands of protesters arrested arbitrarily', meta: 'Amnesty International · 2 Aug 2024', url: 'https://www.amnesty.org/en/documents/asa13/8388/2024/en/' },
    { org: 'The Daily Star', title: 'From quota to state reform — July Uprising timeline', meta: 'Chronology with linked reporting · 2018–5 Aug 2024', url: 'https://www.thedailystar.net/july-uprising/index.html' },
    { org: 'The Daily Star', title: '36 Days of July — reporting, testimony and investigations', meta: 'Multimedia archive · 2026', url: 'https://july36.thedailystar.net/' },
    { org: 'July Memorial Museum', title: 'July Mass Uprising photo and document archive', meta: 'Government of Bangladesh public archive', url: 'https://july36.gov.bd/archives/photo' },
    { org: 'The Business Standard', title: 'How the Bangladeshi diaspora supported the July movement from abroad', meta: 'Diaspora reporting, including Germany · 7 Sep 2024', url: 'https://www.tbsnews.net/features/panorama/how-bangladeshi-diaspora-supported-july-movement-abroad-935821' },
    { org: 'AP', title: 'Student leaders who led the uprising form the National Citizen Party', meta: 'Associated Press · 28 Feb 2025', url: 'https://apnews.com/article/7565d2860be1ed4c03bfd9a5beb4f539' },
    { org: 'BSS', title: 'National Citizen Party officially launched', meta: 'Bangladesh Sangbad Sangstha · 28 Feb 2025', url: 'https://www.bssnews.net/news-flash/250632' },
    { org: 'UN', title: 'Call for justice and protection after the transition', meta: 'United Nations Secretary-General · 5 Aug 2024', url: 'https://www.un.org/sg/en/content/sg/statements/2024-08-05/statement-attributable-the-spokesperson-for-the-secretary-general-bangladesh' },
    { org: 'July Memorial Museum', title: 'The Chronicle of Victory — 36 July', meta: 'Official public chronology of the July Mass Uprising', url: 'https://july36.gov.bd/chronology' },
    { org: 'ITV News', title: 'Bangladesh protests felt across the global diaspora', meta: 'New York, Sydney and Copenhagen reported · 21 Jul 2024', url: 'https://www.itv.com/news/2024-07-21/bangladesh-what-is-going-on-as-violent-protests-sweep-the-country' }
  ];

  const PEOPLE_VISUALS = [
    'https://ncpdagermany.de/img/july/selected/august-03-march-palash-khan.webp',
    'https://ncpdagermany.de/img/july/selected/august-05-parliament-afp.webp',
    'https://ncpdagermany.de/img/july/selected/august-02-salute-orchid-chakma.webp'
  ];

  const bn = {
    archiveLabel:'জুলাই গণঅভ্যুত্থান ২০২৪', share:'শেয়ার', heroKicker:'৩৬ দিন · অসংখ্য মানুষের কণ্ঠ · একটি ভয়হীন বাংলাদেশের স্বপ্ন', heroTitle:'জুলাই গণঅভ্যুত্থান ২০২৪<br><em>এই ইতিহাস আমাদের সবার</em>', heroLead:'শুরু হয়েছিল বৈষম্যের বিরুদ্ধে শিক্ষার্থীদের ন্যায্য দাবিতে। গুলি চলল, ইন্টারনেট নিভল, ঘরে ঘরে ভয় ঢুকল। কিন্তু মানুষ আর পিছু হটেনি। শিক্ষার্থী, শ্রমিক, নারী, অভিভাবক, শিক্ষক, শিল্পী, পেশাজীবী ও প্রবাসী—সব কণ্ঠ মিলে জুলাইকে গণঅভ্যুত্থানে পরিণত করেছিল। এটি সেই মানুষের ইতিহাস; এটি আমাদের সবার ইতিহাস।', explore:'৩৬ দিনের পথ দেখুন', readEvidence:'দমন-পীড়নের প্রমাণ দেখুন', scroll:'মানুষের জুলাইয়ে প্রবেশ করুন',
    navContext:'প্রেক্ষাপট',navTransformation:'রূপান্তর',navTimeline:'সময়রেখা',navMeaning:'৩৬ জুলাই',navEvidence:'প্রমাণ',navPeople:'জনতা',navPromise:'অঙ্গীকার',heroStageOne:'দাবি',heroStageTwo:'রক্ত',heroStageThree:'এক দফা',heroStageFour:'৩৬ জুলাই',
    chorusOne:'কে তুমি? কে আমি? রাজাকার—রাজাকার · কে বলেছে? কে বলেছে? স্বৈরাচার—স্বৈরাচার',chorusTwo:'আমার ভাই কবরে—খুনি কেন বাইরে? · জেগেছে রে জেগেছে—ছাত্রসমাজ জেগেছে · এক দফা—এক দাবি',chorusStatement:'জুলাই ছিল একসঙ্গে জেগে ওঠা বাংলাদেশের নাম—ছাত্রের দাবি, মায়ের শোক, শ্রমিকের সাহস আর জনতার কণ্ঠে লেখা আমাদের সবার ইতিহাস।',uprisingWord:'গণঅভ্যুত্থান',
    methodKicker:'জুলাই সবার', methodTitle:'শিক্ষার্থীরা শুরু করেছিল।<br>তারপর উঠে দাঁড়িয়েছিল বাংলাদেশ।', methodText:'কেউ এসেছিল ক্যাম্পাস থেকে, কেউ কারখানা বা হাসপাতাল থেকে, কেউ সন্তানকে খুঁজতে, কেউ অপরিচিত আহত মানুষকে বাঁচাতে। নারী, শ্রমিক, শিক্ষক, অভিভাবক, আইনজীবী, শিল্পী, রিকশাচালক, দোকানদার ও প্রবাসী—ভিন্ন জীবনের মানুষকে এক করেছিল একটি বিশ্বাস: রাষ্ট্র নাগরিককে ভয় দেখাবে না; রাষ্ট্র নাগরিকের কাছে জবাবদিহি করবে।', balanceText:'এই জুলাইকে কোনো দল, নেতা বা সংগঠন একার সম্পত্তি বলতে পারে না। এর মর্যাদা রক্ষা মানে পুরো সত্য বলা—রাষ্ট্রীয় দমন ও দলীয় সহিংসতার বিচার চাওয়া, আবার আন্দোলনের মধ্যে ও ৫ আগস্টের পর সংঘটিত প্রতিশোধমূলক হামলা এবং সংখ্যালঘুদের ওপর সহিংসতারও নিরপেক্ষ তদন্ত দাবি করা। মানুষের জুলাই মানে সবার ন্যায়বিচার।',
    phasesKicker:'দাবি থেকে গণঅভ্যুত্থান',phasesTitle:'একটি দাবি। একটি গুলি। তারপর—একটি দেশ উঠে দাঁড়াল।',phasesIntro:'প্রথমে প্রশ্ন ছিল চাকরিতে ন্যায্যতার। গুলি, হামলা, কারফিউ ও ইন্টারনেট বন্ধ সেই প্রশ্নকে বদলে দেয়। মানুষ তখন শুধু কোটা নয়—জীবন, মর্যাদা এবং রাষ্ট্র কার জন্য—তার উত্তর চাইতে রাস্তায় নামে।',
    phases:[
      {date:'৫ জুন—১৪ জুলাই',title:'প্রশ্ন উঠল: সুযোগ কি সবার?',text:'ক্যাম্পাসের একটি ন্যায্য দাবি “বাংলা ব্লকেড”-এর মাধ্যমে সড়ক, রেলপথ ও শহরে ছড়িয়ে পড়ল। বিচ্ছিন্ন কণ্ঠ প্রথমবার একসঙ্গে শোনা গেল।',src:[4,6]},
      {date:'১৫—২০ জুলাই',title:'গুলি চলল—দেশ থমকে দাঁড়াল',text:'দলীয় হামলা, আবু সাঈদের হত্যা, প্রাণঘাতী গুলি, কারফিউ ও ইন্টারনেট বন্ধ সবকিছু বদলে দিল। কোটা আর একমাত্র প্রশ্ন রইল না; প্রশ্ন হলো—নাগরিকের জীবনের মূল্য কত?',src:[1,2]},
      {date:'২১—৩১ জুলাই',title:'শোক ঘরে থাকেনি; রাস্তায় ফিরেছে',text:'রায় এলেও মানুষ ঘরে ফেরেনি। হত্যার বিচার, আটক সমন্বয়কদের মুক্তি এবং দায়ীদের জবাবদিহির দাবিতে শিক্ষক, অভিভাবক, শিল্পী, আইনজীবী ও সাধারণ মানুষ পাশে দাঁড়ালেন।',src:[1,5,6]},
      {date:'১—৫ আগস্ট',title:'মানুষ বলল: এবার রাষ্ট্র বদলাও',text:'এক দফা, অসহযোগ ও “মার্চ টু ঢাকা” ছাত্র আন্দোলনকে পূর্ণ ছাত্র–জনতার গণঅভ্যুত্থানে পরিণত করল। ৫ আগস্ট সরকার পতন হলো; শুরু হলো জুলাইয়ের অঙ্গীকার সত্যি করার আরও কঠিন কাজ।',src:[1,6,13]}
    ],
    factsKicker:'ক্ষতের হিসাব', factsTitle:'সংখ্যা নয়—নাম, মুখ, পরিবার এবং থেমে যাওয়া ভবিষ্যৎ', factsNote:'OHCHR-এর হিসাব ১ জুলাই–১৫ আগস্ট ২০২৪ সময়কালের অনুমান; এটি চূড়ান্ত নামভিত্তিক তালিকা নয়। প্রতিটি সংখ্যার পেছনে একজন মানুষ আছেন।',
    facts:[
      {n:'১,৪০০ পর্যন্ত',label:'মানুষ নিহত হয়ে থাকতে পারেন',note:'OHCHR-এর বিশ্বাসযোগ্য উৎসভিত্তিক অনুমান; অধিকাংশ নিহত ও আহত নিরাপত্তা বাহিনীর গুলিতে।',s:1},
      {n:'১২–১৩%',label:'নিহতদের মধ্যে শিশু',note:'OHCHR-এর আনুমানিক অনুপাত—প্রায় ১৮০ শিশু পর্যন্ত।',s:1},
      {n:'১১,৭০০+',label:'আটক',note:'নিরাপত্তা সংস্থাগুলোর দেওয়া তথ্য উদ্ধৃত করে OHCHR-এর প্রতিবেদন।',s:1},
      {n:'১০,০০০+',label:'জুলাইয়েই গ্রেপ্তার',note:'২ আগস্ট ২০২৪-এ Amnesty International-এর তৎকালীন হিসাব।',s:5}
    ],
    timelineKicker:'৩৬ দিনের দিনপঞ্জি', timelineTitle:'৩৬ দিনে একটি দেশের ভয় ভাঙার দিনপঞ্জি', timelineIntro:'এখানে শুধু তারিখ নেই। আছে একটি স্লোগানের ছড়িয়ে পড়া, একটি গুলির সামনে দাঁড়ানো বুক, অন্ধকারে বন্ধ হয়ে যাওয়া ইন্টারনেট, শোকের মিছিল এবং শেষ পর্যন্ত কারফিউ ভেঙে এগিয়ে যাওয়া মানুষ। প্রতিটি বাঁকের পাশে উৎস আছে—কারণ মানুষের স্মৃতিকে সত্যের শক্তি নিয়েই বাঁচতে হবে।',
    timeline:[
      {date:'৫ জুন ২০২৪',tag:'তাৎক্ষণিক সূত্রপাত',title:'হাইকোর্টের রায়ে কোটা পুনর্বহাল',text:'২০১৮ সালের কোটা বাতিলের পরিপত্র অবৈধ ঘোষণা করে মুক্তিযোদ্ধা পরিবারের সন্তান–নাতিদের জন্য ৩০ শতাংশ কোটা কার্যত পুনর্বহাল করা হয়। বিভিন্ন বিশ্ববিদ্যালয়ে প্রতিবাদ শুরু হয়।',src:[1,4,6]},
      {date:'১–৬ জুলাই',tag:'সংগঠিত আন্দোলন',title:'বৈষম্যবিরোধী ছাত্র আন্দোলন ও বাংলা ব্লকেড',text:'শিক্ষার্থীরা নতুন ব্যানারে সংগঠিত হন; ঢাকা থেকে পাবলিক ও প্রাইভেট বিশ্ববিদ্যালয়, জেলা শহর ও মহাসড়কে আন্দোলন ছড়িয়ে পড়ে। ৭ জুলাই থেকে “বাংলা ব্লকেড”-এর ডাক আসে।',src:[2,6]},
      {date:'৭–১১ জুলাই',tag:'দেশব্যাপী বিস্তার',title:'রাস্তা, রেল ও ক্যাম্পাসে এক দাবি',text:'ঢাকার গুরুত্বপূর্ণ মোড় এবং দেশের বিভিন্ন সড়ক–রেলপথ অবরোধ হয়। আদালতের স্থগিতাদেশ এলেও শিক্ষার্থীরা নির্বাহী ও আইনগতভাবে টেকসই সংস্কারের নিশ্চয়তা চেয়ে কর্মসূচি চালিয়ে যান।',src:[4,6]},
      {date:'১৪ জুলাই',tag:'রাজনৈতিক বাঁক',title:'“রাজাকার” মন্তব্যে ক্ষোভের বিস্ফোরণ',text:'শেখ হাসিনার সংবাদ সম্মেলনের একটি মন্তব্যকে আন্দোলনকারীরা অপমান হিসেবে দেখেন। রাতে ক্যাম্পাসগুলোতে প্রতিবাদী স্লোগান ছড়িয়ে পড়ে এবং সংঘাতের ঝুঁকি দ্রুত বাড়ে।',src:[1,6],breaking:true},
      {date:'১৫ জুলাই',tag:'দলীয় হামলা',title:'ঢাকা বিশ্ববিদ্যালয় ও হাসপাতালে আক্রমণ',text:'OHCHR ও সংবাদ প্রতিবেদনে আওয়ামী লীগ-সংশ্লিষ্ট ছাত্র ও যুব সংগঠনের সদস্যদের শান্তিপূর্ণ আন্দোলনকারীদের ওপর হামলার বর্ণনা রয়েছে; আহতদের ঢাকা মেডিকেল কলেজ হাসপাতালেও আক্রমণ করা হয়।',src:[1,4,6],breaking:true},
      {date:'১৬ জুলাই',tag:'ভয় ভাঙার দিন',title:'আবু সাঈদের হত্যাকাণ্ড দেশকে নাড়িয়ে দেয়',text:'রংপুরে নিরস্ত্র শিক্ষার্থী আবু সাঈদ পুলিশের গুলিতে নিহত হন। দৃশ্যটি ছড়িয়ে পড়লে তিনি রাষ্ট্রীয় সহিংসতার বিরুদ্ধে প্রতিরোধের প্রতীক হয়ে ওঠেন; একই দিনে বিভিন্ন জেলায় অন্তত ছয়জন নিহতের খবর আসে।',src:[1,2,6],breaking:true},
      {date:'১৭–১৮ জুলাই',tag:'শাটডাউন ও অন্ধকার',title:'দেশব্যাপী কমপ্লিট শাটডাউন; ইন্টারনেট বিচ্ছিন্ন',text:'গায়েবানা জানাজায় পুলিশি হামলার পর “কমপ্লিট শাটডাউন” ডাকা হয়। ১৮ জুলাই বহু জেলায় প্রাণহানি ও সংঘর্ষের মধ্যে মোবাইল ও পরে ব্রডব্যান্ড ইন্টারনেট বন্ধ করে বাংলাদেশকে কার্যত বিশ্ব থেকে বিচ্ছিন্ন করা হয়।',src:[1,2,6],breaking:true},
      {date:'১৯–২০ জুলাই',tag:'কারফিউ ও প্রাণঘাতী বলপ্রয়োগ',title:'নয় দফা, কারফিউ, সেনা মোতায়েন',text:'গুলিবর্ষণ ও সংঘর্ষে বহু মানুষ নিহত হন। সমন্বয়কেরা বিচার, ক্ষমা ও দায়ীদের অপসারণসহ নয় দফা দেন। সরকার দেশব্যাপী কারফিউ জারি ও সেনা মোতায়েন করে; ঢাকার বিভিন্ন এলাকায় প্রাণঘাতী বলপ্রয়োগ অব্যাহত থাকে।',src:[1,2,6],breaking:true},
      {date:'২০–২৩ জুলাই',tag:'অপহরণ–নির্যাতনের অভিযোগ',title:'নাহিদ ইসলামকে তুলে নেওয়া; কোটা পরিপত্র জারি',text:'সমন্বয়ক নাহিদ ইসলামকে সাদা পোশাকধারীরা তুলে নিয়ে নির্যাতন করেছে—এমন অভিযোগ তিনি মুক্তির পর জানান। ২১ জুলাই আদালত কোটা ৭ শতাংশে নামায় এবং ২৩ জুলাই সরকার পরিপত্র দেয়; কিন্তু তখন আন্দোলনের কেন্দ্রে ছিল হত্যার বিচার।',src:[1,2,6],breaking:true},
      {date:'২৪–২৮ জুলাই',tag:'গণগ্রেপ্তার',title:'ব্লক রেইড, ডিবি হেফাজত ও জোরপূর্বক বিবৃতি',text:'হাজারো মানুষকে গ্রেপ্তার, অজ্ঞাতনামা আসামি করে মামলা এবং বাড়ি–হাসপাতাল থেকে সমন্বয়কদের তুলে নেওয়ার ঘটনা ঘটে। ডিবি হেফাজতে ছয় সমন্বয়কের আন্দোলন প্রত্যাহারের বিবৃতিকে অন্য সংগঠকেরা জোরপূর্বক বলে প্রত্যাখ্যান করেন।',src:[1,5,6],breaking:true},
      {date:'২৯–৩১ জুলাই',tag:'প্রতিরোধের প্রত্যাবর্তন',title:'লাল প্রোফাইল, March for Justice',text:'শিক্ষার্থী, শিক্ষক, অভিভাবক, আইনজীবী, শিল্পী ও নাগরিক সমাজ আবার প্রকাশ্যে দাঁড়ান। রাষ্ট্রীয় শোক প্রত্যাখ্যান করে সামাজিক যোগাযোগমাধ্যম লাল হয়ে ওঠে; “March for Justice” কর্মসূচিতে বাধা ও বলপ্রয়োগের মধ্যেও প্রতিবাদ চলতে থাকে।',src:[2,6,7]},
      {date:'১–২ আগস্ট',tag:'৩২–৩৩ জুলাই',title:'সমন্বয়কদের মুক্তি ও দ্রোহযাত্রা',text:'ছয় সমন্বয়ক ডিবি হেফাজত থেকে মুক্ত হন। ২ আগস্ট শিক্ষার্থী, শিক্ষক, অভিভাবক, চিকিৎসক, শিল্পী ও নাগরিকেরা জাতীয় প্রেস ক্লাব থেকে শহীদ মিনার পর্যন্ত দ্রোহযাত্রায় অংশ নিয়ে হত্যার বিচার ও দমন বন্ধের দাবি জানান।',src:[3,5,6]},
      {date:'৩ আগস্ট',tag:'এক দফা',title:'শহীদ মিনার থেকে সরকারের পদত্যাগ দাবি',text:'বৃষ্টির মধ্যেও বিপুল জনসমাবেশে নাহিদ ইসলাম শেখ হাসিনা ও মন্ত্রিসভার পদত্যাগের এক দফা ঘোষণা করেন। কোটা সংস্কারের আন্দোলন স্পষ্টভাবে সর্বজনীন রাজনৈতিক অভ্যুত্থানে রূপ নেয়।',src:[1,6],breaking:true},
      {date:'৪ আগস্ট',tag:'অসহযোগ',title:'অভ্যুত্থানের সবচেয়ে প্রাণঘাতী দিন',text:'সর্বাত্মক অসহযোগে দেশজুড়ে আন্দোলনকারী, পুলিশ ও আওয়ামী লীগ সমর্থকদের সংঘর্ষ হয়। সংবাদমাধ্যমের প্রাথমিক হিসাবে অন্তত ৯৩ জন নিহত হন। পরদিন “March to Dhaka” এগিয়ে আনার ঘোষণা আসে।',src:[1,6],breaking:true},
      {date:'৫ আগস্ট',tag:'৩৬ জুলাই',title:'কারফিউ ভেঙে ঢাকামুখী জনতা; শেখ হাসিনার পদত্যাগ',text:'হাজারো মানুষ কারফিউ অমান্য করে রাজধানীমুখী হন। দুপুরে শেখ হাসিনা পদত্যাগ করে দেশ ছাড়েন। মানুষ রাস্তায় বিজয় উদ্‌যাপন করে; একই সময়ে বিভিন্ন স্থানে প্রতিশোধমূলক হত্যা, অগ্নিসংযোগ ও সংখ্যালঘুদের ওপর হামলার ঘটনাও ঘটে।',src:[1,6,12],breaking:true},
      {date:'৫ আগস্টের পর',tag:'ন্যায়বিচারের পরীক্ষা',title:'রাষ্ট্র পরিবর্তনের দীর্ঘ কাজ শুরু',text:'অন্তর্বর্তী সরকার, তদন্ত ও সংস্কারের প্রক্রিয়া শুরু হয়। OHCHR সকল পক্ষের হত্যাকাণ্ড, নির্যাতন, প্রতিশোধমূলক সহিংসতা ও সংখ্যালঘুদের ওপর হামলার স্বাধীন তদন্ত, ভুক্তভোগীকেন্দ্রিক বিচার এবং নিরাপত্তা খাত সংস্কারের আহ্বান জানায়।',src:[1,12]}
    ],
    meaningKicker:'ক্যালেন্ডার থেমেছিল, মানুষ থামেনি',meaningTitle:'কেন ৫ আগস্টকে বলা হয় “৩৬ জুলাই”',meaningText:'৩১ জুলাইয়ের রাত পেরিয়ে ক্যালেন্ডার আগস্টে ঢুকেছিল। কিন্তু যেসব মা সন্তান হারিয়েছেন, যেসব তরুণ বন্ধুর রক্তমাখা স্মৃতি নিয়ে আবার রাস্তায় ফিরেছেন, তাঁদের কাছে জুলাই শেষ হওয়ার মতো কোনো মাস ছিল না। বিচার না পাওয়া পর্যন্ত, দমন না থামা পর্যন্ত এবং মানুষের কণ্ঠ বিজয়ে পৌঁছানো পর্যন্ত তাঁরা দিন গুনেছেন জুলাইয়ের ধারাবাহিকতায়—১ আগস্ট তাই ৩২ জুলাই, আর ৫ আগস্ট ৩৬ জুলাই। এটি ক্যালেন্ডারের অতিরিক্ত পাঁচ দিন নয়; রাষ্ট্রের লেখা সমাপ্তি অস্বীকার করে মানুষের নিজের ইতিহাস নিজে শেষ করার নাম।',meaningManifesto:'৩৬ জুলাই সেই দিনের নাম—যেদিন শোক পিছু হটেনি, ভয় পথ আটকাতে পারেনি, আর মানুষ ঘোষণা করেছিল: এই রাষ্ট্রে নাগরিকের জীবন, কণ্ঠ ও মর্যাদাই সবার আগে।',meaningSource:'সরকারি ক্রোনোলজিতে ৩৬ জুলাই দেখুন ↗',
    evidenceKicker:'মানুষের সাক্ষ্য · OHCHR তদন্ত ২০২৫', evidenceTitle:'মানুষ যা দেখেছিল—তদন্তেও উঠে এসেছে সেই দমনের চিত্র', finding:'জাতিসংঘের মানবাধিকার দপ্তর বলেছে, সাবেক সরকার ও তার নিরাপত্তা–গোয়েন্দা কাঠামো, এবং আওয়ামী লীগের সঙ্গে সংশ্লিষ্ট সহিংস উপাদানগুলো বিক্ষোভ দমনে পদ্ধতিগতভাবে গুরুতর মানবাধিকার লঙ্ঘনে জড়িত ছিল—এমন বিশ্বাসের যৌক্তিক ভিত্তি রয়েছে। রাজনৈতিক নেতৃত্ব ও জ্যেষ্ঠ নিরাপত্তা কর্মকর্তাদের জ্ঞান, সমন্বয় ও নির্দেশনায় বিচারবহির্ভূত হত্যা, নির্বিচার গ্রেপ্তার এবং নির্যাতন সংঘটিত হয়েছে বলেও প্রতিবেদনে উল্লেখ করা হয়।', findingAttribution:'— OHCHR Fact-Finding Report, ১২ ফেব্রুয়ারি ২০২৫ (সারসংক্ষেপিত অনুবাদ)', openReport:'তদন্তের পূর্ণ প্রতিবেদন পড়ুন ↗',
    violations:[['প্রাণঘাতী বলপ্রয়োগ','নিরস্ত্র আন্দোলনকারীকে কাছ থেকে গুলি এবং সামরিক রাইফেল ও ধাতব পেলেট ব্যবহারের ঘটনা OHCHR নথিভুক্ত করেছে।'],['নির্বিচার আটক','ব্লক রেইড, বিপুল অজ্ঞাতনামা আসামি এবং শিশু ও পথচারীসহ হাজারো মানুষকে আটক করা হয়।'],['নির্যাতন ও গুম','সমন্বয়ক ও আন্দোলনকারীদের গোপন স্থানে নেওয়া, মারধর, চোখ বাঁধা এবং জোরপূর্বক বিবৃতির অভিযোগ নথিভুক্ত হয়েছে।'],['তথ্য অবরোধ','ইন্টারনেট বন্ধ, সামাজিক যোগাযোগমাধ্যম অবরোধ ও সংবাদপ্রবাহ নিয়ন্ত্রণ চিকিৎসা, নথিকরণ ও জননিরাপত্তা ব্যাহত করে।']],
    photoKicker:'ক্যামেরায় মানুষের জুলাই', photoTitle:'চারটি ছবি। চারটি মুহূর্ত। একটি জেগে ওঠা বাংলাদেশ।', photoIntro:'একটিতে প্রতিরোধ দেয়ালে আঁকা, একটিতে পতাকার সামনে শপথ, একটিতে এক দফার পেছনে মানুষের ঢল, আর একটিতে ৩৬ জুলাইয়ের বিস্ফোরিত মুক্তি। ছবিগুলো শুধু দৃশ্য নয়—মানুষের ভেতরে ভয় ভাঙার মুহূর্ত।',
    photos:[
      {src:'https://ncpdagermany.de/img/july/selected/august-05-parliament-afp.webp',alt:'৫ আগস্ট ২০২৪ জাতীয় সংসদ ভবনে জনতা',title:'৩৬ জুলাই · জনতার বিজয়',credit:'৫ আগস্ট ২০২৪ · AFP আলোকচিত্র'},
      {src:'https://ncpdagermany.de/img/july/selected/august-02-salute-orchid-chakma.webp',alt:'পতাকার পাশে স্যালুটরত আন্দোলনকারী',title:'পতাকার সামনে শপথ',credit:'২ আগস্ট ২০২৪ · ছবি: অর্কিড চাকমা'},
      {src:'https://ncpdagermany.de/img/july/selected/august-03-march-palash-khan.webp',alt:'এক দফা লেখা প্ল্যাকার্ডসহ জনতা',title:'এক দফা · এক জনতা',credit:'৩ আগস্ট ২০২৪ · ছবি: পলাশ খান'},
      {src:'https://ncpdagermany.de/img/july/selected/july-resistance-art.webp',alt:'জুলাইয়ের প্রতিরোধী শিল্পকর্ম',title:'শিল্পেও প্রতিরোধ',credit:'আন্দোলনকালীন শিল্পকর্ম · শিল্পী অজ্ঞাত'}
    ],
    peopleKicker:'কারা ছিল জুলাই?', peopleTitle:'যখন সবাই রাস্তায়—তখনই জুলাই গণঅভ্যুত্থান',
    people:[['তরুণ ও শিক্ষার্থী','তারা প্রশ্ন তুলেছিল, দ্রুত সংগঠিত হয়েছিল এবং গুলির সামনেও দাবি ছাড়েনি। পাবলিক–প্রাইভেট বিশ্ববিদ্যালয়, কলেজ ও মাদ্রাসার তরুণেরা পুরোনো বিভাজন পেরিয়ে একটি প্রজন্মের কণ্ঠ হয়ে উঠেছিল।','৩৬ দিনের পথ পড়ুন','#timeline'],['নারী ও সর্বস্তরের মানুষ','নারী শিক্ষার্থীরা শুরু থেকেই সামনে ছিলেন। পরে শ্রমিক, অভিভাবক, শিক্ষক, চিকিৎসক, আইনজীবী, শিল্পী, রিকশাচালক ও দোকানদার পাশে দাঁড়ালে ছাত্রের আন্দোলন হয়ে ওঠে মানুষের গণঅভ্যুত্থান।','নারীদের ভূমিকা ↗','https://www.thedailystar.net/news/bangladesh/news/inside-july-uprising-women-led-nation-followed-3950221'],['ডিজিটাল ও প্রবাসী প্রতিরোধ','দেশে ইন্টারনেট বন্ধ হলেও ভিডিও, গ্রাফিতি, গান, অনুবাদ ও আন্তর্জাতিক প্রচার সত্যকে সীমান্ত পার করেছিল। প্রবাসীদের মিছিল ও অর্থনৈতিক অসহযোগ জানিয়ে দিয়েছিল—বাংলাদেশের কণ্ঠকে বিচ্ছিন্ন করা যাবে না।','প্রবাসীর ভূমিকা ↗',SOURCES[8].url]],
    ncpKicker:'জুলাই থেকে নতুন রাজনৈতিক যাত্রা', ncpTitle:'জুলাইয়ের সাহসকে রাষ্ট্র গঠনের অঙ্গীকারে নেওয়া', ncpClarification:'<b>ইতিহাসের ধারাবাহিকতা:</b> National Citizen Party (NCP) প্রতিষ্ঠিত হয় ২৮ ফেব্রুয়ারি ২০২৫—জুলাই গণঅভ্যুত্থানের প্রায় সাত মাস পর। তাই জুলাইয়ে এই তরুণদের পরিচয় ছিল বৈষম্যবিরোধী ছাত্র আন্দোলনের সমন্বয়ক ও সংগঠক; পরে সেই অভিজ্ঞতা, জনআকাঙ্ক্ষা ও সংস্কারের দাবি একটি নতুন রাজনৈতিক উদ্যোগে রূপ নেয়।', ncpText:'জুলাইয়ে নেতৃত্ব দিয়ে পরিচিত নাহিদ ইসলাম, আখতার হোসেন, নাসিরুদ্দীন পাটওয়ারী, হাসনাত আবদুল্লাহ ও সারজিস আলমের সঙ্গে সামান্তা শারমিন, আরিফুল ইসলাম আদিব, ডা. তাসনিম জারা, নাহিদা সারওয়ার নিভা ও আব্দুল হান্নান মাসউদসহ বিভিন্ন পেশা ও অঞ্চল থেকে উঠে আসা তরুণেরা NCP-র প্রতিষ্ঠাকালীন নেতৃত্বে যুক্ত হন। দলটির ঘোষিত লক্ষ্য—জাতীয় ঐক্য, নতুন গণতান্ত্রিক সংবিধান, প্রাতিষ্ঠানিক জবাবদিহি এবং একটি “দ্বিতীয় প্রজাতন্ত্র”—জুলাইয়ের জনআকাঙ্ক্ষাকে দীর্ঘমেয়াদি রাষ্ট্র সংস্কারে রূপ দেওয়ার প্রত্যয় বহন করে। এই যাত্রার শক্তি হলো জুলাইয়ের সাহস; দায়িত্ব হলো সেই সাহসকে অন্তর্ভুক্তিমূলক, গণতান্ত্রিক ও নাগরিকমুখী রাজনীতিতে প্রতিষ্ঠা করা।', ncpSourceOne:'AP · NCP প্রতিষ্ঠার প্রেক্ষাপট ↗',ncpSourceTwo:'BSS · প্রতিষ্ঠাকালীন নেতৃত্ব ↗',
    diasporaKicker:'সীমানার বাইরে একই কণ্ঠ',diasporaTitle:'দেশের ইন্টারনেট নিভেছিল—প্রবাসীরা কণ্ঠ নিভতে দেয়নি',diasporaText:'দেশের ভেতর থেকে খবর আসা বন্ধ হয়ে গেলে প্রবাসীরা অনুবাদ করেছেন, ভিডিও যাচাই করে ছড়িয়েছেন, আন্তর্জাতিক সংবাদমাধ্যম ও মানবাধিকার সংগঠনের দরজায় পৌঁছেছেন, দূতাবাসের সামনে দাঁড়িয়েছেন এবং রেমিট্যান্স বয়কটের ডাক তুলেছেন। ডার্মস্টাডট, ফ্রাঙ্কফুর্ট, হাইডেলবার্গ, স্টুটগার্ট ও লন্ডন থেকে ডালাস, নিউ ইয়র্ক, মেলবোর্ন ও সিডনি—শহর বদলেছে, কণ্ঠ বদলায়নি।',diasporaClarification:'<b>স্মৃতি থেকে দায়িত্ব:</b> ২০২৪ সালের সেই বৈশ্বিক সংহতির স্মৃতি, ন্যায়বিচারের দাবি ও নাগরিক দায়িত্ব NCP Diaspora Alliance Germany নতুন প্রজন্মের কাছে বহন করে চলেছে।',diasporaSource:'জার্মানি ও বৈশ্বিক প্রবাসীদের প্রতিবেদন ↗',diasporaSourceGlobal:'নিউ ইয়র্ক–সিডনি–কোপেনহেগেন সংহতি ↗',
    promiseWord:'অঙ্গীকার',legacyKicker:'বিজয়ের পরের প্রশ্ন',legacyTitle:'সরকারের পতন বিজয়ের শেষ কথা নয়',pledges:[['প্রতিটি জীবনের বিচার','প্রতিটি হত্যা, নির্যাতন, গুম ও বেআইনি আটকের স্বাধীন, নিরপেক্ষ ও ভুক্তভোগীকেন্দ্রিক তদন্ত।'],['কোনো প্রতিষ্ঠানের ঊর্ধ্বে দল নয়','পুলিশ, গোয়েন্দা সংস্থা, বিচার ও নির্বাচনব্যবস্থাকে দলীয় নিয়ন্ত্রণ থেকে মুক্ত করে আইন ও নাগরিক অধিকারের অধীন করা।'],['সবার বাংলাদেশ','নারী, ধর্মীয় ও জাতিগত সংখ্যালঘু, আদিবাসী, প্রতিবন্ধী এবং ভিন্নমতের মানুষের নিরাপত্তা ও সমান অধিকার নিশ্চিত করা।'],['স্মৃতি যেন প্রতিরোধ হয়','শহিদ ও আহতদের নাম, সাক্ষ্য ও দলিল সংরক্ষণ; যাচাইকৃত ইতিহাস শেখানো এবং ভবিষ্যৎ দমন ঠেকাতে নাগরিক সচেতনতা গড়ে তোলা।']],
    sourcesKicker:'নিজে যাচাই করুন',sourcesTitle:'বিশ্বাস নয়—উৎস খুলে নিজে যাচাই করুন',sourcesIntro:'এই পাতা কোনো চূড়ান্ত কর্তৃত্ব দাবি করে না; এটি মূল দলিলের দিকে একটি দায়িত্বশীল প্রবেশদ্বার। পূর্ণ সাক্ষ্য, ভুক্তভোগীর তালিকা, আলোকচিত্র, তদন্তপদ্ধতি ও সুপারিশ জানতে উৎসগুলো সরাসরি পড়ুন।',
    sourceTitles:['জুলাই–আগস্ট ২০২৪-এর বিক্ষোভকেন্দ্রিক মানবাধিকার লঙ্ঘন ও নিপীড়ন: অনুসন্ধানী প্রতিবেদন','বাংলাদেশের সাম্প্রতিক বিক্ষোভ ও অস্থিরতার প্রাথমিক বিশ্লেষণ','বাংলাদেশের সহিংসতায় অন্তত ৩২ শিশু নিহত','বাংলাদেশের কোটা সংস্কার আন্দোলনে কী ঘটেছিল?','হাজারো আন্দোলনকারীকে নির্বিচারে গ্রেপ্তার','কোটা থেকে রাষ্ট্র সংস্কার—জুলাই গণঅভ্যুত্থানের সময়রেখা','৩৬ দিনের জুলাই—প্রতিবেদন, সাক্ষ্য ও অনুসন্ধান','জুলাই গণঅভ্যুত্থানের ছবি ও দলিলের উন্মুক্ত আর্কাইভ','বিদেশ থেকে বাংলাদেশি প্রবাসীরা যেভাবে জুলাই আন্দোলনের পাশে দাঁড়িয়েছিলেন','অভ্যুত্থানের ছাত্রনেতাদের National Citizen Party গঠন','National Citizen Party-র আনুষ্ঠানিক আত্মপ্রকাশ','রাজনৈতিক পরিবর্তনের পর ন্যায়বিচার ও সুরক্ষার আহ্বান','বিজয়ের ক্রোনোলজি—৩৬ জুলাই','বিশ্বজুড়ে বাংলাদেশি প্রবাসীদের সংহতি'],
    sourceMeta:['জাতিসংঘ মানবাধিকার দপ্তর · ১২ ফেব্রুয়ারি ২০২৫','জাতিসংঘ মানবাধিকার দপ্তর · ১৬ আগস্ট ২০২৪','UNICEF দক্ষিণ এশিয়া · ২ আগস্ট ২০২৪','Amnesty International · জুলাই ২০২৪','Amnesty International · ২ আগস্ট ২০২৪','সংযুক্ত সংবাদপ্রতিবেদনসহ ধারাবাহিকতা · ২০১৮–৫ আগস্ট ২০২৪','মাল্টিমিডিয়া আর্কাইভ · ২০২৬','বাংলাদেশ সরকারের উন্মুক্ত আর্কাইভ','জার্মানিসহ প্রবাসীদের ভূমিকা · ৭ সেপ্টেম্বর ২০২৪','Associated Press · ২৮ ফেব্রুয়ারি ২০২৫','বাংলাদেশ সংবাদ সংস্থা · ২৮ ফেব্রুয়ারি ২০২৫','জাতিসংঘ মহাসচিব · ৫ আগস্ট ২০২৪','জুলাই গণঅভ্যুত্থান স্মৃতি জাদুঘর · সরকারি ক্রোনোলজি','নিউ ইয়র্ক, সিডনি ও কোপেনহেগেন · ২১ জুলাই ২০২৪'],
    closingKicker:'বিজয় থেকে দায়িত্ব',closingTitle:'জুলাই শেষ হয়নি—<br>যতদিন রাষ্ট্র সত্যিই মানুষের না হয়।',closingText:'জুলাইকে মনে রাখা মানে প্রতিহিংসা নয়; মানে আর কাউকে হারিয়ে যেতে না দেওয়া। প্রতিটি হত্যার বিচার, আহত ও শহিদ পরিবারের মর্যাদা, সংখ্যালঘু ও ভিন্নমতের নিরাপত্তা, এবং এমন প্রতিষ্ঠান গড়া—যেখানে কোনো সরকার গুলি, গুম, কারাগার বা ইন্টারনেট বন্ধ করে মানুষের কণ্ঠ কেড়ে নিতে পারবে না। জুলাই তখনই বেঁচে থাকবে, যখন স্বাধীন নাগরিক মাথা উঁচু করে রাষ্ট্রকে প্রশ্ন করতে পারবে।',shareArchive:'মানুষের জুলাই শেয়ার করুন',footerNote:'জুলাই গণঅভ্যুত্থান ২০২৪—মানুষের স্মৃতি, ন্যায়বিচার ও নাগরিক দায়িত্বের উদ্যোগ',mainSite:'মূল ওয়েবসাইট',sourceNav:'উৎস',backTop:'উপরে ফিরুন ↑',copied:'লিংক কপি হয়েছে।'
  };

  const en = {
    archiveLabel:'July Uprising 2024',share:'Share',heroKicker:'36 days · countless voices · the dream of a Bangladesh without fear',heroTitle:'July Uprising 2024<br><em>this history belongs to everyone</em>',heroLead:'It began with students demanding fairness. Then came gunfire, arrests and an internet blackout. Fear entered homes—but people refused to retreat. Students, workers, women, parents, teachers, artists, professionals and the diaspora turned separate voices into a people’s uprising. This is their history. It belongs to everyone.',explore:'Follow the 36 days',readEvidence:'See the evidence of repression',scroll:'Enter the people’s July',
    navContext:'Context',navTransformation:'Transformation',navTimeline:'Timeline',navMeaning:'36 July',navEvidence:'Evidence',navPeople:'People',navPromise:'Promise',heroStageOne:'Demand',heroStageTwo:'Bloodshed',heroStageThree:'One point',heroStageFour:'36 July',
    chorusOne:'Who are you? Who am I? Razakar—Razakar · Who said so? The autocrat—the autocrat',chorusTwo:'My brother lies in the grave—why is the killer free? · The students have awakened · One demand—one claim',chorusStatement:'July was the name of a Bangladesh awakening together—our shared history, written by students’ demands, mothers’ grief, workers’ courage and the people’s voice.',uprisingWord:'UPRISING',
    methodKicker:'July belongs to everyone',methodTitle:'Students began it.<br>Then Bangladesh stood up.',methodText:'Some came from campuses, others from factories or hospitals. Some searched for their children; some carried an injured stranger to safety. Women, workers, teachers, parents, lawyers, artists, rickshaw drivers, shopkeepers and Bangladeshis abroad were united by one belief: the state must not rule citizens through fear; it must answer to them.',balanceText:'No party, leader or organisation can own this July. Honouring it requires the whole truth: accountability for state repression and party-linked violence, and impartial investigation of retaliatory attacks and violence against minorities during the uprising and after 5 August. A people’s July means justice for everyone.',
    phasesKicker:'From demand to uprising',phasesTitle:'One demand. One gunshot. Then—a country stood up.',phasesIntro:'At first, the question was fairness in public employment. Gunfire, attacks, curfew and an internet blackout changed it. People entered the streets asking not only about quotas, but whose lives the state protects, whose voices it hears and whom power must answer to.',
    phases:[
      {date:'5 June—14 July',title:'The question: is opportunity equal?',text:'A fair demand left the campuses and reached roads, railways and cities through the Bangla Blockade. Scattered voices were heard together for the first time.',src:[4,6]},
      {date:'15—20 July',title:'Shots were fired—and the country stopped',text:'Party-linked attacks, the killing of Abu Sayed, lethal gunfire, curfew and the internet blackout changed everything. Quotas were no longer the only question. The question became: what is a citizen’s life worth?',src:[1,2]},
      {date:'21—31 July',title:'Grief refused to remain indoors',text:'A quota ruling came, but people did not go home. Teachers, parents, artists, lawyers and ordinary citizens stood together for justice, the release of detained coordinators and accountability.',src:[1,5,6]},
      {date:'1—5 August',title:'The people said: change the state',text:'The one-point demand, non-cooperation and March to Dhaka turned a student movement into a people’s uprising. The government fell on 5 August; the harder work of honouring July began.',src:[1,6,13]}
    ],
    factsKicker:'The measure of the wound',factsTitle:'Not numbers—names, faces, families and futures interrupted',factsNote:'The OHCHR estimate covers 1 July–15 August 2024. It is not a final verified list of names. Behind every figure is a human being.',facts:[{n:'Up to 1,400',label:'people may have been killed',note:'OHCHR estimate based on credible sources; the vast majority of killed and injured were shot by security forces.',s:1},{n:'12–13%',label:'of those killed were children',note:'OHCHR’s estimated proportion—potentially as many as about 180 children.',s:1},{n:'11,700+',label:'people detained',note:'OHCHR, citing information provided by the security services.',s:1},{n:'10,000+',label:'arrests in July alone',note:'Amnesty International’s contemporary figure on 2 August 2024.',s:5}],
    timelineKicker:'The 36-day journal',timelineTitle:'How a country broke through fear in 36 days',timelineIntro:'These are more than dates. They carry a slogan travelling from campus to city, an unarmed chest facing a gun, a country cut off from the internet, marches of grief and people finally defying curfew. Every turning point is sourced, because public memory must live with the strength of truth.',
    timeline:[
      {date:'5 June 2024',tag:'Immediate trigger',title:'High Court restores the quota',text:'The court invalidated the 2018 circular that abolished quotas, effectively restoring the 30% allocation for children and grandchildren of freedom fighters. Protests began across several universities.',src:[1,4,6]},
      {date:'1–6 July',tag:'A movement organises',title:'Students Against Discrimination and Bangla Blockade',text:'Students organised under a new banner. Protests spread from Dhaka to public and private universities, district towns and highways; organisers called the “Bangla Blockade” from 7 July.',src:[2,6]},
      {date:'7–11 July',tag:'Nationwide expansion',title:'One demand across roads, rails and campuses',text:'Major junctions in Dhaka and transport routes nationwide were blocked. Even after an appellate stay, students continued to demand durable executive and legislative reform.',src:[4,6]},
      {date:'14 July',tag:'Political turning point',title:'The “razakar” remark ignites outrage',text:'Protesters interpreted a remark by Sheikh Hasina at a press conference as an insult. Protest slogans swept campuses overnight and the risk of confrontation escalated.',src:[1,6],breaking:true},
      {date:'15 July',tag:'Party-linked attacks',title:'Attacks at Dhaka University and a hospital',text:'OHCHR and news reports describe members of Awami League-affiliated student and youth groups attacking peaceful protesters; injured demonstrators were also attacked around Dhaka Medical College Hospital.',src:[1,4,6],breaking:true},
      {date:'16 July',tag:'The day fear broke',title:'The killing of Abu Sayed shakes the country',text:'Police shot and killed unarmed student Abu Sayed in Rangpur. Widely shared footage made him a symbol of resistance to state violence; at least six deaths were reported nationwide that day.',src:[1,2,6],breaking:true},
      {date:'17–18 July',tag:'Shutdown and darkness',title:'Complete Shutdown; the internet goes dark',text:'After police action at memorial prayers, organisers called a “Complete Shutdown.” Amid deaths and clashes across many districts on 18 July, mobile and then broadband internet were cut, isolating Bangladesh.',src:[1,2,6],breaking:true},
      {date:'19–20 July',tag:'Curfew and lethal force',title:'Nine demands, curfew and army deployment',text:'Many were killed amid gunfire and clashes. Coordinators issued nine demands for justice and accountability. The government imposed a nationwide curfew and deployed the army as lethal force continued.',src:[1,2,6],breaking:true},
      {date:'20–23 July',tag:'Abduction and torture alleged',title:'Nahid Islam taken; quota circular issued',text:'Coordinator Nahid Islam said plainclothes men abducted and tortured him. The court reduced quotas to 7% and the government issued a circular, but justice for the killings had become central to the movement.',src:[1,2,6],breaking:true},
      {date:'24–28 July',tag:'Mass arrests',title:'Block raids, DB custody and a coerced statement',text:'Thousands were arrested, cases named vast numbers of unidentified accused, and coordinators were taken from homes and hospitals. Organisers outside custody rejected a withdrawal statement by six detained coordinators as coerced.',src:[1,5,6],breaking:true},
      {date:'29–31 July',tag:'Resistance returns',title:'Red profiles and the March for Justice',text:'Students, teachers, parents, lawyers, artists and civil society returned to public protest. Social media turned red in rejection of official mourning; the March for Justice continued despite obstruction and force.',src:[2,6,7]},
      {date:'1–2 August',tag:'32–33 July',title:'Coordinators freed; the March of Defiance',text:'Six coordinators were released from DB custody. On 2 August, a broad public march from the National Press Club to Shaheed Minar demanded justice for the killings and an end to repression.',src:[3,5,6]},
      {date:'3 August',tag:'One demand',title:'Shaheed Minar calls for the government to resign',text:'Before a huge gathering, Nahid Islam announced the one-point demand for Sheikh Hasina and the cabinet to resign. The quota movement had visibly become a nationwide political uprising.',src:[1,6],breaking:true},
      {date:'4 August',tag:'Non-cooperation',title:'The uprising’s deadliest day',text:'Nationwide non-cooperation brought violent clashes among protesters, police and Awami League supporters. Contemporary media reported at least 93 deaths. Organisers advanced the March to Dhaka to the next day.',src:[1,6],breaking:true},
      {date:'5 August',tag:'36 July',title:'Crowds defy curfew; Sheikh Hasina resigns',text:'Thousands moved towards Dhaka in defiance of curfew. Sheikh Hasina resigned and left the country that afternoon. Crowds celebrated, while revenge killings, arson and attacks on minorities were also reported in several places.',src:[1,6,12],breaking:true},
      {date:'After 5 August',tag:'The test of justice',title:'The long work of changing the state begins',text:'An interim government, investigations and reform processes followed. OHCHR called for independent investigations into abuses by all sides, victim-centred justice and deep reform of the security sector.',src:[1,12]}
    ],
    meaningKicker:'The calendar ended; the people did not',meaningTitle:'Why 5 August is remembered as “36 July”',meaningText:'The calendar crossed into August after the night of 31 July. But for mothers who had lost children, and for young people who returned to the streets carrying the blood-stained memory of friends, July was not a month that could simply end. Until justice came, repression stopped and the people’s voice reached victory, they kept counting within July—1 August became 32 July, and 5 August became 36 July. These were not five extra days on a calendar; they were the people refusing an ending written by the state and completing their own history.',meaningManifesto:'36 July is the day grief refused to retreat, fear could not block the road, and people declared that a citizen’s life, voice and dignity must come first.',meaningSource:'See 36 July in the official chronology ↗',
    evidenceKicker:'People’s testimony · OHCHR investigation 2025',evidenceTitle:'What people witnessed also emerged in the investigation',finding:'The UN Human Rights Office found reasonable grounds to believe that the former government and its security and intelligence apparatus, together with violent elements associated with the Awami League, systematically committed serious human-rights violations to suppress the protests. The report said extrajudicial killings, arbitrary arrests and torture occurred with the knowledge, coordination and direction of political leaders and senior security officials.',findingAttribution:'— OHCHR Fact-Finding Report, 12 February 2025 (condensed)',openReport:'Read the full investigation ↗',violations:[['Lethal force','OHCHR documented point-blank shootings of unarmed protesters and the use of military rifles and metal pellets.'],['Arbitrary detention','Block raids and cases with vast numbers of unnamed accused swept up thousands, including children and bystanders.'],['Torture and disappearance','Coordinators and protesters reported being taken to secret locations, blindfolded, beaten and pressed into statements.'],['Information blackout','Internet and platform shutdowns obstructed medical response, documentation, public safety and independent reporting.']],
    photoKicker:'The people’s July, caught on camera',photoTitle:'Four photographs. Four moments. One Bangladesh awakening.',photoIntro:'Resistance appears on a wall; a pledge is made before the flag; a sea of people gathers behind one demand; freedom erupts on 36 July. These are not only images—they are moments when fear broke inside a society.',photos:[{src:'https://ncpdagermany.de/img/july/selected/august-05-parliament-afp.webp',alt:'Crowds at the parliament building on 5 August 2024',title:'36 July · a people’s victory',credit:'5 August 2024 · AFP photograph'},{src:'https://ncpdagermany.de/img/july/selected/august-02-salute-orchid-chakma.webp',alt:'A protester salutes beside the flag',title:'A pledge before the flag',credit:'2 August 2024 · Photo: Orchid Chakma'},{src:'https://ncpdagermany.de/img/july/selected/august-03-march-palash-khan.webp',alt:'Crowd with a one-point placard',title:'One demand · one people',credit:'3 August 2024 · Photo: Palash Khan'},{src:'https://ncpdagermany.de/img/july/selected/july-resistance-art.webp',alt:'Resistance art from the July uprising',title:'Resistance through art',credit:'Protest-era artwork · artist unknown'}],
    peopleKicker:'Who was July?',peopleTitle:'When everyone entered the streets, July became an uprising',people:[['Youth and students','They raised the first questions, organised quickly and held their ground before gunfire. Young people from public and private universities, colleges and madrasas crossed old divisions and became the voice of a generation.','Follow the 36 days','#timeline'],['Women and people from every walk of life','Women students were at the front from the beginning. Workers, parents, teachers, doctors, lawyers, artists, rickshaw drivers and shopkeepers then turned a student movement into a people’s uprising.','Women in the uprising ↗','https://www.thedailystar.net/news/bangladesh/news/inside-july-uprising-women-led-nation-followed-3950221'],['Digital and diaspora resistance','Even when the internet was cut, videos, graffiti, songs, translations and international advocacy carried truth across borders. Diaspora marches and economic non-cooperation declared that Bangladesh could not be silenced in isolation.','Diaspora role ↗',SOURCES[8].url]],
    ncpKicker:'A new political journey from July',ncpTitle:'Carrying July’s courage into the work of building the state',ncpClarification:'<b>The historical sequence:</b> The National Citizen Party (NCP) was founded on 28 February 2025, almost seven months after the July Uprising. During July, these young figures served as coordinators and organisers of Students Against Discrimination; afterwards, that experience and the public demand for reform grew into a new political initiative.',ncpText:'Nahid Islam, Akhtar Hossen, Nasiruddin Patwary, Hasnat Abdullah and Sarjis Alam—figures known for their roles in July—joined Samanta Sharmin, Ariful Islam Adib, Dr Tasnim Jara, Nahida Sarwar Niva and Abdul Hannan Masud among the NCP’s founding leadership drawn from different professions and regions. The party’s declared pursuit of national unity, a new democratic constitution, institutional accountability and a “second republic” seeks to carry July’s public aspirations into long-term state reform. July’s courage is the strength of this journey; its responsibility is to establish that courage in inclusive, democratic and citizen-centred politics.',ncpSourceOne:'AP · context of NCP’s launch ↗',ncpSourceTwo:'BSS · founding leadership ↗',
    diasporaKicker:'One voice beyond borders',diasporaTitle:'The internet went dark at home—the diaspora kept the voice alive',diasporaText:'When news could no longer leave Bangladesh, diaspora communities translated information, verified and shared videos, approached international media and rights groups, stood outside diplomatic missions and called for a remittance boycott. From Darmstadt, Frankfurt, Heidelberg, Stuttgart and London to Dallas, New York, Melbourne and Sydney—the cities changed, but the voice did not.',diasporaClarification:'<b>From memory to responsibility:</b> NCP Diaspora Alliance Germany carries the memory of that global solidarity, its demand for justice and its civic responsibility to a new generation.',diasporaSource:'Germany and global diaspora report ↗',diasporaSourceGlobal:'New York–Sydney–Copenhagen solidarity ↗',
    promiseWord:'PROMISE',legacyKicker:'The question after victory',legacyTitle:'The fall of a government is not the final victory',pledges:[['Justice for every life','Independent, impartial and victim-centred investigation of every killing, act of torture, disappearance and unlawful detention.'],['No party above an institution','Place policing, intelligence, justice and elections under law and citizens’ rights—not partisan control.'],['A Bangladesh for everyone','Guarantee safety and equal rights for women, religious and ethnic minorities, Indigenous people, persons with disabilities and dissenters.'],['Turn memory into resistance','Preserve the names, testimony and evidence of those killed and injured; teach verified history and build civic vigilance against future repression.']],
    sourcesKicker:'Verify it yourself',sourcesTitle:'Do not take it on trust—open the sources',sourcesIntro:'This page does not claim final authority; it is a responsible gateway to the original record. Follow the sources for full testimony, victim lists, photographs, investigative methods and recommendations.',sourceTitles:SOURCES.map((source)=>source.title),sourceMeta:SOURCES.map((source)=>source.meta),closingKicker:'From victory to responsibility',closingTitle:'July is not over—<br>not until the state truly belongs to its people.',closingText:'Remembering July is not revenge; it is refusing to lose another human being this way. It means justice for every killing, dignity for the injured and bereaved families, safety for minorities and dissenters, and institutions no government can use to steal a citizen’s voice through bullets, disappearance, prison or an internet shutdown. July lives when free citizens can stand upright and question the state.',shareArchive:'Share the people’s July',footerNote:'July Uprising 2024—an initiative for people’s memory, justice and civic responsibility',mainSite:'Main website',sourceNav:'Sources',backTop:'Back to top ↑',copied:'Link copied.'
  };

  const de = {
    archiveLabel:'Juli-Aufstand 2024',share:'Teilen',heroKicker:'36 Tage · zahllose Stimmen · der Traum von einem Bangladesch ohne Angst',heroTitle:'Juli-Aufstand 2024<br><em>diese Geschichte gehört allen</em>',heroLead:'Es begann mit der berechtigten Forderung von Studierenden nach Fairness. Dann kamen Schüsse, Festnahmen und die Internetsperre. Die Angst drang in die Häuser—doch die Menschen wichen nicht zurück. Studierende, Arbeiter, Frauen, Eltern, Lehrkräfte, Künstler, Berufstätige und die Diaspora machten aus vielen Stimmen einen Volksaufstand. Dies ist ihre Geschichte. Sie gehört allen.',explore:'Die 36 Tage verfolgen',readEvidence:'Belege der Repression sehen',scroll:'In den Juli der Menschen eintreten',
    navContext:'Kontext',navTransformation:'Wandel',navTimeline:'Chronologie',navMeaning:'36. Juli',navEvidence:'Belege',navPeople:'Menschen',navPromise:'Versprechen',heroStageOne:'Forderung',heroStageTwo:'Blutvergießen',heroStageThree:'Eine Forderung',heroStageFour:'36. Juli',
    chorusOne:'Wer bist du? Wer bin ich? Razakar—Razakar · Wer sagt das? Der Autokrat—der Autokrat',chorusTwo:'Mein Bruder liegt im Grab—warum ist der Täter frei? · Die Studierenden sind erwacht · Eine Forderung—ein Anspruch',chorusStatement:'Der Juli war der Name eines gemeinsam erwachenden Bangladeschs—unsere Geschichte, geschrieben von Forderungen der Studierenden, der Trauer der Mütter, dem Mut der Arbeiter und der Stimme des Volkes.',uprisingWord:'AUFSTAND',
    methodKicker:'Der Juli gehört allen',methodTitle:'Studierende begannen.<br>Dann stand Bangladesch auf.',methodText:'Manche kamen vom Campus, andere aus Fabriken oder Krankenhäusern. Einige suchten ihre Kinder; andere retteten einen verletzten Fremden. Frauen, Arbeiter, Lehrkräfte, Eltern, Juristen, Künstler, Rikschafahrer, Händler und Menschen im Ausland verband eine Überzeugung: Der Staat darf Bürger nicht durch Angst regieren; er muss ihnen Rechenschaft ablegen.',balanceText:'Keine Partei, Führungsperson oder Organisation kann diesen Juli besitzen. Ihn zu ehren verlangt die ganze Wahrheit: Rechenschaft für staatliche Repression und parteinahe Gewalt sowie unabhängige Untersuchungen von Vergeltungsangriffen und Gewalt gegen Minderheiten während des Aufstands und nach dem 5. August. Ein Juli der Menschen bedeutet Gerechtigkeit für alle.',
    phasesKicker:'Von der Forderung zum Aufstand',phasesTitle:'Eine Forderung. Ein Schuss. Dann—stand ein Land auf.',phasesIntro:'Zunächst ging es um Fairness im öffentlichen Dienst. Schüsse, Angriffe, Ausgangssperre und Internetsperre veränderten die Frage. Die Menschen wollten nun wissen, wessen Leben der Staat schützt, wessen Stimme er hört und wem Macht antworten muss.',
    phases:[
      {date:'5. Juni—14. Juli',title:'Die Frage: Sind Chancen für alle gleich?',text:'Eine berechtigte Forderung verließ die Campus und erreichte durch die Bangla Blockade Straßen, Bahnlinien und Städte. Verstreute Stimmen wurden erstmals gemeinsam gehört.',src:[4,6]},
      {date:'15.—20. Juli',title:'Schüsse fielen—das Land hielt inne',text:'Parteinahe Angriffe, die Tötung Abu Sayeds, tödliche Schüsse, Ausgangssperre und Internetsperre veränderten alles. Nicht mehr nur die Quote war die Frage, sondern: Was ist das Leben eines Bürgers wert?',src:[1,2]},
      {date:'21.—31. Juli',title:'Die Trauer blieb nicht zu Hause',text:'Eine Quotenentscheidung kam, doch die Menschen gingen nicht nach Hause. Lehrkräfte, Eltern, Künstler, Juristen und Bürger standen für Gerechtigkeit, Freilassung und Rechenschaft zusammen.',src:[1,5,6]},
      {date:'1.—5. August',title:'Die Menschen sagten: Verändert den Staat',text:'Ein-Punkt-Forderung, Nichtzusammenarbeit und March to Dhaka machten aus einer Studentenbewegung einen Volksaufstand. Am 5. August fiel die Regierung; die schwierigere Arbeit, den Juli zu erfüllen, begann.',src:[1,6,13]}
    ],
    factsKicker:'Das Ausmaß der Wunde',factsTitle:'Keine Zahlen—Namen, Gesichter, Familien und unterbrochene Zukünfte',factsNote:'Die OHCHR-Schätzung umfasst den 1. Juli bis 15. August 2024 und ist keine endgültige Namensliste. Hinter jeder Zahl steht ein Mensch.',facts:[{n:'Bis zu 1.400',label:'Menschen könnten getötet worden sein',note:'OHCHR-Schätzung aus glaubwürdigen Quellen; die große Mehrheit der Getöteten und Verletzten wurde von Sicherheitskräften angeschossen.',s:1},{n:'12–13 %',label:'der Getöteten waren Kinder',note:'Geschätzter Anteil laut OHCHR—möglicherweise bis zu etwa 180 Kinder.',s:1},{n:'11.700+',label:'Menschen wurden inhaftiert',note:'OHCHR unter Berufung auf Angaben der Sicherheitsdienste.',s:1},{n:'10.000+',label:'Festnahmen allein im Juli',note:'Zeitgenössische Angabe von Amnesty International vom 2. August 2024.',s:5}],
    timelineKicker:'Das Tagebuch der 36 Tage',timelineTitle:'Wie ein Land in 36 Tagen die Angst durchbrach',timelineIntro:'Hier stehen mehr als Daten: ein Slogan, der vom Campus in die Städte wanderte; eine unbewaffnete Brust vor einem Gewehr; ein Land ohne Internet; Märsche der Trauer und Menschen, die schließlich die Ausgangssperre brachen. Jede Wendung ist belegt, denn öffentliche Erinnerung braucht die Kraft der Wahrheit.',
    timeline:[
      {date:'5. Juni 2024',tag:'Unmittelbarer Auslöser',title:'High Court stellt die Quote wieder her',text:'Das Gericht erklärte den Erlass von 2018 zur Abschaffung der Quoten für unwirksam und stellte damit faktisch die 30-Prozent-Quote für Nachkommen von Freiheitskämpfern wieder her. An mehreren Universitäten begann Protest.',src:[1,4,6]},
      {date:'1.–6. Juli',tag:'Die Bewegung organisiert sich',title:'Students Against Discrimination und Bangla Blockade',text:'Studierende organisierten sich unter einem neuen Namen. Von Dhaka aus breiteten sich Proteste auf staatliche und private Hochschulen, Bezirksstädte und Fernstraßen aus; ab 7. Juli wurde zur „Bangla Blockade“ aufgerufen.',src:[2,6]},
      {date:'7.–11. Juli',tag:'Landesweite Ausweitung',title:'Eine Forderung auf Straßen, Schienen und Campus',text:'Zentrale Kreuzungen in Dhaka sowie Verkehrswege im ganzen Land wurden blockiert. Trotz einer gerichtlichen Aussetzung verlangten Studierende eine dauerhafte gesetzliche Reform.',src:[4,6]},
      {date:'14. Juli',tag:'Politische Wendung',title:'Die „Razakar“-Bemerkung entfacht Empörung',text:'Demonstrierende verstanden eine Äußerung Sheikh Hasinas auf einer Pressekonferenz als Beleidigung. Über Nacht erfassten Protestparolen die Campus; das Konfrontationsrisiko stieg.',src:[1,6],breaking:true},
      {date:'15. Juli',tag:'Parteinahe Angriffe',title:'Angriffe an der Dhaka University und am Krankenhaus',text:'OHCHR und Medien beschreiben Angriffe von Mitgliedern Awami-League-naher Studenten- und Jugendorganisationen auf friedliche Demonstrierende; auch Verletzte am Dhaka Medical College Hospital wurden angegriffen.',src:[1,4,6],breaking:true},
      {date:'16. Juli',tag:'Der Tag, an dem die Angst brach',title:'Die Tötung Abu Sayeds erschüttert das Land',text:'Die Polizei erschoss in Rangpur den unbewaffneten Studenten Abu Sayed. Das verbreitete Video machte ihn zum Symbol gegen staatliche Gewalt; landesweit wurden an diesem Tag mindestens sechs Todesfälle gemeldet.',src:[1,2,6],breaking:true},
      {date:'17.–18. Juli',tag:'Stillstand und Dunkelheit',title:'Complete Shutdown; das Internet erlischt',text:'Nach Polizeigewalt bei Trauergebeten riefen Organisatoren zum „Complete Shutdown“ auf. Inmitten von Toten und Zusammenstößen wurden Mobil- und Breitbandinternet abgeschaltet und Bangladesch isoliert.',src:[1,2,6],breaking:true},
      {date:'19.–20. Juli',tag:'Ausgangssperre und tödliche Gewalt',title:'Neun Forderungen, Ausgangssperre, Armeeeinsatz',text:'Viele Menschen starben durch Schüsse und Zusammenstöße. Koordinatoren stellten neun Forderungen nach Gerechtigkeit. Die Regierung verhängte eine landesweite Ausgangssperre und setzte die Armee ein.',src:[1,2,6],breaking:true},
      {date:'20.–23. Juli',tag:'Entführung und Folter vorgeworfen',title:'Nahid Islam verschleppt; Quotenerlass veröffentlicht',text:'Koordinator Nahid Islam erklärte, Männer in Zivil hätten ihn entführt und gefoltert. Das Gericht senkte die Quote auf 7 Prozent und die Regierung erließ eine Regelung; inzwischen stand jedoch Gerechtigkeit für die Getöteten im Zentrum.',src:[1,2,6],breaking:true},
      {date:'24.–28. Juli',tag:'Massenfestnahmen',title:'Razzien, DB-Gewahrsam und erzwungene Erklärung',text:'Tausende wurden festgenommen, Verfahren nannten massenhaft unbekannte Beschuldigte und Koordinatoren wurden aus Wohnungen und Krankenhäusern geholt. Organisatoren in Freiheit bezeichneten die Rückzugserklärung sechs Inhaftierter als erzwungen.',src:[1,5,6],breaking:true},
      {date:'29.–31. Juli',tag:'Der Widerstand kehrt zurück',title:'Rote Profile und March for Justice',text:'Studierende, Lehrkräfte, Eltern, Juristen, Künstler und Zivilgesellschaft kehrten auf die Straße zurück. Soziale Medien färbten sich als Ablehnung der Staatstrauer rot; der March for Justice ging trotz Gewalt weiter.',src:[2,6,7]},
      {date:'1.–2. August',tag:'32.–33. Juli',title:'Koordinatoren frei; Marsch des Widerstands',text:'Sechs Koordinatoren wurden aus DB-Gewahrsam freigelassen. Am 2. August verlangte ein breiter Marsch vom National Press Club zum Shaheed Minar Gerechtigkeit und ein Ende der Repression.',src:[3,5,6]},
      {date:'3. August',tag:'Eine Forderung',title:'Shaheed Minar fordert den Rücktritt der Regierung',text:'Vor einer riesigen Versammlung verkündete Nahid Islam die Ein-Punkt-Forderung nach Rücktritt Sheikh Hasinas und des Kabinetts. Die Quotenbewegung war sichtbar zu einem landesweiten politischen Aufstand geworden.',src:[1,6],breaking:true},
      {date:'4. August',tag:'Nichtzusammenarbeit',title:'Der tödlichste Tag des Aufstands',text:'Die landesweite Nichtzusammenarbeit führte zu schweren Zusammenstößen zwischen Demonstrierenden, Polizei und Anhängern der Awami League. Medien meldeten zunächst mindestens 93 Tote. Der Marsch auf Dhaka wurde vorgezogen.',src:[1,6],breaking:true},
      {date:'5. August',tag:'36. Juli',title:'Menschen widersetzen sich der Sperre; Hasina tritt zurück',text:'Tausende zogen trotz Ausgangssperre nach Dhaka. Am Nachmittag trat Sheikh Hasina zurück und verließ das Land. Menschen feierten; zugleich wurden Vergeltungstötungen, Brandstiftung und Angriffe auf Minderheiten gemeldet.',src:[1,6,12],breaking:true},
      {date:'Nach dem 5. August',tag:'Die Bewährungsprobe der Gerechtigkeit',title:'Die lange Arbeit am Staat beginnt',text:'Eine Übergangsregierung, Ermittlungen und Reformprozesse folgten. OHCHR forderte unabhängige Untersuchungen aller Übergriffe, opferzentrierte Gerechtigkeit und eine tiefgreifende Reform des Sicherheitssektors.',src:[1,12]}
    ],
    meaningKicker:'Der Kalender endete; die Menschen nicht',meaningTitle:'Warum der 5. August als „36. Juli“ erinnert wird',meaningText:'Nach der Nacht des 31. Juli wechselte der Kalender in den August. Doch für Mütter, die ihre Kinder verloren hatten, und für junge Menschen, die mit der blutigen Erinnerung an Freunde auf die Straße zurückkehrten, konnte der Juli nicht einfach enden. Bis Gerechtigkeit kam, die Repression aufhörte und die Stimme des Volkes den Sieg erreichte, zählten sie im Juli weiter—der 1. August wurde zum 32. Juli, der 5. August zum 36. Juli. Das waren keine fünf zusätzlichen Kalendertage, sondern Menschen, die ein vom Staat geschriebenes Ende verweigerten und ihre Geschichte selbst vollendeten.',meaningManifesto:'Der 36. Juli ist der Tag, an dem Trauer nicht wich, Angst den Weg nicht sperren konnte und die Menschen erklärten: Leben, Stimme und Würde der Bürger stehen an erster Stelle.',meaningSource:'Den 36. Juli in der offiziellen Chronologie ansehen ↗',
    evidenceKicker:'Aussagen der Menschen · OHCHR-Untersuchung 2025',evidenceTitle:'Was Menschen erlebten, bestätigte auch die Untersuchung',finding:'Das UN-Menschenrechtsbüro sah begründeten Anlass zu der Annahme, dass die frühere Regierung, ihr Sicherheits- und Geheimdienstapparat sowie gewalttätige, mit der Awami League verbundene Elemente systematisch schwere Menschenrechtsverletzungen zur Unterdrückung der Proteste begingen. Außergerichtliche Tötungen, willkürliche Festnahmen und Folter seien mit Wissen, Koordination und Leitung der politischen Führung und ranghoher Sicherheitsvertreter erfolgt.',findingAttribution:'— OHCHR Fact-Finding Report, 12. Februar 2025 (gekürzt)',openReport:'Die vollständige Untersuchung lesen ↗',violations:[['Tödliche Gewalt','OHCHR dokumentierte Schüsse aus nächster Nähe auf Unbewaffnete sowie den Einsatz militärischer Gewehre und Metallpellets.'],['Willkürliche Inhaftierung','Razzien und Verfahren mit massenhaft unbekannten Beschuldigten erfassten Tausende, darunter Kinder und Unbeteiligte.'],['Folter und Verschwindenlassen','Koordinatoren und Demonstrierende berichteten von geheimen Orten, Augenbinden, Schlägen und erzwungenen Erklärungen.'],['Informationssperre','Internet- und Plattformabschaltungen behinderten medizinische Hilfe, Dokumentation, Sicherheit und unabhängige Berichte.']],
    photoKicker:'Der Juli der Menschen vor der Kamera',photoTitle:'Vier Bilder. Vier Momente. Ein erwachendes Bangladesch.',photoIntro:'Widerstand erscheint auf einer Wand; vor der Flagge wird ein Versprechen gegeben; hinter einer Forderung versammelt sich ein Menschenmeer; am 36. Juli bricht Freiheit hervor. Es sind nicht nur Bilder—es sind Momente, in denen Angst in einer Gesellschaft zerbrach.',photos:[{src:'https://ncpdagermany.de/img/july/selected/august-05-parliament-afp.webp',alt:'Menschen am Parlament am 5. August 2024',title:'36. Juli · Sieg der Bevölkerung',credit:'5. August 2024 · AFP-Fotografie'},{src:'https://ncpdagermany.de/img/july/selected/august-02-salute-orchid-chakma.webp',alt:'Demonstrant salutiert neben einer Flagge',title:'Ein Versprechen vor der Flagge',credit:'2. August 2024 · Foto: Orchid Chakma'},{src:'https://ncpdagermany.de/img/july/selected/august-03-march-palash-khan.webp',alt:'Menge mit einem Ein-Punkt-Plakat',title:'Eine Forderung · ein Volk',credit:'3. August 2024 · Foto: Palash Khan'},{src:'https://ncpdagermany.de/img/july/selected/july-resistance-art.webp',alt:'Widerstandskunst des Juli-Aufstands',title:'Widerstand durch Kunst',credit:'Kunst aus der Protestzeit · Künstler unbekannt'}],
    peopleKicker:'Wer war der Juli?',peopleTitle:'Als alle auf die Straße gingen, wurde der Juli zum Volksaufstand',people:[['Jugend und Studierende','Sie stellten die ersten Fragen, organisierten sich schnell und wichen selbst vor Schüssen nicht zurück. Junge Menschen aus Universitäten, Colleges und Madrasas überwanden alte Trennlinien und wurden zur Stimme einer Generation.','Die 36 Tage verfolgen','#timeline'],['Frauen und Menschen aus allen Lebensbereichen','Studentinnen standen von Beginn an vorn. Arbeiter, Eltern, Lehrkräfte, Ärzte, Juristen, Künstler, Rikschafahrer und Händler machten aus einer Studentenbewegung einen Volksaufstand.','Frauen im Aufstand ↗','https://www.thedailystar.net/news/bangladesh/news/inside-july-uprising-women-led-nation-followed-3950221'],['Digitaler und Diaspora-Widerstand','Trotz der Internetsperre trugen Videos, Graffiti, Lieder, Übersetzungen und internationale Öffentlichkeitsarbeit die Wahrheit über Grenzen. Diaspora-Proteste erklärten: Bangladesch lässt sich nicht isoliert zum Schweigen bringen.','Rolle der Diaspora ↗',SOURCES[8].url]],
    ncpKicker:'Ein neuer politischer Weg aus dem Juli',ncpTitle:'Den Mut des Juli in den Aufbau des Staates tragen',ncpClarification:'<b>Die historische Abfolge:</b> Die National Citizen Party (NCP) wurde am 28. Februar 2025 gegründet—fast sieben Monate nach dem Juli-Aufstand. Im Juli wirkten diese jungen Persönlichkeiten als Koordinatoren und Organisatoren von Students Against Discrimination; danach wuchsen diese Erfahrung und die öffentliche Reformforderung zu einer neuen politischen Initiative.',ncpText:'Nahid Islam, Akhtar Hossen, Nasiruddin Patwary, Hasnat Abdullah und Sarjis Alam—bekannt durch ihre Rollen im Juli—traten gemeinsam mit Samanta Sharmin, Ariful Islam Adib, Dr. Tasnim Jara, Nahida Sarwar Niva und Abdul Hannan Masud der Gründungsführung der NCP bei, die unterschiedliche Berufe und Regionen verbindet. Das erklärte Ziel nationaler Einheit, einer neuen demokratischen Verfassung, institutioneller Rechenschaft und einer „zweiten Republik“ soll die Hoffnungen des Juli in langfristige Staatsreformen tragen. Der Mut des Juli ist die Kraft dieses Weges; seine Verantwortung ist, diesen Mut in inklusiver, demokratischer und bürgernaher Politik zu verankern.',ncpSourceOne:'AP · Hintergrund der NCP-Gründung ↗',ncpSourceTwo:'BSS · Gründungsführung ↗',
    diasporaKicker:'Eine Stimme über Grenzen',diasporaTitle:'Zu Hause erlosch das Internet—die Diaspora hielt die Stimme lebendig',diasporaText:'Als Nachrichten Bangladesch nicht mehr verlassen konnten, übersetzten Diaspora-Gemeinschaften Informationen, prüften und verbreiteten Videos, wandten sich an internationale Medien und Menschenrechtsorganisationen, standen vor diplomatischen Vertretungen und riefen zum Remittance-Boykott auf. Von Darmstadt, Frankfurt, Heidelberg, Stuttgart und London bis Dallas, New York, Melbourne und Sydney—die Städte wechselten, die Stimme nicht.',diasporaClarification:'<b>Von Erinnerung zu Verantwortung:</b> Die NCP Diaspora Alliance Germany trägt die Erinnerung an diese weltweite Solidarität, ihre Forderung nach Gerechtigkeit und ihre bürgerschaftliche Verantwortung an eine neue Generation weiter.',diasporaSource:'Bericht zu Deutschland und globaler Diaspora ↗',diasporaSourceGlobal:'Solidarität in New York, Sydney und Kopenhagen ↗',
    promiseWord:'VERSPRECHEN',legacyKicker:'Die Frage nach dem Sieg',legacyTitle:'Der Fall einer Regierung ist nicht der endgültige Sieg',pledges:[['Gerechtigkeit für jedes Leben','Unabhängige, unparteiische und opferzentrierte Untersuchung jeder Tötung, Folter, Entführung und rechtswidrigen Inhaftierung.'],['Keine Partei über Institutionen','Polizei, Geheimdienste, Justiz und Wahlen dem Recht und den Bürgerrechten unterstellen—nicht parteipolitischer Kontrolle.'],['Ein Bangladesch für alle','Sicherheit und gleiche Rechte für Frauen, religiöse und ethnische Minderheiten, Indigene, Menschen mit Behinderungen und Andersdenkende.'],['Erinnerung wird Widerstand','Namen, Zeugnisse und Belege der Getöteten und Verletzten bewahren; geprüfte Geschichte lehren und Wachsamkeit gegen künftige Repression stärken.']],
    sourcesKicker:'Selbst nachprüfen',sourcesTitle:'Nicht einfach glauben—die Quellen öffnen',sourcesIntro:'Diese Seite beansprucht keine endgültige Autorität; sie ist ein verantwortlicher Zugang zu den Originaldokumenten. Dort finden sich vollständige Aussagen, Opferlisten, Fotografien, Untersuchungsmethoden und Empfehlungen.',sourceTitles:['Fact-Finding-Bericht zu Menschenrechtsverletzungen im Juli und August 2024','Vorläufige Analyse der Proteste und Unruhen in Bangladesch','Mindestens 32 Kinder bei der Gewalt in Bangladesch getötet','Was geschah bei den Protesten für eine Quotenreform?','Tausende Demonstrierende willkürlich festgenommen','Von der Quote zur Staatsreform—Chronologie des Juli-Aufstands','36 Tage im Juli—Berichte, Zeugnisse und Recherchen','Foto- und Dokumentenarchiv des Juli-Aufstands','Wie die bangladeschische Diaspora die Juli-Bewegung unterstützte','Führungspersönlichkeiten des Aufstands gründen die National Citizen Party','Offizieller Start der National Citizen Party','Aufruf zu Gerechtigkeit und Schutz nach dem Machtwechsel','Chronik des Sieges—36. Juli','Solidarität der bangladeschischen Diaspora weltweit'],sourceMeta:['UN-Menschenrechtsbüro · 12. Februar 2025','UN-Menschenrechtsbüro · 16. August 2024','UNICEF Südasien · 2. August 2024','Amnesty International · Juli 2024','Amnesty International · 2. August 2024','Chronologie mit verlinkten Berichten · 2018–5. August 2024','Multimedia-Archiv · 2026','Öffentliches Archiv der Regierung Bangladeschs','Diaspora-Bericht einschließlich Deutschland · 7. September 2024','Associated Press · 28. Februar 2025','Bangladesh Sangbad Sangstha · 28. Februar 2025','Generalsekretär der Vereinten Nationen · 5. August 2024','July Mass Uprising Memorial Museum · offizielle Chronologie','New York, Sydney und Kopenhagen · 21. Juli 2024'],closingKicker:'Vom Sieg zur Verantwortung',closingTitle:'Der Juli ist nicht vorbei—<br>nicht solange der Staat nicht wirklich den Menschen gehört.',closingText:'Den Juli zu erinnern heißt nicht Rache, sondern zu verhindern, dass noch ein Mensch so verloren geht. Es bedeutet Gerechtigkeit für jede Tötung, Würde für Verletzte und Hinterbliebene, Sicherheit für Minderheiten und Andersdenkende sowie Institutionen, mit denen keine Regierung Bürger durch Kugeln, Verschwindenlassen, Haft oder Internetsperre ihrer Stimme berauben kann. Der Juli lebt, wenn freie Bürger aufrecht stehen und den Staat befragen können.',shareArchive:'Den Juli der Menschen teilen',footerNote:'Juli-Aufstand 2024—eine Initiative für Erinnerung, Gerechtigkeit und Bürgerverantwortung',mainSite:'Hauptwebsite',sourceNav:'Quellen',backTop:'Nach oben ↑',copied:'Link kopiert.'
  };

  const content = { bn, en, de };
  let language = 'bn';

  async function handOffToArchiveSubdomain() {
    if (location.hostname !== 'ncpdagermany.de') return;

    const destination = new URL(location.href);
    destination.hostname = 'july36.ncpdagermany.de';
    destination.pathname = '/';

    try {
      await fetch('https://july36.ncpdagermany.de/archive.js', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-store'
      });
      location.replace(destination.href);
    } catch {
      // GitHub is still provisioning TLS; remain on the secure main-site copy.
    }
  }

  function sourceLink(number) {
    const source = SOURCES[number - 1];
    return source ? `<a class="citation" href="${source.url}" target="_blank" rel="noopener noreferrer" aria-label="Source ${number}: ${source.org}">${number}</a>` : '';
  }

  function render(lang) {
    const c = content[lang] || bn;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-language-logo]').forEach((logo) => {
      const source = lang === 'bn' ? logo.dataset.logoBn : logo.dataset.logoInternational;
      if (source && logo.getAttribute('src') !== source) logo.setAttribute('src', source);
      logo.alt = lang === 'bn' ? 'এনসিপি ডায়াসপোরা অ্যালায়েন্স জার্মানি' : 'NCP Diaspora Alliance Germany';
    });
    document.title = lang === 'bn' ? 'জুলাই গণঅভ্যুত্থান ২০২৪ — এই ইতিহাস আমাদের সবার | NCPDA Germany' : lang === 'de' ? 'Juli-Aufstand 2024 — Diese Geschichte gehört allen | NCPDA Germany' : 'July Uprising 2024 — This History Belongs to Everyone | NCPDA Germany';
    document.querySelectorAll('[data-copy]').forEach((el) => {
      const value = c[el.dataset.copy];
      if (typeof value === 'string') el.innerHTML = value;
    });
    document.querySelectorAll('[data-lang]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.lang === lang)));

    document.getElementById('phase-grid').innerHTML = c.phases.map((phase, index) => `<article class="phase-card" data-reveal><span class="phase-index">0${index + 1}</span><div class="phase-sources">${phase.src.map(sourceLink).join('')}</div><time class="phase-date">${phase.date}</time><h3>${phase.title}</h3><p>${phase.text}</p></article>`).join('');
    document.getElementById('fact-grid').innerHTML = c.facts.map((fact, index) => `<article class="fact" data-reveal><span class="fact-index">RECORD 0${index + 1}</span><strong>${fact.n}</strong><span>${fact.label}</span><small>${fact.note}</small>${sourceLink(fact.s)}</article>`).join('');
    document.getElementById('timeline-list').innerHTML = c.timeline.map((item, index) => `<li class="timeline-item${item.breaking ? ' breaking' : ''}" data-reveal><time class="timeline-date">${item.date}</time><article class="timeline-content"><span class="timeline-tag">${item.tag}</span><h3>${item.title}</h3><p>${item.text} ${item.src.map(sourceLink).join('')}</p></article><span class="timeline-signal" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span></li>`).join('');
    document.getElementById('violation-grid').innerHTML = c.violations.map((item) => `<article class="violation" data-reveal><b>${item[0]}</b><p>${item[1]}</p></article>`).join('');
    document.getElementById('photo-grid').innerHTML = c.photos.map((photo, index) => `<figure class="photo-card" data-reveal><span class="photo-index" aria-hidden="true">0${index + 1}</span><img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async"><figcaption class="photo-caption"><b>${photo.title}</b><small>${photo.credit}</small></figcaption></figure>`).join('');
    document.getElementById('people-grid').innerHTML = c.people.map((item, index) => `<article class="people-card" data-reveal><div class="people-visual" aria-hidden="true"><img src="${PEOPLE_VISUALS[index]}" alt="" loading="lazy" decoding="async"><span>0${index + 1}</span></div><div class="people-copy"><h3>${item[0]}</h3><p>${item[1]}</p><a href="${item[3]}"${item[3].startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${item[2]}</a></div></article>`).join('');
    document.getElementById('pledge-grid').innerHTML = c.pledges.map((item, index) => `<article class="pledge" data-reveal><span class="pledge-index">${c.promiseWord} ${localNumber(index + 1, lang)}</span><b>${item[0]}</b><p>${item[1]}</p></article>`).join('');
    document.getElementById('source-list').innerHTML = SOURCES.map((source, index) => `<a class="source" href="${source.url}" target="_blank" rel="noopener noreferrer" data-reveal><span class="source-number">${String(index + 1).padStart(2,'0')}</span><span><b>${c.sourceTitles[index] || source.title}</b><small>${c.sourceMeta[index] || source.meta}</small><em class="source-org">${source.org}</em></span><span class="source-arrow">↗</span></a>`).join('');
    localStorage.setItem('july-archive-lang', lang);
    observeReveals();
    animateHeroCount(lang);
    alignHashTarget();
  }

  let anchorTimer;
  function alignHashTarget() {
    if (!location.hash) return;
    clearTimeout(anchorTimer);
    anchorTimer = setTimeout(() => {
      const targetId = decodeURIComponent(location.hash.slice(1));
      if (targetId === 'top') {
        scrollTo({ top: 0, behavior: 'instant' });
        updateScrollScene();
        return;
      }
      const target = document.getElementById(targetId);
      if (!target) return;
      const header = document.querySelector('.site-header');
      const offset = (header?.getBoundingClientRect().height || 72) + 18;
      scrollTo({ top: Math.max(0, target.offsetTop - offset), behavior: 'instant' });
      updateScrollScene();
    }, 80);
  }

  let observer;
  function observeReveals() {
    if (observer) observer.disconnect();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('visible'));
      return;
    }
    observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .08, rootMargin: '0px 0px -30px' });
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
  }

  function localNumber(value, lang) {
    return new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : lang === 'de' ? 'de-DE' : 'en-GB', { useGrouping: false }).format(value);
  }

  let countFrame;
  function animateHeroCount(lang) {
    const counter = document.querySelector('[data-hero-count]');
    if (!counter) return;
    cancelAnimationFrame(countFrame);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counter.textContent = localNumber(36, lang);
      return;
    }
    const started = performance.now();
    const duration = 1500;
    const step = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = localNumber(Math.max(1, Math.round(1 + 35 * eased)), lang);
      if (progress < 1) countFrame = requestAnimationFrame(step);
    };
    countFrame = requestAnimationFrame(step);
  }

  const chapterLinks = [...document.querySelectorAll('[data-chapter-link]')];
  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      chapterLinks.forEach((link) => {
        const active = link.dataset.chapterLink === entry.target.dataset.chapterId;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-38% 0px -52% 0px', threshold: 0 });
  document.querySelectorAll('[data-chapter-id]').forEach((section) => chapterObserver.observe(section));

  let scrollFrame;
  function updateScrollScene() {
    scrollFrame = 0;
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const pageProgress = Math.min(1, Math.max(0, scrollY / max));
    document.documentElement.style.setProperty('--page-progress', pageProgress.toFixed(4));
    document.documentElement.style.setProperty('--hero-shift', `${Math.min(92, scrollY * .11)}px`);
    document.querySelector('.site-header').classList.toggle('scrolled', scrollY > 30);

    const timeline = document.querySelector('.timeline');
    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (innerHeight * .68 - rect.top) / Math.max(1, rect.height)));
      timeline.style.setProperty('--timeline-progress', progress.toFixed(4));
    }
  }

  function scheduleScrollScene() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollScene);
  }

  async function shareArchive() {
    const c = content[language];
    const shareUrl = new URL(location.href);
    shareUrl.hash = '';
    const shareData = { title: document.title, text: c.heroLead.replace(/<[^>]+>/g,''), url: shareUrl.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(shareData.url);
      document.getElementById('share-status').textContent = c.copied;
    } catch (error) {
      if (error.name !== 'AbortError') document.getElementById('share-status').textContent = shareData.url;
    }
  }

  document.querySelectorAll('[data-lang]').forEach((button) => button.addEventListener('click', () => {
    language = button.dataset.lang;
    const url = new URL(location.href);
    if (language === 'bn') url.searchParams.delete('lang'); else url.searchParams.set('lang', language);
    history.replaceState({}, '', url);
    render(language);
  }));
  document.getElementById('share-top').addEventListener('click', shareArchive);
  document.getElementById('share-bottom').addEventListener('click', shareArchive);
  document.querySelectorAll('a[href="#top"]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    const url = new URL(location.href);
    url.hash = 'top';
    history.replaceState({}, '', url);
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  addEventListener('scroll', scheduleScrollScene, { passive: true });
  addEventListener('resize', scheduleScrollScene, { passive: true });

  const requested = new URLSearchParams(location.search).get('lang');
  const saved = localStorage.getItem('july-archive-lang');
  language = ['bn','en','de'].includes(requested) ? requested : (['bn','en','de'].includes(saved) ? saved : 'bn');
  render(language);
  requestAnimationFrame(() => {
    document.documentElement.dataset.motion = 'ready';
    updateScrollScene();
  });
  addEventListener('load', alignHashTarget, { once: true });
  handOffToArchiveSubdomain();
})();
