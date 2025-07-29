import fs from 'fs';
import matter from 'gray-matter';
import { marked } from 'marked';
import { glob } from 'glob';
import SITE_CONFIG from '../../site.config';
import path from 'path';

// Configure marked to not use deprecated options
marked.setOptions({
  mangle: false,
  headerIds: false
});

// Function to determine RSS logo URL
function getRssLogoUrl() {
  const pngPath = path.join(process.cwd(), 'public/img/rss-logo.png');
  const svgPath = path.join(process.cwd(), 'public/img/rss-logo.svg');
  
  // Check if PNG exists first (better RSS reader support)
  if (fs.existsSync(pngPath)) {
    return `${SITE_CONFIG.siteUrl}/img/rss-logo.png`;
  } else if (fs.existsSync(svgPath)) {
    return `${SITE_CONFIG.siteUrl}/img/rss-logo.svg`;
  }
  
  // Fallback to placeholder
  return `${SITE_CONFIG.siteUrl}/img/posts/placeholder.svg`;
}

// Function to escape XML special characters
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

// Extract first image from Markdown
function extractFirstImage(mdContent) {
  const regex = /!\[(?:.*?)\]\((.*?)\)/;
  const match = regex.exec(mdContent);
  return match ? match[1] : null;
}

// Function to parse date string in DD.MM.YYYY or YYYY.MM.DD format to Date object
function parseDate(dateStr) {
  if (!dateStr) {
    return null;
  }
  
  // Remove quotes if present
  dateStr = dateStr.replace(/['"]/g, '');
  
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    // Check if it's YYYY.MM.DD format (year is 4 digits)
    if (parts[0].length === 4) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    } 
    // Otherwise assume DD.MM.YYYY format
    else {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }
  return null;
}

// Function to convert markdown to HTML
function markdownToHtml(markdown) {
  // Process the markdown content
  let html = marked(markdown);
  
  // Convert relative image paths to absolute URLs
  html = html.replace(/src="\/([^"]+)"/g, `src="${SITE_CONFIG.siteUrl}/$1"`);
  html = html.replace(/href="\/([^"]+)"/g, `href="${SITE_CONFIG.siteUrl}/$1"`);
  
  return html;
}

// Function to ensure trailing slash
function ensureTrailingSlash(url) {
  if (!url || url === '/') return '/';
  return url.endsWith('/') ? url : `${url}/`;
}

const isDevelopment = import.meta.env.MODE === 'development';

export async function GET() {
  const markdownFiles = await glob(['src/pages/**/*.md']);
  
  // Filter for English posts only (not in /ru/ directory)
  const englishFiles = markdownFiles.filter(file => !file.includes('/ru/'));
  
  const posts = await Promise.all(
    englishFiles.map(async (file) => {
      const content = fs.readFileSync(file, 'utf-8');
      const { data, content: mdContent } = matter(content);
      
      // Skip files without dates, about pages, and pages with type: 'page'
      if (!data.date || data.type === 'page') {
        return null;
      }
      
      const parsedDate = parseDate(data.date);
      if (!parsedDate) {
        return null;
      }
      
      // Create URL with trailing slash
      const pathFromFile = file.replace('src/pages', '').replace('.md', '');
      const postUrl = SITE_CONFIG.siteUrl + ensureTrailingSlash(pathFromFile);
      
      // Convert markdown to HTML
      const htmlContent = markdownToHtml(mdContent);
      
      // Extract category from file path
      const categoryMatch = file.match(/\/pages\/([^\/]+)\//);
      const category = categoryMatch ? categoryMatch[1] : null;
      
      // Skip 'ru' as a category
      const validCategory = (category && category !== 'ru') ? category : null;
      
      // Extract or determine image URL
      let imageUrl = data.image ?? extractFirstImage(mdContent);
      if (!imageUrl) {
        // Use category-specific placeholder
        const placeholderMap = {
          'blog': '/img/posts/placeholder-blog.svg',
          'technology': '/img/posts/placeholder-technology.svg',
          'projects': '/img/posts/placeholder-projects.svg'
        };
        imageUrl = placeholderMap[validCategory] || '/img/posts/placeholder.svg';
      }
      
      // Convert relative image URL to absolute
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = SITE_CONFIG.siteUrl + imageUrl;
      }
      
      return {
        title: data.h1 || data.title || "No title",
        description: data.description || "",
        content: htmlContent,
        url: postUrl,
        date: parsedDate,
        author: SITE_CONFIG.author.name.en,
        category: validCategory && SITE_CONFIG.categories[validCategory] ? validCategory : null,
        isPrivate: data.private_content || false,
        imageUrl: imageUrl
      };
    })
  );
  
  // Filter out null entries and private posts (if not in development)
  const validPosts = posts
    .filter(post => post !== null)
    .filter(post => isDevelopment || !post.isPrivate);
  
  // Sort posts by date, newest first
  validPosts.sort((a, b) => b.date - a.date);

  // Generate RSS items with full content
  const rssItems = validPosts.map(post => {
    const categoryTag = post.category 
      ? `<category>${escapeXml(SITE_CONFIG.categories[post.category].enabled ? post.category : '')}</category>`
      : '';
    
    // Add media:content tag if image exists
    const mediaTag = post.imageUrl 
      ? `<media:content url="${escapeXml(post.imageUrl)}" medium="image" />`
      : '';
    
    return `
        <item>
            <title>${escapeXml(post.title)}</title>
            <link>${post.url}</link>
            <guid isPermaLink="true">${post.url}</guid>
            <description><![CDATA[${post.description}]]></description>
            <content:encoded><![CDATA[${post.content}]]></content:encoded>
            <author>${escapeXml(SITE_CONFIG.author.email)} (${escapeXml(post.author)})</author>
            ${categoryTag}
            ${mediaTag}
            <pubDate>${post.date.toUTCString()}</pubDate>
        </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/">
    <channel>
        <title>${escapeXml(SITE_CONFIG.title)} - English</title>
        <link>${SITE_CONFIG.siteUrl}/</link>
        <description>${escapeXml(SITE_CONFIG.description.en)}</description>
        <language>en</language>
        <copyright>© ${new Date().getFullYear()} ${escapeXml(SITE_CONFIG.author.name.en)}</copyright>
        <managingEditor>${escapeXml(SITE_CONFIG.author.email)} (${escapeXml(SITE_CONFIG.author.name.en)})</managingEditor>
        <webMaster>${escapeXml(SITE_CONFIG.author.email)} (${escapeXml(SITE_CONFIG.author.name.en)})</webMaster>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <image>
            <url>${getRssLogoUrl()}</url>
            <title>${escapeXml(SITE_CONFIG.title)} - English</title>
            <link>${SITE_CONFIG.siteUrl}/</link>
            <width>144</width>
            <height>144</height>
        </image>
        <atom:link href="${SITE_CONFIG.siteUrl}/en/rss.xml" rel="self" type="application/rss+xml" />${rssItems}
    </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
} 