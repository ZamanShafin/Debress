document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     ONE-TIME LANDING PAGE PRELOADER SYSTEM
     ========================================== */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hasSeenPreloader = sessionStorage.getItem('hasLoadedPreloader');
    
    if (hasSeenPreloader) {
      preloader.style.display = 'none';
    } else {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.style.overflow = '';
        sessionStorage.setItem('hasLoadedPreloader', 'true');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 750);
      }, 1800);
    }
  }

  /* ==========================================
     ACTIVE PAGE LINK HIGHLIGHTING
     ========================================== */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html') || (currentPath === 'index.html' && href === './')) {
      link.classList.add('active');
    }
  });

  /* ==========================================
     CENTERED MINIMALIST DASH MENU TOGGLE (=)
     ========================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });

    // Close menu on nav link click
    navMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        menuToggle.classList.remove('open');
        navMenu.classList.remove('open');
      }
    });
  }

  /* ==========================================
     LENIS ULTRA-SMOOTH LUXURY SCROLLING ENGINE
     ========================================== */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      smoothTouch: false,
      touchMultiplier: 1.0,
      infinite: false,
      autoRaf: false
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Provide globally so other scripts can access
    window.lenis = lenis;

    // Anchor smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement, { offset: -80, duration: 1.5 });
        }
      });
    });
  }

  /* ==========================================
     THEME TOGGLE SYSTEM (ICON ONLY)
     ========================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const iconMoon = document.getElementById('theme-icon-moon');
  const iconSun = document.getElementById('theme-icon-sun');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      htmlElement.setAttribute('data-theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
    });
  }

  function updateThemeIcons(theme) {
    if (iconMoon && iconSun) {
      if (theme === 'dark') {
        iconMoon.style.display = 'none';
        iconSun.style.display = 'block';
      } else {
        iconMoon.style.display = 'block';
        iconSun.style.display = 'none';
      }
    }
  }

  /* ==========================================
     ANIMATED COUNT-UP NUMBERS
     ========================================== */
  const countElements = document.querySelectorAll('.animate-count');

  if (countElements.length > 0) {
    const observerOptions = {
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCountUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    countElements.forEach(el => observer.observe(el));
  }

  function startCountUp(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const padZero = el.hasAttribute('data-padzero');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 2000;
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.round(easeProgress * target);
      
      let valStr = currentValue.toFixed(decimals);
      if (padZero && currentValue < 10) {
        valStr = '0' + valStr;
      }
      
      el.textContent = prefix + valStr + suffix;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    }

    requestAnimationFrame(updateCount);
  }

  /* ==========================================
     CONTACT FORM HANDLING
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Inquiry...</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Inquiry Sent Successfully!</span>';
        }
        if (formStatus) {
          formStatus.textContent = 'Thank you! Our garment sourcing director will get back to you within 24 hours.';
          formStatus.style.display = 'block';
          formStatus.style.color = '#10B981';
        }
        contactForm.reset();
      }, 1200);
    });
  }

  /* ==========================================
     CATEGORY TABBED PORTFOLIO SWITCHING
     ========================================== */
  const categoryTabs = document.querySelectorAll('.category-tab-btn');
  const divisionBlocks = document.querySelectorAll('.portfolio-division-block');

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetDivId = tab.getAttribute('data-target');
      
      // Update active tab button
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update active division block
      divisionBlocks.forEach(block => {
        if (block.id === targetDivId) {
          block.classList.add('active');
        } else {
          block.classList.remove('active');
        }
      });
    });
  });

  /* ==========================================
     CATEGORY IMAGE LIGHTBOX PREVIEW MODAL
     ========================================== */
  const lightboxModal = document.getElementById('category-lightbox-modal');
  const lightboxImg = document.getElementById('category-lightbox-img');
  const lightboxClose = document.getElementById('category-lightbox-close');
  const lightboxBackdrop = document.getElementById('category-lightbox-backdrop');
  const photoCards = document.querySelectorAll('.product-photo-card');

  if (lightboxModal && lightboxImg) {
    photoCards.forEach(card => {
      card.addEventListener('click', () => {
        const fullImgSrc = card.getAttribute('data-full-img') || card.querySelector('.product-photo-img')?.getAttribute('src');
        if (fullImgSrc) {
          lightboxImg.src = fullImgSrc;
          lightboxModal.classList.add('active');
          lightboxModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!lightboxModal.classList.contains('active')) {
          lightboxImg.src = '';
        }
      }, 300);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ==========================================
     INTERACTIVE POP-UP MODAL SYSTEM (SERVICES)
     ========================================== */
  const interactiveElements = document.querySelectorAll('.service-interactive-card');
  const modalOverlays = document.querySelectorAll('.service-modal-overlay');

  interactiveElements.forEach(el => {
    el.addEventListener('click', (e) => {
      const modalId = el.getAttribute('data-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalOverlays.forEach(overlay => {
    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close on close button click
    const closeBtn = overlay.querySelector('.service-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach(overlay => {
        if (overlay.classList.contains('active')) {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });

  /* ==========================================
     SCROLL REVEAL ANIMATIONS OBSERVER ENGINE
     ========================================== */
  const scrollElements = document.querySelectorAll('.fade-in-on-scroll, .card, .about-card, .grid-2 > div, .grid-3 > div, .grid-4 > div, .footer-cta-box, .cert-card-item, .sustainability-image-card-full, .section-title-area, .categories-card, .service-card');

  if (scrollElements.length > 0) {
    if (window.innerWidth <= 768) {
      // Immediate 100% visibility reveal for mobile screens
      scrollElements.forEach(el => el.classList.add('is-visible'));
    } else {
      const scrollObserverOptions = {
        root: null,
        rootMargin: '50px 0px 50px 0px',
        threshold: 0.01
      };

      const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, scrollObserverOptions);

      scrollElements.forEach((el) => {
        if (!el.classList.contains('fade-in-on-scroll')) {
          el.classList.add('fade-in-on-scroll');
        }
        scrollObserver.observe(el);
      });
    }
  }
});
