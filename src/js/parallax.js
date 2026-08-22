export function initParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const layers = document.querySelectorAll('.parallax-layer');
  if (layers.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    layers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-speed') || '0');
      // A speed of 0 means it scrolls normally with the page.
      // A speed of 0.5 means it scrolls half as fast (moves down relative to viewport).
      layer.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initParallax();
});
