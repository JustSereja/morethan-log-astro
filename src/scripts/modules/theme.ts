const SWITCHER_SELECTOR = '.theme-mode-switcher';
const THEME_STORAGE_KEY = 'theme';

type ThemeMode = 'light' | 'dark';

const isDarkStored = (value: string | null): value is ThemeMode => value === 'dark' || value === 'light';

const detectPreferredMode = (): ThemeMode => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (isDarkStored(stored)) {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const updateSwitcherState = (mode: ThemeMode) => {
  const switchers = document.querySelectorAll<HTMLButtonElement>(SWITCHER_SELECTOR);
  switchers.forEach((button) => {
    button.setAttribute('data-mode', mode === 'dark' ? 'light' : 'dark');
  });
};

const applyThemeMode = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle('dark-mode', mode === 'dark');
  localStorage.setItem(THEME_STORAGE_KEY, mode);
  updateSwitcherState(mode);
};

const attachSystemPreferenceListener = (() => {
  let attached = false;
  return () => {
    if (attached) {
      return;
    }
    attached = true;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (event) => {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (isDarkStored(stored)) {
        return;
      }
      applyThemeMode(event.matches ? 'dark' : 'light');
    });
  };
})();

const handleThemeToggle = () => {
  const isDark = document.documentElement.classList.contains('dark-mode');
  applyThemeMode(isDark ? 'light' : 'dark');
};

export const initThemeSwitchers = () => {
  if (typeof window === 'undefined') {
    return;
  }

  const switchers = document.querySelectorAll<HTMLButtonElement>(SWITCHER_SELECTOR);
  if (!switchers.length) {
    return;
  }

  const initialMode = detectPreferredMode();
  applyThemeMode(initialMode);

  const hasStoredPreference = isDarkStored(localStorage.getItem(THEME_STORAGE_KEY));
  if (!hasStoredPreference) {
    attachSystemPreferenceListener();
  }

  switchers.forEach((switcher) => {
    if (switcher.dataset.themeInit === 'true') {
      return;
    }
    switcher.dataset.themeInit = 'true';
    switcher.addEventListener('click', handleThemeToggle);
  });
};
