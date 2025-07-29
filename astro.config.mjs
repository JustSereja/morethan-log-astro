import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import purgecss from "astro-purgecss";
import siteConfig from './src/site.config.ts';

// https://astro.build/config
export default defineConfig({
    site: siteConfig.siteUrl,
    output: "static",
    trailingSlash: "always", // Enforce trailing slashes on all URLs
    i18n: {
        defaultLocale: siteConfig.defaultLanguage || "en",
        locales: siteConfig.languages || ["en", "ru"],
    },
    integrations: [
        purgecss({
            content: [
                "./src/**/*.astro",
                "./src/**/*.md",
                "./src/**/*.js",
                "./src/**/*.ts"
            ],
            safelist: [
                'medium-zoom-image--opened',
                'medium-zoom-overlay',
                'medium-zoom-overlay--visible',
                /^hljs-/
            ]
        }),
        sitemap({
            filter: (page) => !/404/.test(page),
            serialize: (item) => {
                // Ensure proper URL format
                if (item.url.at(-1) !== '/') {
                    item.url += '/';
                }
                return item;
            }
        })
    ],
    vite: {
        plugins: []
    }
});
