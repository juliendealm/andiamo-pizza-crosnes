/* Progressive enhancement: content stays visible if animation is unavailable. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  function animate(element, frames, options) {
    if (!element || reduced.matches || !element.animate) return;
    const animation = element.animate(frames, options);
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  }
  const reveal = element => animate(element,
    [{opacity: 0, transform: 'translateY(18px)'}, {opacity: 1, transform: 'translateY(0)'}],
    {duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)'});

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        reveal(entry.target);
      });
    }, {threshold: 0.08});
    // Photos/cards stay opaque: revealing an already painted lazy-loaded card
    // from opacity zero made it disappear briefly while scrolling.
    document.querySelectorAll('.hero-copy > *, .offers-intro, .deal-card, .section-heading, .promise-copy, .practical-cards article').forEach(element => observer.observe(element));
  }

  // Pulse only after the quantity actually increases, not when options open.
  const badge = document.querySelector('.cart-count');
  let quantity = Number(badge.textContent);
  new MutationObserver(() => {
    const next = Number(badge.textContent);
    if (next > quantity) animate(badge,
      [{transform: 'scale(1)'}, {transform: 'scale(1.23)', offset: .4}, {transform: 'scale(1)'}],
      {duration: 360, easing: 'ease-out'});
    quantity = next;
  }).observe(badge, {childList: true, characterData: true, subtree: true});

  reduced.addEventListener('change', () => {
    if (reduced.matches) running.forEach(animation => animation.cancel());
  });
})();
