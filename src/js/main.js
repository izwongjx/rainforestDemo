// Mobile Navigation Toggle
export function initMobileNav() {
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const header = document.querySelector('.site-header');

  if (mobileBtn && header) {
    mobileBtn.addEventListener('click', () => {
      header.classList.toggle('menu-open');
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', !isExpanded);
      mobileBtn.textContent = isExpanded ? '☰' : '✕';
    });

    // Close menu when a nav link is clicked
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        mobileBtn.setAttribute('aria-expanded', false);
        mobileBtn.textContent = '☰';
      });
    });
  }

  // Header scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Currency Toggle (Static Rates)
const EXCHANGE_RATES = {
  MYR: 1,
  USD: 0.21,
  EUR: 0.20,
  GBP: 0.17,
  SGD: 0.28,
  AUD: 0.33
};

export function initCurrencyToggle() {
  const currencySelects = document.querySelectorAll('.currency-select');
  const priceElements = document.querySelectorAll('[data-price-myr]');

  currencySelects.forEach(select => {
    select.addEventListener('change', (e) => {
      const selectedCurrency = e.target.value;
      updatePrices(selectedCurrency, priceElements);
      
      // Sync other dropdowns if multiple exist
      currencySelects.forEach(otherSelect => {
        if (otherSelect !== select) {
          otherSelect.value = selectedCurrency;
        }
      });
    });
  });
}

function updatePrices(currency, priceElements) {
  const rate = EXCHANGE_RATES[currency];
  
  priceElements.forEach(el => {
    const priceMyr = parseFloat(el.getAttribute('data-price-myr'));
    if (isNaN(priceMyr)) return;
    
    const converted = Math.round(priceMyr * rate);
    
    // Formatting logic
    el.innerHTML = `${currency} ${converted} <span style="font-size: 0.8rem; font-weight: normal; font-family: var(--font-body);">/ night</span>`;
    
    const noteEl = el.nextElementSibling;
    if (noteEl && noteEl.classList.contains('currency-note')) {
      if (currency === 'MYR') {
         noteEl.style.display = 'none';
      } else {
         noteEl.style.display = 'block';
         noteEl.textContent = `*Estimated in ${currency}. Final price confirmed in MYR via WhatsApp.`;
      }
    }
  });
}



// --- Landing Page Logic --- //

function initCarousel() {
  const track = document.getElementById('roomsCarousel');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const indicator = document.getElementById('carouselIndicator');
  if (!track || !prevBtn || !nextBtn || !indicator) return;

  const originalSlides = Array.from(track.querySelectorAll('.carousel-slide'));
  const totalOriginalSlides = originalSlides.length; // 4

  // Clone entire set of original slides for head & tail to allow infinite scrolling
  const headClones = originalSlides.map(s => {
    const clone = s.cloneNode(true);
    clone.classList.add('clone');
    return clone;
  });

  const tailClones = originalSlides.map(s => {
    const clone = s.cloneNode(true);
    clone.classList.add('clone');
    return clone;
  });

  // Prepend headClones before original slides
  headClones.forEach(clone => {
    track.insertBefore(clone, originalSlides[0]);
  });

  // Append tailClones after original slides
  tailClones.forEach(clone => {
    track.appendChild(clone);
  });

  const allSlides = Array.from(track.querySelectorAll('.carousel-slide'));
  const offset = totalOriginalSlides; // 4 head clones prepended -> real slides start at index 4

  function getSlideCenterScroll(index) {
    const targetSlide = allSlides[index];
    if (!targetSlide) return 0;
    const slideCenter = targetSlide.offsetLeft + (targetSlide.offsetWidth / 2);
    return slideCenter - (track.clientWidth / 2);
  }

  function getClosestIndex() {
    const trackCenter = track.scrollLeft + (track.clientWidth / 2);
    let closestIndex = 0;
    let minDistance = Infinity;

    allSlides.forEach((slide, idx) => {
      const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
      const distance = Math.abs(trackCenter - slideCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    return closestIndex;
  }

  function updateCarouselState() {
    const activeIdx = getClosestIndex();

    allSlides.forEach((slide, idx) => {
      if (idx === activeIdx) {
        slide.classList.add('active');
        slide.style.zIndex = '10';
      } else {
        slide.classList.remove('active');
        slide.style.zIndex = '1';
      }
    });

    let realIndex = ((activeIdx - offset) % totalOriginalSlides + totalOriginalSlides) % totalOriginalSlides + 1;
    indicator.textContent = `${realIndex} / ${totalOriginalSlides}`;
  }

  function scrollToSlide(index, smooth = true) {
    track.style.scrollBehavior = smooth ? 'smooth' : 'auto';
    track.scrollLeft = getSlideCenterScroll(index);
    updateCarouselState();
  }

  // Set initial position to real slide 1 on load
  setTimeout(() => {
    scrollToSlide(offset, false);
  }, 100);

  function checkSeamlessWrap() {
    const activeIdx = getClosestIndex();
    
    if (activeIdx >= offset + totalOriginalSlides) {
      const equivalentIdx = activeIdx - totalOriginalSlides;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = getSlideCenterScroll(equivalentIdx);
      updateCarouselState();
    } else if (activeIdx < offset) {
      const equivalentIdx = activeIdx + totalOriginalSlides;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = getSlideCenterScroll(equivalentIdx);
      updateCarouselState();
    }
  }

  let scrollTimeout = null;
  track.addEventListener('scroll', () => {
    updateCarouselState();

    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      checkSeamlessWrap();
    }, 150);
  });

  track.addEventListener('scrollend', () => {
    checkSeamlessWrap();
  });

  nextBtn.addEventListener('click', () => {
    const current = getClosestIndex();
    scrollToSlide(current + 1, true);
  });

  prevBtn.addEventListener('click', () => {
    const current = getClosestIndex();
    scrollToSlide(current - 1, true);
  });

  // Click on side card to center & focus it
  allSlides.forEach((slide, index) => {
    slide.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const closest = getClosestIndex();
      if (index !== closest) {
        scrollToSlide(index, true);
      }
    });
  });

  // Ensure vertical mouse wheel scrolling over room cards propagates directly to the page window
  track.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      window.scrollBy({
        top: e.deltaY,
        behavior: 'auto'
      });
    }
  }, { passive: true });
}

function initLightbox() {
  const modal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalIframe');
  const closeBtn = document.getElementById('closeModal');
  const thumbs = document.querySelectorAll('.media-thumb');
  
  if (!modal || !modalIframe || !closeBtn) return;

  function openModal(videoId) {
    modalIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling
  }

  function closeModal() {
    modalIframe.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const videoId = thumb.getAttribute('data-video');
      openModal(videoId);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}


function initActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const linkPath = new URL(link.href).pathname;
    
    // Normalize paths to ignore leading slash or exact index.html
    const isCurrentHome = currentPath === '/' || currentPath === '/index.html' || currentPath.endsWith('/index.html');
    const isLinkHome = linkPath === '/' || linkPath === '/index.html' || linkPath.endsWith('/index.html');
    
    if (isCurrentHome && isLinkHome) {
      link.classList.add('active');
    } else if (!isLinkHome && currentPath.includes(linkPath.replace('.html', ''))) {
      link.classList.add('active');
    }
  });
}

export function initAccordions() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  
  triggers.forEach(trigger => {
    trigger.onclick = (e) => {
      e.preventDefault();
      const content = trigger.nextElementSibling;
      const arrow = trigger.querySelector('.accordion-arrow');
      
      if (content) {
        content.classList.toggle('active');
        const isActive = content.classList.contains('active');
        if (arrow) {
          arrow.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      }
    };
  });
  
  // Accordions start closed by default
}

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCurrencyToggle();
  initCarousel();
  initLightbox();
  initPageTransitions();
  initActiveNav();
  initScrollReveal();
  initAccordions();
});

// Function to handle smooth fade transitions between pages
function initPageTransitions() {
  // Fade in on initial load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.25s ease-in-out';
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // Handle back button (bfcache)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted || document.body.style.opacity === '0') {
      document.body.style.opacity = '1';
    }
  });

  // Fade out on internal link clicks
  document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Only intercept internal standard links
      if (
        this.hostname === window.location.hostname && 
        this.getAttribute('target') !== '_blank' &&
        href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')
      ) {
        e.preventDefault();
        const destination = this.href;
        
        document.body.style.opacity = '0';
        
        // Wait for fade out to complete before navigating
        setTimeout(() => {
          window.location.href = destination;
        }, 250);
      }
    });
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });
}
