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
  const totalOriginalSlides = originalSlides.length;

  // Clone slides to create infinite effect
  // Clone last 2 and put at start
  const firstClone1 = originalSlides[totalOriginalSlides - 2].cloneNode(true);
  const firstClone2 = originalSlides[totalOriginalSlides - 1].cloneNode(true);
  firstClone1.classList.add('clone');
  firstClone2.classList.add('clone');
  
  // Clone first 3 and put at end
  const lastClone1 = originalSlides[0].cloneNode(true);
  const lastClone2 = originalSlides[1].cloneNode(true);
  const lastClone3 = originalSlides[2].cloneNode(true);
  lastClone1.classList.add('clone');
  lastClone2.classList.add('clone');
  lastClone3.classList.add('clone');

  track.insertBefore(firstClone2, originalSlides[0]);
  track.insertBefore(firstClone1, firstClone2);
  
  track.appendChild(lastClone1);
  track.appendChild(lastClone2);
  track.appendChild(lastClone3);

  const allSlides = Array.from(track.querySelectorAll('.carousel-slide'));

  function getSlideWidth() {
    return allSlides[0].offsetWidth + 24; // 1.5rem gap = 24px
  }

  // Center the real first slide on load
  setTimeout(() => {
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = getSlideWidth() * 2; // Jump past the 2 prepended clones
    updateCarouselState();
  }, 100);

  function updateCarouselState() {
    const trackCenter = track.scrollLeft + (track.clientWidth / 2);
    
    let closestIndex = 0;
    let minDistance = Infinity;
    
    allSlides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + (slide.offsetWidth / 2);
      const distance = Math.abs(trackCenter - slideCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    allSlides.forEach((slide, index) => {
      if (index === closestIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    let realIndex = closestIndex - 2 + 1; 
    if (realIndex < 1) realIndex = totalOriginalSlides + realIndex;
    if (realIndex > totalOriginalSlides) realIndex = realIndex % totalOriginalSlides;
    if (realIndex === 0) realIndex = totalOriginalSlides;

    indicator.textContent = `${realIndex} / ${totalOriginalSlides}`;
  }

  let isScrolling = false;
  track.addEventListener('scroll', () => {
    updateCarouselState();
    
    if (!isScrolling) {
      window.requestAnimationFrame(function checkInfinite() {
        const slideWidth = getSlideWidth();
        const maxScrollLeft = track.scrollWidth - track.clientWidth;
        
        // If we hit the left edge (clones), jump to real slides at end
        if (track.scrollLeft <= 5) {
          track.style.scrollBehavior = 'auto';
          track.classList.remove('snap-enabled');
          track.scrollLeft = slideWidth * totalOriginalSlides;
        } 
        // If we hit the right edge clones, jump to real slides at start
        else if (track.scrollLeft >= maxScrollLeft - 5) {
          track.style.scrollBehavior = 'auto';
          track.classList.remove('snap-enabled');
          track.scrollLeft = slideWidth * 2;
        }
        
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  prevBtn.addEventListener('click', () => {
    track.style.scrollBehavior = 'smooth';
    track.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.style.scrollBehavior = 'smooth';
    track.scrollBy({ left: getSlideWidth(), behavior: 'smooth' });
  });

  // Wheel scrolling behavior has been removed so vertical scrolling is uninterrupted
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

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCurrencyToggle();
  initCarousel();
  initLightbox();
  initPageTransitions();
  initActiveNav();
  initScrollReveal();
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
