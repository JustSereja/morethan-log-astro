import { promises as fs } from 'node:fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import { ui } from '../i18n/ui.ts';
import SITE_CONFIG from '../site.config';

const isDevelopment = import.meta.env.MODE === 'development';

// Function to ensure trailing slash
function ensureTrailingSlash(url) {
  if (!url || url === '/') return '/';
  return url.endsWith('/') ? url : `${url}/`;
}

// Function to parse date string in DD.MM.YYYY or YYYY.MM.DD format to Date object
function parseDate(dateStr) {
  if (!dateStr) {
    return new Date(); // Return current date for missing dates
  }
  
  // Remove quotes if present
  dateStr = dateStr.replace(/['"]/g, '');
  
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    // Check if it's YYYY.MM.DD format (year is 4 digits)
    if (parts[0].length === 4) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // months in JavaScript start from 0
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    } 
    // Otherwise assume DD.MM.YYYY format
    else {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // months in JavaScript start from 0
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }
  return new Date();
}

// Function to clean Markdown content from formatting elements
function cleanMarkdown(mdContent) {
  mdContent = mdContent.replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/^#+\s+(.*)/gm, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`{1,3}([^`]*)`{1,3}/g, '$1')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return mdContent;
}

// Extract first image from Markdown
function extractFirstImage(mdContent) {
  const regex = /!\[(?:.*?)\]\((.*?)\)/;
  const match = regex.exec(mdContent);
  return match ? match[1] : null;
}

function extractCategoryFromUrl(url) {
  const match = url.match(/\/(?:ru\/)?([^\/]+)\/.*/);
  return match ? match[1] : null;
}

// Function to extract language from URL
function extractLanguageFromUrl(url) {
  if (url.startsWith('/ru')) {
    return 'ru';
  } else {
    return 'en';
  }
}

export async function GET() {
  const glob = import.meta.glob('./**/*.md');
  const posts = await Promise.all(
    Object.keys(glob).map(async (file) => {
      const filePath = './src/pages' + file.split('.')[1] + '.md';
      const content = await fs.readFile(filePath, 'utf8');
      const { data, content: mdContent } = matter(content);
      const category = extractCategoryFromUrl(file.split('.')[1]);
      const lang = extractLanguageFromUrl(file.split('.')[1]);
      const isPrivate = data.private_content || false;
      
      // Create URL with trailing slash
      const postUrl = SITE_CONFIG.siteUrl + ensureTrailingSlash(file.split('.')[1]);

      if (isDevelopment) {
        if (isPrivate) {
          return {
            title: data.h1 || data.title || "No title",
            description: data.description || "No description",
            url: postUrl,
            date: `${data.date}`,
            content: cleanMarkdown(mdContent),
            imageUrl: data.image ?? extractFirstImage(mdContent),
            category: category,
            icon: SITE_CONFIG.categories[category] ? SITE_CONFIG.categories[category].icon : '📂',
            lang: lang,
            categoryText: ui[lang]['ui.' + category],
          };
        } else {
          return {
            title: data.h1 || data.title || "No title",
            description: data.description || "No description",
            url: postUrl,
            date: `${data.date}`,
            content: cleanMarkdown(mdContent),
            imageUrl: data.image ?? extractFirstImage(mdContent),
            category: category,
            icon: SITE_CONFIG.categories[category] ? SITE_CONFIG.categories[category].icon : '📂',
            lang: lang,
            categoryText: ui[lang]['ui.' + category],
          };
        }
      }

      if (!isDevelopment && !isPrivate) {
        return {
          title: data.h1 || data.title || "No title",
          description: data.description || "No description",
          url: postUrl,
          date: `${data.date}`,
          content: cleanMarkdown(mdContent),
          imageUrl: data.image ?? extractFirstImage(mdContent),
          category: category,
          icon: SITE_CONFIG.categories[category] ? SITE_CONFIG.categories[category].icon : '📂',
          lang: lang,
          categoryText: ui[lang]['ui.' + category],
        };
      }
    })
  );

  const searchJson = JSON.stringify(posts, null, 2);

  return new Response(searchJson, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
