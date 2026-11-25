/**
 * Hasegawa Denki - Core JavaScript
 * Features:
 *  - Multilingual Engine (i18n) with LocalStorage persistence
 *  - Mobile Menu Navigation Toggle
 *  - Sticky Navbar & Active Section Spy
 *  - IntersectionObserver Scroll Reveal Animations
 *  - Portfolio Filtering System
 *  - Quote Request Modal & WhatsApp Direct Generator
 *  - Form Validation & Interactive Feedback Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Multilingual i18n System
  // ==========================================
  const langSelector = document.querySelector('.language-selector');
  const langBtn = document.getElementById('languageButton');
  const langCurrentLabel = document.getElementById('currentLangLabel');
  const langOptions = document.querySelectorAll('.lang-option');

  // Toggle Language Dropdown
  if (langBtn && langSelector) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langSelector.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      langSelector.classList.remove('open');
    });
  }

  // Change Language Function
  function setLanguage(lang) {
    if (!translations[lang]) lang = 'pt';

    // Store in localStorage
    localStorage.setItem('hd_preferred_lang', lang);

    // Update Text Contents with data-i18n
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });

    // Update Placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.setAttribute('placeholder', translations[lang][key]);
      }
    });

    // Update HTML title & Meta Description
    if (translations[lang].pageTitle) {
      document.title = translations[lang].pageTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && translations[lang].metaDesc) {
      metaDesc.setAttribute('content', translations[lang].metaDesc);
    }

    // Update Lang Button Label
    if (langCurrentLabel) {
      const labels = {
        pt: 'PT-BR',
        en: 'EN-US',
        es: 'ES',
        ja: '日本語'
      };
      langCurrentLabel.textContent = labels[lang] || 'PT-BR';
    }

    // Update active class on dropdown
    langOptions.forEach((opt) => {
      if (opt.getAttribute('data-lang') === lang) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  }

  // Handle click on language options
  langOptions.forEach((option) => {
    option.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = option.getAttribute('data-lang');
      setLanguage(selectedLang);
      langSelector.classList.remove('open');
    });
  });

  // Initialize Language from LocalStorage or Browser Language
  const savedLang = localStorage.getItem('hd_preferred_lang') || 'pt';
  setLanguage(savedLang);

  // ==========================================
  // 2. Mobile Menu Navigation
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isExpanded = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      menuToggle.textContent = isExpanded ? '✕' : '☰';
    });

    // Close menu when clicking on a link
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      });
    });
  }

  // ==========================================
  // 3. Header Scroll Effect & Active Section Spy
  // ==========================================
  const header = document.querySelector('.header-navbar');
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Header shadow
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll spy for navigation
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // ==========================================
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // ==========================================
  // 5. Portfolio Filtering System
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // ==========================================
  // 6. Quote Modal Logic
  // ==========================================
  const modalOverlay = document.getElementById('quoteModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const openModalBtns = document.querySelectorAll('.open-quote-modal');

  function openModal() {
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // ==========================================
  // 7. Forms Handling & WhatsApp Generation
  // ==========================================
  const contactForm = document.getElementById('mainContactForm');
  const modalForm = document.getElementById('modalContactForm');
  const toast = document.getElementById('toastNotification');
  const toastMsg = document.getElementById('toastMessage');

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  function handleFormSubmit(e, formElement, isModal = false) {
    e.preventDefault();

    const name = formElement.querySelector('[name="name"]').value.trim();
    const email = formElement.querySelector('[name="email"]').value.trim();
    const phone = formElement.querySelector('[name="phone"]').value.trim();
    const service = formElement.querySelector('[name="service"]').value;
    const message = formElement.querySelector('[name="message"]').value.trim();

    if (!name || !email || !phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const currentLang = localStorage.getItem('hd_preferred_lang') || 'pt';
    const successMsg = translations[currentLang]?.modalSuccessMsg || 'Mensagem enviada com sucesso!';

    // Show visual feedback
    showToast(successMsg);
    formElement.reset();

    if (isModal) {
      setTimeout(() => {
        closeModal();
      }, 1000);
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmit(e, contactForm, false));
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => handleFormSubmit(e, modalForm, true));
  }

  // Direct WhatsApp Button Trigger
  const whatsappBtns = document.querySelectorAll('.trigger-whatsapp');
  whatsappBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentLang = localStorage.getItem('hd_preferred_lang') || 'pt';
      
      const greetings = {
        pt: "Olá, Hasegawa Denki! Gostaria de solicitar um orçamento para serviços elétricos.",
        en: "Hello, Hasegawa Denki! I would like to request an electrical engineering quote.",
        es: "¡Hola, Hasegawa Denki! Me gustaría solicitar un presupuesto para servicios eléctricos.",
        ja: "長谷川電気様、電気設備工事・点検のお見積りをお願いしたくご連絡いたしました。"
      };

      const phone = "819063821725";
      const message = encodeURIComponent(greetings[currentLang] || greetings.pt);
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    });
  });
});
