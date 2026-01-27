// Stash iOS Shortcut - Content Extraction Script
// Copy this JavaScript into the "Run JavaScript on Web Page" action in Shortcuts app

(function() {
  // Extract content from article selectors
  function extractContent() {
    const paragraphs = [];

    // Try article-specific selectors first
    document.querySelectorAll('article p, main p, .article-body p, .post-content p, .entry-content p, [role="article"] p').forEach(p => {
      const text = p.innerText?.trim();
      if (text && text.length > 20) {
        paragraphs.push(text);
      }
    });

    // Fallback: get all paragraphs if specific selectors didn't work
    if (paragraphs.length < 3) {
      document.querySelectorAll('p').forEach(p => {
        const text = p.innerText?.trim();
        if (text && text.length > 50) {
          paragraphs.push(text);
        }
      });
    }

    return paragraphs.join('\n\n');
  }

  // Get meta tag content
  function getMeta(name) {
    const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"], meta[property="og:${name}"]`);
    return el?.content || el?.getAttribute('content') || '';
  }

  // Get site name from URL
  function getSiteName() {
    try {
      return new URL(window.location.href).hostname.replace('www.', '');
    } catch {
      return location.hostname.replace('www.', '');
    }
  }

  // Extract selected text (if any)
  const selection = window.getSelection().toString().trim();

  // Build extracted data object
  const extracted = {
    url: window.location.href,
    title: document.querySelector('h1')?.innerText?.trim() || document.title,
    content: selection || extractContent(),
    excerpt: getMeta('description') || getMeta('og:description'),
    image_url: getMeta('og:image'),
    site_name: getMeta('og:site_name') || getSiteName(),
    author: getMeta('author') || document.querySelector('[rel="author"], .author, .byline')?.innerText?.trim() || '',
    highlight: selection || null,
  };

  // Return as JSON string
  return JSON.stringify(extracted);
})();
