---
layout: '../../layouts/Post.astro'
title: 'Web Performance Optimization: Making Your Sites Lightning Fast'
h1: 'Web Performance Optimization'
date: 01.03.2024
custom_category: 'technology'
hreflang_en: '/technology/web-performance/'
hreflang_ru: '/ru/technology/web-performance/'

description: 'Learn essential techniques to optimize your web applications for speed and better user experience.'
---

Speed matters. Users expect pages to load in under 3 seconds. Here's how to deliver lightning-fast experiences.
## Why Performance Matters

- **53%** of users abandon sites that take > 3s to load
- **Every 100ms** delay costs 1% in sales
- **Better performance** = Better SEO rankings

## Measuring Performance

### Core Web Vitals

1. **LCP (Largest Contentful Paint)**: < 2.5s
2. **FID (First Input Delay)**: < 100ms
3. **CLS (Cumulative Layout Shift)**: < 0.1

### Tools

- Chrome DevTools
- Lighthouse
- WebPageTest
- GTmetrix

## Optimization Techniques

### 1. Optimize Images

```html
<!-- Use modern formats -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description">
</picture>

<!-- Lazy loading -->
<img src="image.jpg" loading="lazy" alt="Description">
```

### 2. Minify Resources

Before:
```css
.header {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 10px;
}
```

After:
```css
.header{background-color:#fff;padding:20px;margin-bottom:10px}
```

### 3. Enable Compression

```nginx
# Nginx configuration
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 4. Leverage Browser Caching

```apache
# .htaccess
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access 1 year"
  ExpiresByType text/css "access 1 month"
  ExpiresByType application/javascript "access 1 month"
</IfModule>
```

## JavaScript Optimization

### Code Splitting

```javascript
// Dynamic imports
const module = await import('./heavy-module.js');

// Route-based splitting
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
```

### Tree Shaking

```javascript
// Only import what you need
import { debounce } from 'lodash-es';
// Not: import _ from 'lodash';
```

## CSS Optimization

### Critical CSS

```html
<head>
  <!-- Inline critical CSS -->
  <style>
    /* Above-the-fold styles */
    body { margin: 0; font-family: sans-serif; }
    .header { background: #333; color: white; }
  </style>
  
  <!-- Load non-critical CSS async -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
</head>
```

### Remove Unused CSS

Use tools like PurgeCSS:
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./src/**/*.html', './src/**/*.js']
    })
  ]
};
```

## Network Optimization

### Use CDN

```html
<!-- Serve assets from CDN -->
<script src="https://cdn.example.com/app.js"></script>
```

### Resource Hints

```html
<!-- DNS prefetch -->
<link rel="dns-prefetch" href="//api.example.com">

<!-- Preconnect -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- Preload critical resources -->
<link rel="preload" href="font.woff2" as="font" crossorigin>
```

## Advanced Techniques

### Service Workers

```javascript
// Cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        '/css/style.css',
        '/js/app.js',
        '/offline.html'
      ]);
    })
  );
});
```

### HTTP/2 Push

```
Link: </css/style.css>; rel=preload; as=style
```

## Performance Budget

Set limits:
- JavaScript: < 170KB (gzipped)
- CSS: < 50KB
- Images: < 500KB per page
- Time to Interactive: < 5s

## Monitoring

1. Set up Real User Monitoring (RUM)
2. Create performance dashboards
3. Set up alerts for regressions
4. Regular performance audits

## Conclusion

Performance optimization is an ongoing process. Start with the biggest wins:

1. Optimize images
2. Minify and compress
3. Implement caching
4. Monitor continuously

Remember: Fast sites = Happy users = Better business!

---

*What performance wins have you achieved? Share your success stories!* 