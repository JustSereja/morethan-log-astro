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
};

const SEARCH_INPUT_SELECTOR = '.search input';
const SEARCH_RESULTS_ID = 'search-results';
const SEARCH_CONTAINER_SELECTOR = '.search';
const POSTS_LIST_SELECTOR = '.posts-list';
const FILTER_SELECTOR = '.filter';
const SEARCH_TOGGLE_SELECTOR = '.header__search-toggle';
const CATEGORY_SLUGS = ['technology', 'projects', 'blog'];

let postsCache: SearchPost[] | null = null;
let debounceTimer: number | undefined;

const loadPosts = async (): Promise<SearchPost[]> => {
  if (postsCache) {
    return postsCache;
  }

  const response = await fetch('/search.json');
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
  const categoryTitle = (contextCategory ?? 'all').toUpperCase();
  const header = `
<div class="filter">
  <div class="filter__categories categories">
    <div class="categories__wrapper">
      <h2 class="categories__wrapper">${categoryTitle}: Search Results</h2>
    </div>
    <div class="categories__content"></div>
  </div>
</div>`;

  if (!posts.length) {
    resultsContainer.innerHTML = `${header}<div class="no-posts">No results found</div>`;
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
  const category = CATEGORY_SLUGS.find((slug) => normalizedPath.startsWith(`/${slug}`)) ?? null;
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
