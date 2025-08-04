import SITE_CONFIG from '../site.config';

export const languages = {
    en: 'English',
    ru: 'Русский',
};

export const defaultLang = 'en';

export const ui = {
    en: {
        'name': SITE_CONFIG.author.name.en,
        'ui.description': SITE_CONFIG.description.en,
        'ui.categories': 'Categories',
        'ui.profile': 'Profile',
        'ui.projects': 'Projects',
        'ui.contacts': 'Contact',
        'ui.about': 'About',
        'ui.other_locale': 'Ru',
        'ui.other_locale_url': '/ru',
        'ui.technology': 'Technology',
        'ui.blog': 'Blog',
        'ui.not_found': 'Post not found',
        'ui.no_posts': 'No posts yet',
        'ui.search': 'Search',
        'ui.search_placeholder': 'Search...',
        'ui.prev': 'Prev',
        'ui.next': 'Next',
        'ui.back': 'Back',
        'ui.top': 'Top',
        'ui.page_not_found': 'Page not found',
        'ui.404_message': 'The page you are looking for does not exist.',
        'ui.ai_warning': 'The content of this material is written or translated using AI',
        'ui.contents': 'Contents',
        'ui.all_posts': 'All Posts',
    },
    ru: {
        'name': SITE_CONFIG.author.name.ru,
        'ui.description': SITE_CONFIG.description.ru,
        'ui.categories': 'Категории',
        'ui.profile': 'Профиль',
        'ui.projects': 'Проекты',
        'ui.contacts': 'Контакты',
        'ui.about': 'Обо мне',
        'ui.other_locale': 'En',
        'ui.other_locale_url': '/',
        'ui.technology': 'Технологии',
        'ui.blog': 'Блог',
        'ui.not_found': 'Пост не найден',
        'ui.no_posts': 'Пока нет постов',
        'ui.search': 'Поиск',
        'ui.search_placeholder': 'Поиск...',
        'ui.prev': 'Назад',
        'ui.next': 'Далее',
        'ui.back': 'Назад',
        'ui.top': 'Наверх',
        'ui.page_not_found': 'Страница не найдена',
        'ui.404_message': 'Страница, которую вы ищете, не существует.',
        'ui.ai_warning': 'Содержание этого материала написано или переведено с помощью ИИ',
        'ui.contents': 'Содержание',
        'ui.all_posts': 'Все записи',
    },
} as const;

export const showDefaultLang = false;