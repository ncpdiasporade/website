/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const i18n = window.SiteI18n;
const t = (value) => i18n?.t(value) ?? value;
const localize = (value) => i18n?.localize(value) ?? value;
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function cleanText(value, maxLength = 280) {
  const normalized = String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.length <= maxLength) return normalized;
  const clipped = normalized.slice(0, maxLength + 1);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, lastSpace > maxLength * .65 ? lastSpace : maxLength).trim()}…`;
}

function contentItems(data) {
  const items = Array.isArray(data?.items) ? data.items : data;
  return Array.isArray(items)
    ? items.filter((item) => item && typeof item === 'object')
    : [];
}

function safeHref(value) {
  const href = String(value ?? '#').trim();
  if (!href || href === '#') return '#';

  try {
    const url = new URL(href, window.location.href);
    return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? escapeHtml(href) : '#';
  } catch {
    return '#';
  }
}

function safeImageSrc(value, fallback = 'img/blog/july-uprising.svg') {
  const src = String(value ?? '').trim();
  if (!src) return fallback;

  try {
    const url = new URL(src, window.location.href);
    if (url.origin === window.location.origin || url.protocol === 'https:' || url.protocol === 'data:') {
      return src;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

async function loadContentJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Failed to load ${path}`);
  return response.json();
}

/* ─────────────────────────────────────────
   MODULE: PROGRESS BAR
───────────────────────────────────────── */
function initProgressBar() {
  const bar = $('#progress-bar');
  if (!bar) return;

  function updateBar() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  updateBar();
  window.addEventListener('scroll', updateBar, { passive: true });
}

/* ─────────────────────────────────────────
   MODULE: STICKY NAV
───────────────────────────────────────── */
function initStickyNav() {
  const navWrap = $('#navWrap');
  if (!navWrap) return;

  function onScroll() {
    navWrap.classList.toggle('scrolled', window.scrollY > 20);
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─────────────────────────────────────────
   MODULE: SIGNATURE MOTION
───────────────────────────────────────── */
function initSignatureMotion() {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.add('page-ready'));
  });

  if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const panel = $('.hero-panel');
  if (!panel) return;

  let glowFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  function renderPanelGlow() {
    glowFrame = 0;
    const rect = panel.getBoundingClientRect();
    const xRatio = Math.min(1, Math.max(0, (pointerX - rect.left) / rect.width));
    const yRatio = Math.min(1, Math.max(0, (pointerY - rect.top) / rect.height));
    panel.style.setProperty('--panel-glow-x', `${xRatio * 100}%`);
    panel.style.setProperty('--panel-glow-y', `${yRatio * 100}%`);
  }

  panel.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!glowFrame) glowFrame = requestAnimationFrame(renderPanelGlow);
  });
  panel.addEventListener('pointerleave', () => {
    if (glowFrame) cancelAnimationFrame(glowFrame);
    glowFrame = 0;
    panel.style.setProperty('--panel-glow-x', '76%');
    panel.style.setProperty('--panel-glow-y', '12%');
  });
}

/* ─────────────────────────────────────────
   MODULE: JULY MOVEMENT MOTION
───────────────────────────────────────── */
function initJulyMotion() {
  const sections = $$('.july-visual-section');
  if (!sections.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    sections.forEach((section) => section.classList.add('motion-visible'));
    return;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    sections.forEach((section) => observer.observe(section));
  } else {
    sections.forEach((section) => section.classList.add('motion-visible'));
  }

  const photoSections = sections.filter((section) => section.querySelector('.section-memory img'));
  let parallaxFrame = 0;
  function updateMemoryParallax() {
    parallaxFrame = 0;
    const viewportHeight = window.innerHeight || 1;
    photoSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > viewportHeight + 120) return;
      const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const shift = Math.max(-34, Math.min(34, (progress - .5) * -68));
      section.style.setProperty('--memory-shift', `${shift.toFixed(1)}px`);
    });
  }
  function requestMemoryParallax() {
    if (!parallaxFrame) parallaxFrame = requestAnimationFrame(updateMemoryParallax);
  }

  updateMemoryParallax();
  window.addEventListener('scroll', requestMemoryParallax, { passive: true });
  window.addEventListener('resize', requestMemoryParallax);
}

/* ─────────────────────────────────────────
   MODULE: ACTIVE SECTION NAVIGATION
───────────────────────────────────────── */
function initActiveNavigation() {
  const links = $$('.nav-links a[href^="#"]');
  const destinations = links
    .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter((item) => item.section);
  if (!destinations.length) return;

  let navFrame = 0;

  function updateActiveLink() {
    navFrame = 0;
    const activationLine = window.innerHeight * .34;
    const visibleDestinations = destinations.filter((item) => (
      !item.section.hidden
      && !item.link.hidden
      && !item.link.closest('[hidden]')
    ));
    let activeItem = null;

    visibleDestinations.forEach((item) => {
      if (item.section.getBoundingClientRect().top <= activationLine) activeItem = item;
    });

    destinations.forEach((item) => {
      const isActive = item === activeItem;
      item.link.classList.toggle('is-active', isActive);
      if (isActive) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  }

  function requestNavUpdate() {
    if (!navFrame) navFrame = requestAnimationFrame(updateActiveLink);
  }

  updateActiveLink();
  window.addEventListener('scroll', requestNavUpdate, { passive: true });
  window.addEventListener('resize', requestNavUpdate);
}

/* ─────────────────────────────────────────
   MODULE: MOBILE MENU
───────────────────────────────────────── */
function initMobileMenu() {
  const btn  = $('#mobileBtn');
  const menu = $('#mobileMenu');
  if (!btn || !menu) return;

  function setOpen(isOpen) {
    menu.classList.toggle('open', isOpen);
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  }

  function toggleMenu() {
    setOpen(!menu.classList.contains('open'));
  }

  btn.addEventListener('click', toggleMenu);

  $$('a', menu).forEach(link => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* ─────────────────────────────────────────
   MODULE: SCROLL REVEAL
───────────────────────────────────────── */
function initScrollReveal() {
  const targets = $$('.reveal, .stagger-children');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el) => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });
}

/* ─────────────────────────────────────────
   MODULE: BACK TO TOP
───────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#back-top');
  if (!btn) return;

  function toggleVisibility() {
    btn.classList.toggle('visible', window.scrollY > 400);
  }

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleVisibility();
  window.addEventListener('scroll', toggleVisibility, { passive: true });
}

/* ─────────────────────────────────────────
   MODULE: TICKER BAND
───────────────────────────────────────── */
function initTicker() {
  const track = $('#tickerTrack');
  if (!track) return;

  const items = [
    { label: 'জুলাই গণঅভ্যুত্থান ২০২৪', value: 'ছাত্র-জনতার ঐতিহাসিক জাগরণ' },
    { label: 'OHCHR অনুসন্ধান', value: 'সর্বোচ্চ ১,৪০০ মানুষ নিহত হয়ে থাকতে পারেন' },
    { label: 'NCP প্রতিষ্ঠা', value: '২৮ ফেব্রুয়ারি ২০২৫' },
    { label: 'জাতীয় নাগরিক পার্টি (NCP)', value: 'জুলাই নেতৃত্বের উদ্যোগে গঠিত রাজনৈতিক দল' },
    { label: 'রাষ্ট্র সংস্কার', value: 'গণতান্ত্রিক প্রতিষ্ঠান ও জবাবদিহির অঙ্গীকার' },
    { label: 'নতুন বাংলাদেশ', value: 'ন্যায়, সাম্য ও গণতন্ত্রের অঙ্গীকার' },
    { label: 'প্রবাসী বাংলাদেশি', value: 'ভোট, সেবা ও প্রতিনিধিত্বের অধিকার' },
    { label: 'NCP Diaspora Alliance Germany', value: 'প্রবাসীদের ঐক্যবদ্ধ প্ল্যাটফর্ম' },
    { label: 'জার্মানি চ্যাপ্টার', value: 'সক্রিয় · ২০২৫' },
    { label: 'ডায়াসপোরা নেটওয়ার্ক', value: 'জ্ঞান, দক্ষতা ও নাগরিক অংশগ্রহণ' },
    { label: 'প্রবাসী অধিকার', value: 'রাজনৈতিক অন্তর্ভুক্তির দাবি' },
    { label: 'দ্বিতীয় প্রজাতন্ত্র', value: 'গণতান্ত্রিক পুনর্গঠনের লক্ষ্য' }
  ];

  function renderItems(list) {
    return list.map(({ label, value }) => `
      <span class="ticker-item">
        ${escapeHtml(t(label))}
        <span class="ticker-sep"></span>
        <strong>${escapeHtml(t(value))}</strong>
      </span>
    `).join('');
  }

  function renderTicker() {
    track.innerHTML = renderItems(items) + renderItems(items);
  }

  renderTicker();
  i18n?.onChange(renderTicker);
}

/* ─────────────────────────────────────────
   MODULE: ANNOUNCEMENTS
───────────────────────────────────────── */
function initAnnouncements() {
  const announcementsSection = $('#announcements');
  const announcementsList = $('#announcementsList');
  const announcementLinks = $$('[data-announcements-link]');
  if (!announcementsSection || !announcementsList) return;
  let announcementItems = [];

  function setAnnouncementVisibility(isVisible) {
    announcementsSection.hidden = !isVisible;
    announcementLinks.forEach((link) => {
      link.hidden = !isVisible;
    });
    window.dispatchEvent(new Event('resize'));
  }

  function renderAnnouncement(items) {
    const sourceAnnouncement = contentItems(items)
      .filter((item) => item.status !== 'draft')
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))[0];
    if (!sourceAnnouncement) {
      announcementsList.textContent = '';
      setAnnouncementVisibility(false);
      return;
    }

    const announcement = localize(sourceAnnouncement);

    const isFacebookEvent = announcement.sourceType === 'facebook-event';
    const sourceUrl = safeHref(announcement.sourceUrl || '#');
    const posterUrl = safeHref(announcement.posterUrl || announcement.image || announcement.sourceUrl || '#');
    const hasSeparatePoster = posterUrl !== '#' && posterUrl !== sourceUrl;
    const mediaUrl = hasSeparatePoster ? posterUrl : sourceUrl;
    const image = escapeHtml(safeImageSrc(announcement.image, 'img/logo/logo-premium.png'));
    const media = `
      <a class="announcement-media" href="${mediaUrl}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(`${cleanText(announcement.title, 90)} — ${t('বিস্তারিত দেখুন')}`)}">
        <img src="${image}" alt="${escapeHtml(cleanText(announcement.imageAlt || announcement.title, 140))}" width="1200" height="1500" />
      </a>`;
    const sourceLink = sourceUrl === '#' || isFacebookEvent
      ? ''
      : `<a class="btn-pill btn-ghost" href="${sourceUrl}" target="_blank" rel="noopener noreferrer" style="color:#fff;border-color:rgba(255,255,255,.2);">${escapeHtml(t('ফেসবুকে বিস্তারিত'))}</a>`;
    const eventPosterLink = isFacebookEvent && hasSeparatePoster
      ? `<a class="btn-pill btn-ghost" href="${posterUrl}" target="_blank" rel="noopener noreferrer" style="color:#fff;border-color:rgba(255,255,255,.2);">${escapeHtml(t('পোস্টার ও QR দেখুন'))}</a>`
      : '';

    announcementsList.innerHTML = `
      <article class="announcement-shell reveal visible">
        ${media}
        <div class="announcement-copy">
          <div class="announcement-kicker">${escapeHtml(cleanText(announcement.kicker || t('বিশেষ ঘোষণা'), 70))}</div>
          <h2 id="announcementsTitle">${escapeHtml(cleanText(announcement.title, 100))}</h2>
          <p>${escapeHtml(cleanText(announcement.excerpt, 620))}</p>
          <div class="event-details" aria-label="${escapeHtml(t('অনুষ্ঠানের তথ্য'))}">
            <div class="event-detail"><small>${escapeHtml(t('তারিখ'))}</small><strong>${escapeHtml(cleanText(announcement.date, 70))}</strong></div>
            <div class="event-detail"><small>${escapeHtml(t('সময়'))}</small><strong>${escapeHtml(cleanText(announcement.time, 60))}</strong></div>
            <div class="event-detail"><small>${escapeHtml(t('স্থান'))}</small><strong>${escapeHtml(cleanText(announcement.location, 70))}</strong></div>
          </div>
          <div class="announcement-actions">
            <a class="btn-pill btn-primary" href="${isFacebookEvent ? sourceUrl : posterUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(t(isFacebookEvent ? 'Facebook Event দেখুন' : 'পোস্টার ও নিবন্ধন QR দেখুন'))}</a>
            ${eventPosterLink}
            ${sourceLink}
            <span class="announcement-source">${escapeHtml(cleanText(announcement.sourceName || 'NCP Diaspora Alliance Germany', 70))}</span>
            <span class="announcement-source">${escapeHtml(t('Facebook Events · প্রতি ২৪ ঘণ্টায় যাচাই'))}</span>
          </div>
        </div>
      </article>`;
    setAnnouncementVisibility(true);
  }

  loadContentJson(announcementsList.dataset.contentSource || 'data/announcements.json')
    .then((data) => {
      announcementItems = contentItems(data.items || data);
      renderAnnouncement(announcementItems);
    })
    .catch(() => {
      announcementItems = [];
      renderAnnouncement(announcementItems);
    });
  i18n?.onChange(() => renderAnnouncement(announcementItems));
}

/* ─────────────────────────────────────────
   MODULE: 32–36 JULY MEMORY EXPERIENCE
───────────────────────────────────────── */
function initJuly36Special() {
  const section = $('#july-36');
  const experience = $('#july36Experience');
  const navigationLinks = $$('[data-july36-link]');
  if (!section || !experience) return;

  let sourceContent = null;
  let selectedJulyDay = 36;
  let scheduleState = null;

  function translatedValue(value) {
    const language = i18n?.language || document.documentElement.lang || 'bn';
    const { translations = {}, ...baseValue } = value || {};
    return language !== 'bn' && translations[language]
      ? { ...baseValue, ...translations[language] }
      : baseValue;
  }

  function calendarDateInTimeZone(timeZone) {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return {
      year: Number(values.year),
      month: Number(values.month),
      day: Number(values.day)
    };
  }

  function resolveSchedule(content) {
    const schedule = content.schedule || {};
    const calendar = calendarDateInTimeZone(schedule.timeZone || 'Europe/Berlin');
    const currentKey = calendar.month * 100 + calendar.day;
    const startKey = Number(schedule.startMonth || 8) * 100 + Number(schedule.startDay || 1);
    const endKey = Number(schedule.endMonth || 8) * 100 + Number(schedule.endDay || 5);
    const isLive = currentKey >= startKey && currentKey <= endKey;
    const requestedDay = Number(new URL(window.location.href).searchParams.get('july-day'));
    const hasRequestedDay = content.days.some((day) => Number(day.julyDay) === requestedDay);
    const currentJulyDay = isLive
      ? Number(content.days.find((day) => Number(day.calendarDay) === calendar.day)?.julyDay || 36)
      : 0;
    const maximumUnlockedDay = isLive ? currentJulyDay : 36;
    const requestedIsUnlocked = hasRequestedDay && requestedDay <= maximumUnlockedDay;

    return {
      isLive,
      isPreview: !isLive && hasRequestedDay,
      isVisible: isLive || hasRequestedDay,
      currentJulyDay,
      maximumUnlockedDay,
      initialDay: requestedIsUnlocked ? requestedDay : (isLive ? currentJulyDay : requestedDay)
    };
  }

  function setVisibility(isVisible) {
    section.hidden = !isVisible;
    navigationLinks.forEach((link) => {
      link.hidden = !isVisible;
    });
    if (isVisible) section.classList.add('motion-visible');
    window.dispatchEvent(new Event('resize'));
  }

  function localizedNumber(value) {
    return i18n?.formatNumber(Number(value), { useGrouping: false }) ?? String(value);
  }

  function renderDayTabs(days, labels) {
    const tabs = $('#july36Days', experience);
    if (!tabs) return;

    tabs.innerHTML = days.map((day) => {
      const isActive = Number(day.julyDay) === selectedJulyDay;
      const isToday = scheduleState.isLive && Number(day.julyDay) === scheduleState.currentJulyDay;
      const isLocked = Number(day.julyDay) > scheduleState.maximumUnlockedDay;
      const stateLabel = isToday ? labels.today : labels.past;
      const accessibleLabel = isLocked
        ? `${day.date}: ${labels.locked}`
        : `${day.date}: ${day.title}. ${stateLabel}`;

      return `
        <button
          class="july36-day${isActive ? ' is-active' : ''}${isToday ? ' is-today' : ''}"
          type="button"
          role="tab"
          id="july36Tab${escapeHtml(day.julyDay)}"
          aria-controls="july36Story"
          aria-selected="${String(isActive)}"
          aria-label="${escapeHtml(accessibleLabel)}"
          tabindex="${isActive ? '0' : '-1'}"
          data-july36-day="${escapeHtml(day.julyDay)}"
          ${isLocked ? `disabled title="${escapeHtml(labels.locked)}"` : ''}
        >
          ${isLocked ? '<span class="july36-day-lock" aria-hidden="true">⌁</span>' : ''}
          <strong class="july36-day-number">${escapeHtml(localizedNumber(day.julyDay))}</strong>
          <span class="july36-day-date">${escapeHtml(cleanText(day.date, 42))}</span>
          <span class="july36-day-theme">${escapeHtml(cleanText(day.theme, 40))}</span>
        </button>`;
    }).join('');
  }

  function renderStory(day, content) {
    const story = $('#july36Story', experience);
    if (!story || !day) return;

    const labels = content.labels;
    const image = escapeHtml(safeImageSrc(day.image, 'img/july/selected/august-05-parliament-afp.webp'));
    const sources = contentItems(day.sources).slice(0, 4).map((source) => `
      <a class="july36-source" href="${safeHref(source.url)}" target="_blank" rel="noopener noreferrer">
        ${escapeHtml(cleanText(source.label, 150))}<span aria-hidden="true">↗</span>
      </a>`).join('');
    const archiveUrl = safeHref(content.archiveUrl || '/july-uprising/');
    const archiveLanguage = ['en', 'de'].includes(i18n?.language) ? i18n.language : '';
    const localizedArchiveUrl = archiveLanguage
      ? `${archiveUrl}${archiveUrl.includes('?') ? '&amp;' : '?'}lang=${archiveLanguage}`
      : archiveUrl;
    const storyState = scheduleState.isLive && Number(day.julyDay) === scheduleState.currentJulyDay
      ? labels.today
      : labels.past;

    story.outerHTML = `
      <article
        class="july36-story"
        id="july36Story"
        role="tabpanel"
        aria-labelledby="july36Tab${escapeHtml(day.julyDay)}"
        data-july36-story-day="${escapeHtml(day.julyDay)}"
      >
        <figure class="july36-visual">
          <img src="${image}" alt="${escapeHtml(cleanText(day.imageAlt || day.title, 220))}" width="1600" height="1067">
          <strong class="july36-visual-number" aria-hidden="true">${escapeHtml(localizedNumber(day.julyDay))}</strong>
          <figcaption class="july36-visual-caption">${escapeHtml(cleanText(day.imageCredit, 180))}</figcaption>
        </figure>
        <div class="july36-copy">
          <div class="july36-story-meta">
            <span>${escapeHtml(cleanText(day.date, 42))}</span>
            <span>${escapeHtml(cleanText(day.theme, 40))}</span>
            <span>${escapeHtml(storyState)}</span>
          </div>
          <h3>${escapeHtml(cleanText(day.title, 170))}</h3>
          <p class="july36-summary">${escapeHtml(cleanText(day.summary, 1200))}</p>
          <blockquote class="july36-mantra">${escapeHtml(cleanText(day.mantra, 260))}</blockquote>
          <div class="july36-sources-title">${escapeHtml(labels.sources)}</div>
          <div class="july36-sources">${sources}</div>
          <div class="july36-actions">
            <button class="july36-action primary" type="button" data-july36-share="${escapeHtml(day.julyDay)}">${escapeHtml(labels.share)}</button>
            <a class="july36-action" href="${localizedArchiveUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(labels.archive)} ↗</a>
          </div>
          <p class="july36-share-status" id="july36ShareStatus" role="status" aria-live="polite"></p>
        </div>
      </article>`;
  }

  function renderExperience() {
    if (!sourceContent || !scheduleState?.isVisible) return;
    const content = translatedValue(sourceContent);
    const days = sourceContent.days.map(translatedValue);
    const labels = content.labels;
    const currentIndex = days.findIndex((day) => Number(day.julyDay) === scheduleState.maximumUnlockedDay);
    const progressSteps = Math.max(1, currentIndex + 1);
    const progressPercent = `${(progressSteps / days.length) * 100}%`;
    const liveLabel = scheduleState.isPreview ? labels.preview : labels.live;

    experience.innerHTML = `
      <div class="july36-shell reveal visible">
        <header class="july36-header">
          <div>
            <div class="july36-kicker">${escapeHtml(content.kicker)}</div>
            <h2 id="july36Title">${escapeHtml(content.title)}</h2>
            <p>${escapeHtml(content.intro)}</p>
          </div>
          <div class="july36-live"><span class="july36-live-dot" aria-hidden="true"></span>${escapeHtml(liveLabel)}</div>
        </header>
        <div
          class="july36-progress"
          role="progressbar"
          aria-label="${escapeHtml(labels.progress)}"
          aria-valuemin="1"
          aria-valuemax="${days.length}"
          aria-valuenow="${progressSteps}"
          style="--july36-progress:${progressPercent}"
        ><span></span></div>
        <div class="july36-days stagger-children visible" id="july36Days" role="tablist" aria-label="${escapeHtml(content.title)}"></div>
        <article class="july36-story" id="july36Story" role="tabpanel"></article>
        <footer class="july36-closing">
          <h3>${escapeHtml(content.closingTitle)}</h3>
          <p>${escapeHtml(content.closingText)}</p>
        </footer>
      </div>`;

    renderDayTabs(days, labels);
    const selectedDay = days.find((day) => Number(day.julyDay) === selectedJulyDay)
      || days.find((day) => Number(day.julyDay) === scheduleState.maximumUnlockedDay)
      || days[0];
    selectedJulyDay = Number(selectedDay.julyDay);
    renderStory(selectedDay, content);
  }

  function selectDay(julyDay, { updateUrl = true } = {}) {
    if (!sourceContent) return;
    const numericDay = Number(julyDay);
    if (numericDay > scheduleState.maximumUnlockedDay) return;
    const sourceDay = sourceContent.days.find((day) => Number(day.julyDay) === numericDay);
    if (!sourceDay) return;

    selectedJulyDay = numericDay;
    const content = translatedValue(sourceContent);
    const days = sourceContent.days.map(translatedValue);
    renderDayTabs(days, content.labels);
    renderStory(translatedValue(sourceDay), content);

    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('july-day', String(numericDay));
      url.hash = 'july-36';
      window.history.replaceState({ julyDay: numericDay }, '', url);
    }
  }

  async function shareDay(julyDay) {
    const sourceDay = sourceContent?.days.find((day) => Number(day.julyDay) === Number(julyDay));
    if (!sourceDay) return;
    const day = translatedValue(sourceDay);
    const content = translatedValue(sourceContent);
    const language = i18n?.language || document.documentElement.lang || 'bn';
    const languageSuffix = language === 'bn' ? '' : `${language}/`;
    const url = new URL(`/july/${day.julyDay}/${languageSuffix}`, window.location.origin);
    const shareData = {
      title: day.title,
      text: `${day.mantra}\n\n${day.title}`,
      url: url.toString()
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }

    const status = $('#july36ShareStatus', experience);
    try {
      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      if (status) status.textContent = content.labels.copied;
    } catch {
      if (status) status.textContent = content.labels.shareError;
    }
  }

  experience.addEventListener('click', (event) => {
    const dayButton = event.target.closest('[data-july36-day]');
    if (dayButton && !dayButton.disabled) {
      selectDay(dayButton.dataset.july36Day);
      return;
    }

    const shareButton = event.target.closest('[data-july36-share]');
    if (shareButton) shareDay(shareButton.dataset.july36Share);
  });

  experience.addEventListener('keydown', (event) => {
    const currentButton = event.target.closest('[data-july36-day]');
    if (!currentButton || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = $$('[data-july36-day]:not(:disabled)', experience);
    if (!buttons.length) return;
    const currentIndex = buttons.indexOf(currentButton);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? buttons.length - 1
        : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
    event.preventDefault();
    buttons[nextIndex].focus();
    selectDay(buttons[nextIndex].dataset.july36Day);
  });

  loadContentJson(experience.dataset.contentSource || 'data/july-36-special.json')
    .then((data) => {
      sourceContent = data;
      scheduleState = resolveSchedule(sourceContent);
      if (!scheduleState.isVisible) {
        setVisibility(false);
        return;
      }
      selectedJulyDay = scheduleState.initialDay;
      renderExperience();
      setVisibility(true);
    })
    .catch(() => setVisibility(false));

  i18n?.onChange(() => {
    if (sourceContent && scheduleState?.isVisible) renderExperience();
  });
}

/* ─────────────────────────────────────────
   MODULE: JULY RESOURCES
───────────────────────────────────────── */
function initJulyResources() {
  const resourcesGrid = $('#julyResources');
  if (!resourcesGrid) return;
  let resourceItems = [];

  function renderResources(items) {
    const published = contentItems(items).filter((item) => item.status !== 'draft').slice(0, 9);
    if (!published.length) return;

    resourcesGrid.innerHTML = published.map((sourceItem) => {
      const item = localize(sourceItem);
      return `
      <a class="resource-card" href="${safeHref(item.url || '#')}" target="_blank" rel="noopener noreferrer">
        <span>${escapeHtml(cleanText(item.type || t('তথ্যসূত্র'), 44))}</span>
        <strong>${escapeHtml(cleanText(item.title, 120))}</strong>
        <p>${escapeHtml(cleanText(item.description, 260))}</p>
        <em>${escapeHtml(cleanText(item.cta || t('মূল উৎস দেখুন →'), 52))}</em>
      </a>`;
    }).join('');
  }

  loadContentJson(resourcesGrid.dataset.contentSource || 'data/july-resources.json')
    .then((data) => {
      resourceItems = contentItems(data.items || data);
      renderResources(resourceItems);
    })
    .catch(() => {
      // Keep the verified fallback links already rendered in the page.
    });
  i18n?.onChange(() => renderResources(resourceItems));
}

/* ─────────────────────────────────────────
   MODULE: RECENT UPDATES
───────────────────────────────────────── */
function initRecentUpdates() {
  const updatesGrid = $('#updatesGrid');
  if (!updatesGrid) return;

  const filterButtons = $$('[data-update-filter]');
  const freshness = $('#updatesFreshness');
  let allUpdates = [];
  let activeFilter = 'all';
  let lastUpdatedAt = '';

  function renderFreshness() {
    if (!freshness) return;
    const date = new Date(lastUpdatedAt);
    freshness.textContent = lastUpdatedAt && !Number.isNaN(date.getTime())
      ? `${t('সর্বশেষ হালনাগাদ')} · ${i18n?.formatDate(date, { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Berlin' }) ?? date.toLocaleString()}`
      : t('প্রতি ঘণ্টায় হালনাগাদ');
  }

  function renderUpdates(items) {
    const filtered = contentItems(items)
      .filter((item) => item.status !== 'draft')
      .filter((item) => activeFilter === 'all'
        || (activeFilter === 'featured' && item.featured === true && /(^|\.)facebook\.com$/i.test(new URL(safeHref(item.sourceUrl || '#'), window.location.href).hostname))
        || (activeFilter === 'video' && item.mediaType === 'video')
        || item.sourceKey === activeFilter);
    const sorted = filtered.sort((a, b) => {
      if (activeFilter === 'featured') {
        return Number(a.featuredOrder || 99) - Number(b.featuredOrder || 99)
          || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      if (activeFilter === 'video') {
        return Number(b.viewCount || 0) - Number(a.viewCount || 0)
          || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    const limit = activeFilter === 'featured' ? 4 : activeFilter === 'video' ? 6 : 10;
    const published = sorted.slice(0, limit);

    if (!published.length) {
      updatesGrid.innerHTML = `<div class="updates-empty">${escapeHtml(t(activeFilter === 'featured' ? 'এই মুহূর্তে কোনো যাচাইকৃত পিন করা Facebook পোস্ট পাওয়া যায়নি। পেজে নতুন পোস্ট পিন করা হলে এখানে দেখা যাবে।' : 'এই উৎসে এখনো কোনো প্রকাশিত আপডেট নেই। নতুন পোস্ট যুক্ত হলে এখানে দেখা যাবে।'))}</div>`;
      return;
    }

    updatesGrid.innerHTML = published.map((sourceItem) => {
      const item = localize(sourceItem);
      const href = safeHref(item.sourceUrl || item.link || '#');
      const mediaType = cleanText(item.mediaType || (item.image ? 'image' : 'text'), 12).toLowerCase();
      const image = item.image ? escapeHtml(safeImageSrc(item.image, 'img/blog/july-uprising.svg')) : '';
      const mediaLabel = mediaType === 'video' ? t('ভিডিও') : mediaType === 'image' ? t('ছবি') : '';
      const views = Number(item.viewCount || 0);
      const viewsLabel = mediaType === 'video' && views > 0
        ? `${i18n?.formatNumber(views, { notation: 'compact', maximumFractionDigits: 1 }) ?? views} ${t('ভিউ')}`
        : '';
      const createdDate = sourceItem.createdAt ? new Date(sourceItem.createdAt) : null;
      const dateLabel = createdDate && !Number.isNaN(createdDate.getTime())
        ? (i18n?.formatDate(createdDate, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' }) ?? item.date)
        : item.date;
      const media = image ? `
        <div class="update-media">
          <img src="${image}" alt="${escapeHtml(cleanText(item.imageAlt || item.title, 160))}" loading="lazy" />
          ${mediaLabel ? `<span class="update-media-badge">${mediaLabel}</span>` : ''}
          ${mediaType === 'video' ? '<span class="update-play" aria-hidden="true"><span>▶</span></span>' : ''}
        </div>` : '';
      const body = `
        ${media}
        <div class="update-body">
          <div class="update-meta">
            <span class="update-dot"></span>
            <span class="update-date">${escapeHtml(cleanText(dateLabel, 42))}</span>
            ${item.featured === true ? `<span class="update-featured">${escapeHtml(t('ফিচার্ড'))}</span>` : ''}
            <span class="update-badge">${escapeHtml(cleanText(item.badge || item.tag || t('আপডেট'), 28))}</span>
            ${viewsLabel ? `<span class="update-badge">${escapeHtml(viewsLabel)}</span>` : ''}
          </div>
          <h3>${escapeHtml(cleanText(item.title, 140))}</h3>
          <p>${escapeHtml(cleanText(item.excerpt, 330))}</p>
          <div class="update-source">
            <span>${escapeHtml(cleanText(item.sourceName || item.source || t('অফিসিয়াল উৎস'), 70))}</span>
            <strong>${escapeHtml(t(mediaType === 'video' ? 'ভিডিও দেখুন →' : 'মূল পোস্ট →'))}</strong>
          </div>
        </div>
      `;

      return href === '#'
        ? `<article class="update-card">${body}</article>`
        : `<article class="update-card"><a href="${href}" target="_blank" rel="noopener noreferrer">${body}</a></article>`;
    }).join('');
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.updateFilter || 'all';
      filterButtons.forEach((candidate) => {
        const selected = candidate === button;
        candidate.classList.toggle('active', selected);
        candidate.setAttribute('aria-pressed', String(selected));
      });
      renderUpdates(allUpdates);
    });
  });

  loadContentJson(updatesGrid.dataset.contentSource || 'data/recent-updates.json')
    .then((data) => {
      allUpdates = contentItems(data.items || data);
      lastUpdatedAt = data.updatedAt || '';
      renderUpdates(allUpdates);
      renderFreshness();
    })
    .catch(() => {
      // Keep the hardcoded fallback cards already present in the page.
    });
  i18n?.onChange(() => {
    renderUpdates(allUpdates);
    renderFreshness();
  });
}

/* ─────────────────────────────────────────
   MODULE: BLOG
───────────────────────────────────────── */
function initBlog() {
  const blogGrid = $('#blogGrid');
  if (!blogGrid) return;

  const blogMore = $('#blogMore');
  const blogMoreLabel = $('#blogMoreLabel');
  const modal = $('#blogModal');
  const modalPanel = modal ? $('.blog-modal-panel', modal) : null;
  const modalImage = $('#blogModalImage');
  const modalMeta = $('#blogModalMeta');
  const modalTitle = $('#blogModalTitle');
  const modalFacts = $('#blogModalFacts');
  const modalBody = $('#blogModalBody');
  const modalSources = $('#blogModalSources');
  const modalCredit = $('#blogModalCredit');
  const modalShare = $('#blogModalShare');
  const modalShareStatus = $('#blogShareStatus');
  const defaultImage = 'img/blog/july-uprising.svg';
  let articlesById = new Map();
  let rawArticles = [];
  let activeArticleId = '';
  let lastFocusedElement = null;
  let showingAllArticles = false;
  const mobileBlogQuery = window.matchMedia('(max-width: 680px)');
  const initialBlogLimit = () => mobileBlogQuery.matches ? 3 : 6;

  const fallbackArticles = [
    {
      id: 'july-uprising-dream-responsibility',
      status: 'published',
      tag: 'জুলাই চেতনা',
      author: 'সম্পাদকীয় টিম',
      date: 'জুলাই ২০২৬',
      title: 'জুলাই অভ্যুত্থান ২০২৪: নতুন বাংলাদেশের স্বপ্ন ও দায়িত্ব',
      excerpt: 'জুলাই অভ্যুত্থান কেবল এক গণআন্দোলন নয়; এটি ছিল নাগরিক মর্যাদা, অধিকার, গণতন্ত্র এবং বৈষম্যবিরোধী বাংলাদেশের নতুন দিকনির্দেশনা।',
      image: 'img/blog/july-uprising.svg',
      imageAlt: 'জুলাই অভ্যুত্থানের চেতনা নিয়ে একটি মৌলিক সম্পাদকীয় ইলাস্ট্রেশন',
      imageCredit: 'Original copyright-free illustration prepared for NCP Diaspora Alliance Germany.',
      content: [
        'জুলাই অভ্যুত্থান ২০২৪ বাংলাদেশের নাগরিক রাজনীতিকে নতুনভাবে ভাবতে শেখায়। এই আন্দোলন দেখিয়েছে, রাষ্ট্র তখনই শক্তিশালী হয় যখন নাগরিকের মর্যাদা, ভোট, মতপ্রকাশ ও ন্যায়বিচারকে রাষ্ট্রের কেন্দ্রস্থলে রাখা হয়।',
        'নতুন বাংলাদেশের স্বপ্ন তাই শুধু ক্ষমতার পরিবর্তন নয়; এটি রাজনৈতিক সংস্কৃতি, প্রতিষ্ঠান, শিক্ষা, কর্মসংস্থান এবং নাগরিক নিরাপত্তাকে নতুন করে সাজানোর দায়িত্ব।',
        'প্রবাসীদের জন্য এই দায়িত্ব আরও গভীর, কারণ দূরে থেকেও তারা বাংলাদেশের অর্থনীতি, জনমত, আন্তর্জাতিক যোগাযোগ এবং নৈতিক সমর্থনের সঙ্গে যুক্ত।'
      ]
    },
    {
      id: 'diaspora-voting-rights-future',
      status: 'published',
      tag: 'প্রবাসী অধিকার',
      author: 'সম্পাদকীয় টিম',
      date: 'জুলাই ২০২৬',
      title: 'প্রবাসী ভোটাধিকার: বাংলাদেশের ভবিষ্যৎ গঠনে একটি মৌলিক অধিকার',
      excerpt: 'প্রবাসী বাংলাদেশিদের ভোটাধিকার কেবল একটি রাজনৈতিক দাবি নয়; এটি তাদের নাগরিক মর্যাদা, অংশগ্রহণ ও জাতীয় দায়িত্বের স্বীকৃতি।',
      image: 'img/blog/voting-rights.svg',
      imageAlt: 'প্রবাসী ভোটাধিকার নিয়ে ব্যালট ও সংযোগের মৌলিক ইলাস্ট্রেশন',
      imageCredit: 'Original copyright-free illustration prepared for NCP Diaspora Alliance Germany.',
      content: [
        'প্রবাসীরা দেশের বাইরে থাকলেও তারা বাংলাদেশের নাগরিক, করুণার প্রাপক নয়। তাদের পাঠানো রেমিট্যান্স, জ্ঞান, শ্রম, সম্পর্ক ও সুনাম জাতীয় জীবনের গুরুত্বপূর্ণ অংশ।',
        'তাই প্রবাসী ভোটাধিকার কোনো অতিরিক্ত সুবিধা নয়; এটি নাগরিক অধিকার বাস্তবায়নের একটি জরুরি ধাপ। নিরাপদ নিবন্ধন, স্বচ্ছ যাচাই এবং সহজ ভোটপ্রদান পদ্ধতি তৈরি করা রাষ্ট্রের দায়িত্ব।',
        'প্রবাসী ভোট নিশ্চিত হলে বাংলাদেশ তার বৃহত্তর নাগরিক সমাজকে রাজনৈতিকভাবে দৃশ্যমান করতে পারবে।'
      ]
    },
    {
      id: 'diaspora-leadership-germany-europe',
      status: 'published',
      tag: 'ডায়াস্পোরা',
      author: 'সম্পাদকীয় টিম',
      date: 'আগস্ট ২০২৬',
      title: 'জার্মানি ও ইউরোপে বাংলাদেশি ডায়াস্পোরা: একতাবদ্ধ নেতৃত্বের নতুন সম্ভাবনা',
      excerpt: 'জার্মানি ও ইউরোপে বসবাসকারী বাংলাদেশিরা তাদের অভিজ্ঞতা, জ্ঞান ও নেটওয়ার্ককে ব্যবহার করে বাংলাদেশের উন্নয়নে শক্তিশালী ভূমিকা রাখতে পারেন।',
      image: 'img/blog/diaspora-leadership.svg',
      imageAlt: 'জার্মানি ও ইউরোপে বাংলাদেশি ডায়াস্পোরা নেতৃত্বের মৌলিক ইলাস্ট্রেশন',
      imageCredit: 'Original copyright-free illustration prepared for NCP Diaspora Alliance Germany.',
      content: [
        'জার্মানি ও ইউরোপে বাংলাদেশি ডায়াস্পোরা এখন আর শুধু প্রবাসী শ্রম বা শিক্ষার গল্প নয়। এখানে আছে গবেষণা, প্রযুক্তি, চিকিৎসা, উদ্যোক্তা, সংস্কৃতি ও নাগরিক সংগঠনের অভিজ্ঞতা।',
        'এই অভিজ্ঞতাকে একত্র করতে হলে দরকার সুশৃঙ্খল নেতৃত্ব, তথ্যভিত্তিক কাজ এবং প্রজন্মভিত্তিক অংশগ্রহণ। শহরভিত্তিক ছোট ছোট উদ্যোগকে একটি বড় নেটওয়ার্কে যুক্ত করা গেলে তার প্রভাব বহুগুণ বাড়ে।',
        'প্রবাসী নেতৃত্বের প্রধান শক্তি হলো সংযোগ: বাংলাদেশ, জার্মানি এবং ইউরোপীয় প্রতিষ্ঠানের মধ্যে আস্থা ও সহযোগিতার সেতু তৈরি করা।'
      ]
    },
    {
      id: 'brain-drain-to-brain-gain',
      status: 'published',
      tag: 'অর্থনীতি',
      author: 'সম্পাদকীয় টিম',
      date: 'আগস্ট ২০২৬',
      title: 'ডায়াস্পোরা কীভাবে বাংলাদেশের জন্য “ব্রেন ড্রেন” নয়, “ব্রেন গেইন” হতে পারে',
      excerpt: 'সঠিক নীতি, সংগঠন এবং সুযোগের মাধ্যমে প্রবাসী দক্ষতা, উদ্যোক্তা মনোভাব ও প্রযুক্তিগত জ্ঞানকে বাংলাদেশে ফিরিয়ে আনা সম্ভব।',
      image: 'img/blog/brain-gain.svg',
      imageAlt: 'প্রবাসী জ্ঞান ও দক্ষতা বাংলাদেশের উন্নয়নে ফেরার মৌলিক ইলাস্ট্রেশন',
      imageCredit: 'Original copyright-free illustration prepared for NCP Diaspora Alliance Germany.',
      content: [
        'বাংলাদেশ থেকে দক্ষ মানুষ বিদেশে গেলে সেটিকে অনেক সময় ক্ষতি হিসেবে দেখা হয়। কিন্তু সঠিক নীতি ও সংগঠনের মাধ্যমে একই মানুষ দেশের জন্য জ্ঞান, বিনিয়োগ, প্রযুক্তি ও আন্তর্জাতিক অভিজ্ঞতার উৎস হতে পারেন।',
        'ব্রেন গেইনের জন্য দরকার স্পষ্ট সেতুবন্ধন: প্রবাসী পেশাজীবীদের ডাটাবেস, বিশ্ববিদ্যালয় ও শিল্পখাতের সঙ্গে মেন্টরশিপ, গবেষণা সহযোগিতা, স্টার্টআপ বিনিয়োগ এবং নীতিনির্ধারণে বিশেষজ্ঞ মতামত।',
        'মানুষকে শুধু ফিরে আসতে বললেই হবে না; তাদের জ্ঞান যেন বাংলাদেশে কাজ করে, সেই ব্যবস্থাই তৈরি করতে হবে।'
      ]
    },
    {
      id: 'diaspora-leadership-investment-impact',
      status: 'published',
      tag: 'উন্নয়ন',
      author: 'সম্পাদকীয় টিম',
      date: 'সেপ্টেম্বর ২০২৬',
      title: 'কোন কোন খাতে প্রবাসী নেতৃত্ব ও বিনিয়োগ সবচেয়ে বেশি প্রভাব ফেলতে পারে',
      excerpt: 'শিক্ষা, স্বাস্থ্য, টেকনোলজি, কৃষি, উদ্যোক্তা এবং সামাজিক অবকাঠামো—এসব ক্ষেত্রে প্রবাসীদের সক্রিয় অংশগ্রহণ জাতীয় উন্নয়নে বড় পরিবর্তন আনতে পারে।',
      image: 'img/blog/investment-impact.svg',
      imageAlt: 'প্রবাসী বিনিয়োগের প্রভাব নিয়ে শিক্ষা স্বাস্থ্য প্রযুক্তি ও উদ্যোক্তা খাতের মৌলিক ইলাস্ট্রেশন',
      imageCredit: 'Original copyright-free illustration prepared for NCP Diaspora Alliance Germany.',
      content: [
        'প্রবাসী বিনিয়োগকে শুধু রিয়েল এস্টেট বা ব্যক্তিগত সহায়তায় আটকে রাখা উচিত নয়। শিক্ষা, স্বাস্থ্য, প্রযুক্তি, কৃষি, দক্ষতা উন্নয়ন এবং সামাজিক উদ্যোগে বিনিয়োগ করলে তার প্রভাব দীর্ঘমেয়াদি হয়।',
        'সবচেয়ে বড় পরিবর্তন আসে যখন অর্থের সঙ্গে অভিজ্ঞতা, ব্যবস্থাপনা, বাজার-সংযোগ এবং জবাবদিহি যুক্ত হয়। প্রবাসীরা আন্তর্জাতিক মান, স্বচ্ছতা এবং পেশাদার সংস্কৃতি নিয়ে আসতে পারেন।',
        'সঠিক প্রকল্প বাছাই, স্থানীয় অংশীদারিত্ব এবং ফলাফল-পরিমাপের মাধ্যমে প্রবাসী নেতৃত্ব বাংলাদেশের উন্নয়নে বাস্তব পরিবর্তন আনতে পারে।'
      ]
    },
    {
      id: 'diaspora-voice-equity-bangladesh',
      status: 'published',
      tag: 'ঐক্য',
      author: 'সম্পাদকীয় টিম',
      date: 'সেপ্টেম্বর ২০২৬',
      title: 'বৈষম্যমুক্ত বাংলাদেশে প্রবাসী কণ্ঠস্বরের গুরুত্ব',
      excerpt: 'প্রবাসী কণ্ঠস্বর শুধু স্বদেশপ্রেমের প্রকাশ নয়; এটি ন্যায্যতা, অন্তর্ভুক্তি ও নতুন বাংলাদেশের রাজনৈতিক সংস্কারে একটি শক্তিশালী চালিকা শক্তি।',
      image: 'img/blog/diaspora-voice.svg',
      imageAlt: 'বৈষম্যমুক্ত বাংলাদেশে প্রবাসী কণ্ঠস্বরের মৌলিক ইলাস্ট্রেশন',
      imageCredit: 'Original copyright-free illustration prepared for NCP Diaspora Alliance Germany.',
      content: [
        'বৈষম্যমুক্ত বাংলাদেশ গড়তে হলে দেশের ভেতরের মানুষের পাশাপাশি প্রবাসীদের কণ্ঠও গুরুত্বপূর্ণ। কারণ প্রবাসীরা একদিকে বাংলাদেশের বাস্তবতা জানেন, অন্যদিকে গণতান্ত্রিক প্রতিষ্ঠান ও নাগরিক অধিকার নিয়ে ভিন্ন অভিজ্ঞতা অর্জন করেন।',
        'এই কণ্ঠস্বর যেন দায়িত্বশীল, তথ্যভিত্তিক এবং অন্তর্ভুক্তিমূলক হয়, সেটি জরুরি। বিভাজন নয়, ন্যায় ও সংস্কারের ভাষা প্রবাসী রাজনীতিকে শক্তিশালী করে।',
        'বাংলাদেশের ভবিষ্যৎ নিয়ে প্রবাসীদের অংশগ্রহণ তাই আবেগের বিষয় হলেও তার বাস্তব রূপ হতে হবে সংগঠিত, স্বচ্ছ এবং সবার জন্য উন্মুক্ত।'
      ]
    }
  ];

  function articleId(article, index) {
    const rawId = cleanText(article.id || article.slug || `article-${index + 1}`, 90);
    const normalized = rawId.replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
    return normalized || `article-${index + 1}`;
  }

  function articleParagraphs(article) {
    if (Array.isArray(article.content)) {
      return article.content.filter((paragraph) => cleanText(paragraph, 1400));
    }

    if (typeof article.body === 'string') {
      return article.body.split(/\n{2,}/).filter((paragraph) => cleanText(paragraph, 1400));
    }

    return [article.excerpt].filter((paragraph) => cleanText(paragraph, 1400));
  }

  function localizeArticle(article) {
    const language = i18n?.language || document.documentElement.lang || 'bn';
    const { translations = {}, ...baseArticle } = article || {};
    const translated = language !== 'bn' && translations[language]
      ? { ...baseArticle, ...translations[language] }
      : baseArticle;
    return localize(translated);
  }

  function renderArticleContent(article) {
    if (!Array.isArray(article.blocks)) {
      return articleParagraphs(article)
        .map((paragraph) => `<p>${escapeHtml(cleanText(paragraph, 1800))}</p>`)
        .join('');
    }

    return article.blocks.map((block) => {
      if (!block || typeof block !== 'object') return '';

      if (block.type === 'heading') {
        return `<h4>${escapeHtml(cleanText(block.text, 240))}</h4>`;
      }

      if (block.type === 'list' && Array.isArray(block.items)) {
        const items = block.items
          .filter((item) => cleanText(item, 900))
          .slice(0, 20)
          .map((item) => `<li>${escapeHtml(cleanText(item, 900))}</li>`)
          .join('');
        if (!items) return '';
        const listTag = block.ordered ? 'ol' : 'ul';
        return `<${listTag}>${items}</${listTag}>`;
      }

      if (block.type === 'callout') {
        return `<blockquote>${escapeHtml(cleanText(block.text, 1800))}</blockquote>`;
      }

      if (block.type === 'image') {
        const image = safeImageSrc(block.src, defaultImage);
        const sourceUrl = safeHref(block.sourceUrl);
        const caption = cleanText(block.caption, 420);
        const credit = cleanText(block.credit, 240);
        const sourceLink = sourceUrl !== '#'
          ? `<a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('ছবির উৎস'))}</a>`
          : '';
        return `
          <figure class="blog-inline-figure">
            <img src="${escapeHtml(image)}" alt="${escapeHtml(cleanText(block.alt || article.title, 240))}" loading="lazy">
            <figcaption>
              ${caption ? `<span>${escapeHtml(caption)}</span>` : ''}
              ${credit ? `<small>${escapeHtml(credit)}</small>` : ''}
              ${sourceLink}
            </figcaption>
          </figure>`;
      }

      const paragraph = cleanText(block.text, 1800);
      return paragraph ? `<p>${escapeHtml(paragraph)}</p>` : '';
    }).join('');
  }

  function renderModalMeta(article) {
    return `
      <span class="blog-tag">${escapeHtml(cleanText(article.tag, 32))}</span>
      <span class="blog-author">${escapeHtml(cleanText(article.author || t('সম্পাদকীয় টিম'), 42))}</span>
      <span class="blog-date">${escapeHtml(cleanText(article.date, 42))}</span>
    `;
  }

  function renderArticleFacts(article) {
    if (!Array.isArray(article.facts)) return '';

    return article.facts
      .filter((fact) => fact && cleanText(fact.value, 80) && cleanText(fact.label, 180))
      .slice(0, 4)
      .map((fact) => `
        <div class="blog-data-item">
          <strong>${escapeHtml(cleanText(fact.value, 80))}</strong>
          <span>${escapeHtml(cleanText(fact.label, 180))}</span>
        </div>
      `)
      .join('');
  }

  function renderArticleSources(article) {
    if (!Array.isArray(article.sources)) return '';

    const links = article.sources
      .filter((source) => source && cleanText(source.label, 120) && safeHref(source.url) !== '#')
      .slice(0, 10)
      .map((source) => `
        <li>
          <a href="${safeHref(source.url)}" target="_blank" rel="noopener noreferrer">
            ${escapeHtml(cleanText(source.label, 120))}
          </a>
        </li>
      `)
      .join('');

    return links ? `<h4>${escapeHtml(t('তথ্যসূত্র'))}</h4><ul>${links}</ul>` : '';
  }

  function articleShareUrl(id) {
    const article = articlesById.get(id);
    const language = i18n?.language || document.documentElement.lang || 'bn';
    const sharePath = cleanText(article?.sharePath, 160).replace(/[^a-zA-Z0-9/_-]+/g, '');

    if (sharePath) {
      const languagePath = language !== 'bn' ? `${language}/` : '';
      return new URL(`/${sharePath.replace(/^\/+|\/+$/g, '')}/${languagePath}`, window.location.origin).toString();
    }

    const url = new URL(`${window.location.origin}${window.location.pathname}`);
    if (language && language !== 'bn') url.searchParams.set('lang', language);
    url.searchParams.set('blog', id);
    url.hash = 'blog';
    return url.toString();
  }

  function updateArticleUrl(id) {
    const url = new URL(window.location.href);
    url.searchParams.set('blog', id);
    url.hash = 'blog';
    window.history.replaceState({ blog: id }, '', url);
  }

  function clearArticleUrl() {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('blog')) return;
    url.searchParams.delete('blog');
    window.history.replaceState({}, '', url);
  }

  function renderSharePanel(article, id) {
    const shareUrl = articleShareUrl(id);
    const title = cleanText(article.title, 220);
    const shareText = `${title}\n${shareUrl}`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(shareText);
    const nativeAction = typeof navigator.share === 'function' ? `
      <button type="button" class="blog-share-action blog-share-native" data-blog-native-share="${escapeHtml(id)}">
        <span class="blog-share-icon" aria-hidden="true">↗</span>${escapeHtml(t('শেয়ার করুন'))}
      </button>` : '';

    return `
      <span class="blog-share-label">${escapeHtml(t('এই লেখাটি শেয়ার করুন'))}</span>
      <div class="blog-share-actions">
        ${nativeAction}
        <a class="blog-share-action" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t('Facebook-এ শেয়ার'))}">
          <span class="blog-share-icon" aria-hidden="true">f</span>Facebook
        </a>
        <a class="blog-share-action" href="https://wa.me/?text=${encodedText}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t('WhatsApp-এ শেয়ার'))}">
          <span class="blog-share-icon" aria-hidden="true">WA</span>WhatsApp
        </a>
        <a class="blog-share-action" href="https://twitter.com/intent/tweet?text=${encodedTitle}&amp;url=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t('X-এ শেয়ার'))}">
          <span class="blog-share-icon" aria-hidden="true">X</span>X
        </a>
        <a class="blog-share-action" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(t('LinkedIn-এ শেয়ার'))}">
          <span class="blog-share-icon" aria-hidden="true">in</span>LinkedIn
        </a>
        <button type="button" class="blog-share-action" data-blog-copy-link="${escapeHtml(id)}">
          <span class="blog-share-icon" aria-hidden="true">⌁</span>${escapeHtml(t('লিংক কপি করুন'))}
        </button>
      </div>`;
  }

  async function copyArticleLink(id) {
    const shareUrl = articleShareUrl(id);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const field = document.createElement('textarea');
        field.value = shareUrl;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        if (!copied) throw new Error('Copy command was rejected');
      }
      if (modalShareStatus) modalShareStatus.textContent = t('লিংক কপি হয়েছে।');
    } catch {
      if (modalShareStatus) modalShareStatus.textContent = t('লিংক কপি করা যায়নি।');
    }
  }

  async function shareArticle(id) {
    const article = articlesById.get(id);
    if (!article) return;
    const shareData = {
      title: cleanText(article.title, 220),
      text: cleanText(article.excerpt || article.title, 280),
      url: articleShareUrl(id)
    };

    if (typeof navigator.share !== 'function') {
      await copyArticleLink(id);
      return;
    }

    try {
      await navigator.share(shareData);
    } catch (error) {
      if (error?.name !== 'AbortError' && modalShareStatus) {
        modalShareStatus.textContent = t('লিংক কপি করা যায়নি।');
      }
    }
  }

  function closeBlogModal({ updateUrl = true } = {}) {
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.body.classList.remove('blog-modal-open');
    if (updateUrl) clearArticleUrl();
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function openBlogModal(id, { updateUrl = true, focusShare = false } = {}) {
    if (!modal || !modalPanel || !modalImage || !modalMeta || !modalTitle || !modalFacts || !modalBody || !modalSources || !modalCredit || !modalShare || !modalShareStatus) return;

    const article = articlesById.get(id);
    if (!article) return;

    activeArticleId = id;
    lastFocusedElement = document.activeElement;
    modalImage.src = safeImageSrc(article.image, defaultImage);
    modalImage.alt = cleanText(article.imageAlt || article.title, 220);
    modalMeta.innerHTML = renderModalMeta(article);
    modalTitle.textContent = cleanText(article.title, 220);
    modalShare.innerHTML = renderSharePanel(article, id);
    modalShare.setAttribute('aria-label', t('এই লেখাটি শেয়ার করুন'));
    modalShareStatus.textContent = '';
    modalFacts.innerHTML = renderArticleFacts(article);
    modalBody.innerHTML = renderArticleContent(article);
    modalSources.innerHTML = renderArticleSources(article);
    const imageCredit = cleanText(
      article.imageCredit || 'Original copyright-free illustration prepared for NCP Diaspora Alliance Germany.',
      360
    );
    const imageSourceUrl = safeHref(article.imageSourceUrl);
    modalCredit.innerHTML = `
      <span>${escapeHtml(imageCredit)}</span>
      ${imageSourceUrl !== '#'
        ? `<a href="${imageSourceUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(t('ছবির উৎস'))} ↗</a>`
        : ''}
    `;

    modal.hidden = false;
    document.body.classList.add('blog-modal-open');
    if (updateUrl) updateArticleUrl(id);
    modalPanel.focus({ preventScroll: true });
    if (focusShare) modalShare.querySelector('a, button')?.focus({ preventScroll: true });
  }

  function trapModalFocus(event) {
    if (!modal || modal.hidden || event.key !== 'Tab') return;

    const focusable = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modal)
      .filter((element) => !element.hasAttribute('hidden'));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function renderArticles(articles) {
    const published = contentItems(articles).filter((article) => article.status !== 'draft');
    if (!published.length) return;

    articlesById = new Map(published.map((article, index) => [articleId(article, index), localizeArticle(article)]));
    const visibleArticles = showingAllArticles ? published : published.slice(0, initialBlogLimit());

    if (blogMore) {
      const hasHiddenArticles = published.length > visibleArticles.length;
      blogMore.hidden = !hasHiddenArticles;
      blogMore.setAttribute('aria-expanded', String(showingAllArticles));
      blogMore.setAttribute('aria-label', t('সব ব্লগ দেখুন'));
      if (blogMoreLabel) blogMoreLabel.textContent = t('আরও দেখুন');
    }

    blogGrid.innerHTML = visibleArticles.map((sourceArticle) => {
      const index = published.indexOf(sourceArticle);
      const id = articleId(sourceArticle, index);
      const article = localizeArticle(sourceArticle);
      const image = safeImageSrc(article.image, defaultImage);

      return `
      <article class="blog-card">
        <div class="blog-image">
          <img src="${escapeHtml(image)}" alt="${escapeHtml(cleanText(article.imageAlt || article.title, 220))}" loading="lazy">
        </div>
        <div class="blog-body">
          <div class="blog-meta">
            <span class="blog-tag">${escapeHtml(cleanText(article.tag, 32))}</span>
            <span class="blog-author">${escapeHtml(cleanText(article.author || t('সম্পাদকীয় টিম'), 42))}</span>
            <span class="blog-date">${escapeHtml(cleanText(article.date, 42))}</span>
          </div>
          <h3>${escapeHtml(cleanText(article.title, 150))}</h3>
          <p>${escapeHtml(cleanText(article.excerpt, 360))}</p>
          <div class="blog-card-actions">
            <button type="button" class="blog-link" data-blog-id="${escapeHtml(id)}" aria-label="${escapeHtml(`${t('সম্পূর্ণ লেখা পড়ুন')}: ${cleanText(article.title, 120)}`)}">
              ${escapeHtml(t('সম্পূর্ণ লেখা পড়ুন'))}
              <span aria-hidden="true">→</span>
            </button>
            <button type="button" class="blog-share-trigger" data-blog-share-id="${escapeHtml(id)}" aria-label="${escapeHtml(`${t('শেয়ার করুন')}: ${cleanText(article.title, 120)}`)}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><path d="m8.6 10.6 6.8-4.2M8.6 13.4l6.8 4.2"></path></svg>
              ${escapeHtml(t('শেয়ার করুন'))}
            </button>
          </div>
        </div>
      </article>
    `;
    }).join('');
  }

  blogMore?.addEventListener('click', () => {
    const firstNewArticleIndex = initialBlogLimit();
    showingAllArticles = true;
    renderArticles(rawArticles);
    blogGrid.querySelectorAll('.blog-card')[firstNewArticleIndex]?.querySelector('button')?.focus({ preventScroll: true });
  });

  mobileBlogQuery.addEventListener?.('change', () => {
    if (!showingAllArticles) renderArticles(rawArticles);
  });

  blogGrid.addEventListener('click', (event) => {
    const shareTrigger = event.target.closest('[data-blog-share-id]');
    if (shareTrigger) {
      openBlogModal(shareTrigger.dataset.blogShareId, { focusShare: true });
      return;
    }
    const trigger = event.target.closest('[data-blog-id]');
    if (!trigger) return;
    openBlogModal(trigger.dataset.blogId);
  });

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target.closest('[data-close-blog-modal]')) {
        closeBlogModal();
        return;
      }
      const nativeShare = event.target.closest('[data-blog-native-share]');
      if (nativeShare) shareArticle(nativeShare.dataset.blogNativeShare);
      const copyLink = event.target.closest('[data-blog-copy-link]');
      if (copyLink) copyArticleLink(copyLink.dataset.blogCopyLink);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeBlogModal();
    trapModalFocus(event);
  });

  rawArticles = fallbackArticles;
  renderArticles(rawArticles);

  const requestedArticleId = new URL(window.location.href).searchParams.get('blog') || '';
  if (requestedArticleId && articlesById.has(requestedArticleId)) {
    openBlogModal(requestedArticleId, { updateUrl: false });
  }

  loadContentJson('data/blog-posts.json?v=20260804-nahid-mandate')
    .then((data) => {
      rawArticles = Array.isArray(data.items) ? data.items : data;
      renderArticles(rawArticles);
      if (requestedArticleId && articlesById.has(requestedArticleId)) {
        openBlogModal(requestedArticleId, { updateUrl: false });
      }
    })
    .catch(() => {
      // Keep fallback cards if the data file cannot be loaded.
    });
  i18n?.onChange(() => {
    const reopenId = modal && !modal.hidden ? activeArticleId : '';
    const previousFocus = lastFocusedElement;
    renderArticles(rawArticles);
    if (reopenId) {
      openBlogModal(reopenId, { updateUrl: false });
      lastFocusedElement = previousFocus;
    }
  });
}

/* ─────────────────────────────────────────
   MODULE: GALLERY
───────────────────────────────────────── */
function initGallery() {
  const galleryTrack = $('#galleryTrack');
  const galleryStageImage = $('#galleryStageImage');
  const galleryStageTag = $('#galleryStageTag');
  const galleryStageLocation = $('#galleryStageLocation');
  const galleryStageCounter = $('#galleryStageCounter');
  const galleryStageTitle = $('#galleryStageTitle');
  const galleryStageCaption = $('#galleryStageCaption');
  const galleryStageSource = $('#galleryStageSource');
  const galleryProgressFill = $('#galleryProgressFill');
  const galleryPrev = $('#galleryPrev');
  const galleryNext = $('#galleryNext');

  if (!galleryTrack || !galleryStageImage || !galleryStageTag || !galleryStageLocation || !galleryStageCounter || !galleryStageTitle || !galleryStageCaption || !galleryStageSource || !galleryProgressFill || !galleryPrev || !galleryNext) return;

  const fallbackImage = 'img/july/1.jpg';

  const galleryItems = [
    {
      image: 'img/july/1.jpg',
      tag: 'দূতাবাস সাক্ষাৎ',
      location: 'বার্লিন · ১৭ এপ্রিল ২০২৬',
      title: 'রাষ্ট্রদূতের সঙ্গে সৌজন্য সাক্ষাৎ',
      caption: 'বাংলাদেশ দূতাবাস, বার্লিনে NCP Diaspora Alliance Germany-এর প্রতিনিধিদল রাষ্ট্রদূত জনাব মুহাম্মদ জুলকার নাইন-এর সঙ্গে প্রবাসী অধিকার, সংগঠন ও নাগরিক অংশগ্রহণ নিয়ে মতবিনিময় করে।',
      detail: 'প্রতিনিধিদল দূতাবাসের সঙ্গে নিয়মিত যোগাযোগ, প্রবাসী নাগরিকদের সেবা ও বাংলাদেশের গণতান্ত্রিক রূপান্তরে প্রবাসীদের ভূমিকা নিয়ে আলোচনা করে।',
      sourceUrl: 'https://www.facebook.com/ncpdagermany/posts/122181003530921031/',
      sourceLabel: 'ফেসবুক আপডেট দেখুন'
    },
    {
      image: 'img/july/6.jpg',
      tag: 'নীতিগত সংলাপ',
      location: 'বাংলাদেশ দূতাবাস, বার্লিন',
      title: 'প্রবাসী ইস্যুতে দূতাবাসে মতবিনিময়',
      caption: 'দূতাবাসে অনুষ্ঠিত আলোচনায় প্রবাসী বাংলাদেশিদের নাগরিক সেবা, অংশগ্রহণ এবং জার্মানিতে সংগঠিত কমিউনিটি কাজের ধারাবাহিকতা নিয়ে কথা বলা হয়।',
      detail: 'এই বৈঠক জার্মানির বিভিন্ন শহরে থাকা বাংলাদেশি কমিউনিটিকে একত্রিত করে নীতিগত আলোচনায় যুক্ত করার একটি গুরুত্বপূর্ণ ধাপ।',
      sourceUrl: 'https://www.facebook.com/ncpdagermany/posts/122181003530921031/',
      sourceLabel: 'ফেসবুক আপডেট দেখুন'
    },
    {
      image: 'img/gallery/berlin-embassy-meeting-2026.jpg',
      tag: 'লিখিত প্রস্তাবনা',
      location: 'বার্লিন · ১৭ এপ্রিল ২০২৬',
      title: 'দূতাবাসে প্রস্তাবনা ও সাংগঠনিক বার্তা হস্তান্তর',
      caption: 'সৌজন্য সাক্ষাতে প্রতিনিধিদল লিখিত প্রস্তাবনা ও সাংগঠনিক অবস্থান তুলে ধরে, যাতে প্রবাসী অধিকার, নাগরিক মর্যাদা ও কমিউনিটি সেবার বিষয়গুলো গুরুত্ব পায়।',
      detail: 'ছবিটি NCP Diaspora Alliance Germany-এর দূতাবাসভিত্তিক আনুষ্ঠানিক যোগাযোগ ও দলিলভিত্তিক কাজের একটি দৃশ্যমান নথি।',
      sourceUrl: 'https://www.facebook.com/ncpdagermany/posts/122181003530921031/',
      sourceLabel: 'ফেসবুক আপডেট দেখুন'
    },
    {
      image: 'img/gallery/independence-day-networking-2026.jpg',
      tag: 'জাতীয় দিবস',
      location: 'বার্লিন · ৩০ এপ্রিল ২০২৬',
      title: 'স্বাধীনতা ও জাতীয় দিবসের নেটওয়ার্কিং',
      caption: 'বাংলাদেশ দূতাবাস, বার্লিন আয়োজিত মহান স্বাধীনতা ও জাতীয় দিবস ২০২৬ উপলক্ষে নেটওয়ার্কিং ও সৌহার্দ্য বিনিময় অনুষ্ঠানে NCP Diaspora Alliance Germany-এর প্রতিনিধিদল অংশগ্রহণ করে।',
      detail: 'ফেসবুক আপডেট অনুযায়ী, প্রতিনিধিদল কূটনীতিক, আমন্ত্রিত অতিথি ও কমিউনিটির প্রতিনিধিদের সঙ্গে বাংলাদেশের গণতান্ত্রিক ভবিষ্যৎ ও প্রবাসী ভূমিকা নিয়ে সৌহার্দ্যপূর্ণ মতবিনিময় করে।',
      sourceUrl: 'https://www.facebook.com/ncpdagermany/photos/d41d8cd9/122178857246921031/',
      sourceLabel: 'ফেসবুক ছবি দেখুন'
    },
    {
      image: 'img/gallery/ramadan-iftar-2026.jpg',
      tag: 'কমিউনিটি আয়োজন',
      location: 'NRW · ১৭ মার্চ ২০২৬',
      title: 'প্রবাসী বাংলাদেশিদের ইফতার মাহফিল',
      caption: 'পবিত্র রমজান উপলক্ষে জার্মানিতে প্রবাসী বাংলাদেশিদের অংশগ্রহণে আন্তরিক ইফতার মাহফিলের আয়োজন করা হয়, যা কমিউনিটি সম্পর্ক ও পারস্পরিক সহমর্মিতা দৃঢ় করার একটি উদ্যোগ।',
      detail: 'বার্লিন ও NRW-সহ বিভিন্ন অঞ্চলের প্রবাসীদের যোগাযোগের সুযোগ তৈরি করে সংগঠনের মানবিক ও সামাজিক বন্ধনকে শক্তিশালী করা এই আয়োজনের মূল উদ্দেশ্য।',
      fit: 'contain',
      sourceUrl: 'https://www.facebook.com/ncpdagermany/posts/122174119832921031/',
      sourceLabel: 'ফেসবুক আমন্ত্রণ দেখুন'
    },
    {
      image: 'img/gallery/july-remembrance-nrw-2026.jpg',
      tag: 'জুলাই স্মরণ',
      location: 'NRW · ২৬ জুলাই ২০২৬',
      title: 'জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে রক্তে জুলাই',
      caption: 'অনুষ্ঠানের প্রথম পর্ব “স্মৃতি থেকে জাগরণ” এবং দ্বিতীয় পর্ব “অভিজ্ঞতা, অংশগ্রহণ ও আগামীর ভাবনা”।',
      detail: 'অনুষ্ঠানসূচিতে প্রামাণ্যচিত্র, জুলাইয়ের জীবন্ত গল্প, বক্তব্য, ভিজ্যুয়াল স্টোরি, প্রবাস থেকে আলোচনা, অভিজ্ঞতা ও প্রতিফলন, শর্ট ফিল্ম, July Quiz, সদস্যদের কণ্ঠ ও ইন্টারঅ্যাকটিভ সেশন রয়েছে।',
      fit: 'contain',
      sourceUrl: 'https://www.facebook.com/ncpdagermany/',
      sourceLabel: 'ফেসবুক পেজ দেখুন'
    },
    {
      image: 'img/gallery/student-safety-notice-2026.jpg',
      tag: 'জনস্বার্থ নোটিশ',
      location: 'জার্মানি চ্যাপ্টার · ১৩ জুলাই ২০২৬',
      title: 'শিক্ষার্থীদের নিরাপত্তা ও পরীক্ষা স্থগিতের আহ্বান',
      caption: 'দেশের বিভিন্ন অঞ্চলে বন্যা, টানা বর্ষণ ও জলাবদ্ধতার কারণে শিক্ষার্থীদের নিরাপত্তা বিবেচনায় এইচএসসি ও সমমান পরীক্ষা সাময়িক স্থগিতের আহ্বান জানায় NCP Diaspora Alliance Germany।',
      detail: 'প্রবাসে থেকেও দেশের শিক্ষার্থীদের নিরাপত্তা ও মানবিক পরিস্থিতি নিয়ে সংগঠনের দ্রুত জনস্বার্থ অবস্থান এই নোটিশে প্রতিফলিত হয়েছে।',
      fit: 'contain',
      sourceUrl: 'https://www.facebook.com/ncpdagermany/',
      sourceLabel: 'ফেসবুক পেজ দেখুন'
    }
  ];

  let activeIndex = 0;

  function renderGalleryItems(items) {
    return items.map((item, index) => `
      <button
        class="gallery-thumb${index === 0 ? ' active' : ''}"
        type="button"
        data-gallery-index="${index}"
        aria-label="${item.title}"
        aria-pressed="${index === 0 ? 'true' : 'false'}"
      >
        <img
          src="${item.image}"
          alt="${item.title}"
          loading="lazy"
          decoding="async"
          data-fallback-image="${fallbackImage}"
          style="object-fit:${item.fit === 'contain' ? 'contain' : 'cover'};"
        />
        <div class="gallery-thumb-content">
          <span class="gallery-thumb-badge">${item.tag}</span>
          <strong>${item.title}</strong>
          <small>${item.location}</small>
          <em class="gallery-thumb-detail">${item.detail}</em>
        </div>
      </button>
    `).join('');
  }

  function setActive(index, shouldScroll = true) {
    const item = galleryItems[index];
    const buttons = $$('[data-gallery-index]', galleryTrack);
    activeIndex = index;

    galleryStageImage.style.opacity = '0.45';
    galleryStageImage.src = item.image;
    galleryStageImage.alt = item.title;
    galleryStageImage.style.objectFit = item.fit === 'contain' ? 'contain' : 'cover';
    galleryStageImage.onerror = () => {
      galleryStageImage.onerror = null;
      galleryStageImage.src = fallbackImage;
      galleryStageImage.style.objectFit = 'cover';
    };
    requestAnimationFrame(() => {
      galleryStageImage.style.opacity = '1';
    });

    galleryStageTag.textContent = item.tag;
    galleryStageLocation.textContent = item.location;
    galleryStageCounter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
    galleryStageTitle.textContent = item.title;
    galleryStageCaption.textContent = item.caption;
    if (item.sourceUrl) {
      galleryStageSource.hidden = false;
      galleryStageSource.href = item.sourceUrl;
      galleryStageSource.textContent = item.sourceLabel || 'উৎস দেখুন';
    } else {
      galleryStageSource.hidden = true;
      galleryStageSource.removeAttribute('href');
      galleryStageSource.textContent = '';
    }
    galleryProgressFill.style.width = `${((index + 1) / galleryItems.length) * 100}%`;

    buttons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (shouldScroll && buttons[index]) {
      buttons[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  galleryTrack.addEventListener('error', (event) => {
    const image = event.target.closest('img[data-fallback-image]');
    if (!image || image.dataset.fallbackApplied === 'true') return;
    image.dataset.fallbackApplied = 'true';
    image.src = image.dataset.fallbackImage;
  }, true);

  galleryTrack.innerHTML = renderGalleryItems(galleryItems);

  galleryTrack.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gallery-index]');
    if (!button) return;
    setActive(Number(button.dataset.galleryIndex));
  });

  galleryPrev.addEventListener('click', () => {
    setActive((activeIndex - 1 + galleryItems.length) % galleryItems.length);
  });

  galleryNext.addEventListener('click', () => {
    setActive((activeIndex + 1) % galleryItems.length);
  });
  setActive(0, false);
}

/* ─────────────────────────────────────────
   MODULE: FORM SUBMISSION
───────────────────────────────────────── */
function initForm() {
  const form      = $('#membershipForm');
  const statusEl  = $('#status');
  const submitBtn = $('#submitBtn');
  if (!form || !statusEl || !submitBtn) return;

  function setLoading(loading) {
    submitBtn.disabled = loading;
    submitBtn.classList.toggle('loading', loading);
  }

  function showStatus(type, message) {
    statusEl.className = 'status-msg ' + type;
    statusEl.textContent = message;
    statusEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function clearStatus() {
    statusEl.className = 'status-msg';
    statusEl.textContent = '';
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      showStatus('error', t('অনুগ্রহ করে সব আবশ্যিক তথ্য পূরণ করুন এবং তথ্য ব্যবহারের সম্মতিটি নিশ্চিত করুন।'));
      return;
    }

    clearStatus();
    setLoading(true);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error('Network response not ok');

      showStatus('success', t('✅ ধন্যবাদ! আপনার নিবন্ধন সফল হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।'));
      form.reset();
    } catch {
      showStatus('error', t('❌ কিছু একটা ভুল হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা সরাসরি ইমেইল করুন: ncpdiasporade@gmail.com'));
    } finally {
      setLoading(false);
    }
  }

  form.addEventListener('submit', handleSubmit);
}

/* ─────────────────────────────────────────
   MODULE: SMOOTH NAV LINKS
───────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const navH  = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      const offset = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
function init() {
  const root = document.documentElement;
  const revealAllContent = () => {
    root.classList.add('page-ready');
    $$('.reveal, .stagger-children').forEach((element) => element.classList.add('visible'));
  };
  const runSafely = (initializer) => {
    try {
      initializer();
    } catch (error) {
      console.error(`Could not initialise ${initializer.name || 'website module'}.`, error);
    }
  };

  root.classList.add('motion-ready');
  window.setTimeout(revealAllContent, 1800);
  [
    () => i18n?.init(),
    initProgressBar,
    initStickyNav,
    initSignatureMotion,
    initJulyMotion,
    initActiveNavigation,
    initMobileMenu,
    initScrollReveal,
    initBackToTop,
    initTicker,
    initAnnouncements,
    initJuly36Special,
    initJulyResources,
    initRecentUpdates,
    initBlog,
    initForm,
    initSmoothScroll
  ].forEach(runSafely);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
