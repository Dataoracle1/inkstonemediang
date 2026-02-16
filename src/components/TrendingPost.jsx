import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TrendingPost = ({ post }) => {
  const { _id, title, image, category, createdAt } = post;
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <Link to={`/news/${_id}`} className="flex space-x-3 group">
      <img
        src={image}
        alt={title}
        className="w-20 h-20 object-cover rounded group-hover:opacity-75 transition"
      />
      <div className="flex-1">
        <span className="text-xs text-primary-500 font-semibold">{category}</span>
        <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary-500 transition dark:text-gray-200">
          {title}
        </h4>
        <span className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Clock size={12} />
          <span>{timeAgo}</span>
        </span>
      </div>
    </Link>
  );
};

export default TrendingPost;