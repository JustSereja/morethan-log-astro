import { getLocaleConfig, getLanguageFromPath, normalizeLanguage } from './locale';

const SWITCHER_SELECTOR = '.language-switcher';
const OPEN_CLASS = 'language-switcher--open';
const STORAGE_KEY = 'userLangPreference';
const REDIRECT_KEY = 'hasRedirected';

const cleanupRedirectMarker = (() => {
  let attached = false;
  return () => {
    if (attached) {
      return;
    }
    attached = true;
    window.addEventListener(
      'beforeunload',
      () => {
        sessionStorage.removeItem(REDIRECT_KEY);
      },
      { once: true },
    );
  };
})();

const handlePreferenceSync = (() => {
  let handled = false;
  return () => {
    if (handled) {
      return;
    }
    handled = true;

    const config = getLocaleConfig();
    const currentNormalized = normalizeLanguage(
      getLanguageFromPath(window.location.pathname, config),
      config,
    );
    const storedRaw = localStorage.getItem(STORAGE_KEY);

    if (!storedRaw) {
      localStorage.setItem(STORAGE_KEY, currentNormalized);
      cleanupRedirectMarker();
      return;
    }

    const stored = normalizeLanguage(storedRaw, config);
    const hasRedirected = sessionStorage.getItem(REDIRECT_KEY) === 'true';

    if (!hasRedirected && stored !== currentNormalized) {
      const targetLink = document.querySelector<HTMLAnchorElement>(
        `${SWITCHER_SELECTOR} .language-switcher__item[data-lang="${stored}"]`,
      );
      const isAvailable = targetLink?.dataset.available === 'true';
      if (isAvailable && targetLink?.href) {
        sessionStorage.setItem(REDIRECT_KEY, 'true');
        cleanupRedirectMarker();
        window.location.href = targetLink.href;
        return;
      }

      localStorage.setItem(STORAGE_KEY, currentNormalized);
      cleanupRedirectMarker();
      return;
    }

    localStorage.setItem(STORAGE_KEY, currentNormalized);
    cleanupRedirectMarker();
  };
})();

const closeSwitcher = (switcher: HTMLElement) => {
  const toggle = switcher.querySelector<HTMLButtonElement>('.language-switcher__toggle');
  const menu = switcher.querySelector<HTMLUListElement>('.language-switcher__menu');
  if (!toggle || !menu) {
    return;
  }

  menu.hidden = true;
  switcher.classList.remove(OPEN_CLASS);
  toggle.setAttribute('aria-expanded', 'false');
};

const openSwitcher = (switcher: HTMLElement) => {
  const toggle = switcher.querySelector<HTMLButtonElement>('.language-switcher__toggle');
  const menu = switcher.querySelector<HTMLUListElement>('.language-switcher__menu');
  if (!toggle || !menu) {
    return;
  }

  menu.hidden = false;
  switcher.classList.add(OPEN_CLASS);
  toggle.setAttribute('aria-expanded', 'true');
};

const attachDocumentCloseListener = (() => {
  let attached = false;
  return () => {
    if (attached) {
      return;
    }
    attached = true;

    document.addEventListener('click', (event) => {
      const target = event.target as Node;
      document.querySelectorAll<HTMLElement>(`${SWITCHER_SELECTOR}.${OPEN_CLASS}`).forEach((switcher) => {
        if (!switcher.contains(target)) {
          closeSwitcher(switcher);
        }
      });
    });
  };
})();

export const initLanguageSwitcher = () => {
  if (typeof window === 'undefined') {
    return;
  }

  handlePreferenceSync();
  attachDocumentCloseListener();

  const config = getLocaleConfig();
  const switchers = document.querySelectorAll<HTMLElement>(SWITCHER_SELECTOR);
  if (!switchers.length) {
    return;
  }

  switchers.forEach((switcher) => {
    if (switcher.dataset.languageInit === 'true') {
      return;
    }
    switcher.dataset.languageInit = 'true';

    const toggle = switcher.querySelector<HTMLButtonElement>('.language-switcher__toggle');
    const menu = switcher.querySelector<HTMLUListElement>('.language-switcher__menu');
    const links = switcher.querySelectorAll<HTMLAnchorElement>('.language-switcher__item');
    if (!toggle || !menu) {
      return;
    }

    menu.hidden = true;

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = switcher.classList.contains(OPEN_CLASS);
      if (isOpen) {
        closeSwitcher(switcher);
      } else {
        openSwitcher(switcher);
        const firstLink = menu.querySelector<HTMLAnchorElement>('a');
        if (firstLink) {
          firstLink.focus();
        }
      }
    });

    toggle.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        openSwitcher(switcher);
        const firstLink = menu.querySelector<HTMLAnchorElement>('a');
        if (firstLink) {
          firstLink.focus();
        }
        event.preventDefault();
      }
      if (event.key === 'Escape') {
        closeSwitcher(switcher);
      }
    });

    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeSwitcher(switcher);
        toggle.focus();
      }
    });

    links.forEach((link) => {
      if (link.dataset.languageLinkInit === 'true') {
        return;
      }
      link.dataset.languageLinkInit = 'true';

      link.addEventListener('click', () => {
        const lang = normalizeLanguage(link.dataset.lang, config);
        localStorage.setItem(STORAGE_KEY, lang);
        sessionStorage.removeItem(REDIRECT_KEY);
        closeSwitcher(switcher);
      });
    });
  });
};
