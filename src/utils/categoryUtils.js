/**
 * categoryUtils.js
 * Save to: src/utils/categoryUtils.js
 * Single source of truth for category slug <-> display name mapping.
 */

export const CATEGORIES = [
  'Breaking News',
  'Finance',
  'Stock Markets',
  'Economy',
  'Sports',
  'Movies',
  'Entertainment',
  'Technology',
  'Politics',
  'Health',
  'World',
  'Business',
  'Science',
  'Other',
];

/** "Breaking News" -> "breaking-news" */
export const categoryToSlug = (category) =>
  category.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

/** "breaking-news" -> "Breaking News" (null if unknown) */
export const slugToCategory = (slug) =>
  slug ? CATEGORIES.find(cat => categoryToSlug(cat) === slug) || null : null;

/** "Breaking News" -> "/category/breaking-news" */
export const categoryPath = (category) =>
  `/category/${categoryToSlug(category)}`;