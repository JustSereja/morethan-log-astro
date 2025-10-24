import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import purgecss from 'astro-purgecss';
import siteConfig from './src/config/site.ts';

const { siteUrl, defaultLanguage, languages } = siteConfig;

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: defaultLanguage,
    locales: languages,
  },
  integrations: [
    react(),
    mdx(),
    purgecss({
      content: [
        './src/**/*.astro',
        './src/**/*.md',
        './src/**/*.mdx',
        './src/**/*.js',
        './src/**/*.ts',
        './src/**/*.tsx',
      ],
      safelist: [
        'medium-zoom-image--opened',
        'medium-zoom-overlay',
        'medium-zoom-overlay--visible',
        /^hljs-/,
      ],
    }),
    sitemap({
      filter: (page) => !page.includes('404'),
      serialize: (item) => ({
        ...item,
        url: item.url.endsWith('/') ? item.url : `${item.url}/`,
      }),
    }),
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.ts')) {
              const filename = assetInfo.name.split('/').pop()?.replace(/\.ts$/, '');
              return `_astro/${filename}.[hash].js`;
            }
            return 'assets/[name].[hash][extname]';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@config': fileURLToPath(new URL('./src/config', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)),
        '@scripts': fileURLToPath(new URL('./src/scripts', import.meta.url)),
      },
    },
  },
});
