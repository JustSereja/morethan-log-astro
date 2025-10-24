import {
  getLanguageFromPath,
  getLocaleConfig,
  normalizeLanguage,
  stripLanguageFromPath,
} from './locale';

type SearchPost = {
  title: string;
  content: string;
  url: string;
  lang: string;
  category?: string;
  categoryText?: string;
  icon?: string;
  imageUrl?: string;
  date?: string;
  publishedAt?: string;
};

const SEARCH_INPUT_SELECTOR = '.search input';
const SEARCH_RESULTS_ID = 'search-results';
const SEARCH_CONTAINER_SELECTOR = '.search';
const POSTS_LIST_SELECTOR = '.posts-list';
const FILTER_SELECTOR = '.filter';
const SEARCH_TOGGLE_SELECTOR = '.header__search-toggle';

type SearchWindow = Window & {
  __SEARCH_CATEGORY_SEGMENTS__?: unknown;
  __ASTRO_BASE_PATH__?: unknown;
  __SEARCH_STRINGS__?: Partial<SearchStrings>;
  __SEARCH_CATEGORY_LABELS__?: Record<string, string>;
};

type SearchStrings = {
  resultsHeading: string;
  noResults: string;
  allPosts: string;
};

const DEFAULT_SEARCH_STRINGS: SearchStrings = {
  resultsHeading: 'Search results',
  noResults: 'No results found',
  allPosts: 'All posts',
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const getCategorySlugs = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  const segments = (window as SearchWindow).__SEARCH_CATEGORY_SEGMENTS__;
  if (!Array.isArray(segments)) {
    return [];
  }

  return segments
    .map((segment) =>
      typeof segment === 'string'
        ? segment.trim().replace(/^\//, '').replace(/\/$/, '')
        : '',
    )
    .filter((segment): segment is string => Boolean(segment));
};

const getBasePath = (): string => {
  if (typeof window === 'undefined') {
    return '/';
  }

  const raw = (window as SearchWindow).__ASTRO_BASE_PATH__;
  if (typeof raw !== 'string' || !raw.length) {
    return '/';
  }

  return raw.endsWith('/') ? raw : `${raw}/`;
};

let postsCache: SearchPost[] | null = null;
let debounceTimer: number | undefined;

const getSearchStrings = (): SearchStrings => {
  if (typeof window === 'undefined') {
    return DEFAULT_SEARCH_STRINGS;
  }

  const raw = (window as SearchWindow).__SEARCH_STRINGS__;
  if (!raw) {
    return DEFAULT_SEARCH_STRINGS;
  }

  return {
    resultsHeading: typeof raw.resultsHeading === 'string' && raw.resultsHeading.length
      ? raw.resultsHeading
      : DEFAULT_SEARCH_STRINGS.resultsHeading,
    noResults: typeof raw.noResults === 'string' && raw.noResults.length
      ? raw.noResults
      : DEFAULT_SEARCH_STRINGS.noResults,
    allPosts: typeof raw.allPosts === 'string' && raw.allPosts.length
      ? raw.allPosts
      : DEFAULT_SEARCH_STRINGS.allPosts,
  };
};

const getCategoryLabels = (): Record<string, string> => {
  if (typeof window === 'undefined') {
    return {};
  }

  const raw = (window as SearchWindow).__SEARCH_CATEGORY_LABELS__;
  if (!raw || typeof raw !== 'object') {
    return {};
  }

  return raw;
};

const loadPosts = async (): Promise<SearchPost[]> => {
  if (postsCache) {
    return postsCache;
  }

  const normalizedBasePath = getBasePath();
  const searchIndexUrl = new URL(`${normalizedBasePath}search.json`, window.location.origin);
  const response = await fetch(searchIndexUrl.toString());
  if (!response.ok) {
    throw new Error(`Failed to fetch search index: ${response.status}`);
  }

  postsCache = await response.json();
  return postsCache ?? [];
};

const resetSearchView = (
  resultsContainer: HTMLElement,
  postsListContainer: HTMLElement | null,
  filterContainer: HTMLElement | null,
) => {
  resultsContainer.innerHTML = '';
  resultsContainer.style.display = 'none';
  if (postsListContainer) {
    postsListContainer.style.display = '';
  }
  if (filterContainer) {
    filterContainer.style.display = '';
  }
};

const renderResults = (
  posts: SearchPost[],
  resultsContainer: HTMLElement,
  contextCategory: string | null,
) => {
  const strings = getSearchStrings();
  const categoryLabels = getCategoryLabels();
  const categoryTitle = contextCategory
    ? categoryLabels[contextCategory] ?? contextCategory
    : strings.allPosts;

  const headerTitle = categoryTitle
    ? `${strings.resultsHeading}: ${categoryTitle}`
    : strings.resultsHeading;

  const header = `
<div class="filter">
  <div class="filter__categories categories">
    <div class="categories__wrapper">
      <h2 class="categories__wrapper">${escapeHtml(headerTitle)}</h2>
    </div>
    <div class="categories__content"></div>
  </div>
</div>`;

  if (!posts.length) {
    resultsContainer.innerHTML = `${header}<div class="no-posts">${escapeHtml(strings.noResults)}</div>`;
    return;
  }

  const markup = posts
    .map((post) => {
      const categoryText = post.categoryText ?? post.category ?? '';
      const categoryHtml =
        post.category && post.icon
          ? `<div class="post__category category"><div class="category__item category__item--light-blue">${post.icon} ${categoryText}</div></div>`
          : '';
      const imageHtml = post.imageUrl
        ? `<div class="post__thumbnail"><picture><img src="${post.imageUrl}" alt=""></picture></div>`
        : '';

      return `
<a href="${post.url}" class="post">
  ${categoryHtml}
  ${imageHtml}
  <div class="post__content">
    <h2 class="post__title">${post.title}</h2>
    <div class="post__date">${post.date ?? ''}</div>
  </div>
</a>`;
    })
    .join('');

  resultsContainer.innerHTML = `${header}${markup}`;
};

const getCurrentContext = (config: ReturnType<typeof getLocaleConfig>) => {
  const path = window.location.pathname;
  const lang = getLanguageFromPath(path, config);
  const normalizedLang = normalizeLanguage(lang, config);
  const normalizedPath = stripLanguageFromPath(path, normalizedLang, config);
  const slugs = getCategorySlugs();
  const category = slugs.find((slug) => normalizedPath.startsWith(`/${slug}`)) ?? null;
  return { lang: normalizedLang, category };
};

const debounce = (callback: () => void, delay: number) => {
  if (debounceTimer) {
    window.clearTimeout(debounceTimer);
  }
  debounceTimer = window.setTimeout(callback, delay);
};

export const initSearch = () => {
  const searchInput = document.querySelector<HTMLInputElement>(SEARCH_INPUT_SELECTOR);
  const resultsContainer = document.getElementById(SEARCH_RESULTS_ID);
  if (!searchInput || !resultsContainer) {
    return;
  }

  if (searchInput.dataset.searchInit === 'true') {
    return;
  }
  searchInput.dataset.searchInit = 'true';

  const postsListContainer = document.querySelector<HTMLElement>(POSTS_LIST_SELECTOR);
  const filterContainer = document.querySelector<HTMLElement>(FILTER_SELECTOR);
  const searchContainer = document.querySelector<HTMLElement>(SEARCH_CONTAINER_SELECTOR);
  const searchToggle = document.querySelector<HTMLButtonElement>(SEARCH_TOGGLE_SELECTOR);

  const config = getLocaleConfig();

  const showResults = (posts: SearchPost[], contextCategory: string | null) => {
    resultsContainer.style.display = 'block';
    if (postsListContainer) {
      postsListContainer.style.display = 'none';
    }
    if (filterContainer) {
      filterContainer.style.display = 'none';
    }
    renderResults(posts, resultsContainer, contextCategory);
  };

  const handleSearchTerm = async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (!searchTerm) {
      resetSearchView(resultsContainer, postsListContainer, filterContainer);
      return;
    }

    try {
      const posts = await loadPosts();
      const { lang, category } = getCurrentContext(config);

      const filtered = posts.filter((post) => {
        const matchesLang = normalizeLanguage(post.lang, config) === lang;
        const matchesCategory = !category || post.category === category;
        const content = `${post.title} ${post.content ?? ''}`.toLowerCase();
        const matchesTerm = content.includes(searchTerm);
        return matchesLang && matchesCategory && matchesTerm;
      });

      showResults(filtered, category);
    } catch (error) {
      console.error(error);
    }
  };

  searchInput.addEventListener('input', () => {
    debounce(handleSearchTerm, 300);
  });

  if (searchToggle && searchContainer) {
    searchContainer.classList.toggle('hidden', true);
    resultsContainer.style.display = 'none';

    if (searchToggle.dataset.searchToggleInit !== 'true') {
      searchToggle.dataset.searchToggleInit = 'true';
      searchToggle.addEventListener('click', () => {
        const isHidden = searchContainer.classList.toggle('hidden');
        if (isHidden) {
          resetSearchView(resultsContainer, postsListContainer, filterContainer);
          searchInput.value = '';
        } else {
          resultsContainer.style.display = 'none';
          searchInput.focus();
        }
      });
    }
  }

  resetSearchView(resultsContainer, postsListContainer, filterContainer);
};
