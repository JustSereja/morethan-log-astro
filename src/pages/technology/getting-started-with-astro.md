---
layout: '../../layouts/Post.astro'
title: 'Getting Started with Astro: A Modern Static Site Generator'
h1: 'Getting Started with Astro'
date: 20.03.2024
custom_category: 'technology'
hreflang_en: '/technology/getting-started-with-astro/'
hreflang_ru: '/ru/technology/getting-started-with-astro/'

description: 'Learn how to build blazing-fast websites with Astro, the modern static site generator that ships zero JavaScript by default.'
---

![Getting Started with Astro](/img/posts/placeholder.svg)
Astro is revolutionizing the way we build static websites. With its innovative approach to web development, you can create blazing-fast websites that ship zero JavaScript by default.

## Why Choose Astro?

Astro brings several compelling advantages:

- **Zero JavaScript by Default**: Your pages load incredibly fast
- **Component Islands**: Use any framework (React, Vue, Svelte, etc.)
- **Built for Speed**: Optimized build process and output
- **Great DX**: Excellent developer experience with hot reloading

## Getting Started

To create your first Astro project, run:

```bash
npm create astro@latest
```

Follow the prompts and you'll have a working Astro site in minutes!

## Basic Project Structure

```
my-astro-project/
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
├── public/
└── astro.config.mjs
```

## Your First Page

Create a file at `src/pages/index.astro`:

```astro
---
const title = "My Astro Site"
---
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>Welcome to Astro!</h1>
  </body>
</html>
```

## Next Steps

- Explore Astro's component system
- Learn about content collections
- Try different UI frameworks
- Deploy your site to production

Happy coding with Astro! 🚀 