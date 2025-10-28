(() => {
  const setup = () => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      return;
    }

    const lightboxImage = lightbox.querySelector('.lightbox-content');
    const siteUrl = lightbox.getAttribute('data-site-url') || window.location.origin;

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      if (lightboxImage) {
        lightboxImage.removeAttribute('src');
      }
    };

    lightbox.addEventListener('click', (event) => {
      const target = event.target;
      if (target === lightbox || (target instanceof HTMLElement && target.classList.contains('close'))) {
        closeLightbox();
      }
    });

    document.querySelectorAll('a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith(siteUrl) && !href.startsWith('/') && !href.startsWith('#')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });

    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('click', () => {
        if (!lightboxImage) {
          return;
        }
        lightboxImage.src = img.currentSrc || img.src;
        lightbox.style.display = 'flex';
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }
})();
