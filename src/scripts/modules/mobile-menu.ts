const MENU_ID = 'mobile-menu';
const TOGGLE_SELECTOR = '.header__menu-toggle';

let documentListenerAttached = false;
let resizeListenerAttached = false;
let astroSwapListenerAttached = false;

const closeMenu = () => {
  const menu = document.getElementById(MENU_ID);
  if (menu) {
    menu.classList.remove('active');
  }
};

const handleDocumentClick = (event: MouseEvent) => {
  const menu = document.getElementById(MENU_ID);
  const toggle = document.querySelector<HTMLElement>(TOGGLE_SELECTOR);
  if (!menu || !toggle) {
    return;
  }

  const target = event.target as Node;
  if (!menu.contains(target) && !toggle.contains(target)) {
    closeMenu();
  }
};

const handleResize = () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
};

export const initMobileMenu = () => {
  const menu = document.getElementById(MENU_ID);
  const toggle = document.querySelector<HTMLButtonElement>(TOGGLE_SELECTOR);
  if (!menu || !toggle) {
    return;
  }

  if (toggle.dataset.mobileMenuInit !== 'true') {
    toggle.dataset.mobileMenuInit = 'true';
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      menu.classList.toggle('active');
    });
  }

  if (!documentListenerAttached) {
    documentListenerAttached = true;
    document.addEventListener('click', handleDocumentClick);
  }

  if (!resizeListenerAttached) {
    resizeListenerAttached = true;
    window.addEventListener('resize', handleResize, { passive: true });
  }

  if (!astroSwapListenerAttached) {
    astroSwapListenerAttached = true;
    document.addEventListener('astro:after-swap', closeMenu);
  }
};
