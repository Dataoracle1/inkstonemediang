import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const NewsCard = ({ post, featured = false }) => {
  const {
    _id,
    title,
    excerpt,
    image,
    category,
    createdAt,
    views = 0,
    likes = 0,
  } = post;

  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  if (featured) {
    return (
      <Link to={`/news/${_id}`} className="block group">
        <div className="card overflow-hidden">
          <div className="relative h-96">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <span className="absolute top-4 left-4 badge bg-primary-500 text-white">
              {category}
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl font-heading font-bold mb-2 group-hover:text-primary-400 transition">
                {title}
              </h2>
              <p className="text-gray-200 mb-3 line-clamp-2">{excerpt}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{timeAgo}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{views}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Heart size={14} />
                  <span>{likes}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/news/${_id}`} className="block group">
      <div className="card overflow-hidden h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute top-3 left-3 badge bg-primary-500 text-white text-xs">
            {category}
          </span>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-heading font-semibold mb-2 line-clamp-2 group-hover:text-primary-500 transition">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 flex-1">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center space-x-1">
              <Calendar size={12} />
              <span>{timeAgo}</span>
            </span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Eye size={12} />
                <span>{views}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Heart size={12} />
                <span>{likes}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;