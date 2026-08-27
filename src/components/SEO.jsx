import { useEffect } from 'react';

const SEO = ({ title, description, image, url, article = false, author, publishDate }) => {
  useEffect(() => {
    document.title = title ? `${title} | SYDLINES` : 'SYDLINES';

    const updateMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updateProperty = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    if (description) updateMeta('description', description);
    if (image) updateProperty('og:image', image);
    if (url) updateProperty('og:url', url);
    if (title) updateProperty('og:title', title);
    if (description) updateProperty('og:description', description);

    if (article) {
      if (publishDate) updateProperty('article:published_time', publishDate);
      if (author) updateProperty('article:author', author);
    }
  }, [title, description, image, url, article, author, publishDate]);

  return null;
};

export default SEO;