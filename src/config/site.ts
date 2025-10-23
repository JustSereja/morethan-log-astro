import type { SiteConfig } from './types';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './locales';

const siteConfig: SiteConfig = {
  // Basic site information
  siteUrl: 'https://morethan-log-astro.sereja.com',
  title: {
    en: 'Morethan-Log',
    ru: 'Morethan-Log',
  },
  description: {
    en: 'A modern blog template built with Astro - fast, responsive, and multilingual',
    ru: 'Современный шаблон блога на Astro - быстрый, адаптивный и многоязычный',
  },

  // Author information
  author: {
    name: {
      en: 'Sereja',
      ru: 'Серёжа',
    },
    email: 'demo@morethan-log.com',
    avatar: '/img/avatar.svg',
    bio: {
      en: 'Full-stack developer passionate about creating beautiful and functional web applications. Building with Astro, React, and modern web technologies.',
      ru: 'Full-stack разработчик, увлеченный созданием красивых и функциональных веб-приложений. Работаю с Astro, React и современными веб-технологиями.',
    },
  },

  // Blog settings
  postsPerPage: 10,
  featuredImageFallback: '/img/posts/placeholder.svg',

  // Social links
  socialLinks: {
    en: {
      github: 'https://github.com/yourusername',
      twitter: 'https://x.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      telegram: 'https://t.me/yourusername',
      tiktok: 'https://www.tiktok.com/@yourusername',
      instagram: 'https://www.instagram.com/yourusername/',
      youtube: 'https://www.youtube.com/@yourusername',
      twitch: 'https://www.twitch.tv/yourusername',
    },
    ru: {
      github: 'https://github.com/yourusername-ru',
      twitter: 'https://x.com/yourusername-ru',
      linkedin: 'https://linkedin.com/in/yourusername-ru',
      telegram: 'https://t.me/yourusername-ru',
      tiktok: 'https://www.tiktok.com/@yourusername-ru',
      instagram: 'https://www.instagram.com/yourusername-ru/',
      youtube: 'https://www.youtube.com/@yourusername-ru',
      twitch: 'https://www.twitch.tv/yourusername-ru',
    },
  },

  categories: {
    blog: {
      enabled: true,
      path: '/blog',
      icon: '💻',
      label: {
        en: 'Blog',
        ru: 'Блог',
      },
      description: {
        en: 'Personal thoughts, experiences, and insights from my journey',
        ru: 'Личные мысли, опыт и идеи из моего путешествия',
      },
    },
    technology: {
      enabled: true,
      path: '/technology',
      icon: '🚀',
      label: {
        en: 'Technology',
        ru: 'Технологии',
      },
      description: {
        en: 'Deep dives into web development, tools, and best practices',
        ru: 'Глубокое погружение в веб-разработку, инструменты и лучшие практики',
      },
    },
    projects: {
      enabled: true,
      path: '/projects',
      icon: '🛠️',
      label: {
        en: 'Projects',
        ru: 'Проекты',
      },
      description: {
        en: 'Showcase of my work and open-source contributions',
        ru: 'Витрина моих работ и вклада в открытый исходный код',
      },
    },
  },

  navigation: [
    {
      id: 'about',
      labelKey: 'ui.about',
      translationKey: 'about',
    },
  ],

  // Feature toggles
  features: {
    darkMode: true,
    search: true,
    rss: true,
    sitemap: true,
    imageLightbox: true,
    postNavigation: true,
    readingTime: true,
    viewCounter: false,
  },

  // SEO & Meta tags
  seo: {
    defaultImage: '/img/og-image.svg',
    twitterHandle: 'astrodotbuild',
    googleAnalytics: '',
  },

  // Language settings
  defaultLanguage: DEFAULT_LOCALE,
  languages: [...SUPPORTED_LOCALES],

  // Date format settings
  dateFormats: {
    en: {
      locale: 'en-US',
      options: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    },
    ru: {
      locale: 'ru-RU',
      options: {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    },
  },
};

export default siteConfig;
export type { SiteConfig } from './types';
export { SUPPORTED_LOCALES, SUPPORTED_LOCALES as SUPPORTED_LANGUAGES } from './locales';
