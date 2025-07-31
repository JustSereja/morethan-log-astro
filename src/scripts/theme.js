console.log(`%c wow, you're curious! 🧐
%c
%c         ▄              ▄
%c        ▌▒█           ▄▀▒▌
%c        ▌▒▒█        ▄▀▒▒▒▐
%c       ▐▄▀▒▒▀▀▀▀▄▄▄▀▒▒▒▒▒▐
%c     ▄▄▀▒░▒▒▒▒▒▒▒▒▒█▒▒▄█▒▐
%c   ▄▀▒▒▒░░░▒▒▒░░░▒▒▒▀██▀▒▌
%c  ▐▒▒▒▄▄▒▒▒▒░░░▒▒▒▒▒▒▒▀▄▒▒▌
%c  ▌░░▌█▀▒▒▒▒▒▄▀█▄▒▒▒▒▒▒▒█▒▐
%c ▐░░░▒▒▒▒▒▒▒▒▌██▀▒▒░░░▒▒▒▀▄▌
%c ▌░▒▄██▄▒▒▒▒▒▒▒▒▒░░░░░░▒▒▒▒▌
%c▌▒▀▐▄█▄█▌▄░▀▒▒░░░░░░░░░░▒▒▒▐
%c▐▒▒▐▀▐▀▒░▄▄▒▄▒▒▒▒▒▒░▒░▒░▒▒▒▒▌
%c▐▒▒▒▀▀▄▄▒▒▒▄▒▒▒▒▒▒▒▒░▒░▒░▒▒▐
%c ▌▒▒▒▒▒▒▀▀▀▒▒▒▒▒▒░▒░▒░▒░▒▒▒▌
%c ▐▒▒▒▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▒▄▒▒▐
%c  ▀▄▒▒▒▒▒▒▒▒▒▒▒░▒░▒░▒▄▒▒▒▒▌
%c    ▀▄▒▒▒▒▒▒▒▒▒▒▄▄▄▀▒▒▒▒▄▀
%c      ▀▄▄▄▄▄▄▀▀▀▒▒▒▒▒▄▄▀
%c         ▒▒▒▒▒▒▒▒▒▒▀▀`,
  'color: #f07d63',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62',
  'color: #ccae62');

/**
 *  Theme mode
 */
const setThemeMode = (box, condition) => {
  const html = document.querySelector('html');
  if (condition) {
    html.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light');
  }

  box.forEach((el) => {
    buttonsState(el, condition);
  });
}

const buttonsState = (el, condition) => {
  el.setAttribute('data-mode', condition ? 'light' : 'dark');
}

const checkThemeMode = (switcherBox) => {
  const storedTheme = localStorage.getItem('theme');
  const isDarkMode = storedTheme ? storedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  const box = document.querySelectorAll(switcherBox);

  setThemeMode(box, isDarkMode);
};

const onChangeThemeMode = (switcherBox) => {
  const box = document.querySelectorAll(switcherBox);

  box.forEach((button) => {
    button.addEventListener('click', () => {
      const darkMode = document.querySelector('html').classList.contains('dark-mode');
      setThemeMode(box, !darkMode);
    });
  });
};

const switcherBox = '.theme-mode-switcher';


document.addEventListener('DOMContentLoaded', function () {
  checkThemeMode(switcherBox);
  onChangeThemeMode(switcherBox);
  
  // Search toggle functionality
  const searchToggle = document.querySelector('.header__search-toggle');
  const searchForm = document.querySelector('.search.form');
  const searchResults = document.getElementById('search-results');
  
  if (searchToggle && searchForm) {
    // Ensure search is hidden on page load
    searchForm.classList.add('hidden');
    if (searchResults) {
      searchResults.style.display = 'none';
    }
    
    searchToggle.addEventListener('click', function() {
      searchForm.classList.toggle('hidden');
      if (searchResults) {
        searchResults.style.display = searchForm.classList.contains('hidden') ? 'none' : 'block';
      }
      if (!searchForm.classList.contains('hidden')) {
        const searchInput = searchForm.querySelector('.input');
        if (searchInput) searchInput.focus();
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.tags__list a');
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.setAttribute('data-active', 'true');
    } else {
      link.setAttribute('data-active', 'false');
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // console.log('Документ загружен.');

  // Функция для установки языкового предпочтения пользователя
  function setUserLanguagePreference(lang, shouldRedirect = true) {
    localStorage.setItem('userLangPreference', lang);
    if (shouldRedirect) {
      sessionStorage.setItem('hasRedirected', 'true');
    }
    // console.log(`Языковое предпочтение установлено: ${lang}, перенаправление: ${shouldRedirect}`);
  }

  // Функция проверки и выполнения перенаправления, если это необходимо
  function handleRedirection() {
    const userPreferredLang = localStorage.getItem('userLangPreference');
    const hasRedirected = sessionStorage.getItem('hasRedirected');
    const path = window.location.pathname;
    const browserLang = navigator.language.substr(0, 2);

    // console.log(`Пользовательское предпочтение: ${userPreferredLang}`);
    // console.log(`Язык браузера: ${browserLang}`);
    // console.log(`Текущий путь: ${path}`);
    // console.log(`Статус перенаправления: ${hasRedirected}`);

    // Установка языкового предпочтения по URL при первом посещении
    if (!userPreferredLang) {
      if (path.startsWith('/ru/')) {
        setUserLanguagePreference('ru', false);
      } else if (!path.startsWith('/ru')) { // Подразумевается, что это английский URL
        setUserLanguagePreference('en', false);
      }
    }

    // Перенаправление по языковому предпочтению только если это необходимо
    if (!hasRedirected) {
      if (userPreferredLang === 'ru' && path === '/') {
        console.log('Перенаправление на русскую версию.');
        window.location.pathname = '/ru';
      } else if (userPreferredLang === 'en' && path === '/ru') {
        console.log('Перенаправление на английскую версию.');
        window.location.pathname = '/';
      }
    } else {
      console.log('Перенаправление отменено, так как уже перенаправлялись.');
    }
  }

  // Устанавливаем обработчики клика по ссылкам для смены языка
  document.querySelectorAll('.header__link a, .header__text-logo a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();  // Предотвратить переход по ссылке
      const targetLang = e.target.getAttribute('href') === '/ru' ? 'ru' : 'en';
      setUserLanguagePreference(targetLang, false);
      sessionStorage.removeItem('hasRedirected');  // Сброс флага перенаправления
      window.location.pathname = e.target.getAttribute('href');  // Произвести перенаправление вручную
    });
  });

  // Активируем перенаправление при загрузке страницы
  if (window.location.pathname.startsWith('/') || window.location.pathname.startsWith('/ru')) {
    handleRedirection();
  }

  // Сброс флага перенаправления при уходе со страницы
  window.addEventListener('beforeunload', function() {
    sessionStorage.removeItem('hasRedirected');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.input');
  let allPosts = [];
  const postsListContainer = document.querySelector('.posts-list');
  const searchResultsContainer = document.getElementById('search-results');
  const filterContainer = document.querySelector('.filter');
  let timeoutId = null;

  async function fetchPosts() {
    const response = await fetch('/search.json');
    allPosts = await response.json();
  }

  function getCurrentCategoryAndLang() {
    const path = window.location.pathname;
    const categories = { '/technology': 'technology', '/projects': 'projects', '/blog': 'blog', '/ru/technology': 'technology', '/ru/projects': 'projects', '/ru/blog': 'blog' };
    const lang = path.startsWith('/ru') ? 'ru' : 'en';
    const category = Object.keys(categories).find(key => path.includes(key));
    return { category: categories[category], lang };
  }

  function displayResults(posts) {
    searchResultsContainer.innerHTML = '';
    postsListContainer.style.display = 'none';
    filterContainer.style.display = 'none';

    if (posts.length === 0) {
      searchResultsContainer.innerHTML = '<div>No results found</div>';
      return;
    }

    searchResultsContainer.innerHTML = `
<div class="filter">
   <div class="filter__categories categories">
      <div class="categories__wrapper">
         <h2 class="categories__wrapper">${getCurrentCategoryAndLang().category ? getCurrentCategoryAndLang().category.toUpperCase() : 'ALL'}: Search Results</h2>
      </div>
      <div class="categories__content"></div>
   </div>
</div>
`;
    posts.forEach(post => {
      const categoryHtml = post.category && post.icon ? `<div class="post__category category"><div class="category__item category__item--light-blue">${post.icon} ${post.categoryText}</div></div>` : '';
      const imageHtml = post.imageUrl ? `<div class="post__thumbnail"><picture><img src="${post.imageUrl}" alt=""></picture></div>` : '';
      const postElement = `
        <a href="${post.url}" class="post">
          ${categoryHtml}
          ${imageHtml}
          <div class="post__content">
            <h2 class="post__title">${post.title}</h2>
            <div class="post__date">${post.date}</div>
          </div>
        </a>`;
      searchResultsContainer.innerHTML += postElement;
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      if (!searchTerm) {
        searchResultsContainer.innerHTML = '';
        postsListContainer.style.display = '';
        filterContainer.style.display = '';
        return;
      }
      if (allPosts.length === 0) {
        await fetchPosts();
      }
      const { category, lang } = getCurrentCategoryAndLang();
      const filteredPosts = allPosts.filter(post => post.lang === lang && (post.category === category || category === undefined) && (post.title.toLowerCase().includes(searchTerm) || post.content.toLowerCase().includes(searchTerm)));
      displayResults(filteredPosts);
    }, 500);
  });
  }
});

