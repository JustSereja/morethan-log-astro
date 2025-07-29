export function getPages(allPosts, category, lang) {

  const getPostLanguage = (path) => {
    if (path.includes('/ru/')) {
      return 'ru';
    } else {
      return 'en'; // All files not containing '/ru/' are considered English
    }
  };

  // Function to convert date from DD.MM.YYYY or YYYY.MM.DD format to YYYY-MM-DD
  const convertDate = (dateStr) => {
    if (!dateStr) {
      return null; // Return null for missing dates
    }
    
    // Remove quotes if present
    dateStr = dateStr.toString().replace(/['"]/g, '');
    
    const parts = dateStr.split('.');
    if (parts.length !== 3) {
      return null; // Return null for invalid date format
    }
    
    // Check if it's YYYY.MM.DD format (year is 4 digits)
    if (parts[0].length === 4) {
      const [year, month, day] = parts;
      return `${year}-${month}-${day}`;
    } 
    // Otherwise assume DD.MM.YYYY format
    else {
      const [day, month, year] = parts;
      return `${year}-${month}-${day}`;
    }
  };

  // Filter posts, excluding those with type 'page' and posts without dates
  const filteredPosts = allPosts.filter(post => {
    const postLang = getPostLanguage(post.file);
    if (post.frontmatter.type === 'page' || !post.frontmatter.date) {
      return false;
    }
    return (!category || post.file.includes(`/${category}/`)) && postLang === lang;
  });

  // Sort posts by date from newest to oldest
  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = convertDate(a.frontmatter.date);
    const dateB = convertDate(b.frontmatter.date);
    
    // If either date is null, put those posts at the end
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    return new Date(dateB) - new Date(dateA);
  });

  return sortedPosts;
}