const DATA_URL = 'data/site.json';

const $ = (s) => document.querySelector(s);

const DEFAULT_PROFILE = {
  name: 'Amir Hussain Shaik',
  title: 'Senior Electrical & Automation Engineer | Project Execution Lead',
  headline: 'Industrial Automation | Material Handling Systems | Project Execution | Site Leadership | Lean Six Sigma Black Belt',
  intro: 'Delivering reliable engineering solutions across Saudi Arabia, UAE and India with 10+ years of experience in electro-mechanical systems, conveyor solutions, automated storage systems and mission-critical maintenance operations.',
  photo: 'assets/images/formal-profile.jpg',
  email: 'amirhussain462@gmail.com',
  phone: 'KSA: +966 56 066 8265 | UAE: +971 54 763 7988',
  phoneDial: '+966560668265',
  linkedin: 'https://www.linkedin.com/in/amirhussainshaik',
  location: 'Riyadh, Saudi Arabia | Dubai, UAE | Available for KSA & UAE Projects'
};

let SITE_DATA = {};
let currentProjectIndex = 0;

function safeSetText(selector, text) {
  const node = $(selector);
  if (node) node.textContent = text || '';
}

function safeSetHref(selector, href) {
  const node = $(selector);
  if (node) node.href = href || '#';
}

function createEl(tag, cls = '', html = '') {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html) n.innerHTML = html;
  return n;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function loadSite() {
  try {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('site.json not found');
    const data = await res.json();
    SITE_DATA = data;
    render(data);
  } catch (err) {
    console.warn('Using fallback portfolio data:', err);
    SITE_DATA = {};
    render({});
  }
}

function render(data = {}) {
  const p = { ...DEFAULT_PROFILE, ...(data.profile || {}) };

  document.title = `${p.name} | ${p.title}`;

  safeSetText('#profile-name', p.name);
  safeSetText('#profile-title', p.title);
  safeSetText('#profile-headline', p.headline);
  safeSetText('#profile-intro', p.intro);

  const photo = $('#profile-photo');
  if (photo) photo.src = p.photo || DEFAULT_PROFILE.photo;

  if (p.heroImage) {
    document.documentElement.style.setProperty('--hero-image', `url('../${p.heroImage}')`);
  }

  safeSetText('#about-text', data.about || 'Senior Electrical & Automation Engineer with 10+ years of hands-on experience in industrial automation, material handling systems, conveyor systems, airport logistics automation, project execution, maintenance operations, and client-facing technical coordination.');

  renderList('#stats', data.stats || [
    { number: '10+', label: 'Years Experience' },
    { number: '50+', label: 'Major Projects & Deliverables' },
    { number: '98%+', label: 'System Availability Focus' },
    { number: '3', label: 'Countries Experience' }
  ], item => createEl('div', 'stat reveal', `<strong>${escapeHtml(item.number)}</strong><span>${escapeHtml(item.label)}</span>`));

  renderList('#expertise-list', data.expertise || [], item => createEl('div', 'expertise-card reveal', `<h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>`));

  renderProjects(data.projects || []);

  renderList('#experience-list', data.experience || [], item => createEl('div', 'timeline-item reveal', `
    <h3>${escapeHtml(item.role)}</h3>
    <div class="period">${escapeHtml(item.company)} • ${escapeHtml(item.period)}</div>
    <p>${escapeHtml(item.text)}</p>`));

  renderList('#certification-list', data.certifications || [], item => createEl('div', 'cert-card reveal', `
    <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
    <h3>${escapeHtml(item.title)}</h3>
    <a href="${escapeHtml(item.file)}" target="_blank" rel="noopener">View Certificate</a>`));

  safeSetHref('#email-link', `mailto:${p.email || DEFAULT_PROFILE.email}`);
  safeSetText('#email-link', p.email || DEFAULT_PROFILE.email);

  safeSetHref('#phone-link', `tel:${p.phoneDial || DEFAULT_PROFILE.phoneDial}`);
  safeSetText('#phone-link', p.phone || DEFAULT_PROFILE.phone);

  safeSetHref('#linkedin-link', p.linkedin || DEFAULT_PROFILE.linkedin);
  safeSetText('#linkedin-link', 'LinkedIn Profile');

  safeSetText('#location-text', p.location || DEFAULT_PROFILE.location);

  revealNow();
}

function renderProjects(projects) {
  const root = $('#project-list');
  if (!root) return;
  root.innerHTML = '';

  projects.forEach((item, index) => {
    const cover = item.coverImage || item.image || (item.media && item.media[0] && item.media[0].src) || 'assets/images/header-bg.jpg';
    const mediaCount = item.media ? item.media.length : 0;
    const card = createEl('article', 'project-card reveal', `
      <img src="${escapeHtml(cover)}" alt="${escapeHtml(item.title || 'Project')}">
      <div class="project-body project-summary">
        <span class="chip">${escapeHtml(item.category || 'Project')}</span>
        <h3>${escapeHtml(item.title || '')}</h3>
        <div class="project-meta">
          ${item.location ? `<span>${escapeHtml(item.location)}</span>` : ''}
          ${item.date ? `<span>${escapeHtml(item.date)}</span>` : ''}
          ${item.role ? `<span>${escapeHtml(item.role)}</span>` : ''}
          ${mediaCount ? `<span>${mediaCount} media files</span>` : ''}
        </div>
        <p><span class="label">Challenge:</span> ${escapeHtml(item.challenge || '')}</p>
        <p><span class="label">Result:</span> ${escapeHtml(item.result || '')}</p>
      </div>
      <div class="project-actions">
        <button class="btn ghost view-project" type="button" data-project-index="${index}">View Full Project</button>
      </div>`);
    root.appendChild(card);
  });

  document.querySelectorAll('.view-project').forEach(btn => {
    btn.addEventListener('click', () => openProjectModal(Number(btn.dataset.projectIndex)));
  });
}

function renderList(selector, list, renderer) {
  const root = $(selector);
  if (!root) return;
  root.innerHTML = '';
  (list || []).forEach(item => root.appendChild(renderer(item)));
}

function openProjectModal(index) {
  const projects = SITE_DATA.projects || [];
  const project = projects[index];
  if (!project) return;
  currentProjectIndex = index;
  renderProjectModal(project);
  const modal = $('#project-modal');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeProjectModal() {
  const modal = $('#project-modal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function renderProjectModal(project) {
  const modalContent = $('#modal-content');
  if (!modalContent) return;
  const media = project.media && project.media.length
    ? project.media
    : [{ type: 'image', src: project.coverImage || project.image || 'assets/images/header-bg.jpg', title: project.title }];

  modalContent.innerHTML = `
    <div class="modal-header">
      <span class="chip">${escapeHtml(project.category || 'Project')}</span>
      <h2 id="modal-title">${escapeHtml(project.title || '')}</h2>
      <p class="modal-sub">${escapeHtml(project.overview || '')}</p>
      <div class="project-meta">
        ${project.client ? `<span>Project Environment: ${escapeHtml(project.client)}</span>` : ''}
        ${project.location ? `<span>Location: ${escapeHtml(project.location)}</span>` : ''}
        ${project.date ? `<span>Date: ${escapeHtml(project.date)}</span>` : ''}
        ${project.role ? `<span>Role: ${escapeHtml(project.role)}</span>` : ''}
      </div>
    </div>
    <div class="modal-grid">
      <div class="modal-media">
        <div class="modal-main-media" id="modal-main-media"></div>
        <div class="modal-thumbs" id="modal-thumbs"></div>
      </div>
      <div class="modal-details">
        ${detailCard('Challenge Faced', project.challenge)}
        ${detailCard('Root Cause / Key Observation', project.rootCause)}
        ${detailCard('Solution Implemented', project.solution)}
        ${detailCard('Final Result', project.result)}
        ${listCard('Technical Scope', project.technicalScope)}
        ${listCard('Safety / Site Constraints', project.safety)}
      </div>
    </div>`;

  renderMedia(project, media, 0);
}

function detailCard(title, text) {
  if (!text) return '';
  return `<div class="detail-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`;
}

function listCard(title, list) {
  if (!list || !list.length) return '';
  return `<div class="detail-card"><h3>${escapeHtml(title)}</h3><ul>${list.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>`;
}

function renderMedia(project, media, activeIndex) {
  const active = media[activeIndex] || media[0];
  const main = $('#modal-main-media');
  const thumbs = $('#modal-thumbs');
  if (!main || !thumbs || !active) return;

  if (active.type === 'video') {
    main.innerHTML = `<video src="${escapeHtml(active.src)}" controls playsinline poster="${escapeHtml(active.poster || project.coverImage || '')}"></video>`;
  } else {
    main.innerHTML = `<img src="${escapeHtml(active.src)}" alt="${escapeHtml(active.title || project.title || 'Project media')}">`;
  }

  thumbs.innerHTML = '';
  media.forEach((item, idx) => {
    const thumb = createEl('button', `modal-thumb ${idx === activeIndex ? 'active' : ''}`, item.type === 'video'
      ? `<video src="${escapeHtml(item.src)}" muted poster="${escapeHtml(item.poster || project.coverImage || '')}"></video><span class="video-badge">Video</span>`
      : `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.title || project.title || 'Project media')}">`);
    thumb.type = 'button';
    thumb.addEventListener('click', () => renderMedia(project, media, idx));
    thumbs.appendChild(thumb);
  });
}

function revealNow() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(n => n.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });

  items.forEach(n => io.observe(n));
}

const menuBtn = $('.menu-btn');
const navLinks = $('.nav-links');

if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
}

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    if (navLinks) navLinks.classList.remove('open');
  });
});

document.addEventListener('click', e => {
  if (e.target.matches('[data-close-modal]')) closeProjectModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeProjectModal();
});

loadSite();
