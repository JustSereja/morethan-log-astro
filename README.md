# Morethan-Log for Astro

A modern, customizable blog template built with Astro. Fast, responsive, and multilingual out of the box.

🌐 **[Live Demo](https://morethan-log-astro.sereja.com/)**

## 🚀 Features

- **🌍 Multilingual Support** - Built-in support for multiple languages (EN/RU by default)
- **📱 Responsive Design** - Looks great on all devices
- **🌙 Dark Mode** - Automatic theme switching based on system preferences
- **🔍 Search Functionality** - Built-in search for your content
- **📝 Markdown Support** - Write posts in Markdown with full syntax highlighting
- **🏷️ Categories** - Organize posts by categories
- **📊 SEO Optimized** - Meta tags, sitemap, multilingual RSS feeds included
- **⚙️ Highly Configurable** - Easy customization through single config file
- **💬 Social Links** - Add your social media profiles easily

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Use this template** (Recommended)
   
   Click the "Use this template" button on GitHub to create a new repository based on this template:
   
   [![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge)](https://github.com/JustSereja/morethan-log-astro/generate)
   
   Or manually:
   - Go to the [repository page](https://github.com/JustSereja/morethan-log-astro)
   - Click the green "Use this template" button
   - Choose "Create a new repository"
   - Name your new repository and create it
   
   Then clone your new repository:
   ```bash
   git clone https://github.com/[your-username]/[your-blog-name].git
   cd [your-blog-name]
   ```

   **Alternative: Clone directly**
   ```bash
   git clone https://github.com/JustSereja/morethan-log-astro.git my-blog
   cd my-blog
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Visit `http://localhost:4321` to see your blog

## ⚙️ Configuration

All site configuration is centralized in `src/site.config.ts`:

```typescript
export default {
  title: "Morethan-Log",
  description: {
    en: "A modern blog template built with Astro",
    ru: "Современный шаблон блога на Astro"
  },
  siteUrl: "https://morethan-log-astro.sereja.com",
  author: {
    name: "Sereja",
    email: "demo@morethan-log.com",
    // ... more options
  }
  // ... see full config options in the file
}
```

### Social Links

Add your social media profiles:

```typescript
socialLinks: {
  github: "https://github.com/JustSereja",
  twitter: "https://twitter.com/your-twitter",
  linkedin: "https://linkedin.com/in/your-linkedin",
  // Add more as needed
}
```

### Categories

Configure blog categories:

```typescript
categories: {
  blog: {
    enabled: true,
    path: "/blog",
    icon: "💻"
  },
  // Add more categories
}
```

### Features

Toggle features on/off:

```typescript
features: {
  darkMode: true,
  search: true,
  rss: true,
  // ... more features
}
```

## 📝 Writing Posts

### Creating a New Post

1. Create a new `.md` file in the appropriate directory:
   - Blog posts: `src/pages/blog/`
   - Technology posts: `src/pages/technology/`
   - Projects: `src/pages/projects/`

2. Add frontmatter:

```markdown
---
layout: '../../layouts/Post.astro'
title: 'Your Post Title'
h1: 'Display Title'
date: 15.03.2024
custom_category: 'blog'
image: '/img/posts/your-image.jpg'
description: 'A brief description of your post'
---

Your post content here...
```

### Multi-language Posts

For Russian translations, create the same file structure under `src/pages/ru/`:

```
src/pages/blog/my-post.md        # English
src/pages/ru/blog/my-post.md     # Russian
```

Add language links in frontmatter:

```markdown
hreflang_en: '/blog/my-post'
hreflang_ru: '/ru/blog/my-post'
```

### Language Support

The template supports both multilingual and single-language content:

#### Multilingual Posts (Default)
```yaml
hreflang_en: '/blog/my-post'
hreflang_ru: '/ru/blog/my-post'
```

#### Single-Language Posts
For content that exists in only one language, simply omit the hreflang for the missing translation:

**English-only post:**
```yaml
hreflang_en: '/blog/english-only-post'
# No hreflang_ru - when users switch to Russian, they'll be redirected to the Russian homepage
```

**Russian-only post:**
```yaml
hreflang_ru: '/ru/blog/russian-only-post'
# No hreflang_en - when users switch to English, they'll be redirected to the English homepage
```

This is perfect for:
- Language-specific announcements
- Regional content
- Technical documentation in one language
- Gradual content translation

### RSS Feeds

The template provides multilingual RSS feeds with full content support:

#### Feed Structure

- **Main Feed** (`/rss.xml`) - Contains posts in the default language (English)
- **English Feed** (`/en/rss.xml`) - English posts only  
- **Russian Feed** (`/ru/rss.xml`) - Russian posts only

This approach ensures subscribers never receive content in languages they don't understand. The main feed (`/rss.xml`) serves the default language to maintain compatibility with RSS readers that expect a feed at this standard location.

#### Features

Each RSS feed includes:
- ✅ Full HTML content (not just descriptions)
- ✅ Properly converted image URLs (relative to absolute)
- ✅ Author information
- ✅ Post categories
- ✅ All required RSS 2.0 elements

#### Feed Discovery

RSS feeds are automatically linked in the `<head>` of each page:
- The main feed (`/rss.xml`) contains default language content
- Language-specific feeds are available at `/{lang}/rss.xml`
- Alternative language feeds include `hreflang` attributes

#### Customizing Default Language

To change which language appears in the main RSS feed, update `defaultLanguage` in `site.config.ts`:

```typescript
// site.config.ts
export default {
  // ...
  defaultLanguage: "ru", // Change to make Russian the main feed language
  // ...
}
```

## 🎨 Customization

### Styling

- Main styles: `public/css/style.css`
- Modify CSS variables for colors and themes
- Dark mode styles are included

### Images

#### Placeholder Images

The template includes category-specific placeholder images for posts without featured images:

- **Blog posts**: `/public/img/posts/placeholder-blog.svg` (Purple gradient with document icon)
- **Technology posts**: `/public/img/posts/placeholder-technology.svg` (Green gradient with code terminal)
- **Projects posts**: `/public/img/posts/placeholder-projects.svg` (Orange gradient with gear icon)
- **Default**: `/public/img/posts/placeholder.svg` (Simple fallback)

Posts automatically use the appropriate placeholder based on their category.

#### RSS Channel Image

For RSS feeds, the template supports both SVG and PNG formats:
- Create your logo as `/public/img/rss-logo.png` (144x144px) for best compatibility
- Falls back to `/public/img/rss-logo.svg` if PNG doesn't exist
- PNG format is recommended as it's more universally supported by RSS readers

### Adding New Languages

1. Add language to `src/i18n/ui.ts`:

```typescript
export const languages = {
  en: 'English',
  ru: 'Русский',
  es: 'Español'  // New language
};
```

2. Add translations:

```typescript
export const ui = {
  // ... existing languages
  es: {
    'name': SITE_CONFIG.author.name,
    'ui.about': 'Acerca de',
    // ... more translations
  }
}
```

### Custom Pages

Create new pages in `src/pages/` using `.astro` or `.md` files.

### Language-Specific Social Links and Author Names

The template now supports different social links and author names for each language:

1. **Language-Specific Social Links**: Configure different social media profiles for each language in `src/site.config.ts`:
   ```javascript
   socialLinks: {
     en: {
       github: "https://github.com/EnglishUsername",
       twitter: "https://x.com/EnglishHandle",
       // ... other social links
     },
     ru: {
       github: "https://github.com/RussianUsername",
       twitter: "https://x.com/RussianHandle",
       // ... other social links
     }
   }
   ```

2. **Language-Specific Author Names**: Set different author names for each language:
   ```javascript
   author: {
     name: {
       en: "John Doe",
       ru: "Иван Иванов"
     },
     // ... other author fields
   }
   ```

## 🚀 Deployment

### Build for Production

```