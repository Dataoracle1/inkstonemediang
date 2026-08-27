export const calculateReadingTime = (content) => {
  if (!content) return 1;
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  return Math.max(1, readingTime);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

export const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const extractExcerpt = (content, maxLength = 160) => {
  if (!content) return '';
  const plainText = content.replace(/<[^>]*>/g, '');
  return truncateText(plainText, maxLength);
};

export const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const isRecentArticle = (publishedAt) => {
  if (!publishedAt) return false;
  const publicationDate = new Date(publishedAt);
  const now = new Date();
  const diffTime = Math.abs(now - publicationDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

export const isTrendingArticle = (article, minViews = 100) => {
  if (!article) return false;
  return (article.views || 0) >= minViews || isRecentArticle(article.publishedAt);
};

export const sortByRelevance = (articles) => {
  return [...articles].sort((a, b) => {
    const viewDiff = (b.views || 0) - (a.views || 0);
    if (viewDiff !== 0) return viewDiff;
    return new Date(b.publishedAt) - new Date(a.publishedAt);
  });
};

export const formatViewCount = (views) => {
  if (!views) return '0';
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
  if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
  return String(views);
};