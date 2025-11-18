// script.js
// Interaktivitas situs: menu, typing effect, reveal on scroll, filter proyek, modal, dan form (demo).

document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Hamburger / mobile nav
  const hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    document.body.classList.toggle('nav-open');
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
        // close mobile nav if open
        document.body.classList.remove('nav-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Typing effect (simple, rotates phrases)
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = JSON.parse(typedEl.getAttribute('data-text'));
    let pIndex = 0, cIndex = 0, forward = true;
    const speed = 40;
    const pauseBetween = 1400;
    const caret = document.createElement('span');
    caret.className = 'caret';
    caret.style.cssText = 'display:inline-block;width:2px;height:1em;background:linear-gradient(180deg,var(--accent1),var(--accent2));margin-left:6px;vertical-align:middle;opacity:0.95';
    typedEl.appendChild(caret);

    function type() {
      const phrase = phrases[pIndex];
      if (forward) {
        if (cIndex <= phrase.length) {
          typedEl.childNodes[0] && typedEl.childNodes[0].remove();
          typedEl.insertBefore(document.createTextNode(phrase.slice(0, cIndex)), caret);
          cIndex++;
          setTimeout(type, speed + Math.random() * 40);
        } else {
          forward = false;
          setTimeout(type, pauseBetween);
        }
      } else {
        if (cIndex > 0) {
          cIndex--;
          typedEl.childNodes[0] && typedEl.childNodes[0].remove();
          typedEl.insertBefore(document.createTextNode(phrase.slice(0, cIndex)), caret);
          setTimeout(type, speed / 2);
        } else {
          forward = true;
          pIndex = (pIndex + 1) % phrases.length;
          setTimeout(type, 220);
        }
      }
    }

    // initialize
    typedEl.insertBefore(document.createTextNode(''), caret);
    setTimeout(type, 600);
  }

  // Reveal on scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => io.observe(r));

  // Project filtering & search
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectGrid = document.getElementById('projects-grid');
  const projects = Array.from(projectGrid.children);
  const searchInput = document.getElementById('project-search');

  function showProjects(filter = '*', query = '') {
    const q = query.trim().toLowerCase();
    projects.forEach(p => {
      const type = p.dataset.type || '';
      const title = (p.dataset.title || p.querySelector('.project-title').textContent).toLowerCase();
      const matchesFilter = filter === '*' || type === filter;
      const matchesQuery = !q || title.includes(q) || (p.querySelector('.project-desc')?.textContent || '').toLowerCase().includes(q);
      if (matchesFilter && matchesQuery) {
        p.style.display = '';
      } else {
        p.style.display = 'none';
      }
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      showProjects(filter, searchInput.value);
    });
  });

  searchInput.addEventListener('input', () => {
    const active = document.querySelector('.filter-btn.active')?.dataset.filter || '*';
    showProjects(active, searchInput.value);
  });

  // Project modal (simple)
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalExtra = document.getElementById('modal-extra');
  const modalLink = document.getElementById('modal-link');
  const closeBtns = modal.querySelectorAll('.modal-close');

  function openModal(projectEl) {
    const title = projectEl.dataset.title || projectEl.querySelector('.project-title').textContent;
    const desc = projectEl.querySelector('.project-desc')?.textContent || '';
    // For demo, construct some extra content
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modalExtra.innerHTML = `
      <p><strong>Kategori:</strong> ${projectEl.dataset.type || '—'}</p>
      <p><strong>Peran:</strong> Analis & Dokumentasi</p>
      <p><strong>Teknologi:</strong> SQL, Figma, (prototype)</p>
    `;
    modalLink.href = '#';
    showModal();
  }

  function showModal() {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function hideModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  projectGrid.addEventListener('click', (e) => {
    const view = e.target.closest('.view-btn');
    if (view) {
      const card = view.closest('.project-card');
      openModal(card);
    } else {
      // If clicked card itself open modal
      const card = e.target.closest('.project-card');
      if (card) openModal(card);
    }
  });

  closeBtns.forEach(b => b.addEventListener('click', hideModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  // Keyboard accessibility for modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') hideModal();
  });

  // Contact form demo behavior
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simple validation demo
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    if (!name || !email || !message) {
      alert('Mohon isi semua field sebelum mengirim.');
      return;
    }
    // Demo: just show a success message
    alert(`Terima kasih, ${name}! Pesan Anda telah (di-simulasikan) dikirim.`);
    contactForm.reset();
  });

  // Initialize filter (show all)
  showProjects('*', '');
});