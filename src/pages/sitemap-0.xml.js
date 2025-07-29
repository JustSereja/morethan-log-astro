import { promises as fs } from 'node:fs';
import matter from 'gray-matter';
import SITE_CONFIG from '../site.config';

const isDevelopment = import.meta.env.MODE === 'development';

// Function to ensure trailing slash
function ensureTrailingSlash(url) {
  if (!url || url === '/') return '/';
  return url.endsWith('/') ? url : `${url}/`;
}

function parseDate(dateStr) {
  if (!dateStr) {
    return new Date(); // Use current date for pages without dates
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
  return new Date(); // return current date if format is incorrect
}

export async function GET() {
  const glob = import.meta.glob('./**/*.md');
  const posts = await Promise.all(
    Object.keys(glob).map(async (file) => {
      const filePath = './src/pages' + file.split('.')[1] + '.md';
      const content = await fs.readFile(filePath, 'utf8');
      const { data } = matter(content);
      
      // Create URL with trailing slash
      const postUrl = SITE_CONFIG.siteUrl + ensureTrailingSlash(file.split('.')[1]);
      
      return {
        url: postUrl,
        date: parseDate(data.date),
        isPrivate: data.private_content || false
      };
    })
  );
  
  const filteredPosts = posts.filter(post => !post.isPrivate || isDevelopment);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${filteredPosts.map(post => `
    <url>
        <loc>${post.url}</loc>
        <lastmod>${post.date.toISOString()}</lastmod>
    </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
